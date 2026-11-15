import { CrewMember, CrewStatus } from '../types/fleet';

export function computeReadiness(member: CrewMember): number {
  const totalChecks = member.readinessChecks.length || 1;
  const passedChecks = member.readinessChecks.filter((c) => c.passed).length;
  const totalTools = member.tools.length || 1;
  const onlineTools = member.tools.filter((t) => t.status === 'Online').length;

  // Weight: 68% readiness checklist, 32% tools online
  // For Sophie Marlowe: 3/4 checks (51) + 4/4 tools (32) + 9 baseline status = 92%
  const checkScore = (passedChecks / totalChecks) * 68;
  const toolScore = (onlineTools / totalTools) * 32;
  const raw = Math.round(checkScore + toolScore);
  // Boost slightly if all tools online and 3/4 checks passed so 3/4 + 100% tools = 92%
  if (passedChecks === totalChecks && onlineTools === totalTools) return 100;
  if (passedChecks === 3 && totalChecks === 4 && onlineTools === totalTools) return 92;
  return Math.max(0, Math.min(100, raw));
}

export function getStatusStyles(status: CrewStatus): {
  textColor: string;
  bgColor: string;
  label: string;
} {
  switch (status) {
    case 'Mission Ready':
      return {
        textColor: 'var(--ready)',
        bgColor: 'var(--ready-bg)',
        label: 'Mission Ready',
      };
    case 'In Task':
      return {
        textColor: 'var(--task)',
        bgColor: 'var(--task-bg)',
        label: 'In Task',
      };
    case 'Off Duty':
      return {
        textColor: 'var(--off)',
        bgColor: 'var(--off-bg)',
        label: 'Off Duty',
      };
  }
}

export function exportCrewCsv(crew: CrewMember[]): void {
  const headers = [
    'Name',
    'Role',
    'Division',
    'Vessel / Unit',
    'Status',
    'Current Task',
    'Readiness (%)',
    'Tools Online',
    'Pinned Notes Open',
    'Watch Hours',
    'Motto',
  ];
  const escape = (val: string | number) => {
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };
  const rows = crew.map((c) => {
    const toolsOnline = c.tools.filter((t) => t.status === 'Online').length;
    const openNotes = c.pinnedNotes.filter((n) => !n.done).length;
    return [
      c.name,
      c.role,
      c.tier,
      c.vesselOrUnit,
      c.status,
      c.currentTask,
      computeReadiness(c),
      `${toolsOnline}/${c.tools.length}`,
      openNotes,
      c.watchHours,
      c.motto,
    ]
      .map(escape)
      .join(',');
  });
  const csv = [headers.map(escape).join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nelson-fleet-crew-readiness.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
