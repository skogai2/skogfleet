import React from 'react';
import {
  Users,
  Compass,
  BookOpen,
  Wrench,
  ScrollText,
  BarChart3,
  Cog,
  Map as MapIcon,
  SlidersHorizontal,
  Anchor,
  X,
} from 'lucide-react';
import { NavSection } from '../types/fleet';

interface SidebarNavProps {
  activeSection: NavSection;
  onSelect: (section: NavSection) => void;
  crewCount: number;
  journalCount: number;
  openObjectives: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'crew-quarters', label: 'Crew Quarters', icon: Users },
  { id: 'mission-deck', label: 'Mission Deck', icon: Compass },
  { id: 'logs-journals', label: 'Logs & Journals', icon: BookOpen },
  { id: 'tools-gear', label: 'Tools & Gear', icon: Wrench },
  { id: 'prompts-library', label: 'Prompts Library', icon: ScrollText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'ship-systems', label: 'Ship Systems', icon: Cog },
  { id: 'map-charts', label: 'Map & Charts', icon: MapIcon },
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeSection,
  onSelect,
  crewCount,
  journalCount,
  openObjectives,
  mobileOpen,
  onCloseMobile,
}) => {
  const getCount = (id: NavSection): number | null => {
    if (id === 'crew-quarters') return crewCount;
    if (id === 'logs-journals') return journalCount;
    if (id === 'mission-deck') return openObjectives;
    return null;
  };

  const navContent = (
    <div
      className="flex flex-col justify-between h-full py-5 px-3 select-none"
      style={{
        backgroundColor: 'var(--navy)',
        color: '#E6DEC9',
      }}
    >
      <div>
        <div className="flex items-center justify-between px-3 pb-4 mb-3 border-b border-[var(--navy-border)]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#B59C6B] font-semibold">
              The Nelson Fleet
            </p>
            <p className="text-xs text-[#9AA8BE] mt-0.5">HMS Vanguard Squadron</p>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded text-[#C8C0AE] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav aria-label="Shipboard compartments" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            const count = getCount(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded text-left text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[var(--navy-raised)] text-[#FAF5EA] border border-[#9A7837]'
                    : 'text-[#C2C9D6] hover:bg-[var(--navy-raised)]/60 hover:text-[#FAF5EA] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-[#E6BE6C]' : 'text-[#8FA0B8]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {count !== null && (
                  <span
                    className={`font-mono-num text-[11px] shrink-0 ${
                      active ? 'text-[#E6BE6C]' : 'text-[#7F91AB]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subtle Admiralty Anchor Crest Footer */}
      <div className="pt-4 mt-6 border-t border-[var(--navy-border)] px-3">
        <div className="flex items-center gap-2.5 text-[#9AA8BE]">
          <Anchor className="w-4 h-4 text-[#B58C3C] shrink-0" />
          <div className="text-[11px] leading-snug">
            <span className="block text-[#D8CEB8] font-medium">North Reach Survey</span>
            <span className="text-[#8898B0]">Day 214 · Fair Winds</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block w-[228px] shrink-0 border-r"
        style={{
          backgroundColor: 'var(--navy)',
          borderColor: 'var(--navy-border)',
        }}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {navContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-64 max-w-[80vw] h-full border-r border-[var(--navy-border)]">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
