import React, { useMemo, useState } from 'react';
import { BarChart3, Download, ArrowUpDown } from 'lucide-react';
import { CrewMember, CrewTier } from '../types/fleet';
import { computeReadiness, exportCrewCsv, getStatusStyles } from '../utils/fleetHelpers';

interface ReportsViewProps {
  crew: CrewMember[];
  voyageDay: number;
  onInspectOfficer: (id: string) => void;
}

type SortKey = 'name' | 'tier' | 'readiness' | 'watchHours';

export const ReportsView: React.FC<ReportsViewProps> = ({
  crew,
  voyageDay,
  onInspectOfficer,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('readiness');
  const [sortAsc, setSortAsc] = useState(false);

  const avgReadiness = useMemo(() => {
    const sum = crew.reduce((acc, c) => acc + computeReadiness(c), 0);
    return Math.round(sum / (crew.length || 1));
  }, [crew]);

  const divisionStats = useMemo(() => {
    const tiers: CrewTier[] = ['Command', 'Operations', 'Support', 'Special'];
    return tiers.map((tier) => {
      const members = crew.filter((c) => c.tier === tier);
      const avg = Math.round(
        members.reduce((acc, m) => acc + computeReadiness(m), 0) / (members.length || 1)
      );
      const watch = members.reduce((acc, m) => acc + m.watchHours, 0);
      return { tier, count: members.length, avg, watch };
    });
  }, [crew]);

  // 7-day voyage readiness trajectory anchored to live avgReadiness
  const trendPoints = useMemo(() => {
    const offsets = [-7, -5, -6, -3, -2, -1, 0];
    return offsets.map((off, idx) => ({
      day: voyageDay - (6 - idx),
      value: Math.max(60, Math.min(100, avgReadiness + off)),
    }));
  }, [avgReadiness, voyageDay]);

  const sortedCrew = useMemo(() => {
    const copy = [...crew];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'tier') cmp = a.tier.localeCompare(b.tier);
      else if (sortKey === 'watchHours') cmp = a.watchHours - b.watchHours;
      else cmp = computeReadiness(a) - computeReadiness(b);
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [crew, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(key === 'name' || key === 'tier');
    }
  };

  // Build SVG path for 7-day trend
  const chartW = 540;
  const chartH = 180;
  const padX = 36;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const coords = trendPoints.map((pt, i) => {
    const x = padX + (i / (trendPoints.length - 1)) * plotW;
    const y = padY + ((100 - pt.value) / 40) * plotH;
    return { ...pt, x, y };
  });

  const linePath = coords
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padY + plotH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padY + plotH).toFixed(1)} Z`;

  return (
    <section aria-labelledby="reports-heading" className="space-y-5">
      <div
        className="p-5 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="reports-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Fleet Readiness Reports
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Live squadron readiness metrics, division watch hours, and exportable officer ledger.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportCrewCsv(crew)}
          className="h-9 px-4 rounded text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-center cursor-pointer"
          style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Two Responsive SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Division Readiness */}
        <div
          className="p-4 rounded border"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                Readiness by Division
              </h2>
              <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
                Mean readiness across all {crew.length} crew: <span className="font-mono-num font-semibold" style={{ color: 'var(--ink)' }}>{avgReadiness}%</span>
              </p>
            </div>
          </div>

          <div className="space-y-3.5 mt-4">
            {divisionStats.map((d) => (
              <div key={d.tier} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    {d.tier} <span style={{ color: 'var(--ink-3)' }}>({d.count} crew · {d.watch}h watch)</span>
                  </span>
                  <span className="font-mono-num font-semibold" style={{ color: 'var(--ink)' }}>
                    {d.avg}%
                  </span>
                </div>
                <div
                  className="h-3 w-full rounded overflow-hidden border"
                  style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${d.avg}%`,
                      backgroundColor: d.avg >= 90 ? 'var(--ready)' : 'var(--brass)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: 7-Day Readiness Trend SVG */}
        <div
          className="p-4 rounded border"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                7-Day Fleet Readiness Trajectory
              </h2>
              <p className="text-xs" style={{ color: 'var(--ink-3)' }}>
                Days {voyageDay - 6}–{voyageDay} composite squadron index
              </p>
            </div>
            <span className="font-mono-num text-sm font-semibold" style={{ color: 'var(--ready)' }}>
              {avgReadiness}% Now
            </span>
          </div>

          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-44 overflow-visible"
            role="img"
            aria-label="7-day fleet readiness trend chart"
          >
            {[60, 75, 90, 100].map((tick) => {
              const y = padY + ((100 - tick) / 40) * plotH;
              return (
                <g key={tick}>
                  <line
                    x1={padX}
                    x2={chartW - padX}
                    y1={y}
                    y2={y}
                    stroke="var(--rule)"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padX - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--ink-3)"
                    className="font-mono-num"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            <path d={areaPath} fill="var(--brass)" fillOpacity="0.16" />
            <path d={linePath} fill="none" stroke="var(--brass-ink)" strokeWidth="2.5" />

            {coords.map((pt) => (
              <g key={pt.day}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="var(--parchment-raised)" stroke="var(--brass-ink)" strokeWidth="2" />
                <text
                  x={pt.x}
                  y={chartH - 2}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--ink-3)"
                  className="font-mono-num"
                >
                  D{pt.day}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Sortable Officer Readiness Matrix Table */}
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
              <th className="py-2.5 px-3">
                <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1 font-semibold cursor-pointer">
                  Officer <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3">
                <button type="button" onClick={() => toggleSort('tier')} className="inline-flex items-center gap-1 font-semibold cursor-pointer">
                  Division <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 text-right">
                <button type="button" onClick={() => toggleSort('watchHours')} className="inline-flex items-center gap-1 font-semibold cursor-pointer">
                  Watch Hours <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-right font-semibold">Tools</th>
              <th className="py-2.5 px-3 text-right">
                <button type="button" onClick={() => toggleSort('readiness')} className="inline-flex items-center gap-1 font-semibold cursor-pointer">
                  Readiness <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--rule)' }}>
            {sortedCrew.map((member) => {
              const readiness = computeReadiness(member);
              const statusStyle = getStatusStyles(member.status);
              const onlineTools = member.tools.filter((t) => t.status === 'Online').length;
              return (
                <tr
                  key={member.id}
                  onClick={() => onInspectOfficer(member.id)}
                  className="cursor-pointer hover:bg-[var(--parchment)] transition-colors"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <td className="py-2.5 px-3">
                    <div className="font-semibold" style={{ color: 'var(--ink)' }}>{member.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>{member.role}</div>
                  </td>
                  <td className="py-2.5 px-3" style={{ color: 'var(--ink-2)' }}>{member.tier}</td>
                  <td className="py-2.5 px-3 font-medium" style={{ color: statusStyle.textColor }}>
                    {statusStyle.label}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-num" style={{ color: 'var(--ink)' }}>
                    {member.watchHours}h
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-num" style={{ color: 'var(--ink-2)' }}>
                    {onlineTools}/{member.tools.length}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-num font-semibold" style={{ color: readiness >= 85 ? 'var(--ready)' : 'var(--task)' }}>
                    {readiness}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
