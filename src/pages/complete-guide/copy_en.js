// Complete fishing guide: English text. Plain words; every claim carries a trust level in render.js.
export default {
  lang: 'en',
  basics: {
    title: 'How fishing difficulty works',
    lines: [
      'Every fight starts at a difficulty from 0 (easiest) to 6 (hardest). One step easier gives you one more mistake before the fish gets away.',
      'The rod sets the first step. A light rod makes small fish easier. A heavy rod never makes the start easier. A rod named for the fish only skips the rod-size penalty.',
      'The hook, lure or fly body adds one step by its size against the fish (up to 15 cm, 16–35 cm, over 35 cm). A hook, bait or lure named for the fish makes it one step easier (they do not add up).',
      'Floats and sinkers never change the difficulty. They only decide which fish bite (the sinker route takes only 30 of the 72 fish).',
      'Rod +2 is how far you can cast (casting and lure rods cast shorter when your HP (stamina) is under 100). Rod +3 × 336 is the range line: how long you can leave a running fish before the line snaps and you lose the tackle. Neither makes a fish easier to land.',
    ],
  },
  bigFish: {
    title: 'Big fish: timing is the meta, not the method',
    lines: [
      'With good timing, bait, casting and lure all land big fish (over 35 cm) about 99 % of the time, and equally fast.',
      'With sloppy input (holding A, steady tapping, reacting late) every method lands 0 %.',
      'Bait is the easy choice because it has no take step. Cast far or use a lure only because you like to.',
    ],
  },
  methodsTitle: 'The five methods',
  good: 'Good at',
  weak: 'Weak at',
  must: 'Must know',
  methods: {
    float: {
      name: 'Float + bait',
      good: 'Catches all 72 fish. Cheapest and simplest start; any bait the fish takes will do.',
      weak: 'Float rods cast the shortest.',
      must: [
        'The float does not change the fight; buy the cheapest.',
        'Choose the hook by fish size: small hooks for up to 15 cm, medium for 16–35 cm, large for over 35 cm.',
        'A hook or bait named for the fish is one step easier.',
      ],
    },
    sinker: {
      name: 'Sinker + bait',
      good: 'Needs a casting rod, so you cast far. Same fight as a float.',
      weak: 'Only 30 of the 72 fish bite on the sinker route.',
      must: [
        'Check the fish takes sinker bait before you buy.',
        'The sinker does not change the fight; buy the cheapest.',
        'Casting rods take sinkers only; they cannot use floats.',
      ],
    },
    casting: {
      name: 'Casting rod',
      good: 'The longest cast. Lands big fish as often as bait with good timing.',
      weak: 'Sold late, and the heavy casting rod costs ¥1,500.',
      must: [
        'It uses the sinker kit: same bite list (30 fish).',
        'Rod +2 is the cast distance; below 100 HP (stamina) you cast shorter.',
        'A heavy rod never makes the start easier.',
      ],
    },
    lure: {
      name: 'Lure',
      good: 'Catches 38 fish and needs no bait.',
      weak: 'Surface lures never took a big fish.',
      must: [
        'For fish over 35 cm use a SINKING type: spinner, spoon, sinking vibration, jig, soft claw, spinnerbait.',
        'Topwater, shallow runner, deep diver and soft frog never took a big fish (0 of 240).',
        'Press A FRESH inside the bite window. Holding A never takes a fish.',
      ],
    },
    fly: {
      name: 'Fly',
      good: 'Catches 33 fish. Small flies are cheap.',
      weak: 'Worst start for fish over 35 cm.',
      must: [
        'Fly bodies have no big-fish size setting: 47 bodies make a big fish one step harder, 17 change nothing.',
        'Wings and tails do not change the fight.',
        'Fly rods are sold only in some stages.',
      ],
    },
  },
  trust: { rom: 'rom', start: 'rom', big: 'tested', lure: 'tested', untested: 'unconfirmed' },
  stage: {
    head: (n, map) => `Stage ${n} · ${map}`,
    fishHead: 'Fish in this stage',
    colFish: 'Fish',
    colSize: 'Real size (cm)',
    colMax: 'Size MAX',
    slow: 'Takes long to raise',
    slowNote: (picks, nights) =>
      `MAX needs ${picks[0]}–${picks[1]} inn nights that pick its cell; at about 30 fights between nights that is roughly ${nights[0]}–${nights[1]} nights.`,
    maxLine: (cm) => `${cm} cm`,
    akame:
      'Akame: 150 cm only for character 1 before the quest fish is landed. Everyone else gets 60–119 cm.',
    eel: 'Giant eel: one per game, in the eel story only. It does not grow and loses 2 cm after each lost fight. MAX 220 cm.',
    growNote:
      'No map caps the size. A fish grows 1 cm for every inn night on its own map. A new fish starts at half its smallest size.',
    whichHead: 'If you like… which method for which fish',
    whichLead:
      'Start difficulty for the real sizes (0 easiest, 6 hardest), with the rod and hook that give the easiest start among those sold in this stage. The lowest number in a row is marked.',
    cols: { cls: 'Weight', price: 'Price', verdict: 'Verdict', why: 'Why' },
    perFishHead: 'For each fish with this method: the rod, hook and bait to use',
    colStart: 'Start (0 easiest)',
    colEasy: 'Easiest',
    none: '—',
    switchHead: 'When to switch method',
    switches: {
      big: 'Fish over 35 cm: keep bait or casting; a lure works only with a sinking type and a fresh A press.',
      fly: 'Fly starts hardest for big fish. Switch to bait or a lure for fish over 35 cm.',
      unreach:
        'A "—" means no tackle sold in this stage takes that fish with that method. Switch method or go to a later stage.',
    },
    methodHead: (name) => name,
    unavailable: {
      rod: (name, first) =>
        `This stage's shops sell no ${name} rod.${first ? ` First sold in stage ${first}.` : ''}`,
      weight: (name, first) =>
        `This stage's shops sell no ${name} weight.${first ? ` First sold in stage ${first}.` : ''}`,
      item: (name) => `This stage's shops sell nothing a fish here takes with ${name}.`,
    },
    kitHead: 'The one easiest kit',
    kitCriterion: (covered, total, mean) =>
      `Chosen for: the most fish of this stage (${covered} of ${total}), then the easiest average start (${mean}), then the lowest price.`,
    budgetHead: 'Cheaper kit, almost as easy',
    kitParts: {
      rod: 'Rod',
      hook: 'Hook',
      bait: 'Bait',
      lure: 'Lure',
      fly: 'Fly body',
      weight: 'Float or sinker',
    },
    weightNote: 'any one, the cheapest',
    total: (yen) => `Total ¥${yen.toLocaleString('en-US')}`,
    shopsHead: 'What the shops sell: buy or skip',
    buy: 'Buy',
    skip: 'Skip',
    maybe: 'Optional',
    reasons: {
      kit: 'part of the easiest kit',
      rodLight: 'light rod: easier start for small fish',
      rodMedium: 'medium rod: no change for medium fish, harder for small and big',
      rodHeavy:
        'heavy rod: never makes the start easier (it casts farther or leaves a running fish longer)',
      rodNamed: (fish) => `named for ${fish}: skips the rod-size penalty`,
      hookSize: [
        'small hook: easier for fish up to 15 cm',
        'medium hook: easier for 16–35 cm',
        'large hook: easier for fish over 35 cm',
      ],
      hookNamed: (fish) => `named for ${fish}: one step easier`,
      baitCovers: (n, total) => `fish here that take it: ${n} of ${total}`,
      baitNamed: (fish) => `named for ${fish}: one step easier`,
      weight: 'no effect on the fight; the cheapest is enough',
      lureSinking: 'sinking type: big fish take it',
      lureSurface: 'surface type: big fish never took it (fine for small fish)',
      lureUntested: 'type not tested on big fish',
      lureNamed: (fish) => `named for ${fish}: one step easier`,
      flyBody: 'fly body: its size setting decides the step',
    },
    upgradesHead: 'Upgrades that matter, and those that do not',
    matter: 'Matter',
    dontMatter: 'Do not matter',
    matters: {
      float: [
        'A rod of the right weight for the fish size',
        'A hook of the right size, or one named for the fish',
        'A bait the fish takes',
      ],
      sinker: [
        'A rod of the right weight for the fish size',
        'A hook of the right size, or one named for the fish',
        'A bait that takes on the sinker route',
      ],
      casting: [
        'A rod of the right weight for the fish size',
        'Rod +2 only if you want a longer cast',
        'Keep HP (stamina) at 100 for the full cast',
      ],
      lure: [
        'A lure of the right size, or one named for the fish',
        'A sinking type for big fish',
        'A light lure rod for small fish',
      ],
      fly: ['A fly body of the right size setting', 'A light fly rod for small fish'],
    },
    dont: {
      float: [
        'The float',
        'Longer or heavier rods for an easier start',
        'Which ordinary bait, once the fish takes it',
      ],
      sinker: ['The sinker', 'Heavier rods for an easier start'],
      casting: [
        'A heavier rod for an easier start',
        'Rod +3 for an easier fight (it only lengthens the range line)',
      ],
      lure: ['Heavier lure rods for an easier start', 'Colour or price of the lure'],
      fly: ['Wing and tail', 'A heavier fly rod for an easier start'],
    },
  },
  how: {
    title: 'How we know',
    lines: [
      'Start difficulty comes from the ROM and was rebuilt by ROM tests for every rod, hook, bait, float, lure and fly body against every fish.',
      'The big-fish result comes from 8,640 real fights played headless on the ROM.',
      'Max size comes from the inn growth code in the ROM and tests that grow every map night after night.',
      'Which lure types big fish take was tested for six lure types that sink and four that do not; other lure types are marked not confirmed.',
    ],
    links: 'Read the proofs',
  },
  levels: {
    rom: 'Confirmed from the ROM',
    tested: 'Confirmed by test',
    unconfirmed: 'Not confirmed',
  },
  fishLink: 'Open fish page',
  classes: ['light', 'medium', 'heavy'],
  stageNav: 'Jump to stage',
  methodNames: {
    float: 'Float + bait',
    sinker: 'Sinker + bait',
    casting: 'Casting rod',
    lure: 'Lure',
    fly: 'Fly',
  },
}
