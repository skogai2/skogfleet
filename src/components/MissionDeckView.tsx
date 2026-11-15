import React, { useMemo, useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  Terminal,
  Copy,
  Check,
  GitBranch,
} from 'lucide-react';
import { CrewMember, MissionObjective } from '../types/fleet';
import { buildHcRunCommand, getTerminalStateStyle } from '../utils/hcCommands';

interface MissionDeckViewProps {
  missionName: string;
  shipStatus: 'Operational' | 'High Alert' | 'Anchored';
  captainTerminalId: string;
  workspaceCwd: string;
  voyageDay: number;
  etaDays: number;
  crew: CrewMember[];
  objectives: MissionObjective[];
  onToggleObjective: (id: string) => void;
  onAddObjective: (title: string, sector: string, assigneeId: string, priority: MissionObjective['priority']) => void;
  onUpdateShipStatus: (status: 'Operational' | 'High Alert' | 'Anchored') => void;
  onUpdateCaptainConfig: (captainTerminalId: string, workspaceCwd: string) => void;
  onAdvanceDay: () => void;
  onInspectOfficer: (id: string, tab?: 'overview' | 'terminal') => void;
}

export const MissionDeckView: React.FC<MissionDeckViewProps> = ({
  missionName,
  shipStatus,
  captainTerminalId,
  workspaceCwd,
  voyageDay,
  etaDays,
  crew,
  objectives,
  onToggleObjective,
  onAddObjective,
  onUpdateShipStatus,
  onUpdateCaptainConfig,
  onAdvanceDay,
  onInspectOfficer,
}) => {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('Sector B · North Reach');
  const [assigneeId, setAssigneeId] = useState('sophie-marlowe');
  const [priority, setPriority] = useState<MissionObjective['priority']>('High');
  const [waitMode, setWaitMode] = useState<'all' | 'any'>('all');
  const [useTemplates, setUseTemplates] = useState(true);
  const [copiedScript, setCopiedScript] = useState(false);

  const completedCount = objectives.filter((o) => o.completed).length;

  const openObjectives = useMemo(
    () => objectives.filter((o) => !o.completed),
    [objectives]
  );

  const dispatchScript = useMemo(() => {
    if (openObjectives.length === 0) {
      return `# All squadron objectives are currently complete.\nhc ls`;
    }
    const seen = new Set<string>();
    const launchLines: string[] = [
      `export HC_TERMINAL_ID=${captainTerminalId}`,
      `cd ${workspaceCwd}`,
      '',
    ];
    for (const obj of openObjectives) {
      const officer = crew.find((c) => c.id === obj.assigneeId);
      if (!officer || seen.has(officer.id)) continue;
      seen.add(officer.id);
      launchLines.push(
        buildHcRunCommand(officer, captainTerminalId, `${obj.title} (${obj.sector})`, useTemplates)
      );
    }
    launchLines.push('');
    launchLines.push(`hc wait --children ${waitMode}`);
    return launchLines.join('\n');
  }, [openObjectives, crew, captainTerminalId, workspaceCwd, useTemplates, waitMode]);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(dispatchScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddObjective(title.trim(), sector.trim() || 'North Reach', assigneeId, priority);
    setTitle('');
  };

  const hierarchyGroups = useMemo(() => {
    const t0Children = crew.filter((c) => c.terminal.parentTerminalId === captainTerminalId || c.terminal.parentTerminalId === 't0');
    const otherNodes = crew.filter((c) => c.terminal.parentTerminalId !== captainTerminalId && c.terminal.parentTerminalId !== 't0');
    return { t0Children, otherNodes };
  }, [crew, captainTerminalId]);

  return (
    <section aria-labelledby="mission-deck-heading" className="space-y-5">
      {/* Expedition Banner */}
      <div
        className="p-5 rounded border flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="mission-deck-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Mission Deck: {missionName}
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Plan squadron orders, configure the Captain&apos;s root <code className="font-mono-num text-xs">$HC_TERMINAL_ID</code>, and generate <code className="font-mono-num text-xs">hc run --bg</code> dispatch scripts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="px-3.5 py-2 rounded border flex items-center gap-3 text-xs"
            style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
          >
            <Calendar className="w-4 h-4" style={{ color: 'var(--brass-ink)' }} />
            <span className="font-mono-num font-semibold" style={{ color: 'var(--ink)' }}>
              Day {voyageDay}
            </span>
            <span style={{ color: 'var(--ink-3)' }}>·</span>
            <span className="font-mono-num font-semibold" style={{ color: 'var(--ready)' }}>
              ETA {etaDays} days
            </span>
          </div>

          <select
            aria-label="Ship Operational Status"
            value={shipStatus}
            onChange={(e) =>
              onUpdateShipStatus(e.target.value as 'Operational' | 'High Alert' | 'Anchored')
            }
            className="h-9 px-3 rounded border text-xs font-semibold cursor-pointer"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--brass)',
              color: 'var(--ink)',
            }}
          >
            <option value="Operational">Operational</option>
            <option value="High Alert">High Alert</option>
            <option value="Anchored">Anchored</option>
          </select>

          <button
            type="button"
            onClick={onAdvanceDay}
            className="h-9 px-4 rounded text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
          >
            Advance Watch Day
          </button>
        </div>
      </div>

      {/* Captain Root Terminal Configuration + Squadron Batch Dispatch Builder */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div
          className="xl:col-span-5 p-4 rounded border space-y-3"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" style={{ color: 'var(--brass-ink)' }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
              Captain Session Anchor ($HC_TERMINAL_ID)
            </h2>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
            Crew terminals spawned by the Captain inherit this address as their report-back target via{' '}
            <code className="font-mono-num">hc send {captainTerminalId}</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-3)' }}>
                Captain $HC_TERMINAL_ID
              </label>
              <input
                type="text"
                value={captainTerminalId}
                onChange={(e) => onUpdateCaptainConfig(e.target.value, workspaceCwd)}
                className="w-full h-9 px-3 rounded border font-mono-num text-xs"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-3)' }}>
                Default Fleet --cwd
              </label>
              <input
                type="text"
                value={workspaceCwd}
                onChange={(e) => onUpdateCaptainConfig(captainTerminalId, e.target.value)}
                className="w-full h-9 px-3 rounded border font-mono-num text-xs"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
            </div>
          </div>

          <div
            className="p-3 rounded border text-xs space-y-1.5"
            style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>Live Terminal States</span>
              <span className="font-mono-num" style={{ color: 'var(--ink-3)' }}>{crew.length} Bound</span>
            </div>
            <div className="grid grid-cols-5 gap-2 pt-1 text-center font-mono-num text-[11px]">
              {(['working', 'idle', 'blocked', 'error', 'offline'] as const).map((st) => {
                const count = crew.filter((c) => c.terminal.terminalState === st).length;
                const style = getTerminalStateStyle(st);
                return (
                  <div
                    key={st}
                    className="py-1.5 px-1 rounded border"
                    style={{ borderColor: 'var(--rule)', backgroundColor: style.bg }}
                  >
                    <div className="font-bold text-sm" style={{ color: style.color }}>{count}</div>
                    <div className="text-[10px]" style={{ color: 'var(--ink-2)' }}>{style.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Squadron Batch Dispatch Script */}
        <div
          className="xl:col-span-7 p-4 rounded border flex flex-col justify-between gap-3"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                Squadron Dispatch Script ({openObjectives.length} Open Orders)
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--ink-3)' }}>
                Launches interactive background sessions with first task attached and waits on children.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--ink-2)' }}>
                <input
                  type="checkbox"
                  checked={useTemplates}
                  onChange={(e) => setUseTemplates(e.target.checked)}
                />
                <span>Use templates</span>
              </label>
              <select
                aria-label="Wait mode"
                value={waitMode}
                onChange={(e) => setWaitMode(e.target.value as 'all' | 'any')}
                className="h-8 px-2 rounded border font-mono-num text-xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                <option value="all">--children all</option>
                <option value="any">--children any</option>
              </select>
              <button
                type="button"
                onClick={handleCopyScript}
                className="h-8 px-3 rounded text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
              >
                {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied Script' : 'Copy Script'}</span>
              </button>
            </div>
          </div>

          <pre
            className="p-3 rounded border font-mono-num text-[11px] leading-relaxed overflow-x-auto max-h-44"
            style={{
              backgroundColor: 'var(--navy)',
              borderColor: 'var(--navy-border)',
              color: '#EAE2CE',
            }}
          >
            {dispatchScript}
          </pre>
        </div>
      </div>

      {/* Add Mission Objective Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded border grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div className="md:col-span-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-3)' }}>
            New Order / Objective
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Describe single-page mission order..."
            className="w-full h-9 px-3 rounded border text-xs"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-3)' }}>
            Sector / Compartment
          </label>
          <input
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full h-9 px-3 rounded border text-xs"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-3)' }}>
            Officer Terminal
          </label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full h-9 px-2 rounded border text-xs cursor-pointer"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          >
            {crew.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.terminal.terminalId})
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-3)' }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as MissionObjective['priority'])}
            className="w-full h-9 px-2 rounded border text-xs cursor-pointer"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <button
            type="submit"
            className="w-full h-9 px-3 rounded text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
            style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </form>

      {/* Objectives Table */}
      <div
        className="rounded border overflow-hidden"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--parchment)' }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
            Squadron Orders & Objectives
          </h2>
          <span className="font-mono-num text-xs" style={{ color: 'var(--ink-2)' }}>
            {completedCount}/{objectives.length} Completed
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--rule)' }}>
          {objectives.map((obj) => {
            const officer = crew.find((c) => c.id === obj.assigneeId);
            const tStyle = officer ? getTerminalStateStyle(officer.terminal.terminalState) : null;
            return (
              <div
                key={obj.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--parchment)] transition-colors"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleObjective(obj.id)}
                    aria-label={obj.completed ? 'Mark objective open' : 'Mark objective complete'}
                    className="mt-0.5 cursor-pointer"
                  >
                    {obj.completed ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--ready)' }} />
                    ) : (
                      <Circle className="w-4 h-4" style={{ color: 'var(--ink-3)' }} />
                    )}
                  </button>
                  <div>
                    <p
                      className={`text-sm font-medium ${obj.completed ? 'line-through opacity-70' : ''}`}
                      style={{ color: 'var(--ink)' }}
                    >
                      {obj.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>
                      {obj.sector} · Due Day {obj.dueDay} · Priority: {obj.priority}
                    </p>
                  </div>
                </div>

                {officer && tStyle && (
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => onInspectOfficer(officer.id, 'terminal')}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded border text-xs font-medium cursor-pointer hover:border-[var(--brass)]"
                      style={{
                        backgroundColor: 'var(--parchment)',
                        borderColor: 'var(--rule)',
                        color: 'var(--ink)',
                      }}
                    >
                      <img
                        src={officer.portrait}
                        alt={officer.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded object-cover object-top"
                      />
                      <span>{officer.name}</span>
                      <span className="font-mono-num text-[11px]" style={{ color: 'var(--brass-ink)' }}>
                        {officer.terminal.terminalId}
                      </span>
                      <span
                        className="font-mono-num text-[10px] px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: tStyle.bg, color: tStyle.color }}
                      >
                        {tStyle.label}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fleet Terminal Hierarchy Tree */}
      <div
        className="p-4 rounded border space-y-3"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" style={{ color: 'var(--brass-ink)' }} />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
              1-to-1 Terminal Supervision Tree
            </h2>
          </div>
          <span className="font-mono-num text-[11px]" style={{ color: 'var(--ink-3)' }}>
            Root: {captainTerminalId}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[...hierarchyGroups.t0Children, ...hierarchyGroups.otherNodes].map((member) => {
            const st = getTerminalStateStyle(member.terminal.terminalState);
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => onInspectOfficer(member.id, 'terminal')}
                className="p-2.5 rounded border text-left flex items-center justify-between gap-2 hover:border-[var(--brass)] cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--ink)' }}>
                    <span className="font-mono-num" style={{ color: 'var(--brass-ink)' }}>
                      {member.terminal.terminalId}
                    </span>
                    <span className="truncate">{member.name}</span>
                  </div>
                  <div className="font-mono-num text-[11px] truncate mt-0.5" style={{ color: 'var(--ink-3)' }}>
                    {member.terminal.parentTerminalId} → {member.terminal.terminalName} ({member.terminal.agentRuntime})
                  </div>
                </div>
                <span
                  className="font-mono-num text-[10px] px-1.5 py-0.5 rounded shrink-0 font-semibold"
                  style={{ backgroundColor: st.bg, color: st.color }}
                >
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
