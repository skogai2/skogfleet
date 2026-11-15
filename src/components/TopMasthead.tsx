import React from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { NavSection } from '../types/fleet';

interface TopMastheadProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  shipStatus: string;
  missionName: string;
  etaDays: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
}

const TOP_LINKS: Array<{ label: string; section: NavSection }> = [
  { label: 'Crew', section: 'crew-quarters' },
  { label: 'Journals', section: 'logs-journals' },
  { label: 'Tools', section: 'tools-gear' },
  { label: 'Prompts', section: 'prompts-library' },
  { label: 'Missions', section: 'mission-deck' },
];

export const TopMasthead: React.FC<TopMastheadProps> = ({
  activeSection,
  onNavigate,
  shipStatus,
  missionName,
  etaDays,
  darkMode,
  onToggleDarkMode,
  onOpenMobileMenu,
}) => {
  return (
    <header
      className="sticky top-0 z-30 border-b px-4 lg:px-6 h-16 flex items-center justify-between gap-6"
      style={{
        backgroundColor: 'var(--navy)',
        borderColor: 'var(--navy-border)',
        color: '#F4ECDA',
      }}
    >
      {/* Zone 1: Brand Title */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open fleet navigation"
          className="lg:hidden p-2 rounded border border-[var(--navy-border)] text-[#E6BE6C] hover:bg-[var(--navy-raised)] cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('crew-quarters')}
          className="flex items-center gap-3 text-left cursor-pointer group focus-visible:outline-2"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-[#D4AD5A] transition-transform duration-200 group-hover:rotate-12"
          >
            <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="1.75" />
            <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M18 3V15M18 21V33M3 18H15M21 18H33M7.4 7.4L15.9 15.9M20.1 20.1L28.6 28.6M28.6 7.4L20.1 15.9M15.9 20.1L7.4 28.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#FAF5EA] whitespace-nowrap">
            The Crew Quarters
          </span>
        </button>
      </div>

      {/* Zone 2: Clean Single-Line Nav Links */}
      <nav aria-label="Primary fleet sections" className="hidden md:flex items-center gap-6">
        {TOP_LINKS.map((link) => {
          const isActive = activeSection === link.section;
          return (
            <button
              key={link.section}
              type="button"
              onClick={() => onNavigate(link.section)}
              className={`text-xs uppercase tracking-[0.12em] font-medium py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                isActive
                  ? 'text-[#E6BE6C] border-[#D4AD5A]'
                  : 'text-[#C8C0AE] border-transparent hover:text-[#FAF5EA] hover:border-[#5D4C2B]'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Ship Status & Theme Switch */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded border text-xs"
          style={{
            backgroundColor: 'var(--navy-raised)',
            borderColor: 'var(--navy-border)',
          }}
        >
          <span className="text-[#78D8A6] font-medium whitespace-nowrap">
            {shipStatus}
          </span>
          <span className="text-[#586A84]" aria-hidden="true">·</span>
          <span className="text-[#EADEC4] whitespace-nowrap">{missionName}</span>
          <span className="text-[#586A84]" aria-hidden="true">·</span>
          <span className="font-mono-num text-[#E6BE6C] whitespace-nowrap">
            ETA {etaDays}d
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Switch to Daylight Chart Room' : 'Switch to Candlelit Cabin'}
          title={darkMode ? 'Switch to Daylight Chart Room' : 'Switch to Candlelit Cabin'}
          className="h-9 px-3 rounded border border-[var(--navy-border)] bg-[var(--navy-raised)] text-[#E6BE6C] hover:border-[#B58C3C] transition-colors flex items-center gap-2 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{darkMode ? 'Daylight' : 'Night Watch'}</span>
        </button>
      </div>
    </header>
  );
};
