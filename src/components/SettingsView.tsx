import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Download,
  RotateCcw,
  Sun,
  Moon,
  Upload,
  Copy,
  Check,
  Terminal,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { FleetState } from '../types/fleet';

interface SettingsViewProps {
  fleetState: FleetState;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onImportFleetJson: (nextState: FleetState) => void;
  onResetState: () => void;
}

const HC_CLI_REFERENCE = [
  {
    cmd: 'hc run --bg --name <name> --cwd <dir> <template|runtime> "<task>"',
    desc: 'Start an interactive background agent terminal with its first task included.',
  },
  {
    cmd: 'hc ls',
    desc: 'List all live terminals and current observed working states.',
  },
  {
    cmd: 'hc get <t>',
    desc: 'Inspect full observed state, foreground.cwd, and first_message.sent.',
  },
  {
    cmd: 'hc send [--wait] <t> "<message>"',
    desc: 'Steer an active terminal or send a follow-up turn; optionally wait until idle.',
  },
  {
    cmd: 'hc read --lines 100 <t>',
    desc: 'Read screen plus scrollback history without attaching interactively.',
  },
  {
    cmd: 'hc interrupt <t>',
    desc: 'Stop the current turn safely without killing the underlying session.',
  },
  {
    cmd: 'hc wait --children all|any',
    desc: 'Block Captain terminal until delegated squadron children complete or surface blockers.',
  },
  {
    cmd: 'hc templates',
    desc: 'List role templates from ~/.config/herdr-core/templates/<name>.md.',
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  fleetState,
  darkMode,
  onToggleDarkMode,
  onImportFleetJson,
  onResetState,
}) => {
  const [jsonDraft, setJsonDraft] = useState<string>(() => JSON.stringify(fleetState, null, 2));
  const [copiedJson, setCopiedJson] = useState(false);
  const [importStatus, setImportStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(fleetState, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nelson-fleet-day-${fleetState.voyageDay}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCurrentJson = async () => {
    const formatted = JSON.stringify(fleetState, null, 2);
    setJsonDraft(formatted);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft) as FleetState;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        !Array.isArray(parsed.crew) ||
        parsed.crew.length === 0 ||
        !parsed.crew.every((c) => c.terminal && Array.isArray(c.hookEvents))
      ) {
        setImportStatus({
          ok: false,
          msg: 'JSON must be a valid FleetState containing crew[] with terminal bindings and hookEvents[].',
        });
        return;
      }
      onImportFleetJson(parsed);
      setImportStatus({
        ok: true,
        msg: `Imported FleetState (${parsed.crew.length} crew terminals, Day ${parsed.voyageDay}).`,
      });
    } catch (err) {
      setImportStatus({
        ok: false,
        msg: err instanceof Error ? err.message : 'Failed to parse JSON.',
      });
    }
  };

  return (
    <section aria-labelledby="settings-heading" className="space-y-5">
      <div
        className="p-5 rounded border"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5" style={{ color: 'var(--brass-ink)' }} />
          <h1
            id="settings-heading"
            className="font-display text-2xl sm:text-3xl font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            Cabin Settings, JSON Schema & Reference Sheets
          </h1>
        </div>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
          Configure display watch mode, edit or import live <code className="font-mono-num text-xs">FleetState</code> JSON snapshots, review <code className="font-mono-num text-xs">hc</code> commands, or inspect Admiralty charters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Display Watch Mode */}
        <div
          className="p-4 rounded border flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div>
            <h2 className="font-display text-base font-semibold" style={{ color: 'var(--ink)' }}>
              Chart Room Illumination
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
              Switch between Daylight Parchment and Candlelit Night Watch.
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="px-3.5 py-2 rounded border text-xs font-semibold inline-flex items-center gap-2 shrink-0 cursor-pointer"
            style={{
              backgroundColor: 'var(--navy)',
              borderColor: 'var(--brass)',
              color: '#E6BE6C',
            }}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Daylight Parchment' : 'Night Watch'}</span>
          </button>
        </div>

        {/* Known-Good Snapshot Controls */}
        <div
          className="p-4 rounded border flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div>
            <h2 className="font-display text-base font-semibold" style={{ color: 'var(--ink)' }}>
              Larder Snapshot & Reset
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
              Download full JSON snapshot or restore default Day 214 fleet roster.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-2 rounded border text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--rule)',
                color: 'var(--ink)',
              }}
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              type="button"
              onClick={() => {
                onResetState();
                setImportStatus({ ok: true, msg: 'Restored default Day 214 FleetState.' });
              }}
              className="px-3 py-2 rounded border text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: 'var(--parchment)',
                borderColor: 'var(--danger)',
                color: 'var(--danger)',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Live Fleet JSON Schema & State Importer + hc CLI Quick Reference */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div
          className="xl:col-span-7 p-4 rounded border space-y-3"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold" style={{ color: 'var(--ink)' }}>
                Live Fleet JSON State Editor & Importer
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>
                1-to-1 serialized <code className="font-mono-num">FleetState</code> schema backing terminals, hooks, journals, and objectives.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJsonDraft(JSON.stringify(fleetState, null, 2))}
                className="px-2.5 py-1.5 rounded border text-xs font-medium cursor-pointer"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                Load Current
              </button>
              <button
                type="button"
                onClick={handleCopyCurrentJson}
                className="px-2.5 py-1.5 rounded border text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                style={{
                  backgroundColor: 'var(--parchment)',
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                }}
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={10}
            value={jsonDraft}
            onChange={(e) => setJsonDraft(e.target.value)}
            spellCheck={false}
            aria-label="FleetState JSON payload"
            className="w-full p-3 rounded border font-mono-num text-[11px] leading-relaxed"
            style={{
              backgroundColor: 'var(--parchment)',
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {importStatus ? (
              <div
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: importStatus.ok ? 'var(--ready)' : 'var(--danger)' }}
              >
                {importStatus.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{importStatus.msg}</span>
              </div>
            ) : (
              <span className="text-[11px]" style={{ color: 'var(--ink-3)' }}>
                Edit or paste a complete JSON snapshot to hydrate all 18 terminals immediately.
              </span>
            )}

            <button
              type="button"
              onClick={handleImportJson}
              className="px-4 py-2 rounded text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: 'var(--navy)', color: '#FAF5EA' }}
            >
              <Upload className="w-3.5 h-3.5" /> Apply Fleet JSON
            </button>
          </div>
        </div>

        {/* hc CLI Quick Reference */}
        <div
          className="xl:col-span-5 p-4 rounded border space-y-3"
          style={{
            backgroundColor: 'var(--parchment-raised)',
            borderColor: 'var(--rule)',
          }}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" style={{ color: 'var(--brass-ink)' }} />
            <h2 className="font-display text-base font-semibold" style={{ color: 'var(--ink)' }}>
              hc (herdr-core) CLI Reference
            </h2>
          </div>
          <div className="space-y-2">
            {HC_CLI_REFERENCE.map((item) => (
              <div
                key={item.cmd}
                className="p-2.5 rounded border"
                style={{ backgroundColor: 'var(--parchment)', borderColor: 'var(--rule)' }}
              >
                <code className="block font-mono-num text-[11px] font-semibold" style={{ color: 'var(--brass-ink)' }}>
                  {item.cmd}
                </code>
                <p className="text-[11px] mt-1" style={{ color: 'var(--ink-2)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Original Fleet Tier Reference Plates */}
      <div
        className="p-5 rounded border space-y-4"
        style={{
          backgroundColor: 'var(--parchment-raised)',
          borderColor: 'var(--rule)',
        }}
      >
        <div>
          <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
            Admiralty Fleet Plates
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-3)' }}>
            Original illustrated charters for Command Tier, Crew Roles, and Marines & Auxiliaries.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Command Tier',
              src: './assets/aistudio/image-gen-1_aaa4a1fb.png',
              alt: 'The Nelson Fleet Command Tier Charter',
            },
            {
              title: 'Crew Roles',
              src: './assets/aistudio/image-gen-2_cdbdcf4e.png',
              alt: 'The Nelson Fleet Crew Roles Charter',
            },
            {
              title: 'Marines & Auxiliaries',
              src: './assets/aistudio/image-gen-3_21ac0ab1.png',
              alt: 'The Nelson Fleet Marines and Auxiliaries Charter',
            },
          ].map((plate) => (
            <figure
              key={plate.title}
              className="rounded border overflow-hidden"
              style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--parchment)' }}
            >
              <img
                src={plate.src}
                alt={plate.alt}
                referrerPolicy="no-referrer"
                className="w-full h-auto block"
              />
              <figcaption className="px-3 py-2 text-xs font-semibold text-center" style={{ color: 'var(--ink)' }}>
                {plate.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
