import React, { useMemo, useState } from 'react';
import { Cog, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CrewMember, ShipSystem } from '../types/fleet';

interface ShipSystemsViewProps {
  systems: ShipSystem[];
  crew: CrewMember[];
  onCycleSystemStatus: (id: string) => void;
  onLogFaultNote: (id: string, note: string) => void;
  onInspectOfficer: (id: string) => void;
}

export const ShipSystemsView: React.FC<ShipSystemsViewProps> = ({
  systems,
  crew,
  onCycleSystemStatus,
  onLogFaultNote,
  onInspectOfficer,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [faultDraft, setFaultDraft] = useState('');

  // Kronsch 4-Book Checksum interactive tester
  const [sampleText, setSampleText] = useState(
    'Dispatch to Sophie Marlowe: Check ./charts/north-reach-day214.txt and verify Blacklight Reef soundings before the fair tide turns.'
  );

  const kronschChecks = useMemo(() => {
    const trimmed = sampleText.trim();
    const hasPath = /(\/|\.\/|\bSector\b|\bReach\b|\bChannel\b|\bDeck\b)/i.test(trimmed);
    const hasFileOrArtifact = /(\.\w{2,4}\b|\bledger\b|\bchart\b|\bmanifest\b|\blog\b|\bsounding\b)/i.test(trimmed);
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    const isEloquent = wordCount >= 8 && !/[A-Z]{4,}_[A-Z]{2,}/.test(trimmed);
    const isPlaintext = !/[<>{}]|\/\/\s*\d+/.test(trimmed) && wordCount > 0;
    const allPass = hasPath && hasFileOrArtifact && isEloquent && isPlaintext;
    return { hasPath, hasFileOrArtifact, isEloquent, isPlaintext, allPass };
  }, [sampleText]);

  return (
    <section aria-labelledby="ship-systems-heading" className="space-y-5">
      <div
        className="p-5 rounded border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <Cog className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
            <h1
              id="ship-systems-heading"
              className="font-display text-2xl sm:text-3xl font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Ship Systems & Checksums
            </h1>
          </div>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
            Engineering, ordnance, purser snapshots, and Kronsch’s 4-book cultural checksum console.
          </p>
        </div>
      </div>

      {/* Subsystems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((sys) => {
          const custodian = crew.find((c) => c.id === sys.custodianId);
          const statusColor =
            sys.status === 'Nominal'
              ? 'var(--ready)'
              : sys.status === 'Attention'
              ? 'var(--task)'
              : 'var(--danger)';

          return (
            <article
              key={sys.id}
              className="p-4 rounded border space-y-3"
              style={{
                backgroundColor: 'var(--parchment-raised)',
                borderColor: 'var(--rule)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                    {sys.name}
                  </h2>
                  <p className="font-mono-num text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>
                    Integrity {sys.integrity}% · Checked Day {sys.lastCheckedDay}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCycleSystemStatus(sys.id)}
                  className="px-2.5 py-1 rounded border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  style={{
                    borderColor: statusColor,
                    color: statusColor,
                    backgroundColor: 'var(--parchment)',
                  }}
                >
                  {sys.status === 'Nominal' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  <span>{sys.status}</span>
                </button>
              </div>

              <div
                className="h-2 w-full rounded overflow-hidden border"
                style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${sys.integrity}%`, backgroundColor: statusColor }}
                />
              </div>

              {editingId === sys.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (faultDraft.trim()) onLogFaultNote(sys.id, faultDraft.trim());
                    setEditingId(null);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={faultDraft}
                    onChange={(e) => setFaultDraft(e.target.value)}
                    placeholder="Specify exact fault or inspection note..."
                    className="flex-1 h-8 px-2.5 rounded border text-xs"
                    style={{
                      backgroundColor: 'var(--parchment)',
                      borderColor: 'var(--brass)',
                      color: 'var(--ink)',
                    }}
                  />
                  <button
                    type="submit"
                    className="px-3 h-8 rounded text-xs font-medium cursor-pointer"
                    style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-2 text-xs">
                  <p style={{ color: 'var(--ink-2)' }}>{sys.lastFaultNote}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(sys.id);
                      setFaultDraft(sys.lastFaultNote);
                    }}
                    className="text-[11px] font-medium underline shrink-0 cursor-pointer"
                    style={{ color: 'var(--brass-ink)' }}
                  >
                    Log Fault
                  </button>
                </div>
              )}

              {custodian && (
                <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--rule)' }}>
                  <button
                    type="button"
                    onClick={() => onInspectOfficer(custodian.id)}
                    className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:underline"
                    style={{ color: 'var(--ink)' }}
                  >
                    <img
                      src={custodian.portrait}
                      alt={custodian.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded object-cover object-top"
                    />
                    <span>Custodian: {custodian.name}</span>
                  </button>
                  <span className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                    {custodian.role}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Kronsch 4-Book Checksum Console */}
      <div
        className="p-5 rounded border space-y-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--brass)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="./assets/crew/kronsch.png"
              alt="Kronsch Watchdog Unit"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded object-cover object-top border shrink-0"
              style={{ borderColor: 'var(--brass)' }}
            />
            <div>
              <h2 className="font-display text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: 'var(--brass-ink)' }} />
                Kronsch Cultural Checksum Validator
              </h2>
              <p className="text-xs" style={{ color: 'var(--ink-2)' }}>
                Validates paths, files, Shakespearean eloquence, and plain text. If he understands your dispatch, he KRONSCHes along.
              </p>
            </div>
          </div>

          <div
            className="px-3 py-1.5 rounded border text-xs font-semibold shrink-0"
            style={{
              borderColor: kronschChecks.allPass ? 'var(--ready)' : 'var(--task)',
              color: kronschChecks.allPass ? 'var(--ready)' : 'var(--task)',
              backgroundColor: 'var(--parchment)',
            }}
          >
            {kronschChecks.allPass ? 'KRONSCH Approved' : 'Needs Clarity'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-7">
            <label htmlFor="kronsch-input" className="block text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-3)' }}>
              Test Dispatch or Introduction
            </label>
            <textarea
              id="kronsch-input"
              rows={3}
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              className="w-full p-3 rounded border text-xs font-mono leading-relaxed"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
                color: 'var(--ink)',
              }}
            />
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-2">
            {[
              { label: 'PATHS', desc: 'Concrete location or path', ok: kronschChecks.hasPath },
              { label: 'FILES', desc: 'Named artifact or ledger', ok: kronschChecks.hasFileOrArtifact },
              { label: 'SHAKESPEARE', desc: 'Clear cadence, no jargon', ok: kronschChecks.isEloquent },
              { label: 'PLAINTEXT', desc: 'Clean readable prose', ok: kronschChecks.isPlaintext },
            ].map((book) => (
              <div
                key={book.label}
                className="p-2.5 rounded border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: book.ok ? 'var(--ready)' : 'var(--rule)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-num text-xs font-bold" style={{ color: 'var(--ink)' }}>
                    {book.label}
                  </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: book.ok ? 'var(--ready)' : 'var(--task)' }}
                  >
                    {book.ok ? 'Pass' : 'Check'}
                  </span>
                </div>
                <span className="text-[11px] mt-1" style={{ color: 'var(--ink-3)' }}>
                  {book.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
