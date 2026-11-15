import React, { useEffect, useState } from 'react';
import {
  Pin,
  Plus,
  Trash2,
  BookOpen,
  Wrench,
  ScrollText,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Compass,
  X,
  Terminal,
  UserCheck,
} from 'lucide-react';
import {
  AgentRuntime,
  CrewMember,
  CrewStatus,
  FleetTool,
  HookToolName,
  InspectorTab,
  TerminalBinding,
  TerminalState,
} from '../types/fleet';
import { computeReadiness, getStatusStyles } from '../utils/fleetHelpers';
import {
  buildHcGetCommand,
  buildHcInterruptCommand,
  buildHcReadCommand,
  buildHcRunCommand,
  buildHcSendCommand,
  buildHcTemplateMarkdown,
  getTerminalStateStyle,
} from '../utils/hcCommands';

interface OfficerInspectorProps {
  member: CrewMember;
  captainTerminalId: string;
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  onUpdateStatus: (memberId: string, status: CrewStatus) => void;
  onUpdateTask: (memberId: string, task: string) => void;
  onUpdateTerminal: (memberId: string, patch: Partial<TerminalBinding>) => void;
  onAddHookEvent: (
    memberId: string,
    tool: HookToolName,
    target: string,
    summary: string,
    outcome: 'ok' | 'blocked' | 'error'
  ) => void;
  onToggleNote: (memberId: string, noteId: string) => void;
  onAddNote: (memberId: string, text: string) => void;
  onDeleteNote: (memberId: string, noteId: string) => void;
  onAddJournal: (memberId: string, title: string, content: string) => void;
  onCycleToolStatus: (memberId: string, toolId: string) => void;
  onToggleReadinessCheck: (memberId: string, checkId: string) => void;
  onAddPrompt: (memberId: string, title: string, summary: string, template: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const TABS: Array<{ id: InspectorTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'profile', label: 'Profile' },
  { id: 'journal', label: 'Journal' },
  { id: 'tools', label: 'Tools' },
  { id: 'prompts', label: 'Prompts' },
  { id: 'reports', label: 'Reports' },
];

export const OfficerInspector: React.FC<OfficerInspectorProps> = ({
  member,
  captainTerminalId,
  activeTab,
  onTabChange,
  onUpdateStatus,
  onUpdateTask,
  onUpdateTerminal,
  onAddHookEvent,
  onToggleNote,
  onAddNote,
  onDeleteNote,
  onAddJournal,
  onCycleToolStatus,
  onToggleReadinessCheck,
  onAddPrompt,
  mobileOpen,
  onCloseMobile,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const [journalTitle, setJournalTitle] = useState('');
  const [journalBody, setJournalBody] = useState('');

  const [promptTitle, setPromptTitle] = useState('');
  const [promptSummary, setPromptSummary] = useState('');
  const [promptBody, setPromptBody] = useState('');
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState(false);
  const [taskDraft, setTaskDraft] = useState(member.currentTask);

  // Terminal tab state
  const [sendDraft, setSendDraft] = useState(member.currentTask);
  const [sendWait, setSendWait] = useState(false);
  const [useTemplateLaunch, setUseTemplateLaunch] = useState(true);
  const [showTemplateMd, setShowTemplateMd] = useState(false);

  // Manual hook event composer
  const [hookTool, setHookTool] = useState<HookToolName>('Read');
  const [hookTarget, setHookTarget] = useState('');
  const [hookSummary, setHookSummary] = useState('');

  useEffect(() => {
    setEditingTask(false);
    setAddingNote(false);
    setShowAddPrompt(false);
    setShowTemplateMd(false);
    setTaskDraft(member.currentTask);
    setSendDraft(member.currentTask);
  }, [member.id, member.currentTask]);

  const readiness = computeReadiness(member);
  const statusStyles = getStatusStyles(member.status);
  const termStyle = getTerminalStateStyle(member.terminal.terminalState);
  const latestJournal = member.journals[0];

  const radius = 54;
  const arcLength = Math.PI * radius;
  const filledLength = (readiness / 100) * arcLength;

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(member.id, newNoteText.trim());
    setNewNoteText('');
    setAddingNote(false);
  };

  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle.trim() || !journalBody.trim()) return;
    onAddJournal(member.id, journalTitle.trim(), journalBody.trim());
    setJournalTitle('');
    setJournalBody('');
  };

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle.trim() || !promptBody.trim()) return;
    onAddPrompt(
      member.id,
      promptTitle.trim(),
      promptSummary.trim() || 'Custom officer operational prompt.',
      promptBody.trim()
    );
    setPromptTitle('');
    setPromptSummary('');
    setPromptBody('');
    setShowAddPrompt(false);
  };

  const handleSubmitHook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookTarget.trim() && !hookSummary.trim()) return;
    onAddHookEvent(
      member.id,
      hookTool,
      hookTarget.trim() || member.terminal.cwd,
      hookSummary.trim() || `${hookTool} event recorded`,
      'ok'
    );
    setHookTarget('');
    setHookSummary('');
  };

  const toolStatusColor = (status: FleetTool['status']) => {
    if (status === 'Online') return 'var(--ready)';
    if (status === 'Calibrating') return 'var(--task)';
    return 'var(--danger)';
  };

  const hcRunCmd = buildHcRunCommand(member, captainTerminalId, sendDraft, useTemplateLaunch);
  const hcSendCmd = buildHcSendCommand(member, sendDraft, sendWait);
  const hcReadCmd = buildHcReadCommand(member, 100);
  const hcGetCmd = buildHcGetCommand(member);
  const hcInterruptCmd = buildHcInterruptCommand(member);
  const templateMd = buildHcTemplateMarkdown(member);

  const content = (
    <div
      className="flex flex-col h-full rounded border overflow-hidden"
      style={{
        backgroundColor: 'var(--parchment-raised)',
        borderColor: 'var(--brass)',
      }}
    >
      {/* Officer Header Banner */}
      <div className="relative p-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close officer inspector"
            className="xl:hidden absolute top-3 right-3 z-10 p-1.5 rounded bg-[#0E1A2B]/80 text-[#FAF5EA] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-start gap-3.5">
          <img
            src={member.portrait}
            alt={member.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded object-cover object-top border shrink-0"
            style={{ borderColor: 'var(--brass)' }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 border"
                style={{
                  backgroundColor: 'var(--navy)',
                  color: '#FAF5EA',
                  borderColor: 'var(--brass)',
                }}
              >
                {member.role}
              </span>
              <span className="font-mono text-[11px]" style={{ color: termStyle.color }}>
                {member.terminal.terminalId} · {termStyle.label}
              </span>
            </div>
            <h2
              className="font-display text-2xl font-semibold leading-tight mt-1"
              style={{ color: 'var(--ink)' }}
            >
              {member.name}
            </h2>
            <p className="font-display italic text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
              “{member.motto}”
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--ink-3)' }}>
              {member.vesselOrUnit}
            </p>
          </div>
        </div>

        {/* Status & Active Task Assignment Control */}
        <div
          className="mt-3.5 p-2.5 rounded border flex flex-col gap-2"
          style={{
            backgroundColor: 'var(--parchment)',
            borderColor: 'var(--rule)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="officer-status-select" className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
              Duty & Terminal
            </label>
            <div className="flex items-center gap-1.5">
              <select
                id="officer-status-select"
                value={member.status}
                onChange={(e) => onUpdateStatus(member.id, e.target.value as CrewStatus)}
                className="text-xs font-medium px-2 py-1 rounded border cursor-pointer"
                style={{
                  backgroundColor: statusStyles.bgColor,
                  color: statusStyles.textColor,
                  borderColor: 'var(--rule)',
                }}
              >
                <option value="Mission Ready">Mission Ready</option>
                <option value="In Task">In Task</option>
                <option value="Off Duty">Off Duty</option>
              </select>

              <select
                aria-label="hc Terminal State"
                value={member.terminal.terminalState}
                onChange={(e) =>
                  onUpdateTerminal(member.id, {
                    terminalState: e.target.value as TerminalState,
                  })
                }
                className="text-xs font-mono px-2 py-1 rounded border cursor-pointer"
                style={{
                  backgroundColor: termStyle.bg,
                  color: termStyle.color,
                  borderColor: 'var(--rule)',
                }}
              >
                <option value="working">working</option>
                <option value="idle">idle</option>
                <option value="blocked">blocked</option>
                <option value="error">error</option>
                <option value="offline">offline</option>
              </select>
            </div>
          </div>

          {editingTask ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateTask(member.id, taskDraft.trim() || member.currentTask);
                setEditingTask(false);
              }}
              className="flex gap-1.5"
            >
              <input
                type="text"
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                className="flex-1 text-xs px-2 py-1 rounded border"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--brass)',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded text-xs font-medium cursor-pointer"
                style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs leading-snug" style={{ color: 'var(--ink-2)' }}>
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>Task: </span>
                {member.currentTask}
              </p>
              <button
                type="button"
                onClick={() => {
                  setTaskDraft(member.currentTask);
                  setEditingTask(true);
                }}
                className="text-[11px] font-medium underline shrink-0 cursor-pointer"
                style={{ color: 'var(--brass-ink)' }}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Inspector Tab Bar */}
        <div
          role="tablist"
          aria-label="Officer inspector tabs"
          className="mt-3 flex flex-wrap gap-1"
        >
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange(t.id)}
                className="px-2.5 py-1.5 rounded border text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: active ? 'var(--navy)' : 'var(--parchment)',
                  color: active ? '#E6BE6C' : 'var(--ink-2)',
                  borderColor: active ? 'var(--brass)' : 'var(--rule)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {activeTab === 'overview' && (
          <>
            {/* Thinks Like Doctrine */}
            <div
              className="p-3 rounded border"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
              }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--brass-ink)' }}>
                Thinks like
              </div>
              <p className="mt-1 text-sm font-medium leading-snug" style={{ color: 'var(--ink)' }}>
                “{member.doctrine}”
              </p>
            </div>

            {/* 1-to-1 Terminal Quick Summary */}
            <div
              className="p-3 rounded border space-y-1.5"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                  <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--brass-ink)' }} />
                  <span>Bound Terminal: {member.terminal.terminalName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onTabChange('terminal')}
                  className="text-[11px] font-medium underline cursor-pointer"
                  style={{ color: 'var(--brass-ink)' }}
                >
                  Open Terminal →
                </button>
              </div>
              <div className="font-mono text-[11px] truncate" style={{ color: 'var(--ink-3)' }}>
                cwd: {member.terminal.cwd} · parent: {member.terminal.parentTerminalId}
              </div>
              <div
                className="p-2 rounded border font-mono text-[11px] leading-snug"
                style={{
                  backgroundColor: 'var(--navy)',
                  borderColor: 'var(--navy-border)',
                  color: '#E6DEC9',
                }}
              >
                {member.terminal.lastScreenPreview}
              </div>
            </div>

            {/* Pinned Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                  <Pin className="w-3.5 h-3.5" style={{ color: 'var(--brass-ink)' }} />
                  <span>Pinned Notes ({member.pinnedNotes.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setAddingNote((v) => !v)}
                  className="text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  style={{ color: 'var(--brass-ink)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Note
                </button>
              </div>

              {addingNote && (
                <form onSubmit={handleSubmitNote} className="mb-2.5 flex gap-1.5">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Write pinned watch note..."
                    className="flex-1 text-xs px-2.5 py-1.5 rounded border"
                    style={{
                      backgroundColor: 'var(--parchment)',
                      borderColor: 'var(--brass)',
                      color: 'var(--ink)',
                    }}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded text-xs font-medium cursor-pointer"
                    style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
                  >
                    Save
                  </button>
                </form>
              )}

              <ul className="space-y-1.5">
                {member.pinnedNotes.map((note) => (
                  <li
                    key={note.id}
                    className="flex items-start justify-between gap-2 text-xs py-1 border-b"
                    style={{ borderColor: 'var(--rule)' }}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleNote(member.id, note.id)}
                      className="flex items-start gap-2 text-left flex-1 cursor-pointer"
                    >
                      {note.done ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--ready)' }} />
                      ) : (
                        <Circle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--ink-3)' }} />
                      )}
                      <span
                        className={note.done ? 'line-through opacity-75' : ''}
                        style={{ color: 'var(--ink)' }}
                      >
                        {note.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteNote(member.id, note.id)}
                      aria-label="Remove note"
                      className="p-0.5 opacity-60 hover:opacity-100 cursor-pointer"
                      style={{ color: 'var(--ink-3)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Journal Excerpt */}
            <div className="pt-2 border-t" style={{ borderColor: 'var(--rule)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                  <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--brass-ink)' }} />
                  <span>Journal Excerpt</span>
                </h3>
                <button
                  type="button"
                  onClick={() => onTabChange('journal')}
                  className="text-xs font-medium cursor-pointer hover:underline"
                  style={{ color: 'var(--brass-ink)' }}
                >
                  View Journal →
                </button>
              </div>
              {latestJournal ? (
                <blockquote
                  className="p-3 rounded border text-xs leading-relaxed"
                  style={{
                    backgroundColor: 'var(--parchment)',
                    borderColor: 'var(--rule)',
                    color: 'var(--ink-2)',
                  }}
                >
                  <p className="font-display italic text-[13px]" style={{ color: 'var(--ink)' }}>
                    “{latestJournal.content}”
                  </p>
                  <footer className="mt-1.5 text-right font-mono-num text-[11px]" style={{ color: 'var(--ink-3)' }}>
                    — Journal, Day {latestJournal.day}
                  </footer>
                </blockquote>
              ) : (
                <p className="text-xs" style={{ color: 'var(--ink-3)' }}>No journal entries logged yet.</p>
              )}
            </div>

            {/* Favorite Tools & Active Prompt Templates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t" style={{ borderColor: 'var(--rule)' }}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--ink)' }}>
                    <Wrench className="w-3 h-3" style={{ color: 'var(--brass-ink)' }} />
                    <span>Tools ({member.tools.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => onTabChange('tools')}
                    className="text-[11px] font-medium cursor-pointer hover:underline"
                    style={{ color: 'var(--brass-ink)' }}
                  >
                    Manage →
                  </button>
                </div>
                <ul className="space-y-1">
                  {member.tools.map((tool) => (
                    <li
                      key={tool.id}
                      className="text-xs px-2 py-1 rounded border flex items-center justify-between gap-1"
                      style={{
                        backgroundColor: 'var(--parchment)',
                        borderColor: 'var(--rule)',
                        color: 'var(--ink)',
                      }}
                    >
                      <span className="truncate">{tool.name}</span>
                      <span
                        className="text-[10px] font-medium shrink-0"
                        style={{ color: toolStatusColor(tool.status) }}
                      >
                        {tool.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--ink)' }}>
                    <ScrollText className="w-3 h-3" style={{ color: 'var(--brass-ink)' }} />
                    <span>Prompts ({member.prompts.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => onTabChange('prompts')}
                    className="text-[11px] font-medium cursor-pointer hover:underline"
                    style={{ color: 'var(--brass-ink)' }}
                  >
                    Open →
                  </button>
                </div>
                <ul className="space-y-1">
                  {member.prompts.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onTabChange('prompts')}
                        className="w-full text-left text-xs px-2 py-1 rounded border flex items-center gap-1.5 cursor-pointer hover:bg-[var(--parchment-deep)] transition-colors"
                        style={{
                          backgroundColor: 'var(--parchment)',
                          borderColor: 'var(--rule)',
                          color: 'var(--ink)',
                        }}
                      >
                        <Compass className="w-3 h-3 shrink-0" style={{ color: 'var(--brass-ink)' }} />
                        <span className="truncate">{p.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mission Readiness Semicircle Gauge & Checklist */}
            <div className="pt-3 border-t" style={{ borderColor: 'var(--rule)' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                  Mission Readiness
                </h3>
                <button
                  type="button"
                  onClick={() => onTabChange('reports')}
                  className="text-xs font-medium cursor-pointer hover:underline"
                  style={{ color: 'var(--brass-ink)' }}
                >
                  Details →
                </button>
              </div>

              <div
                className="p-3 rounded border flex flex-col sm:flex-row items-center gap-4"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                }}
              >
                <div className="relative w-36 h-20 shrink-0 flex items-end justify-center">
                  <svg viewBox="0 0 140 80" className="w-full h-full overflow-visible" aria-hidden="true">
                    <path
                      d="M 16 70 A 54 54 0 0 1 124 70"
                      fill="none"
                      stroke="var(--rule)"
                      strokeWidth="12"
                      strokeLinecap="butt"
                    />
                    <path
                      d="M 16 70 A 54 54 0 0 1 124 70"
                      fill="none"
                      stroke={readiness >= 85 ? 'var(--ready)' : 'var(--task)'}
                      strokeWidth="12"
                      strokeDasharray={`${filledLength} ${arcLength}`}
                      strokeLinecap="butt"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute bottom-0 text-center">
                    <span className="font-mono-num text-2xl font-bold block leading-none" style={{ color: 'var(--ink)' }}>
                      {readiness}%
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: 'var(--ink-3)' }}>
                      Ready
                    </span>
                  </div>
                </div>

                <ul className="flex-1 w-full space-y-1.5">
                  {member.readinessChecks.map((chk) => (
                    <li key={chk.id}>
                      <button
                        type="button"
                        onClick={() => onToggleReadinessCheck(member.id, chk.id)}
                        className="w-full flex items-center gap-2 text-left text-xs cursor-pointer"
                      >
                        {chk.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--ready)' }} />
                        ) : (
                          <Circle className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--task)' }} />
                        )}
                        <span style={{ color: chk.passed ? 'var(--ink)' : 'var(--task)' }}>
                          {chk.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === 'terminal' && (
          <div className="space-y-4">
            {/* 1-to-1 hc Binding Configuration */}
            <div
              className="p-3 rounded border space-y-2.5"
              style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
                1-to-1 herdr-core Terminal Binding
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] uppercase mb-0.5" style={{ color: 'var(--ink-3)' }}>
                    Terminal Name
                  </label>
                  <input
                    type="text"
                    value={member.terminal.terminalName}
                    onChange={(e) => onUpdateTerminal(member.id, { terminalName: e.target.value })}
                    className="w-full px-2 py-1 rounded border font-mono text-xs"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase mb-0.5" style={{ color: 'var(--ink-3)' }}>
                    Agent Runtime
                  </label>
                  <select
                    value={member.terminal.agentRuntime}
                    onChange={(e) => onUpdateTerminal(member.id, { agentRuntime: e.target.value as AgentRuntime })}
                    className="w-full px-2 py-1 rounded border font-mono text-xs cursor-pointer"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  >
                    <option value="claude">claude</option>
                    <option value="pi">pi</option>
                    <option value="codex">codex</option>
                    <option value="custom">custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase mb-0.5" style={{ color: 'var(--ink-3)' }}>
                    Template (~/.config/herdr-core/templates)
                  </label>
                  <input
                    type="text"
                    value={member.terminal.templateName}
                    onChange={(e) => onUpdateTerminal(member.id, { templateName: e.target.value })}
                    className="w-full px-2 py-1 rounded border font-mono text-xs"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase mb-0.5" style={{ color: 'var(--ink-3)' }}>
                    Parent Terminal
                  </label>
                  <input
                    type="text"
                    value={member.terminal.parentTerminalId}
                    onChange={(e) => onUpdateTerminal(member.id, { parentTerminalId: e.target.value })}
                    className="w-full px-2 py-1 rounded border font-mono text-xs"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase mb-0.5" style={{ color: 'var(--ink-3)' }}>
                    Working Directory (--cwd)
                  </label>
                  <input
                    type="text"
                    value={member.terminal.cwd}
                    onChange={(e) => onUpdateTerminal(member.id, { cwd: e.target.value })}
                    className="w-full px-2 py-1 rounded border font-mono text-xs"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  />
                </div>
              </div>
            </div>

            {/* hc CLI Dispatch Builder */}
            <div
              className="p-3 rounded border space-y-2.5"
              style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
                  hc Command Dispatch
                </span>
                <label className="flex items-center gap-1.5 text-[11px] cursor-pointer" style={{ color: 'var(--ink-2)' }}>
                  <input
                    type="checkbox"
                    checked={useTemplateLaunch}
                    onChange={(e) => setUseTemplateLaunch(e.target.checked)}
                  />
                  Use template
                </label>
              </div>

              <textarea
                rows={2}
                value={sendDraft}
                onChange={(e) => setSendDraft(e.target.value)}
                placeholder="Scoped task or follow-up message..."
                className="w-full p-2 rounded border text-xs"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />

              {/* hc run --bg */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-semibold" style={{ color: 'var(--ink-2)' }}>
                    Launch (--bg, report to {captainTerminalId})
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText('hc-run', hcRunCmd)}
                    className="inline-flex items-center gap-1 font-medium cursor-pointer"
                    style={{ color: copiedKey === 'hc-run' ? 'var(--ready)' : 'var(--brass-ink)' }}
                  >
                    {copiedKey === 'hc-run' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'hc-run' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  className="p-2 rounded text-[11px] font-mono whitespace-pre-wrap break-all"
                  style={{ backgroundColor: 'var(--navy)', color: '#E8DFCB' }}
                >
                  {hcRunCmd}
                </pre>
              </div>

              {/* hc send */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold" style={{ color: 'var(--ink-2)' }}>
                      Steer / Message
                    </span>
                    <label className="flex items-center gap-1 cursor-pointer" style={{ color: 'var(--ink-3)' }}>
                      <input
                        type="checkbox"
                        checked={sendWait}
                        onChange={(e) => setSendWait(e.target.checked)}
                      />
                      --wait
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText('hc-send', hcSendCmd)}
                    className="inline-flex items-center gap-1 font-medium cursor-pointer"
                    style={{ color: copiedKey === 'hc-send' ? 'var(--ready)' : 'var(--brass-ink)' }}
                  >
                    {copiedKey === 'hc-send' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'hc-send' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  className="p-2 rounded text-[11px] font-mono whitespace-pre-wrap break-all"
                  style={{ backgroundColor: 'var(--navy)', color: '#E8DFCB' }}
                >
                  {hcSendCmd}
                </pre>
              </div>

              {/* Quick Inspection Commands */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  { key: 'read', label: 'Copy hc read', cmd: hcReadCmd },
                  { key: 'get', label: 'Copy hc get', cmd: hcGetCmd },
                  { key: 'int', label: 'Copy interrupt', cmd: hcInterruptCmd },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => copyText(btn.key, btn.cmd)}
                    className="py-1.5 px-2 rounded border text-[11px] font-mono cursor-pointer truncate"
                    style={{
                      backgroundColor: 'var(--parchment-raised)',
                      borderColor: 'var(--rule)',
                      color: copiedKey === btn.key ? 'var(--ready)' : 'var(--ink)',
                    }}
                  >
                    {copiedKey === btn.key ? 'Copied!' : btn.label}
                  </button>
                ))}
              </div>

              {/* Template Markdown Toggle */}
              <div className="pt-1 border-t" style={{ borderColor: 'var(--rule)' }}>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowTemplateMd((v) => !v)}
                    className="text-[11px] font-medium underline cursor-pointer"
                    style={{ color: 'var(--brass-ink)' }}
                  >
                    {showTemplateMd ? 'Hide' : 'View'} {member.terminal.templateName}.md template
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText('tpl-md', templateMd)}
                    className="text-[11px] font-medium cursor-pointer"
                    style={{ color: copiedKey === 'tpl-md' ? 'var(--ready)' : 'var(--brass-ink)' }}
                  >
                    {copiedKey === 'tpl-md' ? 'Copied .md' : 'Copy .md'}
                  </button>
                </div>
                {showTemplateMd && (
                  <pre
                    className="mt-2 p-2.5 rounded border text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto"
                    style={{
                      backgroundColor: 'var(--parchment-raised)',
                      borderColor: 'var(--rule)',
                      color: 'var(--ink-2)',
                    }}
                  >
                    {templateMd}
                  </pre>
                )}
              </div>
            </div>

            {/* Hooked Tool Usage Event Stream */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                Hooked Tool Events ({member.hookEvents.length})
              </h3>

              <form
                onSubmit={handleSubmitHook}
                className="p-2.5 rounded border space-y-2"
                style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
              >
                <div className="grid grid-cols-3 gap-1.5">
                  <select
                    value={hookTool}
                    onChange={(e) => setHookTool(e.target.value as HookToolName)}
                    className="px-2 py-1 rounded border text-xs font-mono cursor-pointer"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  >
                    <option value="Read">Read</option>
                    <option value="Edit">Edit</option>
                    <option value="Write">Write</option>
                    <option value="Bash">Bash</option>
                    <option value="Grep">Grep</option>
                    <option value="hc send">hc send</option>
                    <option value="hc read">hc read</option>
                  </select>
                  <input
                    type="text"
                    value={hookTarget}
                    onChange={(e) => setHookTarget(e.target.value)}
                    placeholder="File or command..."
                    className="col-span-2 px-2 py-1 rounded border text-xs font-mono"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  />
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={hookSummary}
                    onChange={(e) => setHookSummary(e.target.value)}
                    placeholder="Hook event summary..."
                    className="flex-1 px-2 py-1 rounded border text-xs"
                    style={{ backgroundColor: 'var(--parchment-raised)', borderColor: 'var(--rule)', color: 'var(--ink)' }}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded text-xs font-medium cursor-pointer"
                    style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
                  >
                    Append
                  </button>
                </div>
              </form>

              <ul className="space-y-1.5">
                {member.hookEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className="p-2.5 rounded border text-xs"
                    style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="font-semibold" style={{ color: 'var(--brass-ink)' }}>
                        {ev.tool} · {ev.target}
                      </span>
                      <span style={{ color: 'var(--ink-3)' }}>{ev.timestamp}</span>
                    </div>
                    <p className="mt-1" style={{ color: 'var(--ink-2)' }}>
                      {ev.summary}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div
              className="p-3 rounded border"
              style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Title & Rank</span>
              </div>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--ink)' }}>
                {member.rankTitle}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>
                {member.vesselOrUnit} · {member.tier} Tier
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                What They Do
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                {member.whatTheyDo}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t" style={{ borderColor: 'var(--rule)' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                Signature Trait
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                {member.signatureTrait}
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t" style={{ borderColor: 'var(--rule)' }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                Relationship to the Fleet
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                {member.fleetRelationships}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-4">
            <form
              onSubmit={handleSubmitJournal}
              className="p-3 rounded border space-y-2.5"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
              }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
                Log New Entry ({member.name})
              </div>
              <input
                type="text"
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                placeholder="Log heading (e.g. Fog bank bearing update)"
                className="w-full text-xs px-2.5 py-1.5 rounded border"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
              <textarea
                rows={3}
                value={journalBody}
                onChange={(e) => setJournalBody(e.target.value)}
                placeholder="Record observations, hazards, or course adjustments..."
                className="w-full text-xs px-2.5 py-1.5 rounded border resize-y"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded text-xs font-medium cursor-pointer"
                style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
              >
                Save Journal Entry
              </button>
            </form>

            <div className="space-y-3">
              {member.journals.map((entry) => (
                <article
                  key={entry.id}
                  className="p-3 rounded border"
                  style={{
                    backgroundColor: 'var(--parchment)',
                    borderColor: 'var(--rule)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-num" style={{ color: 'var(--ink-3)' }}>
                    <span>{entry.timestamp}</span>
                    <span>Day {entry.day}</span>
                  </div>
                  <h4 className="font-display font-semibold text-sm mt-1" style={{ color: 'var(--ink)' }}>
                    {entry.title}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                    {entry.content}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'var(--ink-2)' }}>
              Click a tool’s status control to cycle between Online, Calibrating, and Maintenance. Tool availability directly updates readiness.
            </p>
            {member.tools.map((tool) => (
              <div
                key={tool.id}
                className="p-3 rounded border flex items-start justify-between gap-3"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                }}
              >
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
                    {tool.name}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                    {tool.category}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                    {tool.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCycleToolStatus(member.id, tool.id)}
                  className="px-2.5 py-1 rounded border text-[11px] font-semibold shrink-0 cursor-pointer"
                  style={{
                    borderColor: toolStatusColor(tool.status),
                    color: toolStatusColor(tool.status),
                    backgroundColor: 'var(--parchment-raised)',
                  }}
                >
                  {tool.status}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--ink-2)' }}>
                Doctrine-backed operational templates
              </p>
              <button
                type="button"
                onClick={() => setShowAddPrompt((v) => !v)}
                className="text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                style={{ color: 'var(--brass-ink)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                New Prompt
              </button>
            </div>

            {showAddPrompt && (
              <form
                onSubmit={handleSubmitPrompt}
                className="p-3 rounded border space-y-2"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--brass)',
                }}
              >
                <input
                  type="text"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="Template title"
                  className="w-full text-xs px-2.5 py-1.5 rounded border"
                  style={{
                    backgroundColor: 'var(--parchment-raised)',
                    borderColor: 'var(--rule)',
                    color: 'var(--ink)',
                  }}
                />
                <input
                  type="text"
                  value={promptSummary}
                  onChange={(e) => setPromptSummary(e.target.value)}
                  placeholder="Short operational purpose"
                  className="w-full text-xs px-2.5 py-1.5 rounded border"
                  style={{
                    backgroundColor: 'var(--parchment-raised)',
                    borderColor: 'var(--rule)',
                    color: 'var(--ink)',
                  }}
                />
                <textarea
                  rows={4}
                  value={promptBody}
                  onChange={(e) => setPromptBody(e.target.value)}
                  placeholder="Structured checklist or prompt text..."
                  className="w-full text-xs px-2.5 py-1.5 rounded border font-mono"
                  style={{
                    backgroundColor: 'var(--parchment-raised)',
                    borderColor: 'var(--rule)',
                    color: 'var(--ink)',
                  }}
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded text-xs font-medium cursor-pointer"
                  style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
                >
                  Add Template
                </button>
              </form>
            )}

            {member.prompts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded border space-y-2"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
                      {p.title}
                    </h4>
                    <p className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                      {p.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(p.id, p.template)}
                    className="px-2.5 py-1 rounded border text-[11px] font-medium inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    style={{
                      borderColor: 'var(--rule)',
                      backgroundColor: 'var(--parchment-raised)',
                      color: copiedKey === p.id ? 'var(--ready)' : 'var(--ink)',
                    }}
                  >
                    {copiedKey === p.id ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre
                  className="text-[11px] font-mono whitespace-pre-wrap p-2.5 rounded border leading-relaxed"
                  style={{
                    backgroundColor: 'var(--parchment-raised)',
                    borderColor: 'var(--rule)',
                    color: 'var(--ink-2)',
                  }}
                >
                  {p.template}
                </pre>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div
              className="p-3 rounded border grid grid-cols-3 gap-3 text-center"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
              }}
            >
              <div>
                <div className="font-mono-num text-xl font-bold" style={{ color: 'var(--ink)' }}>
                  {readiness}%
                </div>
                <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>Readiness</div>
              </div>
              <div>
                <div className="font-mono-num text-xl font-bold" style={{ color: 'var(--ink)' }}>
                  {member.watchHours}h
                </div>
                <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>Watch Hours</div>
              </div>
              <div>
                <div className="font-mono-num text-xl font-bold" style={{ color: 'var(--ink)' }}>
                  {member.hookEvents.length}
                </div>
                <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>Hook Events</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ink)' }}>
                Toggle Readiness Verification
              </h4>
              <ul className="space-y-2">
                {member.readinessChecks.map((chk) => (
                  <li
                    key={chk.id}
                    className="p-2.5 rounded border flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: 'var(--parchment)',
                      borderColor: 'var(--rule)',
                    }}
                  >
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--ink)' }}>
                        {chk.label}
                      </div>
                      {chk.note && (
                        <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                          {chk.note}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleReadinessCheck(member.id, chk.id)}
                      className="px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer border"
                      style={{
                        borderColor: chk.passed ? 'var(--ready)' : 'var(--task)',
                        color: chk.passed ? 'var(--ready)' : 'var(--task)',
                        backgroundColor: 'var(--parchment-raised)',
                      }}
                    >
                      {chk.passed ? 'Verified' : 'Pending'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside aria-label="Officer inspector" className="hidden xl:block w-[410px] 2xl:w-[440px] shrink-0">
        <div className="sticky top-20 h-[calc(100vh-6rem)]">{content}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/55"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-full max-w-md h-full p-2">{content}</aside>
        </div>
      )}
    </>
  );
};
