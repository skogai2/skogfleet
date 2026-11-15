import React, { useState } from 'react';
import { Map as MapIcon, Compass, Pencil } from 'lucide-react';
import { ChartWaypoint, CrewMember } from '../types/fleet';

interface MapChartsViewProps {
  waypoints: ChartWaypoint[];
  crew: CrewMember[];
  onUpdatePencilNote: (waypointId: string, note: string) => void;
  onInspectOfficer: (id: string) => void;
}

export const MapChartsView: React.FC<MapChartsViewProps> = ({
  waypoints,
  crew,
  onUpdatePencilNote,
  onInspectOfficer,
}) => {
  const [selectedId, setSelectedId] = useState<string>(waypoints[1]?.id || waypoints[0]?.id);
  const [showHazards, setShowHazards] = useState(true);
  const [showSubsurface, setShowSubsurface] = useState(true);
  const [showPencil, setShowPencil] = useState(true);
  const [noteDraft, setNoteDraft] = useState('');
  const [editingNote, setEditingNote] = useState(false);

  const selected = waypoints.find((w) => w.id === selectedId) || waypoints[0];
  const officer = crew.find((c) => c.id === selected?.officerId);

  const routePoints = waypoints.map((w) => `${w.x},${w.y}`).join(' ');

  return (
    <section aria-labelledby="map-charts-heading" className="space-y-5">
      <div
        className="p-5 rounded border flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <MapIcon className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="map-charts-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              North Reach Hydrographic Chart
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Select any sounding waypoint to inspect hazards or revise Sophie Marlowe’s pencil annotations.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'Shoals & Reefs', active: showHazards, toggle: () => setShowHazards((v) => !v) },
            { label: 'Subsurface Trench', active: showSubsurface, toggle: () => setShowSubsurface((v) => !v) },
            { label: 'Pencil Notes', active: showPencil, toggle: () => setShowPencil((v) => !v) },
          ].map((layer) => (
            <button
              key={layer.label}
              type="button"
              onClick={layer.toggle}
              aria-pressed={layer.active}
              className="px-3 py-1.5 rounded border text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: layer.active ? 'var(--navy)' : 'var(--parchment)',
                color: layer.active ? '#FAF5EA' : 'var(--ink-2)',
                borderColor: layer.active ? 'var(--brass)' : 'var(--rule)',
              }}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Interactive SVG Nautical Chart */}
        <div
          className="xl:col-span-8 rounded border overflow-hidden"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--brass)',
          }}
        >
          <svg
            viewBox="0 0 860 460"
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Interactive Nautical Chart of the North Reach"
          >
            {/* Sea Wash & Rhumb Grid */}
            <rect width="860" height="460" fill="var(--parchment)" />
            {[100, 200, 300, 400].map((y) => (
              <line key={`lat-${y}`} x1="0" x2="860" y1={y} y2={y} stroke="var(--rule)" strokeWidth="0.8" />
            ))}
            {[150, 300, 450, 600, 750].map((x) => (
              <line key={`lon-${x}`} y1="0" y2="460" x1={x} x2={x} stroke="var(--rule)" strokeWidth="0.8" />
            ))}

            {/* Compass Rose (Top Left) */}
            <g transform="translate(76, 76)" opacity="0.55">
              <circle cx="0" cy="0" r="34" fill="none" stroke="var(--brass-ink)" strokeWidth="1" />
              <circle cx="0" cy="0" r="24" fill="none" stroke="var(--brass-ink)" strokeWidth="0.6" />
              <path d="M0 -38 L5 -6 L38 0 L5 6 L0 38 L-5 6 L-38 0 L-5 -6 Z" fill="var(--brass-ink)" fillOpacity="0.25" stroke="var(--brass-ink)" strokeWidth="0.9" />
              <text x="0" y="-42" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--ink)">N</text>
            </g>

            {/* Headland Coastline (North-West & East) */}
            <path
              d="M0 0 L410 0 C395 48 355 72 300 94 C248 114 215 160 155 180 C95 198 48 232 0 250 Z"
              fill="var(--parchment-deep)"
              stroke="var(--ink-3)"
              strokeWidth="1.5"
            />
            <path
              d="M860 0 L860 220 C800 205 765 170 725 140 C690 112 670 65 655 0 Z"
              fill="var(--parchment-deep)"
              stroke="var(--ink-3)"
              strokeWidth="1.5"
            />
            <text x="84" y="164" fontSize="12" className="font-display" fill="var(--ink-2)">
              North Reach Cliffs
            </text>
            <text x="735" y="70" fontSize="12" className="font-display" fill="var(--ink-2)">
              East Headland
            </text>

            {/* Blacklight Reef Hazard Zone */}
            {showHazards && (
              <g>
                <ellipse
                  cx="355"
                  cy="285"
                  rx="64"
                  ry="34"
                  fill="var(--task)"
                  fillOpacity="0.16"
                  stroke="var(--task)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text x="355" y="332" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--task)">
                  Blacklight Reef (6 fm)
                </text>
              </g>
            )}

            {/* Subsurface Thermal Trench */}
            {showSubsurface && (
              <g>
                <ellipse
                  cx="560"
                  cy="345"
                  rx="82"
                  ry="42"
                  fill="var(--navy)"
                  fillOpacity="0.1"
                  stroke="var(--navy)"
                  strokeWidth="1.2"
                  strokeDasharray="6 4"
                />
                <text x="560" y="402" textAnchor="middle" fontSize="11" fill="var(--ink-2)">
                  Thermal Counter-Current (42 fm)
                </text>
              </g>
            )}

            {/* Planned Passage Line */}
            <polyline
              points={routePoints}
              fill="none"
              stroke="var(--brass-ink)"
              strokeWidth="2.2"
              strokeDasharray="7 5"
            />

            {/* Waypoint Pins */}
            {waypoints.map((wp) => {
              const isSelected = wp.id === selected?.id;
              return (
                <g
                  key={wp.id}
                  transform={`translate(${wp.x}, ${wp.y})`}
                  onClick={() => {
                    setSelectedId(wp.id);
                    setEditingNote(false);
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected ? 15 : 11}
                    fill={isSelected ? 'var(--navy)' : 'var(--parchment-raised)'}
                    stroke="var(--brass)"
                    strokeWidth={isSelected ? 2.5 : 1.75}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fontSize="10"
                    fontWeight="700"
                    className="font-mono-num"
                    fill={isSelected ? '#E6BE6C' : 'var(--ink)'}
                  >
                    {wp.code.replace('WP-', '')}
                  </text>
                  <text
                    y="-18"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="var(--ink)"
                  >
                    {wp.name}
                  </text>
                  {showPencil && (
                    <text
                      y="26"
                      textAnchor="middle"
                      fontSize="10"
                      fontStyle="italic"
                      fill="var(--ink-3)"
                    >
                      {wp.depthFathoms} fm
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Waypoint Detail & Pencil Notes */}
        {selected && (
          <div
            className="xl:col-span-4 p-4 rounded border space-y-4"
            style={{
              backgroundColor: 'var(--parchment-raised)',
              borderColor: 'var(--rule)',
            }}
          >
            <div className="flex items-start justify-between gap-2 pb-3 border-b" style={{ borderColor: 'var(--rule)' }}>
              <div>
                <span className="font-mono-num text-xs font-semibold" style={{ color: 'var(--brass-ink)' }}>
                  {selected.code} · {selected.depthFathoms} Fathoms
                </span>
                <h2 className="font-display text-xl font-semibold mt-0.5" style={{ color: 'var(--ink)' }}>
                  {selected.name}
                </h2>
              </div>
              <Compass className="w-5 h-5 shrink-0" style={{ color: 'var(--brass-ink)' }} />
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-3)' }}>
                Observed Hazard
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--ink)' }}>
                {selected.hazard}
              </p>
            </div>

            <div
              className="p-3 rounded border space-y-2"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--brass-ink)' }}>
                  <Pencil className="w-3 h-3" /> Graphite Pencil Note
                </span>
                {!editingNote && (
                  <button
                    type="button"
                    onClick={() => {
                      setNoteDraft(selected.pencilNote);
                      setEditingNote(true);
                    }}
                    className="text-[11px] underline cursor-pointer"
                    style={{ color: 'var(--brass-ink)' }}
                  >
                    Revise Note
                  </button>
                )}
              </div>

              {editingNote ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdatePencilNote(selected.id, noteDraft.trim() || selected.pencilNote);
                    setEditingNote(false);
                  }}
                  className="space-y-2"
                >
                  <textarea
                    rows={3}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    className="w-full p-2 rounded border text-xs"
                    style={{
                      backgroundColor: 'var(--parchment-raised)',
                      borderColor: 'var(--brass)',
                      color: 'var(--ink)',
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-3 py-1 rounded text-xs font-medium cursor-pointer"
                      style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
                    >
                      Save Pencil Note
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNote(false)}
                      className="px-3 py-1 rounded border text-xs cursor-pointer"
                      style={{ borderColor: 'var(--rule)', color: 'var(--ink-2)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="font-display italic text-sm" style={{ color: 'var(--ink)' }}>
                  “{selected.pencilNote}”
                </p>
              )}
            </div>

            {officer && (
              <button
                type="button"
                onClick={() => onInspectOfficer(officer.id)}
                className="w-full p-2.5 rounded border flex items-center justify-between gap-2 cursor-pointer hover:border-[var(--brass)]"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={officer.portrait}
                    alt={officer.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded object-cover object-top"
                  />
                  <div className="text-left">
                    <div className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>
                      {officer.name}
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                      Reporting Officer · {officer.role}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--brass-ink)' }}>
                  Inspect →
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
