import React, { useMemo, useState } from 'react';
import { BookOpen, Search, Plus, Terminal, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CrewMember, HookToolName } from '../types/fleet';
import { getTerminalStateStyle, parseExternalHcJson } from '../utils/hcCommands';

interface LogsJournalsViewProps {
  crew: CrewMember[];
  voyageDay: number;
  onAddJournal: (memberId: string, title: string, content: string) => void;
  onIngestHcJson: (rawJson: string) => { updatedTerminals: number; appendedEvents: number };
  onInspectOfficer: (id: string, tab?: 'overview' | 'terminal') => void;
}

const SAMPLE_HC_INGEST = JSON.stringify(
  [
    {
      id: 't10',
      name: 'no-marlowe',
      status: 'working',
      foreground: { cwd: '/workspace/nelson-fleet/charts' },
      tool: 'Edit',
      target: 'charts/north-reach-corridor.json',
      summary: 'Re-plotted fog contingency bearing +4 cables west of shoal',
      outcome: 'ok',
      screen: 'Blacklight Reef clearance verified. Fog corridor locked in pencil overlay.',
    },
    {
      id: 't18',
      name: 'watchdog-kronsch',
      status: 'working',
      tool: 'Read',
      target: 'src/types/fleet.ts',
      summary: 'Checksummed PATHS, FILES, SHAKESPEARE, PLAINTEXT against Day 214 manifest',
      outcome: 'ok',
      screen: '[PATHS ✓] [FILES ✓] [SHAKESPEARE ✓] [PLAINTEXT ✓] -> KRONSCHes along.',
    },
  ],
  null,
  2
);

export const LogsJournalsView: React.FC<LogsJournalsViewProps> = ({
  crew,
  voyageDay,
  onAddJournal,
  onIngestHcJson,
  onInspectOfficer,
}) => {
  const [viewMode, setViewMode] = useState<'journals' | 'hooks'>('journals');

  // Journals filters & composer
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [newAuthorId, setNewAuthorId] = useState(crew[0]?.id || 'sophie-marlowe');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Hook stream filters & JSON ingest
  const [hookOfficerFilter, setHookOfficerFilter] = useState<string>('all');
  const [hookToolFilter, setHookToolFilter] = useState<string>('all');
  const [hookOutcomeFilter, setHookOutcomeFilter] = useState<string>('all');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [ingestFeedback, setIngestFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const allEntries = useMemo(() => {
    const list = crew.flatMap((member) =>
      member.journals.map((entry) => ({
        ...entry,
        member,
      }))
    );
    return list.sort((a, b) => b.day - a.day);
  }, [crew]);

  const filteredJournals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((item) => {
      if (selectedAuthor !== 'all' && item.member.id !== selectedAuthor) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.member.name.toLowerCase().includes(q)
      );
    });
  }, [allEntries, selectedAuthor, query]);

  const allHookEvents = useMemo(() => {
    const list = crew.flatMap((member) =>
      member.hookEvents.map((ev) => ({
        ...ev,
        member,
      }))
    );
    return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [crew]);

  const filteredHooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allHookEvents.filter((item) => {
      if (hookOfficerFilter !== 'all' && item.member.id !== hookOfficerFilter) return false;
      if (hookToolFilter !== 'all' && item.tool !== hookToolFilter) return false;
      if (hookOutcomeFilter !== 'all' && item.outcome !== hookOutcomeFilter) return false;
      if (!q) return true;
      return (
        item.target.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.member.name.toLowerCase().includes(q) ||
        item.member.terminal.terminalName.toLowerCase().includes(q)
      );
    });
  }, [allHookEvents, hookOfficerFilter, hookToolFilter, hookOutcomeFilter, query]);

  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddJournal(newAuthorId, newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
  };

  const handleIngest = () => {
    if (!jsonInput.trim()) return;
    try {
      parseExternalHcJson(jsonInput);
      const result = onIngestHcJson(jsonInput);
      setIngestFeedback({
        ok: true,
        message: `Synced ${result.updatedTerminals} terminal binding(s) and appended ${result.appendedEvents} hook event(s).`,
      });
    } catch (err) {
      setIngestFeedback({
        ok: false,
        message: err instanceof Error ? err.message : 'Invalid JSON payload.',
      });
    }
  };

  const toolOptions: HookToolName[] = [
    'Read',
    'Edit',
    'Write',
    'Bash',
    'Grep',
    'hc send',
    'hc read',
    'hc wait',
    'hc run',
  ];

  return (
    <section aria-labelledby="logs-journals-heading" className="space-y-5">
      {/* Header + Segmented View Mode */}
      <div
        className="p-5 rounded border flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            {viewMode === 'journals' ? (
              <BookOpen className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            ) : (
              <Terminal className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            )}
            <h1
              id="logs-journals-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Logs, Journals & Hook Stream
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Shipboard officer logbooks and live hooked tool events from all 18 bound <code className="font-mono-num text-xs">hc</code> terminals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex rounded border p-0.5"
            style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
            role="tablist"
            aria-label="Log stream view mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'journals'}
              onClick={() => setViewMode('journals')}
              className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: viewMode === 'journals' ? 'var(--navy)' : 'transparent',
                color: viewMode === 'journals' ? '#FAF5EA' : 'var(--ink-2)',
              }}
            >
              Ship Journals ({allEntries.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'hooks'}
              onClick={() => setViewMode('hooks')}
              className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: viewMode === 'hooks' ? 'var(--navy)' : 'transparent',
                color: viewMode === 'hooks' ? '#FAF5EA' : 'var(--ink-2)',
              }}
            >
              Tool Hook Events ({allHookEvents.length})
            </button>
          </div>

          <div
            className="font-mono-num text-xs px-3 py-1.5 rounded border"
            style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--parchment)', color: 'var(--ink)' }}
          >
            Day {voyageDay}
          </div>
        </div>
      </div>

      {viewMode === 'journals' ? (
        <>
          {/* Compose Entry */}
          <form
            onSubmit={handleSubmitJournal}
            className="p-4 rounded border space-y-3"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
              Record Shipboard Log Entry
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={newAuthorId}
                onChange={(e) => setNewAuthorId(e.target.value)}
                aria-label="Log author"
                className="h-9 px-3 rounded border text-xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                {crew.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Entry heading..."
                className="md:col-span-2 h-9 px-3 rounded border text-xs"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={2}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write observation in plain, verifiable language..."
                className="flex-1 p-2.5 rounded border text-xs"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded text-xs font-semibold inline-flex items-center justify-center gap-1.5 self-end sm:self-stretch cursor-pointer"
                style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
              >
                <Plus className="w-4 h-4" /> Log Entry
              </button>
            </div>
          </form>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              aria-label="Filter logs by officer"
              className="h-9 px-3 rounded border text-xs cursor-pointer"
              style={{
                backgroundColor: 'var(--parchment-raised)',
                borderColor: 'var(--rule)',
                color: 'var(--ink)',
              }}
            >
              <option value="all">All Officers ({allEntries.length} entries)</option>
              {crew.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.role}
                </option>
              ))}
            </select>

            <div className="relative sm:w-64">
              <Search
                className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--ink-3)' }}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search log text..."
                className="w-full h-9 pl-8 pr-3 rounded border text-xs"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
            </div>
          </div>

          {/* Entries Feed */}
          <div className="space-y-3">
            {filteredJournals.map((item) => (
              <article
                key={item.id}
                className="p-4 rounded border flex flex-col sm:flex-row gap-4"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onInspectOfficer(item.member.id)}
                  className="flex items-center sm:flex-col sm:items-start gap-2.5 sm:w-40 shrink-0 text-left cursor-pointer group"
                >
                  <img
                    src={item.member.portrait}
                    alt={item.member.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded object-cover object-top border"
                    style={{ borderColor: 'var(--brass)' }}
                  />
                  <div>
                    <div className="font-display font-semibold text-sm group-hover:underline" style={{ color: 'var(--ink)' }}>
                      {item.member.name}
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                      {item.member.role}
                    </div>
                  </div>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-num" style={{ color: 'var(--ink-3)' }}>
                    <span>{item.timestamp}</span>
                    <span>Day {item.day}</span>
                  </div>
                  <h2 className="font-display text-base font-semibold mt-1" style={{ color: 'var(--ink)' }}>
                    {item.title}
                  </h2>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                    {item.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Paste hc ls / Tool Hook JSON Ingest Panel */}
          <div
            className="p-4 rounded border space-y-3"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brass-ink)' }}>
                  Ingest hc ls / Tool Hook JSON Payload
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                  Paste piped <code className="font-mono-num">hc ls</code> or agent tool-hook JSON objects matched by <code className="font-mono-num">id</code> (<code className="font-mono-num">t1..t18</code>) or <code className="font-mono-num">name</code>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setJsonInput(SAMPLE_HC_INGEST);
                  setIngestFeedback(null);
                }}
                className="px-3 py-1.5 rounded border text-xs font-medium cursor-pointer"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                Load Example JSON
              </button>
            </div>

            <textarea
              rows={5}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"id":"t10","name":"no-marlowe","status":"working","tool":"Edit","target":"charts/north-reach.json","summary":"Updated shoal margin","outcome":"ok"}]'
              className="w-full p-2.5 rounded border font-mono-num text-[11px]"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
                color: 'var(--ink)',
              }}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              {ingestFeedback ? (
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: ingestFeedback.ok ? 'var(--ready)' : 'var(--danger)' }}
                >
                  {ingestFeedback.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{ingestFeedback.message}</span>
                </div>
              ) : (
                <span className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                  Updates terminal state, cwd, last screen preview, and appends new hook events.
                </span>
              )}

              <button
                type="button"
                onClick={handleIngest}
                className="px-4 py-2 rounded text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
              >
                <Upload className="w-3.5 h-3.5" /> Apply JSON Sync
              </button>
            </div>
          </div>

          {/* Hook Filter Bar */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={hookOfficerFilter}
                onChange={(e) => setHookOfficerFilter(e.target.value)}
                aria-label="Filter hook events by officer"
                className="h-9 px-3 rounded border text-xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                <option value="all">All Terminals ({allHookEvents.length})</option>
                {crew.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.terminal.terminalId} · {c.name}
                  </option>
                ))}
              </select>

              <select
                value={hookToolFilter}
                onChange={(e) => setHookToolFilter(e.target.value)}
                aria-label="Filter hook events by tool"
                className="h-9 px-3 rounded border text-xs cursor-pointer font-mono-num"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                <option value="all">All Tools</option>
                {toolOptions.map((tool) => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>

              <select
                value={hookOutcomeFilter}
                onChange={(e) => setHookOutcomeFilter(e.target.value)}
                aria-label="Filter hook events by outcome"
                className="h-9 px-3 rounded border text-xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                <option value="all">All Outcomes</option>
                <option value="ok">ok</option>
                <option value="blocked">blocked</option>
                <option value="error">error</option>
              </select>
            </div>

            <div className="relative sm:w-64">
              <Search
                className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--ink-3)' }}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search target or summary..."
                className="w-full h-9 pl-8 pr-3 rounded border text-xs"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              />
            </div>
          </div>

          {/* Hook Event Stream Table */}
          <div
            className="rounded border overflow-x-auto"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
            }}
          >
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b uppercase tracking-wider text-[11px]"
                  style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--parchment)', color: 'var(--ink-3)' }}
                >
                  <th className="py-2.5 px-3 font-semibold">Time</th>
                  <th className="py-2.5 px-3 font-semibold">Terminal / Officer</th>
                  <th className="py-2.5 px-3 font-semibold">Tool</th>
                  <th className="py-2.5 px-3 font-semibold">Target</th>
                  <th className="py-2.5 px-3 font-semibold">Event Summary</th>
                  <th className="py-2.5 px-3 font-semibold">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--rule)' }}>
                {filteredHooks.map((ev) => {
                  const st = getTerminalStateStyle(ev.member.terminal.terminalState);
                  const outcomeColor =
                    ev.outcome === 'ok'
                      ? 'var(--ready)'
                      : ev.outcome === 'blocked'
                      ? 'var(--task)'
                      : 'var(--danger)';
                  return (
                    <tr
                      key={ev.id}
                      className="hover:bg-[var(--parchment)] transition-colors"
                      style={{ borderColor: 'var(--rule)' }}
                    >
                      <td className="py-2.5 px-3 font-mono-num whitespace-nowrap" style={{ color: 'var(--ink-3)' }}>
                        {ev.timestamp}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onInspectOfficer(ev.member.id, 'terminal')}
                          className="inline-flex items-center gap-2 text-left cursor-pointer hover:underline"
                        >
                          <span className="font-mono-num font-semibold" style={{ color: 'var(--brass-ink)' }}>
                            {ev.member.terminal.terminalId}
                          </span>
                          <span className="font-medium" style={{ color: 'var(--ink)' }}>
                            {ev.member.name}
                          </span>
                          <span
                            className="font-mono-num text-[10px] px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: st.bg, color: st.color }}
                          >
                            {st.label}
                          </span>
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono-num font-semibold whitespace-nowrap" style={{ color: 'var(--ink)' }}>
                        {ev.tool}
                      </td>
                      <td className="py-2.5 px-3 font-mono-num max-w-[200px] truncate" style={{ color: 'var(--ink-2)' }}>
                        {ev.target}
                      </td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--ink-2)' }}>
                        {ev.summary}
                      </td>
                      <td className="py-2.5 px-3 font-mono-num font-semibold whitespace-nowrap" style={{ color: outcomeColor }}>
                        {ev.outcome}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};
