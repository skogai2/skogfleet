import React from 'react';
import { SlidersHorizontal, Download, RotateCcw, Sun, Moon } from 'lucide-react';
import { FleetState } from '../types/fleet';

interface SettingsViewProps {
  fleetState: FleetState;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetState: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  fleetState,
  darkMode,
  onToggleDarkMode,
  onResetState,
}) => {
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
            Cabin Settings & Reference Sheets
          </h1>
        </div>
        <p className="mt-1 text-sm" style={{ color: 'var(--ink-2)' }}>
          Configure display watch mode, export known-good fleet snapshots, or inspect the original Admiralty roster sheets.
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
              onClick={onResetState}
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
