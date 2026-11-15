import { CrewMember, HookToolName, TerminalState } from '../types/fleet';

function shellQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function buildHcRunCommand(
  member: CrewMember,
  captainTerminalId: string,
  taskOverride?: string,
  useTemplate = true
): string {
  const { terminalName, templateName, agentRuntime, cwd } = member.terminal;
  const taskText = (taskOverride || member.currentTask).trim();
  const reportSuffix = `Report findings with hc send ${captainTerminalId} when done or stuck. Stay in scope; do not spawn subagents.`;
  const fullTask = `${taskText}. ${reportSuffix}`;
  const runner = useTemplate ? templateName : agentRuntime;

  return `hc run --bg --name ${terminalName} --cwd ${cwd} ${runner} ${shellQuote(fullTask)}`;
}

export function buildHcSendCommand(
  member: CrewMember,
  message: string,
  wait = false
): string {
  const target = member.terminal.terminalName || member.terminal.terminalId;
  return `hc send ${wait ? '--wait ' : ''}${target} ${shellQuote(message)}`;
}

export function buildHcReadCommand(member: CrewMember, lines = 100): string {
  const target = member.terminal.terminalName || member.terminal.terminalId;
  return `hc read --lines ${lines} ${target}`;
}

export function buildHcGetCommand(member: CrewMember): string {
  const target = member.terminal.terminalName || member.terminal.terminalId;
  return `hc get ${target}`;
}

export function buildHcInterruptCommand(member: CrewMember): string {
  const target = member.terminal.terminalName || member.terminal.terminalId;
  return `hc interrupt ${target}`;
}

export function buildHcTemplateMarkdown(member: CrewMember): string {
  const runtime = member.terminal.agentRuntime === 'pi'
    ? 'pi --provider openai-codex --model gpt-6.1-sol --thinking medium'
    : member.terminal.agentRuntime;

  return `---
name: ${member.terminal.templateName}
description: ${member.name} (${member.role}) — ${member.motto}
command: ${runtime}
---

# ${member.name} — ${member.rankTitle}

**Vessel / Unit:** ${member.vesselOrUnit}
**Epithet:** "${member.motto}"

## Operating Doctrine
${member.doctrine}

## Function
${member.whatTheyDo}

## Signature Discipline
${member.signatureTrait}

## Terminal Protocol
- Stay watchable and interactive; never run one-shot print modes.
- Report findings or blockers directly to your parent terminal via \`hc send $HC_PARENT_TERMINAL_ID\`.
- Do not spawn child terminals unless explicitly ordered.
`;
}

export function getTerminalStateStyle(state: TerminalState): {
  label: string;
  color: string;
  bg: string;
} {
  switch (state) {
    case 'working':
      return { label: 'working', color: 'var(--ready)', bg: 'var(--ready-bg)' };
    case 'idle':
      return { label: 'idle', color: 'var(--brass-ink)', bg: 'var(--parchment-deep)' };
    case 'blocked':
      return { label: 'blocked', color: 'var(--task)', bg: 'var(--task-bg)' };
    case 'error':
      return { label: 'error', color: 'var(--danger)', bg: 'var(--task-bg)' };
    case 'offline':
      return { label: 'offline', color: 'var(--off)', bg: 'var(--off-bg)' };
  }
}

export interface ParsedHookIngest {
  terminalMatch?: string;
  terminalState?: TerminalState;
  cwd?: string;
  screenPreview?: string;
  tool?: HookToolName;
  target?: string;
  summary?: string;
  outcome?: 'ok' | 'blocked' | 'error';
}

export function parseExternalHcJson(rawJson: string): ParsedHookIngest[] {
  const parsed = JSON.parse(rawJson);
  const items = Array.isArray(parsed) ? parsed : [parsed];
  const validStates: TerminalState[] = ['working', 'idle', 'blocked', 'error', 'offline'];
  const validTools: HookToolName[] = [
    'Read',
    'Edit',
    'Write',
    'Bash',
    'Grep',
    'hc send',
    'hc read',
    'hc wait',
    'hc run',
  ];

  return items.map((item) => {
    const obj = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const terminalMatch =
      (typeof obj.name === 'string' && obj.name) ||
      (typeof obj.terminalName === 'string' && obj.terminalName) ||
      (typeof obj.id === 'string' && obj.id) ||
      (typeof obj.terminalId === 'string' && obj.terminalId) ||
      undefined;

    const rawState = typeof obj.status === 'string' ? obj.status : obj.terminalState;
    const terminalState = validStates.includes(rawState as TerminalState)
      ? (rawState as TerminalState)
      : undefined;

    const fg = obj.foreground && typeof obj.foreground === 'object'
      ? (obj.foreground as Record<string, unknown>)
      : null;

    const cwd =
      (fg && typeof fg.cwd === 'string' && fg.cwd) ||
      (typeof obj.cwd === 'string' && obj.cwd) ||
      undefined;

    const screenPreview =
      (typeof obj.screen === 'string' && obj.screen) ||
      (typeof obj.lastScreenPreview === 'string' && obj.lastScreenPreview) ||
      undefined;

    const rawTool = typeof obj.tool === 'string' ? obj.tool : undefined;
    const tool = validTools.includes(rawTool as HookToolName)
      ? (rawTool as HookToolName)
      : undefined;

    const target = typeof obj.target === 'string' ? obj.target : undefined;
    const summary = typeof obj.summary === 'string' ? obj.summary : undefined;
    const rawOutcome = obj.outcome;
    const outcome =
      rawOutcome === 'ok' || rawOutcome === 'blocked' || rawOutcome === 'error'
        ? rawOutcome
        : undefined;

    return {
      terminalMatch,
      terminalState,
      cwd,
      screenPreview,
      tool,
      target,
      summary,
      outcome,
    };
  });
}
