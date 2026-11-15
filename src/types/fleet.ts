export type CrewTier = 'Command' | 'Operations' | 'Support' | 'Special';

export type CrewStatus = 'Mission Ready' | 'In Task' | 'Off Duty';

export type TerminalState = 'working' | 'idle' | 'blocked' | 'error' | 'offline';

export type AgentRuntime = 'claude' | 'pi' | 'codex' | 'custom';

export type HookToolName =
  | 'Read'
  | 'Edit'
  | 'Write'
  | 'Bash'
  | 'Grep'
  | 'hc send'
  | 'hc read'
  | 'hc wait'
  | 'hc run';

export type NavSection =
  | 'crew-quarters'
  | 'mission-deck'
  | 'logs-journals'
  | 'tools-gear'
  | 'prompts-library'
  | 'reports'
  | 'ship-systems'
  | 'map-charts'
  | 'settings';

export type InspectorTab =
  | 'overview'
  | 'terminal'
  | 'profile'
  | 'journal'
  | 'tools'
  | 'prompts'
  | 'reports';

export interface PinnedNote {
  id: string;
  text: string;
  done: boolean;
}

export interface JournalEntry {
  id: string;
  day: number;
  title: string;
  content: string;
  timestamp: string;
}

export interface FleetTool {
  id: string;
  name: string;
  category: string;
  status: 'Online' | 'Calibrating' | 'Maintenance';
  description: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  summary: string;
  template: string;
}

export interface ReadinessCheck {
  id: string;
  label: string;
  passed: boolean;
  note?: string;
}

export interface ToolHookEvent {
  id: string;
  timestamp: string;
  tool: HookToolName;
  target: string;
  summary: string;
  outcome: 'ok' | 'blocked' | 'error';
}

export interface TerminalBinding {
  terminalId: string;
  terminalName: string;
  templateName: string;
  agentRuntime: AgentRuntime;
  cwd: string;
  parentTerminalId: string;
  terminalState: TerminalState;
  firstMessageSent: {
    sent: boolean;
    reason?: string;
  };
  lastScreenPreview: string;
  lastActivityAt: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  rankTitle: string;
  tier: CrewTier;
  vesselOrUnit: string;
  motto: string;
  doctrine: string;
  whatTheyDo: string;
  signatureTrait: string;
  fleetRelationships: string;
  portrait: string;
  status: CrewStatus;
  currentTask: string;
  terminal: TerminalBinding;
  hookEvents: ToolHookEvent[];
  pinnedNotes: PinnedNote[];
  journals: JournalEntry[];
  tools: FleetTool[];
  prompts: PromptTemplate[];
  readinessChecks: ReadinessCheck[];
  watchHours: number;
}

export interface MissionObjective {
  id: string;
  title: string;
  sector: string;
  assigneeId: string;
  priority: 'Critical' | 'High' | 'Standard';
  completed: boolean;
  dueDay: number;
}

export interface ShipSystem {
  id: string;
  name: string;
  custodianId: string;
  integrity: number;
  status: 'Nominal' | 'Attention' | 'Overhaul';
  lastFaultNote: string;
  lastCheckedDay: number;
}

export interface ChartWaypoint {
  id: string;
  code: string;
  name: string;
  x: number;
  y: number;
  depthFathoms: number;
  hazard: string;
  officerId: string;
  layer: 'route' | 'hazard' | 'recon' | 'subsurface';
  pencilNote: string;
}

export interface FleetState {
  missionName: string;
  shipStatus: 'Operational' | 'High Alert' | 'Anchored';
  captainTerminalId: string;
  workspaceCwd: string;
  voyageDay: number;
  etaDays: number;
  crew: CrewMember[];
  objectives: MissionObjective[];
  systems: ShipSystem[];
  waypoints: ChartWaypoint[];
}
