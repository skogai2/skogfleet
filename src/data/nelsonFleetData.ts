import { FleetState } from '../types/fleet';

export const INITIAL_FLEET_STATE: FleetState = {
  missionName: 'Chart the North Reach',
  shipStatus: 'Operational',
  captainTerminalId: 't0',
  workspaceCwd: '/workspace/nelson-fleet',
  voyageDay: 214,
  etaDays: 6,
  crew: [
    // ==================== COMMAND TIER (7) ====================
    {
      id: 'vane',
      name: 'Vane',
      role: 'Admiral',
      rankTitle: 'Admiral of the Fleet, Supreme Commander of the Nelson Squadron',
      tier: 'Command',
      vesselOrUnit: 'Fleet Flag Command (HMS Victory)',
      motto: 'The Long View',
      doctrine: 'What are the 2nd-order consequences? What would make me reverse course?',
      whatTheyDo:
        'Sees the full shape of the engagement, second- and third-order consequences, and the gap between Captain reports and deck reality. Issues campaign orders, distributes squadron resources, arbitrates inter-ship disputes, and owns the why and what.',
      signatureTrait:
        'Before any major deployment order, writes out by hand the one thing that would cause him to reverse course entirely—his ledger of humility.',
      fleetRelationships:
        'Closest working relationship is with Red-Cell Navigator Petra Vaas, the voice he actively invites to contradict him. Gives Captains room to be wrong and asks only that they report it.',
      portrait: './assets/crew/vane.png',
      status: 'Mission Ready',
      currentTask: 'Strategic horizon review & abort criteria ledger for North Reach',
      watchHours: 48,
      terminal: {
        terminalId: 't1',
        terminalName: 'admiral-vane',
        templateName: 'admiral',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't0',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Ledger of Humility signed for Day 214. Awaiting Petra Vaas red-cell readback.',
        lastActivityAt: '06:32',
      },
      hookEvents: [
        {
          id: 'ev-vane-1',
          timestamp: '06:32',
          tool: 'hc send',
          target: 'redcell-vaas',
          summary: 'Requested evidence-free assertion audit on Sector B transit',
          outcome: 'ok',
        },
        {
          id: 'ev-vane-2',
          timestamp: '06:24',
          tool: 'Read',
          target: 'docs/campaign/north-reach-brief.md',
          summary: 'Reviewed campaign risk bounds & second-order supply margins',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'v-n1', text: 'Review 2nd-order supply impact if Northern Channel closes', done: true },
        { id: 'v-n2', text: 'Define explicit abort criteria with Petra Vaas before Day 216', done: false },
        { id: 'v-n3', text: 'Sign fleet standing orders for Blacklight Reef transit', done: true },
      ],
      journals: [
        {
          id: 'v-j1',
          day: 214,
          title: 'Second-order consequences of the northern tack',
          content:
            'Every ship in the squadron gains two days by threading the Northern Channel, yet we forfeit our leeward sea room if the barometer drops. Before committing the flagship, I asked Petra to list every unverified chart sounding and Marsh to separate chart-room counsel from quarterdeck orders.',
          timestamp: 'Day 214 · 06:30',
        },
        {
          id: 'v-j2',
          day: 211,
          title: 'Fleet dispersion discipline',
          content:
            'Patrol units must keep acoustic and visual overlap without crowding the frigate screen. Consistency beats speed when the fog rolls off the headlands.',
          timestamp: 'Day 211 · 19:15',
        },
      ],
      tools: [
        { id: 'v-t1', name: 'Fleet Order Ledger', category: 'Command', status: 'Online', description: 'Master squadron directive register and reversal thresholds.' },
        { id: 'v-t2', name: 'Barometric Horizon Glass', category: 'Meteorology', status: 'Online', description: '48-hour pressure gradient tracker for strategic routing.' },
        { id: 'v-t3', name: 'Consequence Matrix', category: 'Planning', status: 'Online', description: 'Two-order impact ledger for fleet maneuvers.' },
      ],
      prompts: [
        {
          id: 'v-p1',
          title: '2nd-Order Consequence Audit',
          summary: 'Evaluate downstream fleet effects and define course-reversal triggers.',
          template:
            'Decision under review: [Proposed Order].\n1. State the immediate 1st-order objective.\n2. Map three 2nd-order consequences across fuel, crew fatigue, and tactical position.\n3. Specify the exact observable condition that forces an immediate reversal of course.',
        },
        {
          id: 'v-p2',
          title: 'Course Reversal Thresholds',
          summary: 'Set pre-committed abort signals before entering contested waters.',
          template:
            'Before crossing [Waypoint], define:\n- Wind/tide boundary that cancels transit\n- Minimum hull/larder margin required\n- Officer authorized to sound the recall.',
        },
      ],
      readinessChecks: [
        { id: 'v-r1', label: 'Tools Online', passed: true },
        { id: 'v-r2', label: 'Current Task Assigned', passed: true },
        { id: 'v-r3', label: 'Reports Up to Date', passed: true },
        { id: 'v-r4', label: 'Fleet Abort Criteria Signed', passed: true },
      ],
    },
    {
      id: 'maren-holt',
      name: 'Maren Holt',
      role: 'Frigate Captain',
      rankTitle: 'Captain, HMS Perseverance (Frigate-class)',
      tier: 'Command',
      vesselOrUnit: 'HMS Perseverance (Frigate-class)',
      motto: 'The Reliable Current',
      doctrine: 'Name the most likely failure point aloud, then proceed with consistency.',
      whatTheyDo:
        'Handles the bulk of the squadron’s operational load—the steady, essential, bread-and-butter runs executed with such consistency that planning officers treat her delivery estimates as guarantees.',
      signatureTrait:
        'At the start of each operation, states aloud to her first officer the single most likely point of failure so it has no power to surprise her.',
      fleetRelationships:
        'The Captain other Captains call to learn how operations are normally run. Works closely with HMS Victory on handoffs and Patrol Vessel crews during overlap runs.',
      portrait: './assets/crew/maren-holt.png',
      status: 'Mission Ready',
      currentTask: 'Maintaining steady screen cadence on standard squadron runs',
      watchHours: 54,
      terminal: {
        terminalId: 't2',
        terminalName: 'frigate-holt',
        templateName: 'frigate-captain',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet/src',
        parentTerminalId: 't1',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Failure point named: starboard shroud block & API retry backoff. Proceeding steady.',
        lastActivityAt: '08:12',
      },
      hookEvents: [
        {
          id: 'ev-mh-1',
          timestamp: '08:12',
          tool: 'Edit',
          target: 'src/workers/convoySync.ts',
          summary: 'Hardened standard batch handoff and named backoff boundary',
          outcome: 'ok',
        },
        {
          id: 'ev-mh-2',
          timestamp: '07:55',
          tool: 'Bash',
          target: 'npm test -- convoy',
          summary: '14/14 steady-state integration assertions passed',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'mh-n1', text: 'Call out starboard rigging tension before squall line hits', done: true },
        { id: 'mh-n2', text: 'Verify watch handover log with Coxswain Reardon', done: true },
      ],
      journals: [
        {
          id: 'mh-j1',
          day: 214,
          title: 'Naming the weakest link on the foremast',
          content:
            'We named the port shroud block aloud at morning quarters. Once everyone on deck knew where strain would appear first, the watch adjusted brace tension without panic when the gusts freshened.',
          timestamp: 'Day 214 · 08:10',
        },
      ],
      tools: [
        { id: 'mh-t1', name: 'Frigate Speed Log', category: 'Navigation', status: 'Online', description: 'Taffrail log calibrated for steady squadron station-keeping.' },
        { id: 'mh-t2', name: 'Failure-Point Register', category: 'Operations', status: 'Online', description: 'Pre-watch hazard ledger shared across all deck officers.' },
        { id: 'mh-t3', name: 'Signal Lantern Array', category: 'Comms', status: 'Online', description: 'Night-watch coded lantern repeater for convoy cadence.' },
      ],
      prompts: [
        {
          id: 'mh-p1',
          title: 'Pre-Watch Failure Naming',
          summary: 'Surface the most probable breakdown before committing resources.',
          template:
            'Operation: [Task Name].\n- Single most likely failure point: [Specify component or assumption].\n- Early warning indicator: [What shifts first].\n- Steady-state mitigation step during execution: [Action].',
        },
      ],
      readinessChecks: [
        { id: 'mh-r1', label: 'Tools Online', passed: true },
        { id: 'mh-r2', label: 'Current Task Assigned', passed: true },
        { id: 'mh-r3', label: 'Reports Up to Date', passed: true },
        { id: 'mh-r4', label: 'Watch Cadence Verified', passed: true },
      ],
    },
    {
      id: 'rook',
      name: 'Rook',
      role: 'Destroyer Captain',
      rankTitle: 'Captain, HMS Exigent (Destroyer-class)',
      tier: 'Command',
      vesselOrUnit: 'HMS Exigent (Destroyer-class)',
      motto: 'The Edge of the Blade',
      doctrine: "If the order won't fit one page, the mission isn't understood yet.",
      whatTheyDo:
        'Handles complex, high-stakes operations requiring speed and surgical precision when compressed timelines or high error costs preclude a slower Frigate approach.',
      signatureTrait:
        'Keeps every operation order to a single page by policy—believing brevity forces clarity and clarity saves lives.',
      fleetRelationships:
        'Respected at a slight distance for rapid tempo. Works closest with Red-Cell Navigator Petra Vaas, one of the few officers who regularly slows him down.',
      portrait: './assets/crew/rook.png',
      status: 'In Task',
      currentTask: 'Outer flank picket & compressed single-page intercept order',
      watchHours: 61,
      terminal: {
        terminalId: 't3',
        terminalName: 'destroyer-rook',
        templateName: 'destroyer-captain',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet/src/critical',
        parentTerminalId: 't1',
        terminalState: 'working',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Trimming intercept spec to <180 words. Isolating race condition in lock path...',
        lastActivityAt: '09:48',
      },
      hookEvents: [
        {
          id: 'ev-rk-1',
          timestamp: '09:47',
          tool: 'Grep',
          target: 'acquireTurnLock',
          summary: 'Traced 3 contested entrypoints on critical intercept path',
          outcome: 'ok',
        },
        {
          id: 'ev-rk-2',
          timestamp: '09:41',
          tool: 'hc read',
          target: 'redcell-vaas',
          summary: 'Checked Petra Vaas pre-mission flaw notes',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'rk-n1', text: 'Compress interception rules to single-page brief', done: true },
        { id: 'rk-n2', text: 'Inspect storm shutters on forward gunwale', done: false },
      ],
      journals: [
        {
          id: 'rk-j1',
          day: 213,
          title: 'Trimming three pages down to six lines',
          content:
            'Sent back the Admiralty routing addendum until it fit on one sheet of oilskin paper. In a cross-sea at midnight, nobody reads footnotes. Clear intent, hard boundaries, then full steam.',
          timestamp: 'Day 213 · 22:40',
        },
      ],
      tools: [
        { id: 'rk-t1', name: 'Single-Page Order Slate', category: 'Command', status: 'Online', description: 'Oilskin tactical dispatch board capped at 180 words.' },
        { id: 'rk-t2', name: 'Storm Anemometer', category: 'Weather', status: 'Online', description: 'Masthead gale gauge for high-speed flank intercepts.' },
        { id: 'rk-t3', name: 'Flank Rangefinder', category: 'Tactical', status: 'Online', description: 'Optical bearing finder calibrated for rough seas.' },
      ],
      prompts: [
        {
          id: 'rk-p1',
          title: 'One-Page Mission Compression',
          summary: 'Distill sprawling directives into crisp, unambiguous orders.',
          template:
            'Strip [Long Plan] to one page:\n1. Objective (1 sentence)\n2. Boundary / Do-Not-Cross (2 bullets)\n3. Success Signal (1 observable fact)\nIf any section overflows, clarify the mission first.',
        },
      ],
      readinessChecks: [
        { id: 'rk-r1', label: 'Tools Online', passed: true },
        { id: 'rk-r2', label: 'Current Task Assigned', passed: true },
        { id: 'rk-r3', label: 'Reports Up to Date', passed: true },
        { id: 'rk-r4', label: 'Flank Intercept Clear', passed: false, note: 'Awaiting squall clearance' },
      ],
    },
    {
      id: 'sera-idriss',
      name: 'Sera Idriss',
      role: 'Patrol Captain',
      rankTitle: 'Lieutenant-Captain, HMS Constancy (Patrol-class)',
      tier: 'Command',
      vesselOrUnit: 'HMS Constancy (Patrol-class)',
      motto: 'The Quiet Mile',
      doctrine: 'Debrief yourself honestly — what happened vs what you expected?',
      whatTheyDo:
        'Handles well-scoped, lower-risk operations: routine sweeps, defined verification tasks, and standard baseline checks that make anomalies visible.',
      signatureTrait:
        'Debriefs every operation to herself aloud after each run, comparing what actually happened against what she expected.',
      fleetRelationships:
        'Mentored by Frigate Captain Maren Holt. Underestimated by officers who confuse scale with significance, while Admiral Vane knows her numbers cold.',
      portrait: './assets/crew/sera-idriss.png',
      status: 'Mission Ready',
      currentTask: 'Scanning leeward headlands & channel baseline checks',
      watchHours: 52,
      terminal: {
        terminalId: 't4',
        terminalName: 'patrol-idriss',
        templateName: 'patrol-captain',
        agentRuntime: 'pi',
        cwd: '/workspace/nelson-fleet/checks',
        parentTerminalId: 't1',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Patrol sweep complete. Delta logged: +0.9kt northwest set vs forecast.',
        lastActivityAt: '09:08',
      },
      hookEvents: [
        {
          id: 'ev-si-1',
          timestamp: '09:05',
          tool: 'Bash',
          target: 'hc ls --json',
          summary: 'Baseline terminal sweep across patrol perimeter',
          outcome: 'ok',
        },
        {
          id: 'ev-si-2',
          timestamp: '08:52',
          tool: 'Write',
          target: 'logs/patrol-day214-debrief.md',
          summary: 'Recorded expected vs observed drift measurements',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'si-n1', text: 'Log variance between predicted and actual drift off North Cliff', done: true },
        { id: 'si-n2', text: 'Cross-check coastal beacon timings with Sophie Marlowe', done: true },
      ],
      journals: [
        {
          id: 'si-j1',
          day: 214,
          title: 'Expected vs observed tide set',
          content:
            'Expected a half-knot eastward set off the stacks; measured 1.4 knots northwest instead. Recording the gap without excuses keeps the flagship off the shelf tomorrow.',
          timestamp: 'Day 214 · 09:05',
        },
      ],
      tools: [
        { id: 'si-t1', name: 'Twin Night-Glass Binoculars', category: 'Recon', status: 'Online', description: 'Low-light brass optics for coastal silhouette scanning.' },
        { id: 'si-t2', name: 'Expectation-vs-Reality Ledger', category: 'Debrief', status: 'Online', description: 'Post-patrol delta log comparing forecast to observation.' },
        { id: 'si-t3', name: 'Drift Buoy Kit', category: 'Hydrography', status: 'Online', description: 'Weighted drogues for direct surface current measurement.' },
      ],
      prompts: [
        {
          id: 'si-p1',
          title: 'Honest Patrol Debrief',
          summary: 'Compare expectations directly against observed reality after every run.',
          template:
            'Patrol Sector: [Sector].\n- What we expected: [Hypothesis]\n- What actually happened: [Observed measurements]\n- Where our mental model erred: [Delta & correction].',
        },
      ],
      readinessChecks: [
        { id: 'si-r1', label: 'Tools Online', passed: true },
        { id: 'si-r2', label: 'Current Task Assigned', passed: true },
        { id: 'si-r3', label: 'Reports Up to Date', passed: true },
        { id: 'si-r4', label: 'Coastal Optics Calibrated', passed: true },
      ],
    },
    {
      id: 'aldren-marsh',
      name: 'Aldren Marsh',
      role: 'Flagship Captain',
      rankTitle: 'Captain, HMS Victory (Flagship)',
      tier: 'Command',
      vesselOrUnit: 'HMS Victory (Flagship)',
      motto: 'First Among Equals',
      doctrine: "Chart room: Admiral's officer. Deck: crew's captain. Know which mode you're in.",
      whatTheyDo:
        'Commands the flagship on the squadron’s highest-consequence operations while serving as the Admiral’s operational right hand—translating campaign strategy into flagship execution.',
      signatureTrait:
        'Maintains an unmistakable boundary between chart-room counsel and quarterdeck command; experienced hands read which mode he is in within a sentence.',
      fleetRelationships:
        'Only Captain in daily contact with Admiral Vane. Deliberately even-handed with other Captains and treats Petra Vaas with wary professional respect.',
      portrait: './assets/crew/aldren-marsh.png',
      status: 'Mission Ready',
      currentTask: 'Coordinating flagship deck watches & Admiral council',
      watchHours: 50,
      terminal: {
        terminalId: 't5',
        terminalName: 'flagship-marsh',
        templateName: 'flagship-captain',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't1',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Deck orders issued via XO Ashdown. Chart room council adjourned.',
        lastActivityAt: '08:30',
      },
      hookEvents: [
        {
          id: 'ev-am-1',
          timestamp: '08:28',
          tool: 'hc send',
          target: 'xo-ashdown',
          summary: 'Dispatched flagship quarterdeck watch allocations',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'am-n1', text: 'Hold 16:00 deck briefing after chart room council closes', done: true },
        { id: 'am-n2', text: 'Review crew rest rotation with Vera Ashdown', done: true },
      ],
      journals: [
        {
          id: 'am-j1',
          day: 213,
          title: 'Separating the chart room from the quarterdeck',
          content:
            'In the chart room I debate Vane on margin and risk. Once I step onto the quarterdeck, ambiguity ends and the crew gets a steady voice and clear deck assignments.',
          timestamp: 'Day 213 · 17:45',
        },
      ],
      tools: [
        { id: 'am-t1', name: 'Quarterdeck Speaking Trumpet', category: 'Command', status: 'Online', description: 'Heavy brass deck hailer for full-rigged maneuvers.' },
        { id: 'am-t2', name: 'Dual-Mode Watch Roster', category: 'Crew', status: 'Online', description: 'Separates strategic deliberations from deck execution schedules.' },
      ],
      prompts: [
        {
          id: 'am-p1',
          title: 'Mode Boundary Check',
          summary: 'Ensure strategic debate never leaks as confusion onto execution.',
          template:
            'Current Context: [Chart Room Debate | Deck Execution].\n- If Chart Room: challenge assumptions openly.\n- If Deck: state crisp assignments, timing, and fallback without hedging.',
        },
      ],
      readinessChecks: [
        { id: 'am-r1', label: 'Tools Online', passed: true },
        { id: 'am-r2', label: 'Current Task Assigned', passed: true },
        { id: 'am-r3', label: 'Reports Up to Date', passed: true },
        { id: 'am-r4', label: 'Quarterdeck Crew Briefed', passed: true },
      ],
    },
    {
      id: 'ysolde-crane',
      name: 'Ysolde Crane',
      role: 'Submarine Captain',
      rankTitle: 'Captain, HMS Inference (Submarine-class)',
      tier: 'Command',
      vesselOrUnit: 'HMS Inference (Submarine-class)',
      motto: 'The Unobserved Hand',
      doctrine: "Maintain the casualty list — which assumptions didn't survive contact?",
      whatTheyDo:
        'Executes sustained, autonomous deep-dive investigations and long-range reconnaissance beneath the visible surface, returning with findings that reframe the engagement.',
      signatureTrait:
        'Maintains a running "casualty list" of every initial assumption that failed contact with evidence, reviewing it before every deployment.',
      fleetRelationships:
        'Rarely seen at staff meetings; known through outcomes. Shares quiet professional kinship with Petra Vaas—both reveal what the fleet would rather not see.',
      portrait: './assets/crew/ysolde-crane.png',
      status: 'In Task',
      currentTask: 'Subsurface thermal layer & deep codebase dependency dive',
      watchHours: 44,
      terminal: {
        terminalId: 't6',
        terminalName: 'sub-crane',
        templateName: 'submarine-captain',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet/deep-audit',
        parentTerminalId: 't1',
        terminalState: 'working',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Running silent trace on 40-fathom shelf. 2 assumptions struck from casualty list.',
        lastActivityAt: '09:51',
      },
      hookEvents: [
        {
          id: 'ev-yc-1',
          timestamp: '09:50',
          tool: 'Read',
          target: 'deep-audit/hydrophone-stream.json',
          summary: 'Analyzed counter-current eddies beneath Blacklight Reef',
          outcome: 'ok',
        },
        {
          id: 'ev-yc-2',
          timestamp: '09:18',
          tool: 'Edit',
          target: 'logs/assumption-casualties.md',
          summary: 'Logged 2 disproven surface-drift assumptions',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'yc-n1', text: 'Strike 3 outdated soundings from Assumption Casualty List', done: true },
        { id: 'yc-n2', text: 'Verify ballast trim at 40-fathom shelf', done: false },
      ],
      journals: [
        {
          id: 'yc-j1',
          day: 214,
          title: 'Two assumptions lost at thirty fathoms',
          content:
            'The cold current beneath Blacklight Reef runs opposite the surface wind. That kills our silent-drift assumption. Added both failed premises to the casualty ledger so we never rely on them again.',
          timestamp: 'Day 214 · 04:20',
        },
      ],
      tools: [
        { id: 'yc-t1', name: 'Assumption Casualty Ledger', category: 'Analysis', status: 'Online', description: 'Tracks every premise disproven upon real-world contact.' },
        { id: 'yc-t2', name: 'Deep Pressure Manometer', category: 'Subsurface', status: 'Online', description: 'Hull-mounted depth and thermal boundary gauge.' },
        { id: 'yc-t3', name: 'Acoustic Hydrophone', category: 'Recon', status: 'Calibrating', description: 'Passive reef-echo listener for blind underwater transit.' },
      ],
      prompts: [
        {
          id: 'yc-p1',
          title: 'Assumption Casualty Review',
          summary: 'Catalog which beliefs broke upon contact with reality.',
          template:
            'Operation: [Run / Test].\nList assumptions that failed contact:\n1. [Assumption] — disproven by [Evidence]\n2. Revised operating rule going forward.',
        },
      ],
      readinessChecks: [
        { id: 'yc-r1', label: 'Tools Online', passed: false, note: 'Hydrophone calibrating' },
        { id: 'yc-r2', label: 'Current Task Assigned', passed: true },
        { id: 'yc-r3', label: 'Reports Up to Date', passed: true },
        { id: 'yc-r4', label: 'Ballast Trim Logged', passed: true },
      ],
    },
    {
      id: 'petra-vaas',
      name: 'Petra Vaas',
      role: 'Red-Cell Navigator',
      rankTitle: 'Commander Petra Vaas, Red-Cell Navigator, Fleet Command Staff',
      tier: 'Command',
      vesselOrUnit: 'Fleet Command Staff (No Ship Assignment)',
      motto: "The Question That Won't Sit Down",
      doctrine: 'List every assertion made without evidence. Read it back at the end.',
      whatTheyDo:
        'Stress-tests plans before they become operations. Probes assumptions, identifies single points of failure, runs adversarial scenarios, and surfaces gaps between belief and verification.',
      signatureTrait:
        'Maintains a private list of every unsupported assertion made during planning and reads it back verbatim at the end of the session.',
      fleetRelationships:
        'Works closest with Admiral Vane, who instituted the role so rank could never overrule scrutiny. Sparring partner to Destroyer Captain Rook.',
      portrait: './assets/crew/petra-vaas.png',
      status: 'Mission Ready',
      currentTask: 'Auditing North Reach route claims for unverified soundings',
      watchHours: 46,
      terminal: {
        terminalId: 't7',
        terminalName: 'redcell-vaas',
        templateName: 'reviewer',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't1',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Read-only audit complete. 7 unverified assertions flagged for 18:00 council.',
        lastActivityAt: '11:02',
      },
      hookEvents: [
        {
          id: 'ev-pv-1',
          timestamp: '11:00',
          tool: 'Grep',
          target: 'TODO|FIXME|assumed',
          summary: 'Scanned chart specs for unverified legacy assumptions',
          outcome: 'ok',
        },
        {
          id: 'ev-pv-2',
          timestamp: '10:48',
          tool: 'hc send',
          target: 'admiral-vane',
          summary: 'Delivered 7-item unsupported-assertions readback',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'pv-n1', text: 'Flag 4 unverified 1898 Admiralty soundings in Sector C', done: true },
        { id: 'pv-n2', text: 'Read back unsupported assertions at evening command council', done: false },
      ],
      journals: [
        {
          id: 'pv-j1',
          day: 214,
          title: 'Seven claims without a lead-line reading',
          content:
            'During briefing, three officers called the eastern channel "historically clear." None could cite a sounding taken within ten years. Wrote all seven claims on the slate to read back before anyone gives the helm order.',
          timestamp: 'Day 214 · 11:00',
        },
      ],
      tools: [
        { id: 'pv-t1', name: 'Unverified Claims Slate', category: 'Audit', status: 'Online', description: 'Running list of assertions lacking primary evidence.' },
        { id: 'pv-t2', name: 'Red-Ink Divider Set', category: 'Charting', status: 'Online', description: 'Marks unconfirmed shoals and blind sectors on overlays.' },
      ],
      prompts: [
        {
          id: 'pv-p1',
          title: 'Evidence-Free Assertion Audit',
          summary: 'Extract every claim stated as fact without direct proof.',
          template:
            'Review [Briefing / Plan]:\n1. List every assertion made without cited measurement or observation.\n2. Rank by catastrophic potential if false.\n3. Read the list back verbatim before approval.',
        },
      ],
      readinessChecks: [
        { id: 'pv-r1', label: 'Tools Online', passed: true },
        { id: 'pv-r2', label: 'Current Task Assigned', passed: true },
        { id: 'pv-r3', label: 'Reports Up to Date', passed: true },
        { id: 'pv-r4', label: 'Red-Cell Audit Complete', passed: true },
      ],
    },

    // ==================== OPERATIONS / CREW ROLES (7) ====================
    {
      id: 'vera-ashdown',
      name: 'Vera Ashdown',
      role: 'Executive Officer',
      rankTitle: 'Lieutenant Commander Vera Ashdown, RN',
      tier: 'Operations',
      vesselOrUnit: 'HMS Argyll (Command Desk)',
      motto: 'The ship runs because she says it does.',
      doctrine: "Nothing crosses the Captain's desk without passing through me first.",
      whatTheyDo:
        'Translates command-level decisions into crew-level standing orders, watch bills, and annotated task lists. Owns the ship’s internal schedule, effort allocation, and morning briefing.',
      signatureTrait:
        'Maintains a plain navy-blue physical notebook recording the ship’s daily state in her own private shorthand.',
      fleetRelationships:
        'Works most closely with Navigation Officer Sophie Marlowe on dependency schedules and takes Coxswain Reardon’s ground-level intelligence seriously.',
      portrait: './assets/crew/vera-ashdown.png',
      status: 'Mission Ready',
      currentTask: 'Triaging deck dispatches & watch schedules',
      watchHours: 58,
      terminal: {
        terminalId: 't8',
        terminalName: 'xo-ashdown',
        templateName: 'executive-officer',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't5',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: '14 requests triaged -> 3 escalated to Admiral/Flagship. Watch bill locked.',
        lastActivityAt: '08:05',
      },
      hookEvents: [
        {
          id: 'ev-va-1',
          timestamp: '08:04',
          tool: 'hc send',
          target: 'no-marlowe',
          summary: 'Synced dependency deadlines into Day 214 standing watch bill',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'va-n1', text: 'Gatekeep non-urgent requisitions until 18:00 council', done: true },
        { id: 'va-n2', text: 'Pair Yusuf Haidari larder snapshot with Fen boiler schedule', done: true },
      ],
      journals: [
        {
          id: 'va-j1',
          day: 214,
          title: 'Order on the companionway',
          content:
            'Filtered fourteen petty requests down to three decisions requiring Captain Marsh and Admiral Vane. A quiet bridge lets command think three days ahead instead of three minutes.',
          timestamp: 'Day 214 · 07:50',
        },
      ],
      tools: [
        { id: 'va-t1', name: 'XO Dispatch Clipboard', category: 'Operations', status: 'Online', description: 'Priority triage board controlling all upward officer traffic.' },
        { id: 'va-t2', name: 'Watch Rotation Ledger', category: 'Personnel', status: 'Online', description: 'Balances fatigue across all 18 officers and deck teams.' },
      ],
      prompts: [
        {
          id: 'va-p1',
          title: 'Executive Dispatch Triage',
          summary: 'Filter operational noise before escalating to command.',
          template:
            'Incoming Request: [Item].\n- Can this be resolved by existing standing orders? [Yes/No]\n- Required owner if delegated: [Officer]\n- Only escalate if irreversible or cross-division.',
        },
      ],
      readinessChecks: [
        { id: 'va-r1', label: 'Tools Online', passed: true },
        { id: 'va-r2', label: 'Current Task Assigned', passed: true },
        { id: 'va-r3', label: 'Reports Up to Date', passed: true },
        { id: 'va-r4', label: 'Bridge Traffic Cleared', passed: true },
      ],
    },
    {
      id: 'james-okorie',
      name: 'James Okorie',
      role: 'Principal Warfare Officer',
      rankTitle: 'Lieutenant Commander James Okorie, RN',
      tier: 'Operations',
      vesselOrUnit: 'HMS Argyll (Operations Room)',
      motto: 'He sees the engagement first.',
      doctrine: 'Ask questions rather than issue corrections — make the right answer feel inevitable.',
      whatTheyDo:
        'Owns the ship’s operational output—coordinating targeting priorities, sequencing the work, managing execution, and deciding what the next objective is and in what order to approach it.',
      signatureTrait:
        'Reworks a printed operational picture in red pen every morning at 0600 before the rest of the wardroom finishes coffee.',
      fleetRelationships:
        'Works in tight loop with WEO Carys Beynon (whose tools he deploys) and Navigation Officer Sophie Marlowe (whose dependency map sets viable routes).',
      portrait: './assets/crew/james-okorie.png',
      status: 'Mission Ready',
      currentTask: 'Sequencing mission priorities & tactical plot drills',
      watchHours: 49,
      terminal: {
        terminalId: 't9',
        terminalName: 'pwo-okorie',
        templateName: 'warfare-officer',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet/src',
        parentTerminalId: 't8',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Operational picture sequenced. Next target: North Reach waypoint parser.',
        lastActivityAt: '08:40',
      },
      hookEvents: [
        {
          id: 'ev-jo-1',
          timestamp: '08:38',
          tool: 'Read',
          target: 'src/data/objectives.json',
          summary: 'Sequenced critical path priorities with WEO and NO',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'jo-n1', text: 'Walk midshipmen through windward arc question tree', done: true },
        { id: 'jo-n2', text: 'Sync broadside readiness with Carys Beynon', done: true },
      ],
      journals: [
        {
          id: 'jo-j1',
          day: 213,
          title: 'Leading the plot team by inquiry',
          content:
            'Rather than overriding the junior plotter on bearing drift, I asked where the target would cross our bows in twelve minutes if wind held steady. He caught the error himself in ten seconds and won’t repeat it.',
          timestamp: 'Day 213 · 15:20',
        },
      ],
      tools: [
        { id: 'jo-t1', name: 'Fleet Tactical Plot', category: 'Warfare', status: 'Online', description: 'Chalkboard relative-motion grid for squadron geometry.' },
        { id: 'jo-t2', name: 'Bearing Convergence Rule', category: 'Optics', status: 'Online', description: 'Brass intercept slide for closing-rate calculation.' },
      ],
      prompts: [
        {
          id: 'jo-p1',
          title: 'Socratic Tactical Correction',
          summary: 'Guide operators to discover the right bearing through targeted questions.',
          template:
            'Observed Drift: [Issue].\nInstead of prescribing the fix, ask:\n1. What happens in 10 minutes if current rate continues?\n2. Which constraint changes first?\n3. Which adjustment preserves both margin and initiative?',
        },
      ],
      readinessChecks: [
        { id: 'jo-r1', label: 'Tools Online', passed: true },
        { id: 'jo-r2', label: 'Current Task Assigned', passed: true },
        { id: 'jo-r3', label: 'Reports Up to Date', passed: true },
        { id: 'jo-r4', label: 'Plot Drills Completed', passed: true },
      ],
    },
    {
      id: 'sophie-marlowe',
      name: 'Sophie Marlowe',
      role: 'Navigation Officer',
      rankTitle: 'Lieutenant Sophie Marlowe, RN',
      tier: 'Operations',
      vesselOrUnit: 'HMS Argyll (Chart Table)',
      motto: 'She knows where the rocks are.',
      doctrine: 'Annotate in pencil, never pen. Everything is contingent, revisable.',
      whatTheyDo:
        'Maps dependencies, identifies critical paths, flags below-the-waterline risks, and sequences the ship’s approach so it arrives at each objective with sufficient sea room.',
      signatureTrait:
        'Annotates her charts exclusively in pencil—regarding anyone who plans in ink with professional suspicion.',
      fleetRelationships:
        'Feeds scheduled dependencies directly to XO Vera Ashdown and tempers PWO James Okorie’s operational ambitions with geographic reality.',
      portrait: './assets/crew/sophie-marlowe.png',
      status: 'In Task',
      currentTask: 'Route refinement for North Reach',
      watchHours: 55,
      terminal: {
        terminalId: 't10',
        terminalName: 'no-marlowe',
        templateName: 'navigation-officer',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet/charts',
        parentTerminalId: 't8',
        terminalState: 'working',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Plotting Blacklight Reef 4-cable berth; revising fog contingency corridor in pencil.',
        lastActivityAt: '10:18',
      },
      hookEvents: [
        {
          id: 'ev-sm-1',
          timestamp: '10:15',
          tool: 'Edit',
          target: 'charts/north-reach-corridor.json',
          summary: 'Updated Blacklight Reef clearance margin to 4 cables west',
          outcome: 'ok',
        },
        {
          id: 'ev-sm-2',
          timestamp: '10:02',
          tool: 'hc read',
          target: 'rm-sapper',
          summary: 'Read Sapper pier load survey before confirming landing waypoint',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'sm-n1', text: 'Recheck shoals near Blacklight Reef.', done: true },
        { id: 'sm-n2', text: 'Confirm tide window with Sapper.', done: true },
        { id: 'sm-n3', text: 'Update secondary route (fog contingency).', done: false },
      ],
      journals: [
        {
          id: 'sm-j1',
          day: 214,
          title: 'Northern Channel approach',
          content:
            'Wind freshening from the west. The northern channel is narrower than the charts suggest, but the current is fair. If we hold our line and give the reef a wider berth, we can make the Reach by the sixth day.',
          timestamp: 'Day 214 · 10:15',
        },
        {
          id: 'sm-j2',
          day: 212,
          title: 'Pencil annotations on Sector B',
          content:
            'Erased yesterday’s anchorage mark after Sera reported shifting gravel bars. Ink tempts pride; graphite obeys the sea.',
          timestamp: 'Day 212 · 16:40',
        },
      ],
      tools: [
        { id: 'sm-t1', name: 'Chart Annotator', category: 'Cartography', status: 'Online', description: 'Graphite drafting overlay for revisable coastal bearings.' },
        { id: 'sm-t2', name: 'Route Simulator', category: 'Navigation', status: 'Online', description: 'Multi-waypoint wind and leeway projection model.' },
        { id: 'sm-t3', name: 'Tide & Current Model', category: 'Hydrography', status: 'Online', description: 'Harmonic tidal window calculator for narrow channels.' },
        { id: 'sm-t4', name: 'Risk Plotter', category: 'Safety', status: 'Online', description: 'Shoal clearance and fog-contingency corridor plotter.' },
      ],
      prompts: [
        {
          id: 'sm-p1',
          title: 'Route Analysis',
          summary: 'Evaluate primary and fallback corridors with revisable assumptions.',
          template:
            'Corridor: [Channel / Waypoint].\n- Minimum under-keel clearance: [Fathoms]\n- Contingent pencil assumption: [Current / Visibility]\n- Secondary fog route if visibility drops below 400 yds.',
        },
        {
          id: 'sm-p2',
          title: 'Hazard Assessment',
          summary: 'Score shoal, reef, and tidal cross-set hazards.',
          template:
            'Hazard: [Reef / Shoal Name].\n- Nearest safe berth: [Distance in cables]\n- Tide window sensitivity: [High/Med/Low]\n- Verification source: [Sounding / Recon].',
        },
        {
          id: 'sm-p3',
          title: 'Navigation Options',
          summary: 'Compare three tactical tacks without locking prematurely.',
          template:
            'Compare 3 routes to [Destination]:\nA) Direct channel (time vs margin)\nB) Outer reef berth\nC) Lay-by anchorage waiting for slack water.',
        },
      ],
      readinessChecks: [
        { id: 'sm-r1', label: 'Tools Online', passed: true },
        { id: 'sm-r2', label: 'Current Task Assigned', passed: true },
        { id: 'sm-r3', label: 'Reports Up to Date', passed: true },
        { id: 'sm-r4', label: 'Awaiting: Tide Update (Minor)', passed: false, note: 'Minor slack-water revision pending' },
      ],
    },
    {
      id: 'patrick-fen',
      name: 'Patrick Fen',
      role: 'Marine Engineering Officer',
      rankTitle: 'Lieutenant Commander Patrick Fen, RN',
      tier: 'Operations',
      vesselOrUnit: 'HMS Argyll (Engine Room)',
      motto: 'Fen makes sure the ship can get there.',
      doctrine: "Fragile is just broken that hasn't happened yet. Rebuild it properly.",
      whatTheyDo:
        'Owns core infrastructure—build systems, pipelines, and runtime environments on which everything else depends. Invisible when engines run cleanly; indispensable when they do not.',
      signatureTrait:
        'Maintains a three-year fault log for every major system and cross-references every new fault against historical patterns before touching a wrench.',
      fleetRelationships:
        'Shares deep professional respect with WEO Carys Beynon; regarded by XO Vera Ashdown as the most dependable officer aboard.',
      portrait: './assets/crew/patrick-fen.png',
      status: 'Mission Ready',
      currentTask: 'Hardening build pipeline & auxiliary steam governor',
      watchHours: 60,
      terminal: {
        terminalId: 't11',
        terminalName: 'meo-fen',
        templateName: 'marine-engineer',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't8',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'vite build + tsc --noEmit green. Bronze collar seated on feedwater valve.',
        lastActivityAt: '05:52',
      },
      hookEvents: [
        {
          id: 'ev-pf-1',
          timestamp: '05:50',
          tool: 'Bash',
          target: 'npm run build && npm run lint',
          summary: 'Verified clean TypeScript & Vite bundle pipeline',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'pf-n1', text: 'Replace patched condenser gasket with milled bronze collar', done: true },
        { id: 'pf-n2', text: 'Inspect starboard bilge pump impeller', done: true },
      ],
      journals: [
        {
          id: 'pf-j1',
          day: 214,
          title: 'No wire-and-tallow fixes below the waterline',
          content:
            'Refused a temporary shim on the feedwater valve. A patch buys an hour in harbour and steals a ship in a gale. Stripped the housing and seated a proper bronze sleeve.',
          timestamp: 'Day 214 · 05:45',
        },
      ],
      tools: [
        { id: 'pf-t1', name: 'Steam Pressure Manifold', category: 'Propulsion', status: 'Online', description: 'Boiler pressure & governor balancing gauge.' },
        { id: 'pf-t2', name: 'Bronze Lathe & Bearing Kit', category: 'Maintenance', status: 'Online', description: 'Machining kit for permanent mechanical rebuilds.' },
        { id: 'pf-t3', name: 'Bilge Flow Sensor', category: 'Hull', status: 'Online', description: 'Continuous lower-deck watertight telemetry.' },
      ],
      prompts: [
        {
          id: 'pf-p1',
          title: 'Fragility Elimination Audit',
          summary: 'Identify temporary patches likely to fail under peak load.',
          template:
            'System: [Engine / Rigging / Module].\n- Where are we relying on temporary workarounds?\n- What load breaks this patch first?\n- Permanent rebuild specification.',
        },
      ],
      readinessChecks: [
        { id: 'pf-r1', label: 'Tools Online', passed: true },
        { id: 'pf-r2', label: 'Current Task Assigned', passed: true },
        { id: 'pf-r3', label: 'Reports Up to Date', passed: true },
        { id: 'pf-r4', label: 'Steam Margin > 20%', passed: true },
      ],
    },
    {
      id: 'carys-beynon',
      name: 'Carys Beynon',
      role: 'Weapons Engineering Officer',
      rankTitle: 'Lieutenant Carys Beynon, RN',
      tier: 'Operations',
      vesselOrUnit: 'HMS Argyll (Ordnance Deck)',
      motto: 'She maintains what others merely use.',
      doctrine: "If you can't describe the fault specifically, you haven't understood it.",
      whatTheyDo:
        'Owns specialist tools and capabilities—linters, formatters, test frameworks, and deployment tooling—ensuring every system is calibrated, regression-tested, and documented.',
      signatureTrait:
        'Runs an undisclosed verification suite on every new system before signing it operational; anything failing is rebuilt until it passes.',
      fleetRelationships:
        'Natural ally of MEO Patrick Fen, primary capability supplier to PWO James Okorie, and in constructive friction with LOGO Haidari over version constraints.',
      portrait: './assets/crew/carys-beynon.png',
      status: 'In Task',
      currentTask: 'Calibrating test harness & starboard battery micrometers',
      watchHours: 53,
      terminal: {
        terminalId: 't12',
        terminalName: 'weo-beynon',
        templateName: 'weapons-engineer',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet/tests',
        parentTerminalId: 't8',
        terminalState: 'working',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Isolated fault to pinion teeth 14-19 (0.02mm tolerance). Lapping test suite...',
        lastActivityAt: '09:44',
      },
      hookEvents: [
        {
          id: 'ev-cb-1',
          timestamp: '09:42',
          tool: 'Bash',
          target: 'vitest run --reporter=verbose',
          summary: 'Pinpointed flaky regression assertion in recoil timing test',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'cb-n1', text: 'Measure recoil trunnion wear to 0.02mm tolerance', done: false },
        { id: 'cb-n2', text: 'Re-index powder magazine humidity tags', done: true },
      ],
      journals: [
        {
          id: 'cb-j1',
          day: 214,
          title: 'Precision fault isolation on Carriage #4',
          content:
            'Gun crew reported "stiff elevation." That is a symptom, not a fault. Stripped the gear arc and found salt-pitting on teeth 14–19 of the brass pinion. Lapped and re-greased.',
          timestamp: 'Day 214 · 09:40',
        },
      ],
      tools: [
        { id: 'cb-t1', name: 'Vernier Caliper Set', category: 'Ordnance', status: 'Online', description: 'High-precision trunnion and bore measurement calipers.' },
        { id: 'cb-t2', name: 'Recoil Hydraulic Bench', category: 'Weapons', status: 'Calibrating', description: 'Pressure bleed and return-spring test rig.' },
        { id: 'cb-t3', name: 'Magazine Hygrometer', category: 'Safety', status: 'Online', description: 'Dry-powder humidity verification gauge.' },
      ],
      prompts: [
        {
          id: 'cb-p1',
          title: 'Specific Fault Diagnosis',
          summary: 'Convert vague symptom complaints into exact root-cause isolation.',
          template:
            'Reported Symptom: [Vague complaint].\n- Exact component & measurement: [Pinpoint location]\n- Reproducible failure condition: [Exact trigger]\n- Verified repair test.',
        },
      ],
      readinessChecks: [
        { id: 'cb-r1', label: 'Tools Online', passed: false, note: 'Recoil bench calibrating' },
        { id: 'cb-r2', label: 'Current Task Assigned', passed: true },
        { id: 'cb-r3', label: 'Reports Up to Date', passed: true },
        { id: 'cb-r4', label: 'Battery Calibration Logged', passed: true },
      ],
    },
    {
      id: 'yusuf-haidari',
      name: 'Yusuf Haidari',
      role: 'Logistics Officer',
      rankTitle: 'Lieutenant Yusuf Haidari, RN',
      tier: 'Operations',
      vesselOrUnit: 'HMS Argyll (Purser Hold)',
      motto: "If it's aboard, Haidari put it there.",
      doctrine: 'Keep snapshots of known-good states. The larder saves ships.',
      whatTheyDo:
        'Manages dependencies—external packages, version-controlled resources, third-party tooling, and supply manifests—ensuring compatibility and rapid recovery when upstream breaks.',
      signatureTrait:
        'Maintains "the larder": timestamped, annotated snapshots of known-good dependency states ready for immediate restoration.',
      fleetRelationships:
        'Works closest with WEO Carys Beynon on tooling requirements and MEO Patrick Fen on infrastructure supplies.',
      portrait: './assets/crew/yusuf-haidari.png',
      status: 'Mission Ready',
      currentTask: 'Auditing package lockfiles & Day 214 known-good snapshot',
      watchHours: 47,
      terminal: {
        terminalId: 't13',
        terminalName: 'logo-haidari',
        templateName: 'logistics-officer',
        agentRuntime: 'pi',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't8',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Larder snapshot Day-214 verified (bun.lock + package.json checksum clean).',
        lastActivityAt: '07:18',
      },
      hookEvents: [
        {
          id: 'ev-yh-1',
          timestamp: '07:16',
          tool: 'Read',
          target: 'package.json',
          summary: 'Verified dependency lock compatibility across fleet workspace',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'yh-n1', text: 'Verify Day 214 known-good manifest snapshot', done: true },
        { id: 'yh-n2', text: 'Allocate storm rations for Constancy & Exigent crews', done: true },
      ],
      journals: [
        {
          id: 'yh-j1',
          day: 214,
          title: 'Known-good manifest snapshot signed',
          content:
            'Eighteen days of fresh water, twelve days of coal-and-oil margin, and sealed spare rigging crates stowed by serial number. If we need to roll back any requisition, the Day 214 larder ledger is our baseline.',
          timestamp: 'Day 214 · 07:15',
        },
      ],
      tools: [
        { id: 'yh-t1', name: 'R.N. Larder Ledger', category: 'Logistics', status: 'Online', description: 'Immutable inventory manifest with known-good daily snapshots.' },
        { id: 'yh-t2', name: 'Crate & Cask Manifest', category: 'Supply', status: 'Online', description: 'Hold stowage map balanced for ship trim.' },
      ],
      prompts: [
        {
          id: 'yh-p1',
          title: 'Known-Good Snapshot Check',
          summary: 'Capture clean rollback state before modifying fleet configuration or supply.',
          template:
            'Pre-Change Snapshot: [Date / Operation].\n- Verified baseline state: [Inventory / Config]\n- Rollback trigger: [Condition]\n- Recovery time to known-good state.',
        },
      ],
      readinessChecks: [
        { id: 'yh-r1', label: 'Tools Online', passed: true },
        { id: 'yh-r2', label: 'Current Task Assigned', passed: true },
        { id: 'yh-r3', label: 'Reports Up to Date', passed: true },
        { id: 'yh-r4', label: 'Larder Snapshot Current', passed: true },
      ],
    },
    {
      id: 'donal-reardon',
      name: 'Donal Reardon',
      role: 'Coxswain',
      rankTitle: 'Warrant Officer Class 1 Donal Reardon, RN',
      tier: 'Operations',
      vesselOrUnit: 'HMS Argyll (Lower Decks)',
      motto: 'Reardon knows the crew.',
      doctrine: "Walk the ship. Stretch your legs. See what others don't report.",
      whatTheyDo:
        'Officer of the watch for the human state of the ship—morale, discipline, institutional memory, translating officer intent to the deck and unspoken deck reality back upward.',
      signatureTrait:
        'Makes one unscheduled daily circuit through machinery spaces, mess decks, operations room, and upper deck—"stretching his legs."',
      fleetRelationships:
        'Consulted privately by the Captain and respected with quiet formality by XO Ashdown.',
      portrait: './assets/crew/donal-reardon.png',
      status: 'Mission Ready',
      currentTask: 'Deck morale rounds & terminal fatigue check',
      watchHours: 56,
      terminal: {
        terminalId: 't14',
        terminalName: 'cox-reardon',
        templateName: 'coxswain',
        agentRuntime: 'pi',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't8',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Completed full deck circuit. Caught chafed hawser eye & stalled worker.',
        lastActivityAt: '06:10',
      },
      hookEvents: [
        {
          id: 'ev-dr-1',
          timestamp: '06:05',
          tool: 'hc read',
          target: 'all terminals',
          summary: 'Inspected all 18 live terminal screens for silent stalls',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'dr-n1', text: 'Walk forward mess & rope locker before night watch', done: true },
        { id: 'dr-n2', text: 'Check fatigue on starboard helm reliefs', done: true },
      ],
      journals: [
        {
          id: 'dr-j1',
          day: 214,
          title: 'What the rope locker tells you',
          content:
            'The formal watch log said "all quiet." Walking the forward deck showed two hands nursing rope burns and a frayed hawser eye. Fixed both before they turned into a man-overboard entry.',
          timestamp: 'Day 214 · 06:00',
        },
      ],
      tools: [
        { id: 'dr-t1', name: 'Deck Walk Tally', category: 'Crew', status: 'Online', description: 'Informal deck-by-deck observation log.' },
        { id: 'dr-t2', name: 'Rigging & Cordage Gauge', category: 'Seamanship', status: 'Online', description: 'Checks hawser chafing and block sheaves first-hand.' },
      ],
      prompts: [
        {
          id: 'dr-p1',
          title: 'Ground-Truth Deck Walk',
          summary: 'Verify real operating conditions directly rather than trusting summary reports.',
          template:
            'Area Walked: [Deck / Subsystem].\n- What formal reports say: [Official status]\n- What direct inspection revealed: [Unreported friction or wear]\n- Immediate crew fix.',
        },
      ],
      readinessChecks: [
        { id: 'dr-r1', label: 'Tools Online', passed: true },
        { id: 'dr-r2', label: 'Current Task Assigned', passed: true },
        { id: 'dr-r3', label: 'Reports Up to Date', passed: true },
        { id: 'dr-r4', label: 'Morning Rounds Complete', passed: true },
      ],
    },

    // ==================== MARINES & AUXILIARIES (4: 3 Support + 1 Special) ====================
    {
      id: 'recce-marine',
      name: 'Recce Marine',
      role: 'Reconnaissance Marine',
      rankTitle: 'Marine First Class, Reconnaissance Troop',
      tier: 'Support',
      vesselOrUnit: 'Reconnaissance Troop (Embarked)',
      motto: 'Gone before you knew he was there.',
      doctrine: 'Read from the edges inward. Trust boundary behavior over center documentation.',
      whatTheyDo:
        'Enters unfamiliar ground—uncharted codebases, unknown dependency trees, undocumented systems—maps what is actually there, and reports back without touching or altering anything.',
      signatureTrait:
        'Reads every system from its edges inward—starting with what it touches, refuses, or fails silently.',
      fleetRelationships:
        'Works closest with flagship planning staff, Navigator Sophie Marlowe, and Sapper, who reads his intelligence reports before touching foundations.',
      portrait: './assets/crew/recce-marine.png',
      status: 'Mission Ready',
      currentTask: 'Read-only boundary recon along North Reach cliffs & entrypoints',
      watchHours: 42,
      terminal: {
        terminalId: 't15',
        terminalName: 'rm-recce',
        templateName: 'recce-marine',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't5',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Boundary map filed. Read-only discipline held; zero files modified.',
        lastActivityAt: '09:14',
      },
      hookEvents: [
        {
          id: 'ev-rm-1',
          timestamp: '09:12',
          tool: 'Read',
          target: 'vite.config.ts',
          summary: 'Mapped build boundary & static asset serving behavior',
          outcome: 'ok',
        },
        {
          id: 'ev-rm-2',
          timestamp: '09:05',
          tool: 'Grep',
          target: 'localStorage',
          summary: 'Located persistence boundary keys without editing source',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'rm-n1', text: 'Survey cliff-edge tide pools where charts end', done: true },
        { id: 'rm-n2', text: 'Sketch unmarked landing coves for Sophie Marlowe', done: true },
      ],
      journals: [
        {
          id: 'rm-j1',
          day: 213,
          title: 'Walking the shoreline edge',
          content:
            'The Admiralty guide claims the cove is inaccessible. From the outer headland ridge, there is a clean shingle shelf at half-tide. Boundary observation beats old center-office ink every time.',
          timestamp: 'Day 213 · 14:10',
        },
      ],
      tools: [
        { id: 'rm-t1', name: 'Edge-Scout Sketch Pad', category: 'Recon', status: 'Online', description: 'Waterproof boundary topography notebook.' },
        { id: 'rm-t2', name: 'Compact Lead Line', category: 'Hydrography', status: 'Online', description: 'Quiet shallow-water sounding cord for shore landings.' },
      ],
      prompts: [
        {
          id: 'rm-p1',
          title: 'Edge-Inward Boundary Recon',
          summary: 'Inspect perimeter edge cases before relying on central documentation.',
          template:
            'Boundary Target: [Perimeter / Interface].\n- What central docs claim: [Official spec]\n- Actual edge behavior observed: [Field notes]\n- Discrepancies to feed back to Navigation.',
        },
      ],
      readinessChecks: [
        { id: 'rm-r1', label: 'Tools Online', passed: true },
        { id: 'rm-r2', label: 'Current Task Assigned', passed: true },
        { id: 'rm-r3', label: 'Reports Up to Date', passed: true },
        { id: 'rm-r4', label: 'Boundary Survey Filed', passed: true },
      ],
    },
    {
      id: 'assault-marine',
      name: 'Assault Marine',
      role: 'Assault Marine',
      rankTitle: 'Corporal, Commando Troop, Royal Marines',
      tier: 'Support',
      vesselOrUnit: 'Commando Troop (Embarked)',
      motto: 'The objective will be taken.',
      doctrine: "Set a time limit. If it's not taken by then, something is wrong — report, don't improvise.",
      whatTheyDo:
        'Turns the planning staff’s orders into finished fact—building features, refactoring components, and executing scoped changes with directional force before stepping back.',
      signatureTrait:
        'Sets a strict time limit before beginning; if the objective is not taken within it, reports the blocker rather than improvising past scope.',
      fleetRelationships:
        'Says Recce makes his job possible and Sapper makes it survivable. Coordinates closely with the First Lieutenant and Sapper on timed breaches.',
      portrait: './assets/crew/assault-marine.png',
      status: 'Mission Ready',
      currentTask: 'Time-boxed implementation breach on scoped objective',
      watchHours: 45,
      terminal: {
        terminalId: 't16',
        terminalName: 'rm-assault',
        templateName: 'assault-marine',
        agentRuntime: 'codex',
        cwd: '/workspace/nelson-fleet/src/components',
        parentTerminalId: 't8',
        terminalState: 'idle',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Objective taken within 12m timebox. Signaling ship and holding position.',
        lastActivityAt: '09:30',
      },
      hookEvents: [
        {
          id: 'ev-asm-1',
          timestamp: '09:28',
          tool: 'Write',
          target: 'src/components/OfficerInspector.tsx',
          summary: 'Delivered scoped Terminal & Hooks view inside timebox',
          outcome: 'ok',
        },
        {
          id: 'ev-asm-2',
          timestamp: '09:29',
          tool: 'hc send',
          target: 'xo-ashdown',
          summary: 'Reported objective complete; standing clear of hold',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'asm-n1', text: 'Enforce strict 12-minute cap on cliff ascent drill', done: true },
        { id: 'asm-n2', text: 'Inspect grappling hooks & storm boarding ladders', done: true },
      ],
      journals: [
        {
          id: 'asm-j1',
          day: 213,
          title: 'Time-boxed breach drill',
          content:
            'Halted Squad B at minute twelve when the grapple jammed rather than letting them improvise an exposed climb. Reported the latch defect to Beynon immediately. Discipline keeps people alive.',
          timestamp: 'Day 213 · 18:00',
        },
      ],
      tools: [
        { id: 'asm-t1', name: 'Brass Chronometer Stop', category: 'Tactical', status: 'Online', description: 'Hard time-limit timer enforcing report-over-improvise doctrine.' },
        { id: 'asm-t2', name: 'Storm Boarding Rig', category: 'Assault', status: 'Online', description: 'Reinforced grapples, boarding pikes, and flintlock kits.' },
      ],
      prompts: [
        {
          id: 'asm-p1',
          title: 'Time-Boxed Execution Protocol',
          summary: 'Prevent runaway improvisation with strict mission timeboxes.',
          template:
            'Objective: [Target].\n- Hard time limit: [Minutes / Hours]\n- Escalation rule if unmet: Stop, hold ground, report exact blocker without improvising scope.',
        },
      ],
      readinessChecks: [
        { id: 'asm-r1', label: 'Tools Online', passed: true },
        { id: 'asm-r2', label: 'Current Task Assigned', passed: true },
        { id: 'asm-r3', label: 'Reports Up to Date', passed: true },
        { id: 'asm-r4', label: 'Boarding Rig Inspected', passed: true },
      ],
    },
    {
      id: 'sapper',
      name: 'Sapper',
      role: 'Fleet Sapper',
      rankTitle: 'Sergeant, Royal Marines Engineers Troop',
      tier: 'Support',
      vesselOrUnit: 'Royal Marines Engineers Troop',
      motto: 'He changes the ground itself.',
      doctrine: "Map load paths before touching anything. Refuse if the structure can't bear it.",
      whatTheyDo:
        'Modifies underlying terrain—migrations, schema changes, build system modifications, and load-bearing foundations—building the bridges that let the fleet move safely.',
      signatureTrait:
        'Maps every structural load path before touching a beam and refuses orders if the structure cannot bear the proposed change.',
      fleetRelationships:
        'Reads Recce Marine intel before touching foundations, meets Assault Marine timelines, and conducts evidence-based engineering debates with MEO Patrick Fen.',
      portrait: './assets/crew/sapper.png',
      status: 'In Task',
      currentTask: 'Mapping timber pier load paths & JSON schema foundations',
      watchHours: 51,
      terminal: {
        terminalId: 't17',
        terminalName: 'rm-sapper',
        templateName: 'sapper',
        agentRuntime: 'claude',
        cwd: '/workspace/nelson-fleet/src/types',
        parentTerminalId: 't11',
        terminalState: 'working',
        firstMessageSent: { sent: true },
        lastScreenPreview: 'Load path mapped across FleetState -> CrewMember -> TerminalBinding. Rigging pontoon...',
        lastActivityAt: '09:55',
      },
      hookEvents: [
        {
          id: 'ev-sp-1',
          timestamp: '09:52',
          tool: 'Edit',
          target: 'src/types/fleet.ts',
          summary: 'Extended TerminalBinding schema without breaking existing JSON state',
          outcome: 'ok',
        },
        {
          id: 'ev-sp-2',
          timestamp: '09:38',
          tool: 'Read',
          target: 'src/data/nelsonFleetData.ts',
          summary: 'Verified downstream load paths before schema migration',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'sp-n1', text: 'Confirm North Reach landing trestle load rating with Marlowe', done: true },
        { id: 'sp-n2', text: 'Mark undermined pilings on pier survey blueprint', done: false },
      ],
      journals: [
        {
          id: 'sp-j1',
          day: 214,
          title: 'Refusing an unsafe landing trestle',
          content:
            'Mapped the load paths on the North Reach timber jetty before unloading a single crate. Two diagonal struts carry shear into rotten sill beams. Ordered a pontoon span built instead.',
          timestamp: 'Day 214 · 08:45',
        },
      ],
      tools: [
        { id: 'sp-t1', name: 'Brass Structural Dividers', category: 'Engineering', status: 'Online', description: 'Blueprint load-path caliper and stress transfer ruler.' },
        { id: 'sp-t2', name: 'Timber & Pier Sounder', category: 'Field', status: 'Online', description: 'Checks piling rot and bedrock anchor integrity.' },
      ],
      prompts: [
        {
          id: 'sp-p1',
          title: 'Load-Path Pre-Flight Check',
          summary: 'Trace structural dependencies before altering load-bearing foundations.',
          template:
            'Structure: [Target].\n1. Map every primary & secondary load path.\n2. Identify single points of shear or collapse.\n3. Refuse execution if safety margin falls below 2.0x.',
        },
      ],
      readinessChecks: [
        { id: 'sp-r1', label: 'Tools Online', passed: true },
        { id: 'sp-r2', label: 'Current Task Assigned', passed: true },
        { id: 'sp-r3', label: 'Reports Up to Date', passed: true },
        { id: 'sp-r4', label: 'Trestle Load Sign-off', passed: false, note: 'Pontoon span rigging in progress' },
      ],
    },
    {
      id: 'kronsch',
      name: 'Kronsch',
      role: 'Watchdog / Patrol Unit',
      rankTitle: 'Watchdog / Patrol Unit — Bridge & Archive Sentry',
      tier: 'Special',
      vesselOrUnit: 'Bridge & Archive Sentry',
      motto: 'The cultural checksum.',
      doctrine:
        'Validates paths, files, shakespearean eloquence, and plain text. If he understands your introduction, he KRONSCHes along.',
      whatTheyDo:
        'Stands watch over every dispatch, template, and terminal introduction—verifying that paths resolve, files exist, prose carries human cadence, and plain text needs no decoding ring.',
      signatureTrait:
        'Keeps four leather-bound checksum volumes on watch: PATHS, FILES, SHAKESPEARE, and PLAINTEXT. Four green ticks means the fleet KRONSCHes along.',
      fleetRelationships:
        'Trusted companion to every watch aboard HMS Victory and HMS Argyll; catches opaque jargon and broken paths before orders leave the bridge.',
      portrait: './assets/crew/kronsch.png',
      status: 'Mission Ready',
      currentTask: 'Validating paths, files, Shakespearean eloquence & plaintext across hc templates',
      watchHours: 72,
      terminal: {
        terminalId: 't18',
        terminalName: 'watchdog-kronsch',
        templateName: 'kronsch-watchdog',
        agentRuntime: 'pi',
        cwd: '/workspace/nelson-fleet',
        parentTerminalId: 't0',
        terminalState: 'working',
        firstMessageSent: { sent: true },
        lastScreenPreview: '[PATHS ✓] [FILES ✓] [SHAKESPEARE ✓] [PLAINTEXT ✓] -> KRONSCHes along.',
        lastActivityAt: '10:20',
      },
      hookEvents: [
        {
          id: 'ev-kr-1',
          timestamp: '10:20',
          tool: 'Read',
          target: 'public/assets/aistudio/PERSONAS_9f8a19e9.md',
          summary: 'Verified all 17 canonical persona profiles + Kronsch checksum',
          outcome: 'ok',
        },
        {
          id: 'ev-kr-2',
          timestamp: '10:19',
          tool: 'Bash',
          target: 'ls public/assets/crew/*.png',
          summary: 'Confirmed all 18 portrait paths resolve cleanly',
          outcome: 'ok',
        },
      ],
      pinnedNotes: [
        { id: 'kr-n1', text: 'PATHS: Verify all dispatch & chart file paths resolve cleanly', done: true },
        { id: 'kr-n2', text: 'FILES: Check manifest checksums against Haidari larder ledger', done: true },
        { id: 'kr-n3', text: 'SHAKESPEARE & PLAINTEXT: Reject muddy jargon in orders', done: true },
      ],
      journals: [
        {
          id: 'kr-j1',
          day: 214,
          title: 'Four books green — KRONSCHes along',
          content:
            'Inspected morning dispatches across all four ledgers: Paths verified, Files intact, Shakespearean cadence crisp, and Plaintext legible without decoding rings. Tail wag confirmed; clearance granted.',
          timestamp: 'Day 214 · 07:00',
        },
      ],
      tools: [
        { id: 'kr-t1', name: 'PATHS Verifier', category: 'Checksum', status: 'Online', description: 'Ensures every shipboard reference and route path resolves.' },
        { id: 'kr-t2', name: 'FILES Integrity Tome', category: 'Checksum', status: 'Online', description: 'Audits log manifests for missing or corrupted entries.' },
        { id: 'kr-t3', name: 'SHAKESPEARE Eloquence Meter', category: 'Checksum', status: 'Online', description: 'Checks human clarity, rhythm, and noble brevity.' },
        { id: 'kr-t4', name: 'PLAINTEXT Collar Terminal', category: 'Checksum', status: 'Online', description: 'Strips bureaucratic clutter down to plain readable prose.' },
      ],
      prompts: [
        {
          id: 'kr-p1',
          title: 'Kronsch 4-Book Checksum',
          summary: 'Run an introduction or ship order through Paths, Files, Shakespeare, and Plaintext.',
          template:
            'Kronsch Checksum Review:\n[✓] PATHS: Are all references concrete and reachable?\n[✓] FILES: Are artifacts named cleanly?\n[✓] SHAKESPEARE: Does it speak with vivid human grace?\n[✓] PLAINTEXT: Could any deckhand read it in one glance?',
        },
      ],
      readinessChecks: [
        { id: 'kr-r1', label: 'PATHS Verified', passed: true },
        { id: 'kr-r2', label: 'FILES Verified', passed: true },
        { id: 'kr-r3', label: 'SHAKESPEARE Verified', passed: true },
        { id: 'kr-r4', label: 'PLAINTEXT Verified', passed: true },
      ],
    },
  ],
  objectives: [
    {
      id: 'obj-1',
      title: 'Verify soundings along Blacklight Reef outer edge',
      sector: 'Sector B · Blacklight Reef',
      assigneeId: 'sophie-marlowe',
      priority: 'Critical',
      completed: false,
      dueDay: 215,
    },
    {
      id: 'obj-2',
      title: 'Audit all unverified 1898 Admiralty channel assertions',
      sector: 'Admiralty Chart Room',
      assigneeId: 'petra-vaas',
      priority: 'Critical',
      completed: true,
      dueDay: 214,
    },
    {
      id: 'obj-3',
      title: 'Construct pontoon landing span over unsound jetty',
      sector: 'North Reach Cove',
      assigneeId: 'sapper',
      priority: 'High',
      completed: false,
      dueDay: 216,
    },
    {
      id: 'obj-4',
      title: 'Map subsurface counter-current below 30 fathoms',
      sector: 'Northern Channel Trench',
      assigneeId: 'ysolde-crane',
      priority: 'High',
      completed: false,
      dueDay: 215,
    },
    {
      id: 'obj-5',
      title: 'Maintain Day 214 known-good water & coal reserves',
      sector: 'Purser Hold',
      assigneeId: 'yusuf-haidari',
      priority: 'Standard',
      completed: true,
      dueDay: 214,
    },
    {
      id: 'obj-6',
      title: 'Run Kronsch 4-Book Checksum on Day 215 landing orders',
      sector: 'Bridge Archive',
      assigneeId: 'kronsch',
      priority: 'Standard',
      completed: true,
      dueDay: 214,
    },
  ],
  systems: [
    {
      id: 'sys-1',
      name: 'Main Steam & Governor Array',
      custodianId: 'patrick-fen',
      integrity: 96,
      status: 'Nominal',
      lastFaultNote: 'Replaced patched condenser gasket with milled bronze collar.',
      lastCheckedDay: 214,
    },
    {
      id: 'sys-2',
      name: 'Starboard Ordnance & Recoil Gear',
      custodianId: 'carys-beynon',
      integrity: 88,
      status: 'Attention',
      lastFaultNote: 'Salt-pitting isolated on teeth 14–19 of Carriage #4 brass pinion; lapped.',
      lastCheckedDay: 214,
    },
    {
      id: 'sys-3',
      name: 'Navigation & Sounding Suite',
      custodianId: 'sophie-marlowe',
      integrity: 94,
      status: 'Nominal',
      lastFaultNote: 'Waiting on final slack-water harmonic offset for North Reach.',
      lastCheckedDay: 214,
    },
    {
      id: 'sys-4',
      name: 'Purser Larder & Snapshot Vault',
      custodianId: 'yusuf-haidari',
      integrity: 99,
      status: 'Nominal',
      lastFaultNote: 'Day 214 known-good inventory verified across HMS Victory, Argyll, and Perseverance.',
      lastCheckedDay: 214,
    },
    {
      id: 'sys-5',
      name: 'Subsurface Hydrophone Array',
      custodianId: 'ysolde-crane',
      integrity: 82,
      status: 'Attention',
      lastFaultNote: 'Thermal layer echo calibration underway at 35 fathoms aboard HMS Inference.',
      lastCheckedDay: 214,
    },
    {
      id: 'sys-6',
      name: 'Kronsch Cultural Checksum Unit',
      custodianId: 'kronsch',
      integrity: 100,
      status: 'Nominal',
      lastFaultNote: 'PATHS, FILES, SHAKESPEARE, PLAINTEXT all green.',
      lastCheckedDay: 214,
    },
  ],
  waypoints: [
    {
      id: 'wp-1',
      code: 'WP-01',
      name: 'Victory Anchorage',
      x: 155,
      y: 365,
      depthFathoms: 24,
      hazard: 'Clear sand bottom; mild westerly swell',
      officerId: 'vane',
      layer: 'route',
      pencilNote: 'Squadron muster point at dawn watch.',
    },
    {
      id: 'wp-2',
      code: 'WP-02',
      name: 'Blacklight Reef',
      x: 345,
      y: 280,
      depthFathoms: 6,
      hazard: 'Jagged basalt shelf; 1.4kt cross-set',
      officerId: 'sophie-marlowe',
      layer: 'hazard',
      pencilNote: 'Give 4-cable berth west; recheck shoals at low water.',
    },
    {
      id: 'wp-3',
      code: 'WP-03',
      name: 'Northern Channel',
      x: 495,
      y: 210,
      depthFathoms: 18,
      hazard: 'Narrow passage (320 yds); fog bank probable',
      officerId: 'sera-idriss',
      layer: 'recon',
      pencilNote: 'Fair current; HMS Constancy patrolling leeward cliff line.',
    },
    {
      id: 'wp-4',
      code: 'WP-04',
      name: 'Deep Thermal Trench',
      x: 560,
      y: 340,
      depthFathoms: 42,
      hazard: 'Subsurface reverse eddy below 30 fathoms',
      officerId: 'ysolde-crane',
      layer: 'subsurface',
      pencilNote: 'HMS Inference logged counter-current; keep drogues shallow.',
    },
    {
      id: 'wp-5',
      code: 'WP-05',
      name: 'North Reach Landing',
      x: 715,
      y: 125,
      depthFathoms: 11,
      hazard: 'Timber pier compromised; use Sapper pontoon',
      officerId: 'sapper',
      layer: 'route',
      pencilNote: 'ETA Day 220; Recce confirmed shingle cove.',
    },
  ],
};
