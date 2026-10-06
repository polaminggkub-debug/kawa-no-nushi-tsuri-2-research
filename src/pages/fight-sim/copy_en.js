const secs = (value) => `${value} s`

export default {
  loading: 'Loading the fight data…',
  failed: 'Could not load the fight data.',
  retry: 'Try again',
  back: '← Choose equipment',
  fishOption: (name) => name,
  compare: {
    caption: 'Share of simulated fights landed',
    hold: 'Hold A the whole time',
    mash: 'Mash A (about 10 presses a second)',
    rhythm: 'Press when it rests, let go when it stops pulling',
    tackle: (fish, rod, hook) => `${fish}: ${rod}, ${hook}.`,
  },
  methods: { float: 'Float rod (bait)', casting: 'Casting rod' },
  rodGroups: { float: 'Float rods', casting: 'Casting rods' },
  noBait: 'No bait',
  setupLine: (fish, rod, hook, bait) => `${fish} · ${rod} · ${hook}${bait ? ` · ${bait}` : ''}`,
  sizeLine: (low, high) => (low === high ? `Size ${low} cm.` : `Size ${low} to ${high} cm.`),
  startMeter: (steps) =>
    steps === 0
      ? 'The line-strain meter starts empty.'
      : `The line-strain meter starts ${steps} of 6 steps full.`,
  finder: {
    best: 'Best way to press A for this setup',
    landed: (pct, n) => `Landed ${pct} of ${n} random fights`,
    average: (time) => `Average ${secs(time)} when landed.`,
    outcomes: {
      escaped: 'Got away',
      lost: 'Line broke (hook lost, 1 to 4 HP)',
      unfinished: 'Still going after 100 s',
    },
    baselines: 'How the recommended rhythm does',
    base: {
      hold: 'Hold A the whole time',
      mash: 'Mash A (about 10 presses a second)',
      plain: 'The rhythm above',
      reference: 'The same rhythm if you could see the hidden stamina',
    },
    referenceNote: 'Not possible in the real game; shown to see what the hidden value is worth.',
    column: { caught: 'Landed', escaped: 'Got away', lost: 'Line broke', unfinished: 'Unfinished' },
    trick: 'Advanced: tap A while the fish sprints',
    trickNote:
      'Needs sharp eyes: it only works while the fish is running at full speed. Landings go up, but more fish get away.',
    ceiling: 'With frame-perfect timing',
    ceilingNote:
      'What the same idea could reach with no reaction time at all. Not realistic by hand.',
    noGain: 'Perfect timing would not change much here.',
    reaction: (frames, time) =>
      `These figures assume a reaction time of ${frames} frames (about ${time} s).`,
    sample: (n) =>
      `Random starts: ${n} different fights (hidden random numbers, timing, cast distance and fish size). The percentages are for those simulated fights, not a promise.`,
    notComputed:
      'This exact tackle was not worked out in advance. Press the button to run the finder here (a few seconds, up to about ten for the hardest fish).',
    run: 'Run the finder',
    running: 'Working it out…',
    liveFailed: 'The finder could not run in this browser.',
  },
  policy: {
    rest: (wait) =>
      wait === 0
        ? 'When the fish stops and rests, press A at once.'
        : `When the fish has rested for about ${secs(wait)}, press A.`,
    hold: 'Keep holding A while the fish comes closer.',
    release: (stop, slow, time) => {
      const when =
        stop <= 3
          ? 'the moment it stops coming closer'
          : `once it has stopped coming closer for ${secs(time)}`
      return slow ? `Let go ${when}, or as soon as it slows to a crawl.` : `Let go ${when}.`
    },
    cap: (cap) =>
      `Never hold longer than ${secs(cap)} in a row; let go and wait for the next rest.`,
    first: (first) =>
      `If the fish does not start coming closer within ${secs(first)}, let go and wait.`,
    run: 'While the fish runs away, keep your thumb off A.',
    taps: (every) =>
      `While it runs at full speed, tap A (press and let go) about every ${secs(every)}. As soon as it slows down, stop tapping and let it run.`,
  },
  play: {
    start: 'Start a fight',
    again: 'New fight',
    retry: 'Same fight again',
    giveUp: 'Give up',
    waiting: 'Press "Start a fight". The fish is already running when the fight begins.',
    short: {
      running: 'Running',
      resting: 'Resting',
      reeling: 'Reeling in',
      stalled: 'Stopped!',
      pressed: 'No reel',
      escaping: 'Lost',
    },
    status: {
      running: 'The fish is running away. Keep A released.',
      resting: 'The fish has stopped to rest. Press A now.',
      reeling: 'Reeling in. Keep holding A.',
      stalled: 'The fish stopped coming closer. Let go of A!',
      pressed: 'A is held, but the fish is not reeling in.',
      escaping: 'The fish is lost for good. Keep reeling to finish.',
    },
    result: {
      caught: (time) => `Caught! You landed it in ${secs(time)}.`,
      escaped: 'It got away. You keep your hook; only the fish is gone.',
      lost: 'The line broke! The hook is lost and you lose 1 to 4 HP.',
      gaveUp: 'You gave up on this fish.',
    },
    ghost: {
      label: 'Ghost: the recommended rhythm on the very same fight',
      caught: (time) => `Ghost: landed it in ${secs(time)}.`,
      escaped: 'Ghost: the fish got away.',
      lost: 'Ghost: the line broke.',
      unfinished: 'Ghost: still going after 100 s.',
      shown: 'Show the ghost',
    },
    hiddenShown: 'Show hidden values',
    hidden: {
      stamina: 'Fish stamina (reel budget)',
      fightValue: 'Strain value (0 to 63)',
      distance: 'Distance from you',
      boundary: 'Rod range line',
      runTimer: 'Run timer',
      restTimer: 'Rest timer',
      frame: 'Frame',
    },
    held: 'A held',
    released: 'A released',
    meter: 'Strain',
    meterFull: 'Line breaks or fish lost at full',
    range: 'Rod range',
    you: 'You',
    sizeLine: (cm) => `This fish is ${cm} cm.`,
    canvas:
      'Side view of the water. The fish swims between you on the left and the rod range line on the right.',
  },
}
