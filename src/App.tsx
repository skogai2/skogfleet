import React, { useEffect, useMemo, useState } from 'react';
import { INITIAL_FLEET_STATE } from './data/nelsonFleetData';
import {
  CrewStatus,
  FleetState,
  FleetTool,
  HookToolName,
  InspectorTab,
  MissionObjective,
  NavSection,
  TerminalBinding,
} from './types/fleet';
import { parseExternalHcJson } from './utils/hcCommands';
import { TopMasthead } from './components/TopMasthead';
import { SidebarNav } from './components/SidebarNav';
import { CrewQuartersView } from './components/CrewQuartersView';
import { OfficerInspector } from './components/OfficerInspector';
import { MissionDeckView } from './components/MissionDeckView';
import { LogsJournalsView } from './components/LogsJournalsView';
import { ToolsGearView } from './components/ToolsGearView';
import { PromptsLibraryView } from './components/PromptsLibraryView';
import { ReportsView } from './components/ReportsView';
import { ShipSystemsView } from './components/ShipSystemsView';
import { MapChartsView } from './components/MapChartsView';
import { SettingsView } from './components/SettingsView';

const STORAGE_KEY = 'nelson.fleet.state.v2';
const THEME_KEY = 'nelson.fleet.dark.v1';

function isValidFleetState(candidate: unknown): candidate is FleetState {
  if (!candidate || typeof candidate !== 'object') return false;
  const parsed = candidate as FleetState;
  return (
    typeof parsed.captainTerminalId === 'string' &&
    typeof parsed.workspaceCwd === 'string' &&
    Array.isArray(parsed.crew) &&
    parsed.crew.length === INITIAL_FLEET_STATE.crew.length &&
    parsed.crew.every(
      (c) =>
        Boolean(c.terminal) &&
        typeof c.terminal.terminalId === 'string' &&
        Array.isArray(c.hookEvents) &&
        typeof c.rankTitle === 'string'
    )
  );
}

function loadInitialFleetState(): FleetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidFleetState(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore invalid storage payload
  }
  return INITIAL_FLEET_STATE;
}

export const App: React.FC = () => {
  const [fleet, setFleet] = useState<FleetState>(loadInitialFleetState);
  const [activeSection, setActiveSection] = useState<NavSection>('crew-quarters');
  const [selectedCrewId, setSelectedCrewId] = useState<string>('sophie-marlowe');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fleet));
    } catch {
      // Ignore quota errors
    }
  }, [fleet]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem(THEME_KEY, darkMode ? '1' : '0');
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  const selectedMember = useMemo(() => {
    return fleet.crew.find((c) => c.id === selectedCrewId) || fleet.crew[0];
  }, [fleet.crew, selectedCrewId]);

  const totalJournals = useMemo(
    () => fleet.crew.reduce((acc, c) => acc + c.journals.length, 0),
    [fleet.crew]
  );

  const openObjectivesCount = useMemo(
    () => fleet.objectives.filter((o) => !o.completed).length,
    [fleet.objectives]
  );

  const handleSelectCrew = (id: string, tab: InspectorTab = 'overview') => {
    setSelectedCrewId(id);
    setInspectorTab(tab);
    setMobileInspectorOpen(true);
  };

  const handleJumpToOfficer = (id: string, tab: InspectorTab = 'overview') => {
    setSelectedCrewId(id);
    setInspectorTab(tab);
    setActiveSection('crew-quarters');
    setMobileInspectorOpen(true);
  };

  const handleUpdateStatus = (memberId: string, status: CrewStatus) => {
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) => (m.id === memberId ? { ...m, status } : m)),
    }));
  };

  const handleUpdateTask = (memberId: string, currentTask: string) => {
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) => (m.id === memberId ? { ...m, currentTask } : m)),
    }));
  };

  const handleUpdateTerminal = (memberId: string, patch: Partial<TerminalBinding>) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              terminal: {
                ...m.terminal,
                ...patch,
                lastActivityAt: `${hh}:${mm}`,
              },
            }
          : m
      ),
    }));
  };

  const handleAddHookEvent = (
    memberId: string,
    tool: HookToolName,
    target: string,
    summary: string,
    outcome: 'ok' | 'blocked' | 'error'
  ) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ts = `${hh}:${mm}`;
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              terminal: {
                ...m.terminal,
                lastActivityAt: ts,
              },
              hookEvents: [
                {
                  id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  timestamp: ts,
                  tool,
                  target,
                  summary,
                  outcome,
                },
                ...m.hookEvents,
              ],
            }
          : m
      ),
    }));
  };

  const handleUpdateCaptainConfig = (captainTerminalId: string, workspaceCwd: string) => {
    setFleet((prev) => ({
      ...prev,
      captainTerminalId,
      workspaceCwd,
    }));
  };

  const handleIngestHcJson = (rawJson: string): { updatedTerminals: number; appendedEvents: number } => {
    const records = parseExternalHcJson(rawJson);
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ts = `${hh}:${mm}`;

    let updatedTerminals = 0;
    let appendedEvents = 0;

    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((member) => {
        const matches = records.filter(
          (r) =>
            r.terminalMatch &&
            (r.terminalMatch === member.terminal.terminalId ||
              r.terminalMatch === member.terminal.terminalName ||
              r.terminalMatch === member.id)
        );
        if (matches.length === 0) return member;

        updatedTerminals += 1;
        let nextTerminal = { ...member.terminal, lastActivityAt: ts };
        const newEvents = [...member.hookEvents];

        for (const rec of matches) {
          if (rec.terminalState) nextTerminal.terminalState = rec.terminalState;
          if (rec.cwd) nextTerminal.cwd = rec.cwd;
          if (rec.screenPreview) nextTerminal.lastScreenPreview = rec.screenPreview;

          if (rec.tool || rec.summary) {
            appendedEvents += 1;
            newEvents.unshift({
              id: `ev-ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              timestamp: ts,
              tool: rec.tool || 'hc read',
              target: rec.target || nextTerminal.cwd,
              summary: rec.summary || 'Synced via hc JSON ingest',
              outcome: rec.outcome || 'ok',
            });
          }
        }

        return {
          ...member,
          terminal: nextTerminal,
          hookEvents: newEvents,
        };
      }),
    }));

    return { updatedTerminals, appendedEvents };
  };

  const handleToggleNote = (memberId: string, noteId: string) => {
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              pinnedNotes: m.pinnedNotes.map((n) =>
                n.id === noteId ? { ...n, done: !n.done } : n
              ),
            }
          : m
      ),
    }));
  };

  const handleAddNote = (memberId: string, text: string) => {
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              pinnedNotes: [
                ...m.pinnedNotes,
                { id: `note-${Date.now()}`, text, done: false },
              ],
            }
          : m
      ),
    }));
  };

  const handleDeleteNote = (memberId: string, noteId: string) => {
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? { ...m, pinnedNotes: m.pinnedNotes.filter((n) => n.id !== noteId) }
          : m
      ),
    }));
  };

  const handleAddJournal = (memberId: string, title: string, content: string) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              journals: [
                {
                  id: `j-${Date.now()}`,
                  day: prev.voyageDay,
                  title,
                  content,
                  timestamp: `Day ${prev.voyageDay} · ${hh}:${mm}`,
                },
                ...m.journals,
              ],
            }
          : m
      ),
    }));
  };

  const handleCycleToolStatus = (memberId: string, toolId: string) => {
    const order: FleetTool['status'][] = ['Online', 'Calibrating', 'Maintenance'];
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              tools: m.tools.map((t) => {
                if (t.id !== toolId) return t;
                const next = order[(order.indexOf(t.status) + 1) % order.length];
                return { ...t, status: next };
              }),
            }
          : m
      ),
    }));
  };

  const handleToggleReadinessCheck = (memberId: string, checkId: string) => {
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              readinessChecks: m.readinessChecks.map((r) =>
                r.id === checkId ? { ...r, passed: !r.passed } : r
              ),
            }
          : m
      ),
    }));
  };

  const handleAddPrompt = (
    memberId: string,
    title: string,
    summary: string,
    template: string
  ) => {
    setFleet((prev) => ({
      ...prev,
      crew: prev.crew.map((m) =>
        m.id === memberId
          ? {
              ...m,
              prompts: [
                ...m.prompts,
                { id: `pr-${Date.now()}`, title, summary, template },
              ],
            }
          : m
      ),
    }));
  };

  const handleToggleObjective = (id: string) => {
    setFleet((prev) => ({
      ...prev,
      objectives: prev.objectives.map((o) =>
        o.id === id ? { ...o, completed: !o.completed } : o
      ),
    }));
  };

  const handleAddObjective = (
    title: string,
    sector: string,
    assigneeId: string,
    priority: MissionObjective['priority']
  ) => {
    setFleet((prev) => ({
      ...prev,
      objectives: [
        {
          id: `obj-${Date.now()}`,
          title,
          sector,
          assigneeId,
          priority,
          completed: false,
          dueDay: prev.voyageDay + 1,
        },
        ...prev.objectives,
      ],
    }));
  };

  const handleUpdateShipStatus = (shipStatus: FleetState['shipStatus']) => {
    setFleet((prev) => ({ ...prev, shipStatus }));
  };

  const handleAdvanceDay = () => {
    setFleet((prev) => ({
      ...prev,
      voyageDay: prev.voyageDay + 1,
      etaDays: Math.max(0, prev.etaDays - 1),
    }));
  };

  const handleCycleSystemStatus = (id: string) => {
    const order = ['Nominal', 'Attention', 'Overhaul'] as const;
    setFleet((prev) => ({
      ...prev,
      systems: prev.systems.map((s) => {
        if (s.id !== id) return s;
        const next = order[(order.indexOf(s.status) + 1) % order.length];
        const integrity = next === 'Nominal' ? 98 : next === 'Attention' ? 84 : 62;
        return { ...s, status: next, integrity, lastCheckedDay: prev.voyageDay };
      }),
    }));
  };

  const handleLogFaultNote = (id: string, note: string) => {
    setFleet((prev) => ({
      ...prev,
      systems: prev.systems.map((s) =>
        s.id === id ? { ...s, lastFaultNote: note, lastCheckedDay: prev.voyageDay } : s
      ),
    }));
  };

  const handleUpdatePencilNote = (waypointId: string, pencilNote: string) => {
    setFleet((prev) => ({
      ...prev,
      waypoints: prev.waypoints.map((w) =>
        w.id === waypointId ? { ...w, pencilNote } : w
      ),
    }));
  };

  const handleImportFleetJson = (nextState: FleetState) => {
    setFleet(nextState);
  };

  const handleResetState = () => {
    setFleet(INITIAL_FLEET_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col parchment-surface">
      <TopMasthead
        activeSection={activeSection}
        onNavigate={(section) => {
          setActiveSection(section);
          setMobileInspectorOpen(false);
        }}
        shipStatus={fleet.shipStatus}
        missionName={fleet.missionName}
        etaDays={fleet.etaDays}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <div className="flex-1 flex min-w-0">
        <SidebarNav
          activeSection={activeSection}
          onSelect={(section) => {
            setActiveSection(section);
            setMobileInspectorOpen(false);
          }}
          crewCount={fleet.crew.length}
          journalCount={totalJournals}
          openObjectives={openObjectivesCount}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            {activeSection === 'crew-quarters' && (
              <CrewQuartersView
                crew={fleet.crew}
                selectedCrewId={selectedMember.id}
                onSelectCrew={handleSelectCrew}
              />
            )}

            {activeSection === 'mission-deck' && (
              <MissionDeckView
                missionName={fleet.missionName}
                shipStatus={fleet.shipStatus}
                captainTerminalId={fleet.captainTerminalId}
                workspaceCwd={fleet.workspaceCwd}
                voyageDay={fleet.voyageDay}
                etaDays={fleet.etaDays}
                crew={fleet.crew}
                objectives={fleet.objectives}
                onToggleObjective={handleToggleObjective}
                onAddObjective={handleAddObjective}
                onUpdateShipStatus={handleUpdateShipStatus}
                onUpdateCaptainConfig={handleUpdateCaptainConfig}
                onAdvanceDay={handleAdvanceDay}
                onInspectOfficer={handleJumpToOfficer}
              />
            )}

            {activeSection === 'logs-journals' && (
              <LogsJournalsView
                crew={fleet.crew}
                voyageDay={fleet.voyageDay}
                onAddJournal={handleAddJournal}
                onIngestHcJson={handleIngestHcJson}
                onInspectOfficer={handleJumpToOfficer}
              />
            )}

            {activeSection === 'tools-gear' && (
              <ToolsGearView
                crew={fleet.crew}
                onCycleToolStatus={handleCycleToolStatus}
                onInspectOfficer={handleJumpToOfficer}
              />
            )}

            {activeSection === 'prompts-library' && (
              <PromptsLibraryView
                crew={fleet.crew}
                onInspectOfficer={handleJumpToOfficer}
              />
            )}

            {activeSection === 'reports' && (
              <ReportsView
                crew={fleet.crew}
                voyageDay={fleet.voyageDay}
                onInspectOfficer={handleJumpToOfficer}
              />
            )}

            {activeSection === 'ship-systems' && (
              <ShipSystemsView
                systems={fleet.systems}
                crew={fleet.crew}
                onCycleSystemStatus={handleCycleSystemStatus}
                onLogFaultNote={handleLogFaultNote}
                onInspectOfficer={handleJumpToOfficer}
              />
            )}

            {activeSection === 'map-charts' && (
              <MapChartsView
                waypoints={fleet.waypoints}
                crew={fleet.crew}
                onUpdatePencilNote={handleUpdatePencilNote}
                onInspectOfficer={handleJumpToOfficer}
              />
            )}

            {activeSection === 'settings' && (
              <SettingsView
                fleetState={fleet}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode((d) => !d)}
                onImportFleetJson={handleImportFleetJson}
                onResetState={handleResetState}
              />
            )}
          </div>

          {activeSection === 'crew-quarters' && (
            <OfficerInspector
              member={selectedMember}
              captainTerminalId={fleet.captainTerminalId}
              activeTab={inspectorTab}
              onTabChange={setInspectorTab}
              onUpdateStatus={handleUpdateStatus}
              onUpdateTask={handleUpdateTask}
              onUpdateTerminal={handleUpdateTerminal}
              onAddHookEvent={handleAddHookEvent}
              onToggleNote={handleToggleNote}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onAddJournal={handleAddJournal}
              onCycleToolStatus={handleCycleToolStatus}
              onToggleReadinessCheck={handleToggleReadinessCheck}
              onAddPrompt={handleAddPrompt}
              mobileOpen={mobileInspectorOpen}
              onCloseMobile={() => setMobileInspectorOpen(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
