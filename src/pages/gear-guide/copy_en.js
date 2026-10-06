const areaWord = (list) => (list.length === 1 ? `Area ${list[0]}` : `Areas ${list.join(', ')}`)

export default {
  loading: 'Loading the kit data…',
  failed: 'Could not load the kit data.',
  retry: 'Try again',
  sizeLine: (low, high) => (low === high ? `Size ${low} cm.` : `Size ${low} to ${high} cm.`),
  reachLine: (need) => `Needs a rod with reach ${need} or more.`,
  methods: {
    float: 'Float rod + bait',
    casting: 'Casting rod + sinker',
    lure: 'Lure rod + lure',
    fly: 'Fly rod + fly',
  },
  hints: {
    casting:
      'Bottom fish only, and the bite takes about 10 seconds. The float kit catches this fish too.',
    lure: 'Keep tapping A or B; press A once when the fish is level with the lure.',
    fly: 'On a fresh save some flies never bite (see the fly card). This kit already avoids them.',
  },
  slots: {
    rod: 'Rod',
    hook: 'Hook',
    bait: 'Bait',
    lure: 'Lure',
    fly: 'Fly',
  },
  roles: { buy: 'Best kit you can buy', enough: 'Cheaper, almost as good (within 3 points)' },
  total: (price) => `Kit total ${price}`,
  from: (price) => `from ${price}`,
  extra: (name, price) => `Also needed, any will do: ${name} (${price})`,
  where: {
    all: 'every area',
    areas: areaWord,
    special: (list) => `special rod merchant, ${areaWord(list)}`,
    readyMade: 'ready-made fly',
  },
  mistakes: (low, high) =>
    `Mistakes allowed: ${low === high ? low : `${low} to ${high}`} (of 6, more is easier)`,
  caught: (pct, n) => `Landed in ${pct} of ${n} simulated fights`,
  running: (pct) => `${pct} were still going after 100 seconds (slow, not lost)`,
  lost: (pct) => `${pct} lost the tackle`,
  notSimulated: 'Landing odds are not simulated for lures and flies.',
  neverSold: (names) =>
    `The roomiest rod for this fish (${names}) is never sold. This is the best you can buy.`,
  flySwapped: (from, to) =>
    `The cheapest fly for this fish (${from}) never bites on a fresh save, so this kit uses ${to}.`,
  simLink: 'Try this kit in the fight simulator',
  fishLink: 'Where to find this fish',
}
