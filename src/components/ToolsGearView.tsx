import React, { useMemo, useState } from 'react';
import { Wrench, Search } from 'lucide-react';
import { CrewMember, FleetTool } from '../types/fleet';

interface ToolsGearViewProps {
  crew: CrewMember[];
  onCycleToolStatus: (memberId: string, toolId: string) => void;
  onInspectOfficer: (id: string) => void;
}

export const ToolsGearView: React.FC<ToolsGearViewProps> = ({
  crew,
  onCycleToolStatus,
  onInspectOfficer,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | FleetTool['status']>('All');
  const [search, setSearch] = useState('');

  const allTools = useMemo(() => {
    return crew.flatMap((member) =>
      member.tools.map((tool) => ({
        tool,
        member,
      }))
    );
  }, [crew]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allTools.filter(({ tool, member }) => {
      if (statusFilter !== 'All' && tool.status !== statusFilter) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        member.name.toLowerCase().includes(q)
      );
    });
  }, [allTools, statusFilter, search]);

  const statusColor = (status: FleetTool['status']) => {
    if (status === 'Online') return 'var(--ready)';
    if (status === 'Calibrating') return 'var(--task)';
    return 'var(--danger)';
  };

  return (
    <section aria-labelledby="tools-gear-heading" className="space-y-5">
      <div
        className="p-5 rounded border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="tools-gear-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Tools & Gear Registry
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Shipboard instruments, gauges, ledgers, and checksum tools. Click any status control to update operational state.
          </p>
        </div>

        <div className="font-mono-num text-xs px-3 py-1.5 rounded border" style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--parchment)', color: 'var(--ink)' }}>
          {allTools.filter((i) => i.tool.status === 'Online').length}/{allTools.length} Instruments Online
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Online', 'Calibrating', 'Maintenance'] as const).map((st) => {
            const active = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className="px-3 py-1.5 rounded border text-xs font-medium cursor-pointer"
                style={{
                  backgroundColor: active ? 'var(--navy)' : 'var(--parchment-raised)',
                  color: active ? '#FAF5EA' : 'var(--ink-2)',
                  borderColor: active ? 'var(--brass)' : 'var(--rule)',
                }}
              >
                {st}
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-3)' }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instruments or officer..."
            className="w-full h-9 pl-8 pr-3 rounded border text-xs"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filtered.map(({ tool, member }) => (
          <div
            key={tool.id}
            className="p-4 rounded border flex flex-col justify-between gap-3"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
            }}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
                    {tool.category}
                  </span>
                  <h2 className="font-display text-base font-semibold mt-0.5" style={{ color: 'var(--ink)' }}>
                    {tool.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onCycleToolStatus(member.id, tool.id)}
                  className="px-2.5 py-1 rounded border text-[11px] font-semibold cursor-pointer shrink-0"
                  style={{
                    borderColor: statusColor(tool.status),
                    color: statusColor(tool.status),
                    backgroundColor: 'var(--parchment)',
                  }}
                >
                  {tool.status}
                </button>
              </div>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                {tool.description}
              </p>
            </div>

            <div className="pt-2.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--rule)' }}>
              <button
                type="button"
                onClick={() => onInspectOfficer(member.id)}
                className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:underline"
                style={{ color: 'var(--ink)' }}
              >
                <img
                  src={member.portrait}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded object-cover object-top"
                />
                <span>{member.name}</span>
              </button>
              <span className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
