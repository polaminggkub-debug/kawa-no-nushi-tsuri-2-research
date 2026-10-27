export const copy_en = {
  title: 'Gear for this fish',
  size: (low, high) => `Real size ${low === high ? low : `${low}–${high}`} cm`,
  maxSize: (high) => `MAX size ${high} cm`,
  maxSlow: 'Takes long to raise',
  maxSlowNote: (picks, nights) =>
    `MAX needs ${picks[0]}–${picks[1]} inn nights that pick its cell; at about 30 fights between nights that is roughly ${nights[0]}–${nights[1]} nights.`,
  maxAkame:
    'MAX size 150 cm only for character 1 before the quest fish is landed. Everyone else gets 60–119 cm.',
  maxEel:
    'MAX size 220 cm, one eel per game, in the eel story only. It does not grow and loses 2 cm after each lost fight.',
  methods: { float: 'Float rod + bait', lure: 'Lure rod + lure', fly: 'Fly rod + fly' },
  slots: { rod: 'Rod', hook: 'Hook', bait: 'Bait', lure: 'Lure', fly: 'Fly body', float: 'Float' },
  anyFloat: (name) => `Any float works (cheapest: ${name})`,
  best: 'Easiest-start kit',
  cheap: 'Cheapest kit that still works well',
  total: (price) => `Total ${price}`,
  level: ['Easiest', 'Easy', 'Easy', 'Medium', 'Hard', 'Very hard', 'Very hard'],
  bands: ['Small fish (up to 15 cm)', 'Medium fish (16–35 cm)', 'Big fish (over 35 cm)'],
  bandShort: ['Small', 'Medium', 'Big'],
  fightEase: 'How easy the fight starts',
  why: {
    rod: {
      named: 'The rod named for this fish: it skips the fish-size penalty',
      light: 'Light rod: easiest on small fish, and ties with a medium rod on medium fish',
      medium: 'Medium rod: as easy as a light rod for fish this size',
      heavy: 'Heavy rod: does not make the fight easier, but gives the long reach big fish need',
    },
    hook: {
      named: 'The hook named for this fish: one step easier',
      any: 'Any hook will do, because the bait is already named for this fish (take the cheapest)',
      small: 'Small hook, right for fish up to 15 cm',
      medium: 'Medium hook, right for fish 16–35 cm',
      large: 'Big hook, right for fish over 35 cm',
      plain: 'This hook does not change the fight',
    },
    bait: {
      named: 'The bait named for this fish: one step easier',
      plain: 'The fish takes this bait; take the cheapest one it takes',
    },
    lure: {
      named: 'The lure named for this fish: one step easier',
      small: 'This lure type helps small fish (up to 15 cm)',
      medium: 'This lure type helps fish 16–35 cm',
      large: 'This lure type helps fish over 35 cm',
      plain: 'This lure does not change the fight',
    },
    fly: {
      small: 'This fly body helps small fish (up to 15 cm)',
      medium: 'This fly body helps fish 16–35 cm',
      large: 'This fly body helps fish over 35 cm',
      plain: 'This fly body does not change the fight; it only decides whether the fish bites',
    },
  },
  alsoOk: 'Also fine (equally easy)',
  detailsTitle: 'Why this kit (ROM evidence)',
  startsLine: (base) =>
    `This fish starts at level ${base} before any gear (0 easiest to 6 hardest)`,
  startsWith: (band, n) => `${band}: level ${n} with this kit`,
  reach: (need) =>
    `Rod reach needed: about ${need} or more. This is only an estimate from the wiki’s own simulation, not proven in the ROM`,
  evidence:
    'Every rule has a ROM address and a test that runs the real game. The full table and rules:',
  evidenceLink: 'gear-fish-matrix.md',
  noBite: 'This fish does not take this method',
  yen: (n) => `¥${n.toLocaleString('en-US')}`,
  loading: 'Loading the gear…',
  failed: 'Could not load the gear',
}
