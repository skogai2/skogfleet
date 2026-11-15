import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Wrench,
  ScrollText,
  BarChart3,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  Anchor,
  Users,
  Terminal,
} from 'lucide-react';
import { CrewMember, CrewStatus, CrewTier, InspectorTab, TerminalState } from '../types/fleet';
import { computeReadiness, getStatusStyles } from '../utils/fleetHelpers';
import { getTerminalStateStyle } from '../utils/hcCommands';

interface CrewQuartersViewProps {
  crew: CrewMember[];
  selectedCrewId: string;
  onSelectCrew: (id: string, tab?: InspectorTab) => void;
}

const TIER_FILTERS: Array<{ id: 'All' | CrewTier; label: string }> = [
  { id: 'All', label: 'All Crew' },
  { id: 'Command', label: 'Command' },
  { id: 'Operations', label: 'Operations' },
  { id: 'Support', label: 'Marines & Support' },
  { id: 'Special', label: 'Special' },
];

export const CrewQuartersView: React.FC<CrewQuartersViewProps> = ({
  crew,
  selectedCrewId,
  onSelectCrew,
}) => {
  const [tierFilter, setTierFilter] = useState<'All' | CrewTier>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | CrewStatus>('All');
  const [terminalStateFilter, setTerminalStateFilter] = useState<'All' | TerminalState>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const counts = useMemo(() => {
    return {
      total: crew.length,
      ready: crew.filter((c) => c.status === 'Mission Ready').length,
      inTask: crew.filter((c) => c.status === 'In Task').length,
      offDuty: crew.filter((c) => c.status === 'Off Duty').length,
      Command: crew.filter((c) => c.tier === 'Command').length,
      Operations: crew.filter((c) => c.tier === 'Operations').length,
      Support: crew.filter((c) => c.tier === 'Support').length,
      Special: crew.filter((c) => c.tier === 'Special').length,
    };
  }, [crew]);

  const filteredCrew = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return crew.filter((member) => {
      if (tierFilter !== 'All' && member.tier !== tierFilter) return false;
      if (statusFilter !== 'All' && member.status !== statusFilter) return false;
      if (terminalStateFilter !== 'All' && member.terminal.terminalState !== terminalStateFilter) {
        return false;
      }
      if (!q) return true;
      return (
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.motto.toLowerCase().includes(q) ||
        member.doctrine.toLowerCase().includes(q) ||
        member.currentTask.toLowerCase().includes(q) ||
        member.terminal.terminalName.toLowerCase().includes(q) ||
        member.terminal.terminalId.toLowerCase().includes(q)
      );
    });
  }, [crew, tierFilter, statusFilter, terminalStateFilter, searchQuery]);

  const renderStatusIcon = (status: CrewStatus) => {
    if (status === 'Mission Ready') return <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />;
    if (status === 'In Task') return <Clock className="w-3.5 h-3.5 shrink-0" />;
    return <Anchor className="w-3.5 h-3.5 shrink-0" />;
  };

  return (
    <section aria-labelledby="crew-quarters-heading" className="space-y-5">
      {/* Header & KPI Strip */}
      <div
        className="p-5 rounded border flex flex-col xl:flex-row xl:items-center justify-between gap-5"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 shrink-0" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="crew-quarters-heading"
              className="font-display text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{ color: 'var(--ink)' }}
            >
              Crew Quarters
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            1-to-1 crew roster mapped to persistent <code className="font-mono text-xs">hc</code> terminals, tool hooks, journals, and doctrines.
          </p>
        </div>

        {/* Interactive Status KPI Strip */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 border rounded divide-y sm:divide-y-0 sm:divide-x overflow-hidden shrink-0"
          style={{
            borderColor: 'var(--rule)',
            backgroundColor: 'var(--parchment)',
          }}
        >
          {(
            [
              { key: 'All', label: 'Crew Terminals', value: counts.total, color: 'var(--ink)' },
              { key: 'Mission Ready', label: 'Mission Ready', value: counts.ready, color: 'var(--ready)' },
              { key: 'In Task', label: 'In Task', value: counts.inTask, color: 'var(--task)' },
              { key: 'Off Duty', label: 'Off Duty', value: counts.offDuty, color: 'var(--off)' },
            ] as const
          ).map((kpi) => {
            const active = statusFilter === kpi.key;
            return (
              <button
                key={kpi.key}
                type="button"
                onClick={() =>
                  setStatusFilter((prev) =>
                    prev === kpi.key && kpi.key !== 'All' ? 'All' : kpi.key
                  )
                }
                className="px-4 py-2.5 text-left transition-colors cursor-pointer hover:bg-[var(--parchment-raised)]"
                style={{
                  borderColor: 'var(--rule)',
                  backgroundColor: active ? 'var(--parchment-raised)' : undefined,
                }}
              >
                <span
                  className="font-mono-num text-xl font-semibold block leading-none"
                  style={{ color: kpi.color }}
                >
                  {kpi.value}
                </span>
                <span
                  className="text-[11px] font-medium mt-1 block whitespace-nowrap"
                  style={{ color: active ? 'var(--brass-ink)' : 'var(--ink-3)' }}
                >
                  {kpi.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs + Search + Terminal State + Grid/List Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter crew by division"
          className="flex flex-wrap items-center gap-1.5"
        >
          {TIER_FILTERS.map((f) => {
            const count = f.id === 'All' ? counts.total : counts[f.id];
            const active = tierFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTierFilter(f.id)}
                className="px-3 py-1.5 rounded text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  backgroundColor: active ? 'var(--navy)' : 'var(--parchment-raised)',
                  color: active ? '#FAF5EA' : 'var(--ink-2)',
                  borderColor: active ? 'var(--brass)' : 'var(--rule)',
                }}
              >
                {f.label} <span className="font-mono-num opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by terminal state"
            value={terminalStateFilter}
            onChange={(e) => setTerminalStateFilter(e.target.value as 'All' | TerminalState)}
            className="h-9 px-2.5 rounded border text-xs font-mono cursor-pointer"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          >
            <option value="All">hc: all states</option>
            <option value="working">hc: working</option>
            <option value="idle">hc: idle</option>
            <option value="blocked">hc: blocked</option>
            <option value="error">hc: error</option>
            <option value="offline">hc: offline</option>
          </select>

          <div className="relative flex-1 sm:w-52">
            <Search
              className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--ink-3)' }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crew or terminal..."
              aria-label="Search crew members"
              className="w-full h-9 pl-8 pr-3 rounded border text-xs transition-colors"
              style={{
                backgroundColor: 'var(--parchment-raised)',
                borderColor: 'var(--rule)',
                color: 'var(--ink)',
              }}
            />
          </div>

          <div
            className="inline-flex rounded border overflow-hidden shrink-0"
            style={{
              borderColor: 'var(--rule)',
              backgroundColor: 'var(--parchment-raised)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className="h-9 w-9 flex items-center justify-center cursor-pointer transition-colors"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--navy)' : 'transparent',
                color: viewMode === 'grid' ? '#E6BE6C' : 'var(--ink-2)',
              }}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className="h-9 w-9 flex items-center justify-center border-l cursor-pointer transition-colors"
              style={{
                borderColor: 'var(--rule)',
                backgroundColor: viewMode === 'list' ? 'var(--navy)' : 'transparent',
                color: viewMode === 'list' ? '#E6BE6C' : 'var(--ink-2)',
              }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty Search State */}
      {filteredCrew.length === 0 ? (
        <div
          className="p-10 rounded border text-center"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <p className="font-display text-lg font-medium" style={{ color: 'var(--ink)' }}>
            No crew terminals match this watch filter
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ink-3)' }}>
            Clear your search query or reset division filters to inspect all 18 officers.
          </p>
          <button
            type="button"
            onClick={() => {
              setTierFilter('All');
              setStatusFilter('All');
              setTerminalStateFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded text-xs font-medium cursor-pointer"
            style={{
              backgroundColor: 'var(--navy)',
              color: '#FAF5EA',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* 3-Column Crew Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredCrew.map((member) => {
            const isSelected = member.id === selectedCrewId;
            const statusStyle = getStatusStyles(member.status);
            const termStyle = getTerminalStateStyle(member.terminal.terminalState);
            const readiness = computeReadiness(member);
            const latestHook = member.hookEvents[0];

            return (
              <article
                key={member.id}
                className="rounded border overflow-hidden flex flex-col transition-shadow duration-150"
                style={{
                  backgroundColor: 'var(--parchment-raised)',
                  borderColor: isSelected ? 'var(--brass)' : 'var(--rule)',
                  boxShadow: isSelected
                    ? '0 0 0 2px var(--brass), 0 10px 24px -10px rgba(14,26,43,0.28)'
                    : undefined,
                }}
              >
                {/* Clickable Main Card Body */}
                <button
                  type="button"
                  onClick={() => onSelectCrew(member.id, 'overview')}
                  className="text-left flex-1 flex flex-col cursor-pointer group focus-visible:outline-none"
                >
                  {/* Portrait with Navy Role Header */}
                  <div className="relative h-36 w-full overflow-hidden bg-[var(--navy)]">
                    <img
                      src={member.portrait}
                      alt={`${member.name}, ${member.role}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/85 via-transparent to-[#0E1A2B]/50"
                      aria-hidden="true"
                    />
                    <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#F5EBD4] bg-[#0E1A2B]/85 px-2 py-0.5 border border-[#B58C3C]/60 truncate">
                        {member.role}
                      </span>
                      <span className="font-mono-num text-[11px] font-semibold text-[#E6BE6C] bg-[#0E1A2B]/85 px-1.5 py-0.5 border border-[#283F61] shrink-0">
                        {readiness}%
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-mono text-[#E8DFCB]">
                      <span className="truncate">
                        {member.terminal.terminalId} · {member.terminal.terminalName}
                      </span>
                      <span
                        className="shrink-0 font-semibold px-1.5 py-0.5 bg-[#0E1A2B]/85 border border-[#283F61]"
                        style={{ color: termStyle.label === 'working' ? '#78D8A6' : '#E6BE6C' }}
                      >
                        {termStyle.label}
                      </span>
                    </div>
                  </div>

                  {/* Officer Name, Motto & Latest Hook */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h2
                          className="font-display text-lg font-semibold leading-tight"
                          style={{ color: 'var(--ink)' }}
                        >
                          {member.name}
                        </h2>
                        <span className="text-[11px] shrink-0" style={{ color: 'var(--ink-3)' }}>
                          {member.tier}
                        </span>
                      </div>
                      <p
                        className="mt-1 font-display italic text-[13px] leading-snug"
                        style={{ color: 'var(--ink-2)' }}
                      >
                        “{member.motto}”
                      </p>
                      {latestHook && (
                        <p
                          className="mt-2 font-mono text-[11px] truncate"
                          style={{ color: 'var(--ink-3)' }}
                          title={`${latestHook.tool}: ${latestHook.target}`}
                        >
                          {latestHook.tool} · {latestHook.target}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: 'var(--rule)' }}>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: statusStyle.textColor }}
                      >
                        {renderStatusIcon(member.status)}
                        <span>{statusStyle.label}</span>
                      </span>
                      <span
                        className="text-[11px] truncate max-w-[150px]"
                        style={{ color: 'var(--ink-3)' }}
                        title={member.vesselOrUnit}
                      >
                        {member.vesselOrUnit}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Bottom Quick-Action Bar: Terminal / Journal / Tools / Prompts / Reports */}
                <div
                  className="grid grid-cols-5 border-t divide-x"
                  style={{
                    borderColor: 'var(--rule)',
                    backgroundColor: 'var(--parchment)',
                  }}
                >
                  {(
                    [
                      { tab: 'terminal', label: 'Terminal', icon: Terminal },
                      { tab: 'journal', label: 'Journal', icon: BookOpen },
                      { tab: 'tools', label: 'Tools', icon: Wrench },
                      { tab: 'prompts', label: 'Prompts', icon: ScrollText },
                      { tab: 'reports', label: 'Reports', icon: BarChart3 },
                    ] as const
                  ).map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.tab}
                        type="button"
                        onClick={() => onSelectCrew(member.id, action.tab)}
                        className="py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer hover:bg-[var(--parchment-raised)]"
                        style={{
                          color: 'var(--ink-2)',
                          borderColor: 'var(--rule)',
                        }}
                      >
                        <ActionIcon className="w-3.5 h-3.5" style={{ color: 'var(--brass-ink)' }} />
                        <span className="truncate max-w-full">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* High-Density List / Table View */
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
                className="border-b text-[11px] uppercase tracking-wider"
                style={{
                  borderColor: 'var(--rule)',
                  backgroundColor: 'var(--parchment)',
                  color: 'var(--ink-3)',
                }}
              >
                <th className="py-2.5 px-3 font-semibold">Officer</th>
                <th className="py-2.5 px-3 font-semibold">hc Terminal</th>
                <th className="py-2.5 px-3 font-semibold">Current Task</th>
                <th className="py-2.5 px-3 font-semibold">Duty Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Readiness</th>
                <th className="py-2.5 px-3 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--rule)' }}>
              {filteredCrew.map((member) => {
                const isSelected = member.id === selectedCrewId;
                const statusStyle = getStatusStyles(member.status);
                const termStyle = getTerminalStateStyle(member.terminal.terminalState);
                const readiness = computeReadiness(member);
                return (
                  <tr
                    key={member.id}
                    onClick={() => onSelectCrew(member.id, 'overview')}
                    className="cursor-pointer transition-colors hover:bg-[var(--parchment)]"
                    style={{
                      backgroundColor: isSelected ? 'var(--parchment-deep)' : undefined,
                      borderColor: 'var(--rule)',
                    }}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.portrait}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded object-cover object-top border shrink-0"
                          style={{ borderColor: 'var(--brass)' }}
                        />
                        <div>
                          <div className="font-display font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                            {member.name}
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                            {member.role} · {member.vesselOrUnit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <div style={{ color: 'var(--ink)' }}>
                        {member.terminal.terminalId} · {member.terminal.terminalName}
                      </div>
                      <div style={{ color: termStyle.color }}>
                        {termStyle.label} ({member.terminal.agentRuntime})
                      </div>
                    </td>
                    <td className="py-2.5 px-3 max-w-[240px]">
                      <span className="line-clamp-1" style={{ color: 'var(--ink-2)' }}>
                        {member.currentTask}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 font-medium"
                        style={{ color: statusStyle.textColor }}
                      >
                        {renderStatusIcon(member.status)}
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-num font-semibold" style={{ color: 'var(--ink)' }}>
                      {readiness}%
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCrew(member.id, 'terminal');
                        }}
                        className="px-2.5 py-1 rounded border text-[11px] font-medium cursor-pointer"
                        style={{
                          borderColor: 'var(--brass)',
                          color: 'var(--brass-ink)',
                          backgroundColor: 'var(--parchment-raised)',
                        }}
                      >
                        Terminal
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
