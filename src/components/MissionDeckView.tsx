import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, Plus, Calendar } from 'lucide-react';
import { CrewMember, MissionObjective } from '../types/fleet';

interface MissionDeckViewProps {
  missionName: string;
  shipStatus: 'Operational' | 'High Alert' | 'Anchored';
  voyageDay: number;
  etaDays: number;
  crew: CrewMember[];
  objectives: MissionObjective[];
  onToggleObjective: (id: string) => void;
  onAddObjective: (title: string, sector: string, assigneeId: string, priority: MissionObjective['priority']) => void;
  onUpdateShipStatus: (status: 'Operational' | 'High Alert' | 'Anchored') => void;
  onAdvanceDay: () => void;
  onInspectOfficer: (id: string) => void;
}

export const MissionDeckView: React.FC<MissionDeckViewProps> = ({
  missionName,
  shipStatus,
  voyageDay,
  etaDays,
  crew,
  objectives,
  onToggleObjective,
  onAddObjective,
  onUpdateShipStatus,
  onAdvanceDay,
  onInspectOfficer,
}) => {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('Sector B · North Reach');
  const [assigneeId, setAssigneeId] = useState('sophie-marlowe');
  const [priority, setPriority] = useState<MissionObjective['priority']>('High');

  const completedCount = objectives.filter((o) => o.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddObjective(title.trim(), sector.trim() || 'North Reach', assigneeId, priority);
    setTitle('');
  };

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
            Active squadron objectives, command accountability, and passage schedule across the North Reach.
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
            Officer
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
                {c.name}
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

                {officer && (
                  <button
                    type="button"
                    onClick={() => onInspectOfficer(officer.id)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded border text-xs font-medium self-start sm:self-center cursor-pointer hover:border-[var(--brass)]"
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
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
