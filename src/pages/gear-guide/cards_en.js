// Item names and prices are {{name:kind:id}} / {{yen:kind:id}} / {{fish:id}} tokens, filled from the catalogue at build time.
export default {
  labels: {
    jump: 'Jump to an item',
    matters: 'Matters',
    verdicts: { big: 'Big', some: 'Some', no: 'No' },
    does: 'What it does.',
    matter: 'Does it matter?',
    choose: 'How to choose',
    avoid: "Don't waste money on",
  },
  groups: [
    {
      id: 'tackle',
      title: 'Tackle',
      cards: [
        {
          id: 'rod',
          title: 'Rod',
          verdict: 'big',
          does: 'Two jobs. <strong>Reach</strong> is how far a fish can run before your line breaks. <strong>Size class</strong> (small, medium, big-fish) moves where the line-strain meter starts.',
          matters:
            'Big when the fish is big. 38 of the 72 fish are fine on any float rod. The rest need a longer one, and 15 of them (the giant eel, Koi, Akame and 12 more) need the longest reach, 24. On a reach-12 rod the giant eel breaks your line in about 85 % of simulated fights, on reach 24 in about 14 %.',
          choose: [
            'Use the kit finder above: it shows the reach your fish needs and the cheapest rod that has it.',
            'Reach 12 covers 47 of the 72 fish. The cheap way to get it is the {{name:rod:9}} ({{yen:rod:9}}, Areas 4 and 5).',
            'A rod made for your fish (the {{name:rod:5}} for Yamame, the {{name:rod:9}} for Herabuna) skips the size penalty.',
            'Size class: small rods are gentle on tiny fish (15 cm or less) and cost mistakes on big ones. The big-fish rods ({{name:rod:8}}, {{name:rod:13}}, {{name:rod:16}}) reach farthest but cost you 1 to 2 mistakes on most fish. Buy one only for a fish that needs reach 24.',
            'Never sold: {{name:rod:2}}, {{name:rod:6}}, {{name:rod:11}}, {{name:rod:17}}. Some rods exist only at special rod merchants (see Shopping notes).',
          ],
          avoid: [
            'The {{name:rod:7}} ({{yen:rod:7}}, reach 9): the {{yen:rod:9}} {{name:rod:9}} reaches 12.',
            'The {{name:rod:21}} ({{yen:rod:21}}): the {{yen:rod:8}} {{name:rod:8}} reaches just as far, and for 14 of the 15 long-reach fish (all but {{fish:7}}) it gives the same room on the meter.',
          ],
        },
        {
          id: 'hook',
          title: 'Hook',
          verdict: 'big',
          does: 'Sets where the line-strain meter starts, just like the rod. It has no say in which fish bite.',
          matters:
            'Big, as strong as the rod. A Yamame is landed every time (100 %) with the right-size hook and only 6 to 14 % of the time with the wrong size.',
          choose: [
            '<strong>Named hook first.</strong> A hook named after the fish always halves the start: {{name:hook:13}} for {{fish:3}}, {{name:hook:12}} for {{fish:1}}, {{name:hook:4}} for {{fish:13}}, {{name:hook:5}} for {{fish:37}}, {{name:hook:2}} for the {{fish:59}}, {{name:hook:11}} for {{fish:57}}.',
            '<strong>No named hook? Pick by fish size.</strong> Up to 15 cm: small hooks ({{name:hook:8}} {{yen:hook:8}}, {{name:hook:7}} {{yen:hook:7}}, {{name:hook:11}} {{yen:hook:11}}). 16 to 35 cm: medium hooks ({{name:hook:9}} {{yen:hook:9}}, {{name:hook:6}} {{yen:hook:6}}, {{name:hook:13}}, {{name:hook:12}}, {{name:hook:5}}, {{name:hook:2}}). Over 35 cm: big hooks ({{name:hook:4}} {{yen:hook:4}}, {{name:hook:3}} {{yen:hook:3}}, {{name:hook:1}} {{yen:hook:1}}).',
            'Cheap all-rounder for mid-size fish: the {{name:hook:9}}, {{yen:hook:9}}, Areas 2 and 3.',
            'The wrong size class pushes the strain meter up instead of down, so check the fish size in the finder.',
          ],
          avoid: [
            'Small hooks ({{name:hook:7}}, {{name:hook:8}}, {{name:hook:11}}) on anything over 15 cm: they are the worst pick for most fish.',
            'The {{name:hook:10}}: it only helps for {{fish:56}}.',
          ],
        },
        {
          id: 'bait',
          title: 'Bait',
          verdict: 'big',
          does: "Decides <em>which fish can bite</em>. Every bait has a list of fish. If yours is on the fish's list and your bobber sits on the exact tile where that fish swims, it bites within a few seconds.",
          matters:
            'Big for catching anything at all. In the fight it only matters for a few baits named for a fish: {{name:bait:3}} ({{fish:7}}), {{name:bait:14}} ({{fish:37}}), {{name:bait:15}} and {{name:bait:17}} ({{fish:13}}), {{name:bait:16}} ({{fish:57}}), {{name:bait:20}} ({{fish:38}}). They give the same bonus as a named hook, but the two do not stack.',
          choose: [
            'Look your fish up in the finder and buy the bait it shows.',
            'Start with {{name:bait:1}} ({{yen:bait:1}}): it is on the list of 44 of the 72 fish. {{name:bait:7}} and {{name:bait:8}} each cover 33, {{name:bait:18}} covers 32.',
            'Fish ignoring you means the wrong tile or a bait that is not on its list. Move the cast, not the bait. The maps show where each fish starts.',
            'Bait and hooks are sold in stacks of 9, and the price is per stack.',
          ],
          avoid: [
            '{{name:bait:9}} ({{yen:bait:9}}): all 9 fish it catches are also on the {{name:bait:18}} list ({{yen:bait:18}}).',
            'A named bait together with a named hook: one of them is enough.',
          ],
        },
        {
          id: 'float',
          title: 'Float and sinker',
          verdict: 'no',
          does: 'Float rods use floats, casting rods use sinkers. That only picks the route: neither one changes the fight (tested against the real game code).',
          matters:
            'No. Every float works the same. A sinker only catches bottom fish and the bite takes about 10 seconds (a float: about 2). Anything a sinker catches, a float catches too.',
          choose: [
            'Buy the cheapest float: {{name:float_weight:2}}, {{yen:float_weight:2}} (Areas 2, 4, 5).',
            'Use a float rod unless you want a casting rod for some other reason. Its cheapest sinker is the {{name:float_weight:10}}, {{yen:float_weight:10}} (Areas 5, 6).',
          ],
          avoid: [
            'Dearer floats and sinkers ({{name:float_weight:1}} {{yen:float_weight:1}}, {{name:float_weight:7}} {{yen:float_weight:7}}, {{name:float_weight:9}} {{yen:float_weight:9}}): same effect as the cheap ones.',
          ],
        },
        {
          id: 'lure',
          title: 'Lure',
          verdict: 'some',
          does: 'A lure rod lets you work a lure through the water. Fish that like your lure swim after it, and you hook one by pressing A once at the right moment.',
          matters:
            'Some. Which fish chase a lure depends on its group: the 81 lures fall into only three, and two lures together cover all 38 lure fish. Lure size class shifts the fight start; most lures are the big-fish class, which costs the fewest mistakes overall.',
          choose: [
            'Buy two lures: {{name:lure:23}} ({{yen:lure:23}}, Areas 2 to 5) or {{name:lure:46}} ({{yen:lure:46}}, Area 1), plus {{name:lure:35}} ({{yen:lure:35}}, Areas 1 and 4). Together they cover all 38 lure fish.',
            'Keep tapping A or B while the lure is in the water. With no button pressed no fish ever comes.',
            'When a fish is level with your lure, press A <em>once</em> (do not hold) to hook it. If you miss it swims off; keep working the lure and it comes back.',
            'Rods: {{name:rod:10}} ({{yen:rod:10}}) or {{name:rod:12}} ({{yen:rod:12}}). For fish that need reach 24 (giant eel, Koi, Akame) take the {{name:rod:13}} ({{yen:rod:13}}, special merchant in Area 4).',
          ],
          avoid: [
            'More than two lures: lures in the same group catch the same fish.',
            'Looking for catch percentages here: lure and fly fights are not simulated, so the finder shows mistakes allowed only.',
          ],
        },
        {
          id: 'fly',
          title: 'Fly',
          verdict: 'big',
          does: 'A fly rod with a fly made of body, wing and tail. The <strong>body</strong> decides which fish take it: wet bodies 33 fish, dry and terrestrial bodies 17 (all of them also wet fish).',
          matters:
            "Big, because of a hidden lock that is rolled once per save. Each body and wing belongs to one of four lock classes. If either class matches the save's hidden pair, the fly never bites. <strong>A fresh save starts with body class 1 and wing class 2, so the {{yen:fly:1}} {{name:fly:1}} NEVER bites.</strong>",
          choose: [
            'On a fresh save buy the {{name:fly:43}} ({{yen:fly:43}}), or for dry-class fish the {{name:fly:62}} ({{yen:fly:62}}). Both are Area 1 ready-made flies. The finder already swaps dead flies for working ones.',
            'Safe plan: carry the three-fly set for ¥30 ({{name:fly:1}} {{yen:fly:1}}, {{name:fly:43}} {{yen:fly:43}}, {{name:fly:2}} {{yen:fly:2}}). Their classes differ, so at least one always works.',
            'If a fish sits still while your fly floats over it, the fly is blocked or the wrong class. Switch fly.',
            'Resting at an inn (once per town visit) re-rolls each side with a one-in-four chance, so about 1 rest in 3 changes the lock. If a fly stops working after a rest, switch fly.',
            'Wing is only the other lock ticket; tail is cosmetic. Body also shifts the fight: Caddis and hopper bodies suit 16 to 35 cm fish, other families help tiny fish and hurt big ones.',
            'Rods: {{name:rod:18}} ({{yen:rod:18}}) or {{name:rod:19}} ({{yen:rod:19}}). The {{name:rod:17}} is never sold and Area 6 sells no fly rod.',
          ],
          avoid: [
            'Custom flies from the maker (in the Area 1 to 3 towns). The same body, wing and tail costs more there than ready-made (the maker adds up all three parts; ready-made costs the body price). Build one only to get a body and wing combination the shop does not sell.',
            'Paying for wings and tails for looks.',
          ],
        },
        {
          id: 'shop',
          title: 'Shopping notes',
          chip: 'Shops',
          verdict: 'some',
          does: 'Small facts that save yen.',
          matters: 'Some. None of this changes a fight, but you can waste a trip.',
          choose: [
            'Special rod merchants: Area 4 sells the {{name:rod:13}} ({{yen:rod:13}}); Area 5 the {{name:rod:8}} ({{yen:rod:8}}) and the {{name:rod:1}} ({{yen:rod:1}}); Area 6 the {{name:rod:16}} ({{yen:rod:16}}). The ordinary shops there do not stock them.',
            'Bait and hooks come in stacks of 9. Buying when you hold 8 still costs the full price (it tops you up to 9).',
            'Never sold anywhere: {{name:rod:2}}, {{name:rod:6}}, {{name:rod:11}}, {{name:rod:17}}, both mushrooms, the tub and the canoe (those two are traded for).',
          ],
          avoid: ['Walking to an ordinary shop for a rod that only a special merchant sells.'],
        },
      ],
    },
    {
      id: 'other',
      title: 'Everything else',
      intro: 'Short notes on the other items. Details are in the item catalogue.',
      cards: [
        {
          id: 'food',
          title: 'Food and HP',
          chip: 'Food & HP',
          verdict: 'some',
          does: 'HP drains when you swim (1 HP every half second), row the tub or canoe (1 HP per tile) and when a fight costs you tackle (1 to 4 HP). At 0 HP you black out and wake up with 1 HP; money, fish and tools stay. With low HP casting and lure rods get less aiming time (half at 50 HP).',
          matters:
            'Some. HP is never read during a fight, so full HP does not help you land a fish.',
          choose: [
            'Free full heal: take the milk bottle (Area 3 town chest) to the Area 3 cow. The cow never runs out.',
            'Max HP starts at 100 and grows, up to about 190, when you catch newts, frogs, crayfish, turtles and crabs.',
            'Shop food heals as many HP as it costs yen (¥5 for 5 HP, up to the {{yen:food:6}} {{name:food:6}} for 40).',
            'Mushrooms are never sold. The tan flat one heals 10 HP. The red one with yellow spots is poison and drops you to 0 HP. The menu gives both the same name, so tell them apart by the icon.',
          ],
          avoid: [
            'Buying food while you have milk.',
            'Eating a fish from the keepnet without checking its name: the menu eats the first fish, and Kusafugu sets HP to 0.',
          ],
        },
        {
          id: 'key',
          title: '{{name:general_tool:23}}',
          verdict: 'some',
          does: 'The {{name:general_tool:23}} ({{yen:general_tool:23}}) opens locked town chests in Areas 1, 2, 4 and 6. Each chest you open uses up one key. Chests in Areas 3 and 5 need none, and a refused open (for example full inventory) keeps the key.',
          matters: 'Some. You only need keys for the chests you want to open.',
          choose: [
            'Buy one key per chest you plan to open (shops in Areas 1, 2, 4, 6) and use it by talking to the chest, not from the item menu.',
            'Chest will not open because your inventory is full: free a slot, leave and come back.',
          ],
          avoid: ['Keys for Area 3 and 5 chests.', 'A second key while you hold an unused one.'],
        },
        {
          id: 'jizo',
          title: 'Jizo offering',
          chip: 'Jizo',
          verdict: 'some',
          does: 'Offer food to the Jizo in Area 5. The offering value (up to 255) is <strong>required</strong> for the lottery: a ticket can only win if a random number is below it. The same value roughly halves the chance of losing your hook, lure or fly after a catch (hook or lure 6 % to 4 %, fly 12.5 % to 7 % at the maximum).',
          matters:
            'Some. Without an offering the {{name:general_tool:17}} ({{yen:general_tool:17}}) cannot win.',
          choose: [
            'Offer bigger food ({{name:food:6}} or {{name:food:7}}) rather than {{name:food:1}}: it adds more to the value. Then draw at the counter next to the Jizo.',
          ],
          avoid: [
            'Drawing without an offering.',
            'Forgetting that the two big prizes (1,000 and 5,000 yen) reset the value to 0.',
          ],
        },
        {
          id: 'keepnet',
          title: 'Keepnet',
          verdict: 'some',
          does: 'Holds the fish you keep. A new game starts with room for 5. When it is full, fishing is blocked until you sell or eat a fish.',
          matters: 'Some. Only if you fish a long time without going back to town.',
          choose: [
            'Buy only the size you need, and you may skip sizes: 10 fish {{yen:general_tool:11}} (Areas 1, 2), 20 fish {{yen:general_tool:12}} (Areas 3, 4), 30 fish {{yen:general_tool:13}} (Areas 5, 6). The shop refuses equal or smaller sizes.',
          ],
          avoid: [
            'Buying 10, then 20, then 30: every price is the full price, not an upgrade fee.',
          ],
        },
        {
          id: 'boat',
          title: 'Tub and canoe',
          chip: 'Tub & canoe',
          verdict: 'some',
          does: 'Boats that let you cross water without swimming. Rowing still costs 1 HP per tile, but the canoe covers about 40 % more ground per move than the tub (14 steps against 10).',
          matters: 'Some. Optional, and neither is sold: both are trades.',
          choose: [
            'Tub: give a {{fish:34}} to the tub maker in Area 2 (one time, keep one tool slot free).',
            'Canoe: give fresh milk to the canoe maker in Area 3. The maker refuses if you already own a canoe.',
          ],
          avoid: ['Drinking the fresh milk if you want the canoe.'],
        },
        {
          id: 'compass',
          title: '{{name:general_tool:14}}',
          verdict: 'some',
          does: 'The {{name:general_tool:14}} ({{yen:general_tool:14}}) shows which way the area exit is. In Area 6, once the story allows it, it points to the giant eel.',
          matters: 'Some. Mostly for the giant eel hunt.',
          choose: [
            'Buy it if you want the game to point to the Area 6 giant eel spot.',
            'The Area 1 to 5 exits are listed on the maps of this site.',
          ],
          avoid: ['Buying it just to learn exit coordinates in Areas 1 to 5.'],
        },
        {
          id: 'net',
          title: '{{name:general_tool:4}}',
          verdict: 'no',
          does: "The {{name:general_tool:4}} ({{yen:general_tool:4}}) catches 1 to 4 pieces of the area's bait on a shallow-water tile you wade into. A tile gives bait once.",
          matters: 'No. Bait costs ¥5 to ¥40 a stack.',
          choose: ['Buy it only if you run out of bait far from a shop.'],
          avoid: ['Buying it to save money: ¥150 buys 30 stacks of worms.'],
        },
      ],
    },
  ],
}
