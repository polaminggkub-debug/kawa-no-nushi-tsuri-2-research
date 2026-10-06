(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/pages/fight-sim/index.js
  var fight_sim_exports = {};
  __export(fight_sim_exports, {
    initialize: () => initialize
  });

  // src/pages/fight-sim/copy_en.js
  var secs = (value) => `${value} s`;
  var copy_en_default = {
    loading: "Loading the fight data…",
    failed: "Could not load the fight data.",
    retry: "Try again",
    back: "← Choose equipment",
    fishOption: (name) => name,
    compare: {
      caption: "Share of simulated fights landed",
      hold: "Hold A the whole time",
      mash: "Mash A (about 10 presses a second)",
      rhythm: "Press when it rests, let go when it stops pulling",
      tackle: (fish, rod, hook) => `${fish}: ${rod}, ${hook}.`
    },
    methods: { float: "Float rod (bait)", casting: "Casting rod" },
    rodGroups: { float: "Float rods", casting: "Casting rods" },
    noBait: "No bait",
    setupLine: (fish, rod, hook, bait) => `${fish} · ${rod} · ${hook}${bait ? ` · ${bait}` : ""}`,
    sizeLine: (low, high) => low === high ? `Size ${low} cm.` : `Size ${low} to ${high} cm.`,
    startMeter: (steps2) => steps2 === 0 ? "The line-strain meter starts empty." : `The line-strain meter starts ${steps2} of 6 steps full.`,
    finder: {
      best: "Best way to press A for this setup",
      landed: (pct, n) => `Landed ${pct} of ${n} random fights`,
      average: (time) => `Average ${secs(time)} when landed.`,
      outcomes: {
        escaped: "Got away",
        lost: "Line broke (hook lost, 1 to 4 HP)",
        unfinished: "Still going after 100 s"
      },
      baselines: "How other ways of pressing A do",
      base: {
        hold: "Hold A the whole time",
        mash: "Mash A (about 10 presses a second)",
        plain: "The rhythm above",
        reference: "The same rhythm if you could see the hidden stamina"
      },
      referenceNote: "Not possible in the real game; shown to see what the hidden value is worth.",
      column: { caught: "Landed", escaped: "Got away", lost: "Line broke", unfinished: "Unfinished" },
      trick: "Advanced: tap A while the fish sprints",
      trickNote: "Needs sharp eyes: it only works while the fish is running at full speed. Landings go up, but more fish get away.",
      ceiling: "With frame-perfect timing",
      ceilingNote: "What the same idea could reach with no reaction time at all. Not realistic by hand.",
      noGain: "Perfect timing would not change much here.",
      reaction: (frames, time) => `These figures assume a reaction time of ${frames} frames (about ${time} s).`,
      sample: (n) => `Random starts: ${n} different fights (hidden random numbers, timing, cast distance and fish size). The percentages are for those simulated fights, not a promise.`,
      notComputed: "This exact tackle was not worked out in advance. Press the button to run the finder here (a few seconds, up to about ten for the hardest fish).",
      run: "Run the finder",
      running: "Working it out…",
      liveFailed: "The finder could not run in this browser."
    },
    policy: {
      rest: (wait) => wait === 0 ? "When the fish stops and rests, press A at once." : `When the fish has rested for about ${secs(wait)}, press A.`,
      hold: "Keep holding A while the fish comes closer.",
      release: (stop2, slow, time) => {
        const when = stop2 <= 3 ? "the moment it stops coming closer" : `once it has stopped coming closer for ${secs(time)}`;
        return slow ? `Let go ${when}, or as soon as it slows to a crawl.` : `Let go ${when}.`;
      },
      cap: (cap) => `Never hold longer than ${secs(cap)} in a row; let go and wait for the next rest.`,
      first: (first) => `If the fish does not start coming closer within ${secs(first)}, let go and wait.`,
      run: "While the fish runs away, keep your thumb off A.",
      taps: (every) => `While it runs at full speed, tap A (press and let go) about every ${secs(every)}. As soon as it slows down, stop tapping and let it run.`
    },
    play: {
      start: "Start a fight",
      again: "New fight",
      retry: "Same fight again",
      giveUp: "Give up",
      waiting: 'Press "Start a fight". The fish is already running when the fight begins.',
      short: {
        running: "Running",
        resting: "Resting",
        reeling: "Reeling in",
        stalled: "Stopped!",
        pressed: "No reel",
        escaping: "Lost"
      },
      status: {
        running: "The fish is running away. Keep A released.",
        resting: "The fish has stopped to rest. Press A now.",
        reeling: "Reeling in. Keep holding A.",
        stalled: "The fish stopped coming closer. Let go of A!",
        pressed: "A is held, but the fish is not reeling in.",
        escaping: "The fish is lost for good. Keep reeling to finish."
      },
      result: {
        caught: (time) => `Caught! You landed it in ${secs(time)}.`,
        escaped: "It got away. You keep your hook; only the fish is gone.",
        lost: "The line broke! The hook is lost and you lose 1 to 4 HP.",
        gaveUp: "You gave up on this fish."
      },
      ghost: {
        label: "Ghost: the recommended rhythm on the very same fight",
        caught: (time) => `Ghost: landed it in ${secs(time)}.`,
        escaped: "Ghost: the fish got away.",
        lost: "Ghost: the line broke.",
        unfinished: "Ghost: still going after 100 s.",
        shown: "Show the ghost"
      },
      hiddenShown: "Show hidden values",
      hidden: {
        stamina: "Fish stamina (reel budget)",
        fightValue: "Strain value (0 to 63)",
        distance: "Distance from you",
        boundary: "Rod range line",
        runTimer: "Run timer",
        restTimer: "Rest timer",
        frame: "Frame"
      },
      held: "A held",
      released: "A released",
      meter: "Strain",
      meterFull: "Line breaks or fish lost at full",
      range: "Rod range",
      you: "You",
      sizeLine: (cm) => `This fish is ${cm} cm.`,
      canvas: "Side view of the water. The fish swims between you on the left and the rod range line on the right."
    }
  };

  // src/pages/fight-sim/copy_th.js
  var secs2 = (value) => `${value} วินาที`;
  var copy_th_default = {
    loading: "กำลังโหลดข้อมูลการสู้ปลา…",
    failed: "โหลดข้อมูลการสู้ปลาไม่สำเร็จ",
    retry: "ลองอีกครั้ง",
    back: "← เลือกอุปกรณ์",
    compare: {
      caption: "สัดส่วนที่ตกได้ในการจำลองการสู้ปลา",
      hold: "กด A ค้างตลอด",
      mash: "กด A รัว ๆ (ประมาณ 10 ครั้งต่อวินาที)",
      rhythm: "กดตอนปลาพัก ปล่อยตอนปลาหยุดเข้าหา",
      tackle: (fish, rod, hook) => `${fish}: ${rod}, ${hook}`
    },
    methods: { float: "คันทุ่น (ใช้เหยื่อ)", casting: "คันหวด" },
    rodGroups: { float: "คันทุ่น", casting: "คันหวด" },
    noBait: "ไม่ใช้เหยื่อ",
    setupLine: (fish, rod, hook, bait) => `${fish} · ${rod} · ${hook}${bait ? ` · ${bait}` : ""}`,
    sizeLine: (low, high) => low === high ? `ปลาขนาด ${low} ซม.` : `ปลาขนาด ${low}–${high} ซม.`,
    startMeter: (steps2) => steps2 === 0 ? "มาตรวัดแรงตึงของสายเริ่มที่ว่างเปล่า" : `มาตรวัดแรงตึงของสายเริ่มที่ ${steps2} จาก 6 ขั้น`,
    finder: {
      best: "วิธีกด A ที่ดีที่สุดสำหรับชุดนี้",
      landed: (pct, n) => `ตกได้ ${pct} จากการสู้ปลาสุ่ม ${n} ครั้ง`,
      average: (time) => `เฉลี่ย ${secs2(time)} ต่อตัวที่ตกได้`,
      outcomes: {
        escaped: "ปลาหลุด",
        lost: "สายขาด (เบ็ดหาย เสีย HP 1–4)",
        unfinished: "ยังสู้กันอยู่หลังผ่านไป 100 วินาที"
      },
      baselines: "เทียบกับวิธีกดแบบอื่น",
      base: {
        hold: "กด A ค้างตลอด",
        mash: "กด A รัว ๆ (ประมาณ 10 ครั้งต่อวินาที)",
        plain: "จังหวะกดด้านบน",
        reference: "จังหวะเดียวกัน ถ้ามองเห็นแรงของปลาที่ซ่อนอยู่"
      },
      referenceNote: "ในเกมจริงทำไม่ได้ แสดงไว้ให้เห็นว่าค่าที่ซ่อนอยู่มีผลแค่ไหน",
      column: { caught: "ตกได้", escaped: "ปลาหลุด", lost: "สายขาด", unfinished: "ยังไม่จบ" },
      trick: "ขั้นสูง: แตะ A ตอนปลาวิ่งสุดแรง",
      trickNote: "ต้องสังเกตให้แม่น เพราะได้ผลเฉพาะตอนปลาวิ่งเต็มฝีเท้า ตกได้มากขึ้น แต่ปลาหลุดบ่อยขึ้นด้วย",
      ceiling: "ถ้ากดตรงเฟรมเป๊ะ",
      ceilingNote: "แนวคิดเดียวกันจะไปได้ไกลแค่ไหนถ้าไม่มีเวลาตอบสนองเลย ใช้มือจริงทำได้ยาก",
      noGain: "ถ้ากดเป๊ะกว่านี้ก็ไม่ต่างมากนัก",
      reaction: (frames, time) => `ตัวเลขนี้สมมติว่าตอบสนองช้า ${frames} เฟรม (ประมาณ ${time} วินาที)`,
      sample: (n) => `จำลองการสู้ปลาที่เริ่มต่างกัน ${n} ครั้ง (เลขสุ่มที่ซ่อนอยู่ จังหวะเวลา ระยะโยน และขนาดปลา) เปอร์เซ็นต์นี้เป็นของการจำลอง ไม่ใช่คำรับประกัน`,
      notComputed: "ชุดอุปกรณ์นี้ยังไม่ได้คำนวณไว้ล่วงหน้า กดปุ่มเพื่อให้หน้านี้คำนวณเอง (ไม่กี่วินาที ปลาที่ยากสุดอาจนานถึงราว 10 วินาที)",
      run: "เริ่มคำนวณ",
      running: "กำลังคำนวณ…",
      liveFailed: "เบราว์เซอร์นี้คำนวณไม่ได้"
    },
    policy: {
      rest: (wait) => wait === 0 ? "พอปลาหยุดพัก ให้กด A ทันที" : `พอปลาหยุดพักมาประมาณ ${secs2(wait)} ให้กด A`,
      hold: "กด A ค้างไว้ตราบที่ปลายังถูกดึงเข้ามา",
      release: (stop2, slow, time) => {
        const when = stop2 <= 3 ? "ทันทีที่ปลาหยุดเข้าหา" : `เมื่อปลาหยุดเข้าหามาแล้วประมาณ ${secs2(time)}`;
        return slow ? `ปล่อยปุ่ม ${when} หรือทันทีที่ปลาช้าลงจนแทบคลาน` : `ปล่อยปุ่ม ${when}`;
      },
      cap: (cap) => `อย่ากดค้างเกิน ${secs2(cap)} รวดเดียว ปล่อยแล้วรอปลาหยุดพักรอบถัดไป`,
      first: (first) => `ถ้าปลาไม่เริ่มเข้าหาภายใน ${secs2(first)} ให้ปล่อยปุ่มแล้วรอ`,
      run: "ตอนปลาวิ่งหนี อย่าแตะปุ่ม A",
      taps: (every) => `ตอนปลาวิ่งเต็มฝีเท้า ให้แตะ A (กดแล้วปล่อยทันที) ประมาณทุก ${secs2(every)} พอปลาช้าลงให้หยุดแตะแล้วปล่อยให้วิ่งไป`
    },
    play: {
      start: "เริ่มสู้ปลา",
      again: "สู้ตัวใหม่",
      retry: "สู้ตัวเดิมอีกครั้ง",
      giveUp: "ยอมแพ้",
      waiting: 'กด "เริ่มสู้ปลา" ตอนเริ่ม ปลากำลังวิ่งหนีอยู่แล้ว',
      short: {
        running: "ปลาวิ่งหนี",
        resting: "ปลาพัก",
        reeling: "กำลังดึงเข้า",
        stalled: "หยุดแล้ว!",
        pressed: "ไม่ได้ดึง",
        escaping: "หลุดแล้ว"
      },
      status: {
        running: "ปลาวิ่งหนี ปล่อยปุ่ม A ไว้",
        resting: "ปลาหยุดพักแล้ว กด A เลย",
        reeling: "กำลังดึงปลาเข้ามา กด A ค้างไว้",
        stalled: "ปลาหยุดเข้าหาแล้ว ปล่อยปุ่ม A!",
        pressed: "กด A ค้างอยู่ แต่ปลาไม่ได้เข้ามา",
        escaping: "ปลาหลุดแน่แล้ว ดึงต่อจนจบ"
      },
      result: {
        caught: (time) => `ตกได้แล้ว! ใช้เวลา ${secs2(time)}`,
        escaped: "ปลาหลุด เบ็ดยังอยู่ เสียแค่ปลาตัวนี้",
        lost: "สายขาด! เบ็ดหายและเสีย HP 1–4",
        gaveUp: "ยอมแพ้ปลาตัวนี้"
      },
      ghost: {
        label: "เงาจำลอง: จังหวะที่แนะนำ สู้ปลาตัวเดียวกันเป๊ะ",
        caught: (time) => `เงาจำลอง: ตกได้ใน ${secs2(time)}`,
        escaped: "เงาจำลอง: ปลาหลุด",
        lost: "เงาจำลอง: สายขาด",
        unfinished: "เงาจำลอง: ยังสู้อยู่หลังผ่านไป 100 วินาที",
        shown: "แสดงเงาจำลอง"
      },
      hiddenShown: "แสดงค่าที่ซ่อนอยู่",
      hidden: {
        stamina: "แรงของปลา (stamina)",
        fightValue: "ค่าแรงตึง (0–63)",
        distance: "ระยะจากตัวเรา",
        boundary: "ขีดสุดของคัน",
        runTimer: "ตัวนับเวลาวิ่ง",
        restTimer: "ตัวนับเวลาพัก",
        frame: "เฟรม"
      },
      held: "กด A อยู่",
      released: "ปล่อย A แล้ว",
      meter: "แรงตึง",
      meterFull: "เต็มเมื่อไรปลาหลุดหรือสายขาด",
      range: "ขีดสุดของคัน",
      you: "เรา",
      sizeLine: (cm) => `ปลาตัวนี้ยาว ${cm} ซม.`,
      canvas: "ภาพข้างของน้ำ ปลาว่ายอยู่ระหว่างเราทางซ้ายกับขีดสุดของคันทางขวา"
    }
  };

  // src/pages/fight-sim/copy_ja.js
  var secs3 = (value) => `${value}秒`;
  var copy_ja_default = {
    loading: "ファイトのデータを読み込み中…",
    failed: "読み込めませんでした。",
    retry: "再試行",
    back: "← 装備を選ぶ",
    compare: {
      caption: "シミュレーションで釣り上げた割合",
      hold: "Aを押しっぱなし",
      mash: "Aを連打（1秒に約10回）",
      rhythm: "休んだら押し、近づかなくなったら離す",
      tackle: (fish, rod, hook) => `${fish}：${rod}、${hook}。`
    },
    methods: { float: "ウキ竿（エサ）", casting: "投げ竿" },
    rodGroups: { float: "ウキ竿", casting: "投げ竿" },
    noBait: "エサなし",
    setupLine: (fish, rod, hook, bait) => `${fish}・${rod}・${hook}${bait ? `・${bait}` : ""}`,
    sizeLine: (low, high) => low === high ? `大きさ ${low}cm。` : `大きさ ${low}〜${high}cm。`,
    startMeter: (steps2) => steps2 === 0 ? "ラインの負荷メーターは空から始まります。" : `ラインの負荷メーターは6段階中${steps2}段から始まります。`,
    finder: {
      best: "このセットで一番よいAの押し方",
      landed: (pct, n) => `ランダムな${n}回のファイトのうち${pct}で釣り上げ`,
      average: (time) => `釣り上げたときの平均は${secs3(time)}。`,
      outcomes: {
        escaped: "逃げられた",
        lost: "ライン切れ（ハリを失う・HP1〜4減）",
        unfinished: "100秒たっても決着せず"
      },
      baselines: "他の押し方との比較",
      base: {
        hold: "Aを押しっぱなし",
        mash: "Aを連打（1秒に約10回）",
        plain: "上のリズム",
        reference: "隠れたスタミナが見えるとした同じリズム"
      },
      referenceNote: "実際のゲームでは不可能です。隠れた値にどれだけ価値があるかを示すための参考です。",
      column: {
        caught: "釣り上げ",
        escaped: "逃げられた",
        lost: "ライン切れ",
        unfinished: "決着せず"
      },
      trick: "上級：魚が全力で走る間にAを小刻みに押す",
      trickNote: "魚が全速力で走っているときだけ効くため、よく見る必要があります。釣り上げは増えますが、逃げられることも増えます。",
      ceiling: "フレーム単位で完璧に押せた場合",
      ceilingNote: "反応の遅れがゼロなら、同じ考え方でどこまで届くか。手で再現するのは現実的ではありません。",
      noGain: "完璧に押しても大きな差はありません。",
      reaction: (frames, time) => `この数字は反応に${frames}フレーム（約${time}秒）かかる前提です。`,
      sample: (n) => `開始条件の違う${n}回のファイトで計算しました（見えない乱数、タイミング、投げた距離、魚の大きさ）。割合はシミュレーション上のもので、保証ではありません。`,
      notComputed: "このセットは事前に計算していません。ボタンを押すとこのページで計算します（数秒、最も難しい魚で10秒ほど）。",
      run: "計算する",
      running: "計算中…",
      liveFailed: "このブラウザでは計算できませんでした。"
    },
    policy: {
      rest: (wait) => wait === 0 ? "魚が止まって休んだら、すぐAを押す。" : `魚が約${secs3(wait)}休んだらAを押す。`,
      hold: "魚が近づいてくる間は、Aを押したままにする。",
      release: (stop2, slow, time) => {
        const when = stop2 <= 3 ? "魚が近づかなくなった瞬間" : `魚が約${secs3(time)}近づかなくなったとき`;
        return slow ? `${when}、またはほとんど進まなくなったらAを離す。` : `${when}にAを離す。`;
      },
      cap: (cap) => `一度に${secs3(cap)}より長く押さない。離して次の休みを待つ。`,
      first: (first) => `${secs3(first)}たっても魚が近づかなければ、離して待つ。`,
      run: "魚が逃げている間は、Aに触らない。",
      taps: (every) => `魚が全速力で走っている間は、約${secs3(every)}ごとにAを軽く押して離す。遅くなったら押すのをやめて走らせる。`
    },
    play: {
      start: "ファイトを始める",
      again: "新しいファイト",
      retry: "同じファイトをもう一度",
      giveUp: "あきらめる",
      waiting: "「ファイトを始める」を押してください。始まった時点で魚はすでに走っています。",
      short: {
        running: "逃げている",
        resting: "休んでいる",
        reeling: "巻いている",
        stalled: "止まった！",
        pressed: "巻けていない",
        escaping: "逃げた"
      },
      status: {
        running: "魚が逃げている。Aは離したまま。",
        resting: "魚が止まって休んでいる。今Aを押す。",
        reeling: "巻き上げ中。Aを押したまま。",
        stalled: "魚が近づかなくなった。Aを離す！",
        pressed: "Aを押しているが、魚は近づいていない。",
        escaping: "魚はもう逃げた。最後まで巻いて終わらせる。"
      },
      result: {
        caught: (time) => `釣り上げた！ ${secs3(time)}で取り込みました。`,
        escaped: "逃げられた。ハリは残っていて、失ったのは魚だけ。",
        lost: "ラインが切れた！ ハリを失い、HPが1〜4減る。",
        gaveUp: "この魚はあきらめた。"
      },
      ghost: {
        label: "ゴースト：おすすめのリズムで、まったく同じファイトを再現",
        caught: (time) => `ゴースト：${secs3(time)}で釣り上げ。`,
        escaped: "ゴースト：逃げられた。",
        lost: "ゴースト：ライン切れ。",
        unfinished: "ゴースト：100秒たっても決着せず。",
        shown: "ゴーストを表示"
      },
      hiddenShown: "隠れた値を表示",
      hidden: {
        stamina: "魚のスタミナ（巻ける量）",
        fightValue: "負荷の値（0〜63）",
        distance: "自分からの距離",
        boundary: "竿の限界線",
        runTimer: "走るタイマー",
        restTimer: "休むタイマー",
        frame: "フレーム"
      },
      held: "A押下中",
      released: "A離した",
      meter: "負荷",
      meterFull: "満タンで魚が外れるかライン切れ",
      range: "竿の限界",
      you: "自分",
      sizeLine: (cm) => `この魚は${cm}cm。`,
      canvas: "水中を横から見た図。左の自分と右の竿の限界線のあいだを魚が泳ぎます。"
    }
  };

  // src/pages/fight-sim/copy.js
  var copy = { en: copy_en_default, th: copy_th_default, ja: copy_ja_default };

  // src/features/fight-policy/policy.js
  function observe(view, before) {
    return {
      speed: before ? view.fishPos - before.fishPos : 0,
      closing: view.reeling,
      running: view.fishRunning,
      still: !view.reeling && !view.fishRunning,
      resting: view.phase === "resting",
      stamina: view.stamina
    };
  }
  var FIRST_PULL_FRAMES = 12;
  var TAP_SETTLE = 3;
  var holdPolicy = () => () => true;
  function mashPolicy({ on, off }) {
    let tick2 = -1;
    return () => {
      tick2 += 1;
      return tick2 % (on + off) < on;
    };
  }
  function tapper({ taps = 0, tapStart = 0, tapEvery = 16, tapSpeed = 0 }) {
    let runFor = 0;
    let done = 0;
    let since = 99;
    return {
      since: () => since,
      /** True when this frame should be a tap. */
      due(now) {
        since += 1;
        if (taps === 0) return false;
        if (!now.running && since >= TAP_SETTLE) [runFor, done] = [0, 0];
        if (!now.running) return false;
        runFor += 1;
        const ready2 = done < taps && runFor > tapStart + done * tapEvery && now.speed >= tapSpeed;
        if (ready2) [since, done] = [0, done + 1];
        return ready2;
      }
    };
  }
  function rhythmPolicy(spec, seen) {
    const { wait, stop: stop2, slow = 0, cap = 0, first = FIRST_PULL_FRAMES, lag = 0 } = spec;
    const tap = tapper(spec);
    const s = { held: false, heldFor: 0, quietFor: 0, restFor: 0, pulled: false, moved: 99 };
    const flip = (held) => Object.assign(s, { held, heldFor: 0, quietFor: 0, restFor: 0, pulled: false, moved: 0 });
    return () => {
      const now = seen();
      s.moved += 1;
      const fresh = s.moved > lag;
      if (tap.due(now) && !s.held) return true;
      if (s.held) {
        s.heldFor += 1;
        if (fresh && now.closing) s.pulled = true;
        if (fresh) s.quietFor = now.closing ? 0 : s.quietFor + 1;
        const limit = s.pulled ? stop2 : Math.max(stop2, first);
        const crawling = s.pulled && slow > 0 && now.speed < 0 && -now.speed <= slow;
        if (fresh && (crawling || s.quietFor > limit) || cap > 0 && s.heldFor >= cap) flip(false);
      } else if (fresh && tap.since() >= TAP_SETTLE) {
        s.restFor = now.still ? s.restFor + 1 : 0;
        if (s.restFor > wait) flip(true);
      }
      return s.held;
    };
  }
  function referencePolicy(_spec, seen) {
    let held = false;
    return () => {
      const now = seen();
      if (held && now.stamina === 0) held = false;
      else if (!held && now.resting) held = true;
      return held;
    };
  }
  function unpackSpec(packed, lag) {
    return { kind: "rhythm", wait: 0, stop: 0, slow: 0, cap: 0, ...packed, lag };
  }
  var KINDS = {
    hold: holdPolicy,
    mash: mashPolicy,
    rhythm: rhythmPolicy,
    reference: referencePolicy
  };
  function createPolicy(spec) {
    const make = KINDS[spec.kind];
    if (!make) throw new RangeError(`Unknown policy kind ${spec.kind}`);
    const lag = spec.lag ?? 0;
    const history2 = [];
    const seen = () => {
      const at = Math.max(0, history2.length - 1 - lag);
      return observe(history2[at], history2[at - 1]);
    };
    const decide = make(spec, seen);
    return {
      next(view) {
        history2.push(view);
        return decide();
      }
    };
  }

  // src/entities/fight/fight-core.js
  var w16 = (value) => value & 65535;
  var isNegative = (value) => (value & 32768) !== 0;
  function hwDivide(dividend, divisor) {
    const d = divisor & 255;
    if (d === 0) return { quotient: 65535, remainder: w16(dividend) };
    return { quotient: Math.floor(w16(dividend) / d), remainder: w16(dividend) % d };
  }
  var multiply16x8 = (a, b) => w16(a) * (b & 255) & 16777215;
  function createGameRng(table, seed = {}) {
    const state = {
      index: w16(seed.index ?? 0),
      lfsrA: (seed.lfsrA ?? 123) & 255,
      lfsrB: (seed.lfsrB ?? 52) & 255
    };
    return {
      state,
      tableByte() {
        state.index = w16(state.index + 1);
        return table[state.index & 255];
      },
      lfsr() {
        let a = (state.lfsrB & 16) << 3;
        a = ((a ^ state.lfsrB) & 255) << 1;
        state.lfsrB = (a & 255 | a >> 8) & 255;
        state.lfsrA = state.lfsrB + state.lfsrA & 255;
        return state.lfsrA;
      },
      snapshot: () => ({ ...state })
    };
  }
  function speedStep(value) {
    if (value === 0) return 0;
    if (value <= 5) return 1;
    if (value <= 15) return 2;
    if (value <= 30) return 3;
    if (value <= 50) return 4;
    if (value <= 75) return 5;
    return 6;
  }
  var halveBase = (value) => value >> 1;
  var raiseBase = (value) => (value << 1 | 1) & 63;

  // src/entities/fight/fight-params.js
  var METHOD_BY_ROD_STYLE = { 1: 0, 2: 1, 4: 2, 8: 3 };
  var DEFAULT_ENVIRONMENT = {
    castDistance: 900,
    // $1F77, raw cast reach before bucketing
    sceneType: 5,
    // $0850, underwater scene variant (0..13)
    waterDepth: 1,
    // $1324, 1..3
    vehicle: 1,
    // $0858, values >= 3 widen the step mask
    lureAction: 0,
    // $1226, stale lure-record field read by the float rest path (lure style: the lure's own)
    lureDepth: 0,
    // $1F9D, how deep the lure was when the fish struck (lure style)
    moveMode: 0
    // $1EBB left over from before the fight (lure style, first frame only)
  };
  function lookup(tables, kind, id) {
    const row2 = tables[kind]?.find((entry) => entry.id === id);
    if (!row2) throw new RangeError(`Unknown ${kind} id ${id}`);
    return row2;
  }
  function resolveRecords(tables, ids) {
    const rod = lookup(tables, "rod", ids.rodId);
    const method = METHOD_BY_ROD_STYLE[rod.style];
    if (method === void 0) throw new RangeError(`Rod ${ids.rodId} has an unknown style code`);
    const fish = lookup(tables, "fish", ids.fishId);
    if (method === 2) return { method, rod, fish, lure: lookup(tables, "lure", ids.lureId) };
    if (method === 3) return { method, rod, fish, fly: lookup(tables, "fly", ids.flyId) };
    return {
      method,
      rod,
      fish,
      hook: lookup(tables, "hook", ids.hookId),
      bait: ids.baitId ? lookup(tables, "bait", ids.baitId) : { fishMatch: 0 }
    };
  }
  function resolveEnvironment(fish, options = {}) {
    const env = { ...DEFAULT_ENVIRONMENT, ...options.environment };
    const size = options.size ?? fish.sizeLow;
    if (!Number.isInteger(size) || size < 1 || size > 255) throw new RangeError("size must be 1..255");
    const scene = env.sceneType;
    if (!Number.isInteger(scene) || scene < 0 || scene > 13) throw new RangeError("sceneType 0..13");
    return { ...env, size };
  }

  // src/entities/fight/fight-lure-actions.js
  function lureUp(s) {
    if (s.fvAt63 !== 0 || s.fishPos === 0) s.curY = w16(s.curY - 1);
    else if (s.curY > 2) s.curY = w16(s.curY - 1);
    else s.curY = 2;
  }
  var sink = (s) => {
    s.curY = w16(s.curY + 1);
  };
  function pressed(s) {
    s.moveMode = 1;
    s.holding = 1;
  }
  function released(s) {
    s.moveMode = 0;
    s.holding = 0;
  }
  var ACTIONS = {
    // 04:91DF (actions 0 and 9): held lifts the lure on 4th frames while the fish is out; released sinks.
    0(s, p, rng, held, clock) {
      if (!held) return sink(s), released(s);
      if (((s.fishPos ? 3 : 0) & clock) === 0) lureUp(s);
      pressed(s);
    },
    // 04:921D: as action 0 but released sinks only on even frames.
    1(s, p, rng, held, clock) {
      if (held) return ACTIONS[0](s, p, rng, held, clock);
      if ((clock & 1) === 0) sink(s);
      released(s);
    },
    // 04:9263 (actions 2 and 7): held jitters down on a one-in-eight draw; it rises on even frames either way.
    2(s, p, rng, held, clock) {
      if (held && (rng.tableByte() & 7) === 0) s.curY = w16(s.curY + (clock & 3));
      if ((clock & 1) === 0) lureUp(s);
      if (held) pressed(s);
      else released(s);
    },
    // 04:92B5: held sinks by depth band while the fish is out; released rises on even frames.
    3(s, p, rng, held, clock) {
      if (!held) return risingRelease(s, clock);
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else {
        const bands = [48, 64, 96, 128];
        const index = bands.findIndex((limit) => s.curY < limit);
        const mask = index < 0 ? 31 : [1, 3, 7, 15][index];
        if ((mask & clock) === 0) sink(s);
      }
      pressed(s);
    },
    // 04:932D: like action 3 with coarser depth bands.
    4(s, p, rng, held, clock) {
      if (!held) return risingRelease(s, clock);
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else {
        const mask = s.curY < 256 ? 1 : s.curY < 384 ? 3 : 7;
        if ((mask & clock) === 0) sink(s);
      }
      pressed(s);
    },
    // 04:938F: held lifts every fourth frame; released sinks on even frames.
    5(s, p, rng, held, clock) {
      if (!held) {
        if ((clock & 1) === 0) sink(s);
        return released(s);
      }
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else if ((clock & 3) === 0) lureUp(s);
      pressed(s);
    },
    // 04:93D5: held lifts every frame; released sinks every frame.
    6(s, p, rng, held) {
      if (!held) return sink(s), released(s);
      lureUp(s);
      pressed(s);
    },
    // 04:9401: held lifts (freely when the fish is at the bank); released sinks on even frames.
    8(s, p, rng, held, clock) {
      if (!held) {
        if ((clock & 1) === 0) sink(s);
        return released(s);
      }
      if (s.fishPos === 0) s.curY = w16(s.curY - 1);
      else lureUp(s);
      pressed(s);
    }
  };
  ACTIONS[7] = ACTIONS[2];
  ACTIONS[9] = ACTIONS[0];
  function risingRelease(s, clock) {
    if ((clock & 1) === 0) lureUp(s);
    released(s);
  }
  function lureAction(s, p, rng, pad, clock) {
    const act = ACTIONS[p.lureAction];
    if (act) act(s, p, rng, pad.held, clock);
  }

  // src/entities/fight/fight-rolls.js
  function rollStamina(s, p, rng) {
    const half = p.staminaBase >> 1;
    s.stamina = w16(half + hwDivide(rng.tableByte(), half).remainder);
  }
  function rollRest(s, p, rng) {
    let divisor = w16(p.restBase - s.stamBase);
    if (divisor === 0) divisor = 1;
    const value = w16(hwDivide(rng.tableByte(), divisor).remainder + s.stamBase);
    s.restTimer = value < 2 ? 2 : value;
  }
  function rollIdle(s, p, rng) {
    s.idleTimer = w16(hwDivide(rng.tableByte(), p.idleSpread).remainder + 10);
  }
  function startPull(s, p, rng) {
    rollStamina(s, p, rng);
    rollRest(s, p, rng);
    s.maskA = p.pullMask;
    s.maskB = p.beatMask;
    s.bottomFlag = 0;
    if (s.stamBase !== 0) s.stamBase = w16(s.stamBase - 1);
  }
  function restAdjust(s, p, rng) {
    const before = s.restTimer;
    rollRest(s, p, rng);
    if (before > s.restTimer) s.restTimer = before;
    s.restTimer = w16(s.restTimer + (s.restTimer >> 3));
    s.firstRest = 1;
  }
  function drawStartClass(flags, rng) {
    const r = rng.tableByte();
    const f = (bit) => (flags & bit) !== 0;
    if (r & 1) {
      if (r & 2) return f(4) ? 1 : f(2) ? 2 : 3;
      return f(2) ? 2 : f(4) ? 1 : 3;
    }
    if (r & 2) return f(2) ? 2 : f(1) ? 3 : 1;
    return f(1) ? 3 : f(2) ? 2 : 1;
  }

  // src/entities/fight/fight-lure.js
  var swimSpeed = (size) => size <= 20 ? 2 : size <= 40 ? 3 : 4;
  function hookUp(s, p, rng) {
    s.mode = 2;
    s.moveMode = 2;
    startPull(s, p, rng);
    s.fightValue = s.fightBase;
    restAdjust(s, p, rng);
    s.phase = 1;
    s.curX = 176;
  }
  function startFollow(s, p, rng) {
    const half = p.approach >> 1;
    s.lureTimer = w16(hwDivide(rng.lfsr(), half).remainder + half);
    s.lureSub = 1;
    s.lureCount = 0;
  }
  function checkBite(s, p, rng) {
    if (!(s.prevX > 204 && s.prevX < 212)) return;
    let low = w16(s.curY - 4);
    if (isNegative(low)) low = 0;
    if (low >= s.prevY || w16(s.curY + 4) <= s.prevY) return;
    s.lureSub = s.lureSub === 5 ? 6 : 4;
    s.prevY = s.curY;
    s.prevX = s.curX;
    const span = w16(p.biteMax - p.biteMin);
    s.lureTimer = w16(hwDivide(rng.tableByte(), span).remainder + p.biteMin);
  }
  function followTimer(s, rng) {
    s.lureTimer = (rng.lfsr() >> 1) + 16;
    const d = w16(s.curX - s.prevX);
    if (isNegative(d)) {
      s.lureSub = 2;
      s.lureTimer = 8;
    } else if (d < s.lureTimer) s.lureTimer = d;
  }
  var retreat = (s) => {
    s.lureSub = 2;
    s.lureTimer = 8;
  };
  var inWindow = (s) => s.curY > s.yLimLo && s.curY < s.yLimHi;
  function interest(s, rng, pad) {
    if (s.lureTimer === 0) {
      if (!inWindow(s)) return retreat(s);
      s.lureSub = 3;
      return followTimer(s, rng);
    }
    s.lureTimer = w16(s.lureTimer - 1);
    if (!pad.edge) return;
    if (inWindow(s)) {
      s.lureSub = 3;
      followTimer(s, rng);
    } else if (s.prevX < 128) {
      s.lureSub = 0;
      followTimer(s, rng);
    } else retreat(s);
  }
  function tapTest(s, rng, pad) {
    if (s.lureTimer === 0) return retreat(s);
    s.lureTimer = w16(s.lureTimer - 1);
    if (s.lureTimer === 0 && s.lureCount !== 0) {
      s.lureSub = 5;
      followTimer(s, rng);
    }
    if (pad.edge) s.lureCount = w16(s.lureCount + 1);
  }
  function follow(s, p, rng, pad) {
    if (s.fishPos === 0 || s.prevX > 200) return retreat(s);
    if ((p.flags & 16) !== 0 && [2, 3, 7].includes(p.lureAction)) tapTest(s, rng, pad);
    else interest(s, rng, pad);
  }
  function stepToward(s) {
    if (s.curY === s.prevY) return;
    s.prevY = w16(s.prevY + (s.curY > s.prevY ? 1 : -1));
  }
  function swimIn(s, p, rng, clock) {
    const everyFrame = s.lureSub === 3;
    const speed = swimSpeed(s.size);
    if (s.lureTimer !== 0) {
      s.lureTimer = w16(s.lureTimer - speed);
      if (isNegative(s.lureTimer)) s.lureTimer = 0;
      s.prevX = w16(s.prevX + speed);
    } else startFollow(s, p, rng);
    if (everyFrame || (clock & 1) === 0) stepToward(s);
    checkBite(s, p, rng);
  }
  function approachVector(s) {
    const speed = swimSpeed(s.size);
    let reach = w16(s.curX - s.prevX);
    if (isNegative(reach)) reach = 0;
    const rise = w16(s.prevY - s.curY);
    if (isNegative(rise)) return { speed, dy: 1 };
    if (rise > reach) return { speed, dy: w16(65535 - speed) };
    if (rise >> 1 > reach) return { speed, dy: w16(-speed) };
    if (rise >> 2 > reach) return { speed, dy: w16(-(speed >> 1)) };
    return { speed, dy: 65535 };
  }
  function swimDiagonal(s, p, rng) {
    const { speed, dy } = approachVector(s);
    if (s.lureTimer !== 0) {
      s.lureTimer = w16(s.lureTimer - speed);
      if (isNegative(s.lureTimer)) s.lureTimer = 0;
      s.prevX = w16(s.prevX + speed);
      s.prevY = w16(s.prevY + dy);
    } else startFollow(s, p, rng);
    checkBite(s, p, rng);
  }
  function biteWindow(s, p, rng, pad) {
    if (s.lureTimer === 0) retreat(s);
    else {
      s.lureTimer = w16(s.lureTimer - 1);
      if (pad.edge) {
        hookUp(s, p, rng);
        s.lureSub = 2;
        s.lureTimer = 0;
      }
    }
    s.prevY = s.curY;
    s.prevX = s.curX;
  }
  function secondBite(s, p, rng, pad) {
    s.curX = 176;
    if (s.lureTimer === 0) {
      s.curX = 208;
      retreat(s);
    } else {
      s.lureTimer = w16(s.lureTimer - 1);
      if (pad.edge) {
        hookUp(s, p, rng);
        s.lureSub = 2;
        s.lureTimer = 0;
      }
    }
    s.moveMode = 2;
    s.restTimer = p.restBase;
    s.reelSpeed = speedStep(s.restTimer);
    s.curY = w16(s.curY + Math.max(1, s.reelSpeed >> 1));
    const d = w16(s.curY - s.distBase);
    if (!isNegative(d) && d >= 160) s.curY = w16(s.distBase + 160);
    s.prevY = s.curY;
    s.prevX = s.curX;
  }
  function repositionFish(s, startClass2, rng) {
    const t = (rng.lfsr() >> 1) + 32;
    const half = s.distBase >> 1;
    s.prevY = w16(startClass2 === 1 ? t : startClass2 === 2 ? half + t : s.distBase + t);
  }
  function resetFish(s, rng) {
    s.prevX = 65408;
    s.lureSub = 0;
    s.lureTimer = (rng.lfsr() >> 2) + 192;
    s.yLimLo = Math.max(0, s.prevY - 32) & 65535;
    s.yLimHi = w16(s.prevY + 32);
  }
  function swimOff(s, p, rng) {
    if (s.lureTimer !== 0) {
      s.lureTimer = w16(s.lureTimer - 1);
      return;
    }
    const speed = swimSpeed(s.size);
    if (!isNegative(s.prevX) || s.prevX > 65408) s.prevX = w16(s.prevX - speed);
    else if (s.fvAt63 === 0 && s.moveMode === 1 && s.fishPos !== 0) {
      repositionFish(s, drawStartClass(p.flags, rng), rng);
      resetFish(s, rng);
    }
  }
  function biteMachine(s, p, rng, pad, clock) {
    switch (s.lureSub) {
      case 0:
      case 3:
        return swimIn(s, p, rng, clock);
      case 1:
        return follow(s, p, rng, pad);
      case 2:
        return swimOff(s, p, rng);
      case 4:
        return biteWindow(s, p, rng, pad);
      case 5:
        return swimDiagonal(s, p, rng);
      case 6:
        return secondBite(s, p, rng, pad);
      default:
    }
  }

  // src/entities/fight/fight-float.js
  var nudgeY = (s, d) => {
    s.curY = w16(s.curY + d);
    s.prevY = w16(s.prevY + d);
  };
  function beat(s) {
    if (s.stamina !== 0) {
      s.stamina = w16(s.stamina - 1);
      return;
    }
    s.fightValue = raiseBase(s.fightValue);
    if (s.fightValue === 63) {
      s.fvAt63 = 1;
      if (s.fishPos >= s.boundary) s.lostTackle = 1;
    }
    s.maskB = raiseBase(s.maskB);
    s.maskA = raiseBase(s.maskA);
    s.beatCount = w16(s.beatCount + 1);
    if (s.beatCount === 24) {
      s.beatCount = 0;
      s.fightBase = raiseBase(s.fightBase);
    }
  }
  function pullMotion(s, p, clock) {
    if (s.mode === 2) {
      s.moveMode = s.fightValue < 15 ? 2 : 0;
    } else if ((clock & p.beatMask) === 0) {
      s.moveMode = s.stamina === 0 ? 0 : 1;
    }
  }
  function heldPath(s, p, rng, clock) {
    if (s.mode === 2) {
      s.stamina = 0;
      rollRest(s, p, rng);
      if (s.firstRest !== 0) restAdjust(s, p, rng);
      s.bottomFlag = 0;
    }
    s.holding = 1;
    pullMotion(s, p, clock);
    const mask = s.fishPos === 0 ? s.maskA >> 1 : s.maskA;
    if ((mask & clock) === 0) nudgeY(s, -1);
    if ((clock & s.maskB) === 0) {
      beat(s);
      if (s.fvAt63 !== 0) {
        s.phase = 2;
        s.stamina = 1;
      }
    }
  }
  function toRest(s, p, rng) {
    rollIdle(s, p, rng);
    s.fightValue = s.fightBase;
    s.phase = 0;
    s.holding = 0;
  }
  function restMask(s, p) {
    if (s.firstRest === 0) return p.pullMask;
    return p.lureAction === 2 || p.lureAction === 7 ? p.pullMask >> 2 : p.pullMask >> 1;
  }
  function releasedPath(s, p, rng, clock) {
    s.holding = 0;
    s.moveMode = 2;
    s.mode = 2;
    if ((restMask(s, p) & clock) === 0) {
      if (s.bottomFlag === 0) nudgeY(s, 1);
      else if ((p.pullMask & clock) === 0) {
        nudgeY(s, -1);
        if (w16(s.curY - s.distNow) < p.gate) s.bottomFlag = 0;
      }
    }
    if ((clock & p.beatMask) === 0) {
      s.restTimer = w16(s.restTimer - 1);
      if (s.restTimer === 0) toRest(s, p, rng);
    }
  }
  function fightPhase(s, p, rng, pad, clock) {
    s.prevX = s.curX;
    s.prevY = s.curY;
    if (s.fishPos < s.boundary && !pad.held) releasedPath(s, p, rng, clock);
    else heldPath(s, p, rng, clock);
  }
  function restPhase(s, p, rng, pad) {
    s.prevX = s.curX;
    s.prevY = s.curY;
    s.firstRest = 0;
    if (s.idleTimer !== 0) {
      s.idleTimer = w16(s.idleTimer - 1);
      if (pad.edge) {
        s.idleTimer = 0;
        s.mode = 1;
        startPull(s, p, rng);
        s.holding = 1;
        s.phase = 1;
      }
    } else {
      s.mode = 2;
      startPull(s, p, rng);
      s.phase = 1;
    }
    s.moveMode = 0;
  }
  function flyEscape(s, pad, clock) {
    if (pad.held) {
      s.moveMode = 1;
      s.curY = w16(s.curY - 2);
      s.holding = 1;
      return;
    }
    if ((clock & 1) !== 0) s.curY = w16(s.curY - 1);
    s.moveMode = 0;
    s.holding = 0;
  }
  function escapeLift(s, pad) {
    if (pad.held) {
      s.moveMode = 1;
      s.curY = w16(s.curY - 2);
      s.holding = 1;
      return;
    }
    s.curY = w16(s.curY + 1);
    const d = w16(s.curY - s.distBase);
    s.moveMode = isNegative(d) || d < 160 ? 1 : 0;
    s.holding = 0;
  }
  function escapePhase(s, p, pad, clock) {
    if (p.method === 3 && p.flyFlag !== 0 && s.lostTackle === 0) flyEscape(s, pad, clock);
    else escapeLift(s, pad);
    const speed = s.size <= 20 ? 3 : s.size <= 40 ? 4 : 5;
    if (!isNegative(s.prevX) || s.prevX > 65408) s.prevX = w16(s.prevX - speed);
  }
  function lurePhase(s, p, rng, pad, clock) {
    if (s.lostTackle !== 0) escapeLift(s, pad);
    else lureAction(s, p, rng, pad, clock);
    biteMachine(s, p, rng, pad, clock);
  }
  function stateUpdate(s, p, rng, pad, clock) {
    if (s.phase === 0) restPhase(s, p, rng, pad);
    else if (s.phase === 1) fightPhase(s, p, rng, pad, clock);
    else if (s.phase === 2 && p.method === 2) lurePhase(s, p, rng, pad, clock);
    else if (s.phase === 2) escapePhase(s, p, pad, clock);
  }
  function scrollStep(s, dir) {
    s.distNow = w16(s.distNow + dir);
    s.distBase = w16(s.distBase + dir);
    nudgeY(s, dir);
    s.yLimLo = w16(s.yLimLo + dir);
    s.yLimHi = w16(s.yLimHi + dir);
  }
  function runOut(s) {
    if (s.fishPos >= s.boundary) {
      s.reelSpeed = 0;
      return;
    }
    let n = speedStep(s.restTimer);
    s.reelSpeed = n;
    for (; n > 0; n--) {
      s.fishPos = w16(s.fishPos + 1);
      const onStep = s.fishPos < s.stepLimit && (s.fishPos & s.stepMask) === 0;
      if (onStep && s.distBase < 256) scrollStep(s, 1);
    }
  }
  function reelIn(s) {
    if (s.fishPos === 0) {
      s.reelSpeed = 0;
      return;
    }
    let n = speedStep(s.stamina);
    s.reelSpeed = w16(-n);
    for (; n > 0; n--) {
      s.fishPos = w16(s.fishPos - 1);
      if (isNegative(s.fishPos)) {
        s.fishPos = 0;
        continue;
      }
      if (s.fishPos >= s.stepLimit || (s.fishPos & s.stepMask) !== 0) continue;
      s.distNow = w16(s.distNow - 1);
      if (isNegative(s.distNow)) s.distNow = 0;
      s.distBase = w16(s.distBase - 1);
      if (isNegative(s.distBase)) s.distBase = 0;
      nudgeY(s, -1);
      s.yLimLo = w16(s.yLimLo - 1);
      s.yLimHi = w16(s.yLimHi - 1);
    }
  }
  function clampView(s) {
    const floor = w16(s.distBase + 160);
    if (s.distNow > s.distBase) s.distNow = s.distBase;
    if (!isNegative(s.curY) && floor < s.curY) {
      s.curY = floor;
      s.distNow = s.distBase;
    }
    if (!isNegative(s.prevY) && floor < s.prevY) {
      s.prevY = floor;
      s.bottomFlag = 1;
    }
    const d = w16(s.curY - s.distNow);
    if (isNegative(d)) {
      s.distNow = isNegative(s.curY) ? 0 : s.curY;
    } else if (d > 160) {
      s.distNow = w16(s.curY - 160);
    }
  }
  function moveFish(s, passes = 1) {
    for (let i = 0; i < passes; i++) {
      if (s.moveMode === 0) s.reelSpeed = 0;
      else if (s.moveMode === 1) reelIn(s);
      else if (s.moveMode === 2) runOut(s);
    }
    clampView(s);
  }
  var reachedSurface = (s) => s.distNow === 0 && isNegative(s.curY);

  // src/entities/fight/fight-setup.js
  var DISTANCE_BUCKETS = [
    256,
    1024,
    2304,
    4096,
    6400,
    9216,
    12544,
    16384,
    20736,
    25600,
    30976,
    36864,
    43264,
    50176,
    57600
  ];
  var castDistanceForBucket = (bucket) => (16 * bucket - 8) ** 2;
  function distanceBucket(castDistance) {
    const index = DISTANCE_BUCKETS.findIndex((limit) => castDistance < limit);
    return (index < 0 ? DISTANCE_BUCKETS.length + 1 : index + 1) * 256;
  }
  var WIDER_MASK = { 63: 127, 31: 63, 15: 31, 7: 15 };
  function staminaBase(size, fish) {
    const quarter = fish.restBase >> 2;
    if (size <= fish.sizeLow) {
      const ratio2 = hwDivide(size << 8, fish.sizeLow).quotient;
      return w16(multiply16x8(ratio2, quarter) >> 8);
    }
    if (fish.sizeLow === fish.sizeHigh) return fish.restBase >> 1;
    const ratio = hwDivide(w16(size - fish.sizeLow << 8), fish.sizeHigh - fish.sizeLow).quotient;
    return w16((multiply16x8(ratio, quarter) >> 8) + quarter);
  }
  var sizeBand = (size) => size <= 15 ? 0 : size <= 35 ? 1 : 2;
  var HOOK_STEPS = [
    [halveBase, (v) => v, raiseBase],
    [(v) => v, halveBase, (v) => v],
    [raiseBase, (v) => v, halveBase]
  ];
  var ROD_RAISES = [
    [0, 1, 2],
    [1, 0, 1],
    [2, 1, 0]
  ];
  function startingFightValue(records, fishId, size) {
    const { rod, fish, hook, bait, fly, lure } = records;
    let value = fish.fightStart;
    if (rod.selector === 0) value = halveBase(value);
    else if (rod.selector === 2) value = raiseBase(value);
    if (lure) {
      if (lure.fishMatch === fishId) value = halveBase(value);
      else if (lure.selector <= 2) value = HOOK_STEPS[lure.selector][sizeBand(size)](value);
    } else if (fly) {
      if (fly.selector <= 2) value = HOOK_STEPS[fly.selector][sizeBand(size)](value);
    } else if (bait.fishMatch === fishId || hook.fishMatch === fishId) value = halveBase(value);
    else if (hook.selector <= 2) value = HOOK_STEPS[hook.selector][sizeBand(size)](value);
    if (rod.fishMatch !== fishId && rod.selector <= 2) {
      for (let i = ROD_RAISES[rod.selector][sizeBand(size)]; i > 0; i--) value = raiseBase(value);
    }
    return value;
  }
  function placeFish(s, startClass2, rng) {
    const offset = (rng.lfsr() >> 1) + 32;
    s.prevX = 176;
    const base = s.distBase;
    const table = {
      1: [0, offset],
      2: [base >> 1, (base >> 1) + offset],
      3: [base, base + offset],
      4: [base, base + 160]
    };
    [s.distNow, s.prevY] = table[startClass2].map(w16);
  }
  var STATE_FIELDS = [
    "phase",
    "mode",
    "restTimer",
    "maskA",
    "maskB",
    "fightValue",
    "stamina",
    "lostTackle",
    "fvAt63",
    "idleTimer",
    "firstRest",
    "fishPos",
    "boundary",
    "distBase",
    "distNow",
    "curX",
    "curY",
    "prevX",
    "prevY",
    "moveMode",
    "reelSpeed",
    "holding",
    "bottomFlag",
    "stepMask",
    "stepLimit",
    "stamBase",
    "beatCount",
    "fightBase",
    "size",
    "lureSub",
    "lureTimer",
    "yLimLo",
    "yLimHi",
    "lureCount"
  ];
  function initialState(records, env, tables) {
    const mask0 = tables.sceneStepMask[env.sceneType];
    const fishPos = distanceBucket(env.castDistance);
    let distBase = hwDivide(fishPos, mask0 + 1).quotient;
    if (env.waterDepth === 3 && distBase < 224) distBase = 256;
    if (env.waterDepth === 2 && distBase < 112) distBase = 112;
    distBase = Math.min(distBase, 256);
    const stepMask = env.vehicle >= 3 ? WIDER_MASK[mask0] ?? mask0 : mask0;
    const s = Object.fromEntries(STATE_FIELDS.map((key) => [key, 0]));
    return Object.assign(s, {
      fishPos,
      distBase,
      stepMask,
      stepLimit: w16(stepMask << 8),
      boundary: w16(multiply16x8(336, records.rod.reach)),
      stamBase: staminaBase(env.size, records.fish),
      size: env.size
    });
  }
  function fightConstants(records, env) {
    const { fish } = records;
    return {
      method: records.method,
      flyFlag: records.fly ? records.fly.flag : 0,
      movePasses: env.sceneType === 4 ? 2 : 1,
      staminaBase: fish.staminaBase,
      restBase: fish.restBase,
      beatMask: fish.beatMask,
      idleSpread: fish.idleSpread,
      pullMask: fish.pullMask,
      flags: fish.flags,
      gate: fish.flags & 4 ? 32 : fish.flags & 2 ? 80 : 128,
      lureAction: records.lure ? records.lure.action : env.lureAction,
      approach: fish.approach,
      biteMax: fish.biteMax,
      biteMin: fish.biteMin
    };
  }
  function startClass(records, p, rng) {
    if (records.method === 1) return 4;
    if (records.method === 3 && p.flyFlag !== 0) return 1;
    return drawStartClass(p.flags, rng);
  }
  function placeLure(s, depth) {
    const base = s.distBase;
    s.curX = 208;
    if (w16(base + 160) < depth) {
      s.distNow = base;
      s.curY = w16(base + 160);
    } else if (w16(base + 112) < depth) {
      s.distNow = base;
      s.curY = depth;
    } else {
      s.distNow = depth > 112 ? depth - 112 : 0;
      s.curY = depth === 0 ? 1 : depth;
    }
  }
  function initLureFight(tables, records, fishId, env, rng) {
    const s = initialState(records, env, tables);
    s.fightBase = startingFightValue(records, fishId, env.size);
    const p = fightConstants(records, env);
    s.moveMode = env.moveMode;
    placeLure(s, env.lureDepth);
    placeFish(s, drawStartClass(p.flags, rng), rng);
    resetFish(s, rng);
    startPull(s, p, rng);
    s.phase = 2;
    s.stamina = 1;
    moveFish(s);
    return { s, p };
  }
  function initFloatFight(tables, records, fishId, env, rng) {
    const s = initialState(records, env, tables);
    s.fightBase = startingFightValue(records, fishId, env.size);
    const p = fightConstants(records, env);
    placeFish(s, startClass(records, p, rng), rng);
    s.curX = s.prevX;
    s.curY = s.prevY;
    s.mode = 2;
    s.moveMode = 2;
    startPull(s, p, rng);
    s.fightValue = s.fightBase;
    restAdjust(s, p, rng);
    s.phase = 1;
    moveFish(s);
    return { s, p };
  }

  // src/entities/fight/fight-engine.js
  var PHASES = ["resting", "fighting", "escaping"];
  var LURE_STAGES = ["approach", "follow", "leave", "close", "strike", "dash", "strike"];
  var DECOY_AYU_BAIT = 23;
  var defaultTables = null;
  function setFightTables(tables) {
    defaultTables = tables;
  }
  function rngFromSeed(seed) {
    let x = seed >>> 0 || 1;
    const next = () => {
      x ^= x << 13;
      x >>>= 0;
      x ^= x >>> 17;
      x ^= x << 5;
      x >>>= 0;
      return x;
    };
    return { index: next() & 65535, lfsrA: next() & 255, lfsrB: next() & 255 };
  }
  function assertSupported(records, ids) {
    if (records.fish.restBase === 0 && records.fish.staminaBase === 0) {
      throw new RangeError(
        `Fish profile ${ids.fishId} is an empty placeholder: no fight is ever started.`
      );
    }
    if (ids.baitId === DECOY_AYU_BAIT) {
      throw new RangeError("Decoy-ayu (ともづり) fights use a separate loop and are not supported.");
    }
  }
  function phaseName(fight) {
    const { s, p } = fight;
    if (fight.outcome) return "ended";
    return p.method === 2 && s.phase === 2 && s.fvAt63 === 0 ? "chasing" : PHASES[s.phase];
  }
  function describe(fight) {
    const { s, p } = fight;
    const lure = p.method === 2 ? {
      stage: LURE_STAGES[s.lureSub],
      strikeOpen: s.phase === 2 && [4, 6].includes(s.lureSub) && s.lureTimer > 0
    } : null;
    return {
      frame: fight.frame,
      clock: fight.clock,
      phase: phaseName(fight),
      lure,
      outcome: fight.outcome,
      fishPos: s.fishPos,
      boundary: s.boundary,
      fightValue: s.fightValue,
      stamina: s.stamina,
      restTimer: s.restTimer,
      idleTimer: s.idleTimer,
      holding: s.holding === 1,
      reeling: s.moveMode === 1,
      fishRunning: s.moveMode === 2,
      surfaceDistance: s.distNow,
      fishHeight: s.curY,
      pastBoundary: s.fishPos >= s.boundary,
      lostTackleRisk: s.lostTackle === 1
    };
  }
  function surfaceOutcome(s) {
    if (s.phase !== 2) return "caught";
    return s.lostTackle === 1 ? "lost-tackle" : "escaped";
  }
  function advance(fight, input) {
    const { s, p, rng } = fight;
    const a = Boolean(input.a);
    const b = Boolean(input.b);
    fight.clock = fight.clock + 1 & 255;
    const pad = { held: a || b, edge: a && !fight.prevA || b && !fight.prevB };
    fight.prevA = a;
    fight.prevB = b;
    moveFish(s, p.movePasses);
    if (reachedSurface(s)) fight.outcome = surfaceOutcome(s);
    else stateUpdate(s, p, rng, pad, fight.clock);
  }
  function handle(fight) {
    return {
      hp: fight.hp,
      /** Advance one video frame. Input: { a, b } (A and B act identically; d-pad is ignored). */
      step(input = {}) {
        if (fight.outcome) return describe(fight);
        fight.frame += 1;
        advance(fight, input);
        return describe(fight);
      },
      view: () => describe(fight),
      /** Independent copy at the current frame (for look-ahead and schedule search). */
      clone() {
        return handle({
          ...fight,
          s: { ...fight.s },
          rng: createGameRng(fight.table, fight.rng.state)
        });
      },
      /** Raw game variables, keyed as in the ROM trace fixtures. */
      vars() {
        const { index, lfsrA, lfsrB } = fight.rng.state;
        const { s, p } = fight;
        return { ...s, gate: p.gate, clock: fight.clock, rngIndex: index, rngA: lfsrA, rngB: lfsrB };
      }
    };
  }
  function newFight(options, tables) {
    const ids = {
      rodId: options.rodId,
      fishId: options.fishId,
      hookId: options.hookId,
      baitId: options.baitId ?? 0,
      flyId: options.flyId,
      lureId: options.lureId
    };
    const records = resolveRecords(tables, ids);
    assertSupported(records, ids);
    const env = resolveEnvironment(records.fish, options);
    const seed = typeof options.rng === "number" ? rngFromSeed(options.rng) : options.rng;
    const rng = createGameRng(tables.rng.table, seed);
    const clock = (options.clock ?? 0) & 255;
    const base = { hp: options.hp ?? null, table: tables.rng.table, rng, clock, frame: 0 };
    const edge = { prevA: false, prevB: false, outcome: null };
    if (options.resume) {
      const s2 = Object.fromEntries(STATE_FIELDS.map((key) => [key, options.resume[key] ?? 0]));
      return { ...base, ...edge, s: s2, p: fightConstants(records, env) };
    }
    const init = records.method === 2 ? initLureFight : initFloatFight;
    const { s, p } = init(tables, records, ids.fishId, env, rng);
    stateUpdate(s, p, rng, { held: false, edge: false }, clock);
    return { ...base, ...edge, s, p };
  }
  function createFight(options, tables = defaultTables) {
    if (!tables) throw new Error("Fight tables not loaded: call setFightTables(tables) first");
    return handle(newFight(options, tables));
  }

  // src/features/fight-policy/evaluate.js
  var FRAME_CAP = 6e3;
  var rodBoundary = (rod) => rod.reach * 336;
  function stream(seed) {
    let x = seed >>> 0 || 1;
    return (limit) => {
      x ^= x << 13;
      x >>>= 0;
      x ^= x >>> 17;
      x ^= x << 5;
      x >>>= 0;
      return x % limit;
    };
  }
  function farthestBucket(rod) {
    return Math.max(1, Math.min(16, Math.ceil(rodBoundary(rod) / 256) - 1));
  }
  function sampleStarts(fish, rod, count, seed) {
    const draw = stream(seed);
    const buckets = farthestBucket(rod);
    const sizes = fish.sizeHigh - fish.sizeLow + 1;
    return Array.from({ length: count }, () => ({
      rng: { index: draw(65536), lfsrA: draw(256), lfsrB: draw(256) },
      clock: draw(256),
      size: fish.sizeLow + draw(sizes),
      castDistance: castDistanceForBucket(1 + draw(buckets))
    }));
  }
  function fightOptions(setup, start2) {
    return {
      ...setup,
      rng: start2.rng,
      clock: start2.clock,
      size: start2.size,
      environment: { castDistance: start2.castDistance }
    };
  }

  // src/features/fight-policy/search.js
  var REACTION = { human: 8, sharp: 0 };
  var SAMPLE = { search: 200, searchSeed: 20261007, final: 1e3, finalSeed: 7102026 };
  var TAP_CHOICES = [16, 8].flatMap(
    (tapEvery) => [6, 5].map((tapSpeed) => ({ taps: 99, tapStart: 0, tapEvery, tapSpeed }))
  );
  var unpackEntry = (entry) => entry && { spec: unpackSpec(entry.spec, entry.lag), m: entry.m };

  // src/features/fight-policy/tackle.js
  var METHOD_STYLES = { float: 1, casting: 2 };
  var DECOY_AYU = 23;
  var methodOfRod = (rod) => rod.style === METHOD_STYLES.casting ? "casting" : "float";
  var fightableFish = (tables) => tables.fish.filter((fish) => fish.restBase !== 0 || fish.staminaBase !== 0);
  var rodsOfMethod = (tables, method) => tables.rod.filter((rod) => rod.style === METHOD_STYLES[method]);
  var usableBaits = (tables) => tables.bait.filter((bait) => bait.id !== DECOY_AYU);
  function startingFightValue2(tables, setup, size) {
    return createFight({ ...setup, size }, tables).vars().fightBase;
  }
  var middleSize = (fish) => fish.sizeLow + fish.sizeHigh >> 1;
  function compare(a, b) {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  }
  function bestRod(tables, fish, method) {
    const size = middleSize(fish);
    const score = (rod) => {
      const setup = { rodId: rod.id, fishId: fish.id, hookId: 6, baitId: 0 };
      return [-rod.reach, startingFightValue2(tables, setup, size), rod.id];
    };
    const [best] = rodsOfMethod(tables, method).map((rod) => ({ rod, key: score(rod) })).sort((a, b) => compare(a.key, b.key));
    return best.rod;
  }
  function bestHookAndBait(tables, fish, rod) {
    const size = middleSize(fish);
    const candidates = [];
    for (const hook of tables.hook) {
      for (const bait of [{ id: 0, fishMatch: 0 }, ...usableBaits(tables)]) {
        if (bait.id !== 0 && bait.fishMatch !== fish.id) continue;
        const setup = { rodId: rod.id, fishId: fish.id, hookId: hook.id, baitId: bait.id };
        candidates.push({
          setup,
          key: [
            startingFightValue2(tables, setup, size),
            hook.fishMatch === fish.id ? 0 : 1,
            bait.id === 0 ? 1 : 0,
            hook.id,
            bait.id
          ]
        });
      }
    }
    candidates.sort((a, b) => compare(a.key, b.key));
    return candidates[0].setup;
  }
  function defaultSetup(tables, fish, method) {
    const rod = bestRod(tables, fish, method);
    return bestHookAndBait(tables, fish, rod);
  }
  var setupKey = (setup) => [setup.fishId, setup.rodId, setup.hookId, setup.baitId ?? 0].join("|");

  // src/pages/fight-sim/format.js
  var FRAME_RATE = 60.0988;
  var escapeHtml = (value) => String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
  var seconds = (frames) => (frames / FRAME_RATE).toFixed(1);
  var percent = (value) => `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
  var localName = (record, locale) => record?.[locale] ?? record?.en ?? "";

  // src/pages/fight-sim/names.js
  var FISH_GLOSS = { 59: { en: "Giant eel (Oo-unagi)" } };
  function fishLabel(ctx, id) {
    return FISH_GLOSS[id]?.[ctx.locale] ?? localName(ctx.policies.names.fish[id], ctx.locale);
  }
  var rodLabel = (ctx, id) => localName(ctx.policies.names.rod[id], ctx.locale);
  var hookLabel = (ctx, id) => localName(ctx.policies.names.hook[id], ctx.locale);
  var baitLabel = (ctx, id) => id ? localName(ctx.policies.names.bait[id], ctx.locale) : "";
  function setupSummary(ctx, state = ctx.state) {
    return ctx.text.setupLine(
      fishLabel(ctx, state.fishId),
      rodLabel(ctx, state.rodId),
      hookLabel(ctx, state.hookId),
      baitLabel(ctx, state.baitId)
    );
  }

  // src/pages/fight-sim/compare.js
  var COMPARED = { yamame: 3, eel: 59 };
  function comparedCase(ctx, fishId) {
    const fish = ctx.tables.fish.find((row2) => row2.id === fishId);
    const setup = defaultSetup(ctx.tables, fish, "float");
    return { fishId, setup, record: ctx.policies.combos[setupKey(setup)] };
  }
  function tableRow(label, cells, css = "") {
    return `<tr class="${css}"><th scope="row">${escapeHtml(label)}</th>${cells.map((value) => `<td>${percent(value)}</td>`).join("")}</tr>`;
  }
  function renderComparison(ctx) {
    const cases = Object.values(COMPARED).map((id) => comparedCase(ctx, id));
    const words = ctx.text.compare;
    const head = cases.map(
      (item) => `<th scope="col">${escapeHtml(fishLabel(ctx, item.fishId))}</th>`
    );
    const rows = [
      tableRow(
        words.hold,
        cases.map((item) => item.record.base.hold.c)
      ),
      tableRow(
        words.mash,
        cases.map((item) => item.record.base.mash.c)
      ),
      tableRow(
        words.rhythm,
        cases.map((item) => item.record.plain.m.c),
        "fs-rec"
      )
    ];
    const tackle = cases.map(
      (item) => words.tackle(
        fishLabel(ctx, item.fishId),
        rodLabel(ctx, item.setup.rodId),
        hookLabel(ctx, item.setup.hookId)
      )
    ).join(" ");
    ctx.$("fs-compare").innerHTML = `<div class="fs-scroll"><table class="fs-table">
<caption>${escapeHtml(words.caption)}</caption>
<thead><tr><th></th>${head.join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>
<p class="fs-note">${escapeHtml(tackle)}</p>`;
  }
  function tipNumbers(ctx) {
    const { record } = comparedCase(ctx, COMPARED.eel);
    return {
      "eel-plain": percent(record.plain.m.c),
      "eel-unfinished": percent(record.plain.m.s),
      "eel-trick": percent(record.trick?.m.c ?? record.plain.m.c),
      "eel-ceiling": percent(record.ceiling.m.c)
    };
  }
  function fillTipNumbers(ctx) {
    const numbers = tipNumbers(ctx);
    document.querySelectorAll("[data-fill]").forEach((node) => {
      node.textContent = numbers[node.dataset.fill] ?? node.textContent;
    });
  }

  // src/pages/fight-sim/setup.js
  var option = (value, label, selected) => `<option value="${value}"${selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
  var findRow = (ctx, kind, id) => ctx.tables[kind].find((row2) => row2.id === id);
  function bestState(ctx, fishId, method) {
    const setup = defaultSetup(ctx.tables, findRow(ctx, "fish", fishId), method);
    return { fishId, method, rodId: setup.rodId, hookId: setup.hookId, baitId: setup.baitId };
  }
  function stateFromAddress(ctx) {
    const number = (name) => Number(ctx.params.get(name));
    const fish = fightableFish(ctx.tables).find((row2) => row2.id === number("fish"));
    const rod = ctx.tables.rod.find((row2) => row2.id === number("rod"));
    const start2 = bestState(ctx, fish?.id ?? 3, rod ? methodOfRod(rod) : "float");
    const hook = ctx.tables.hook.find((row2) => row2.id === number("hook"));
    const bait = usableBaits(ctx.tables).find((row2) => row2.id === number("bait"));
    if (rod && fish) start2.rodId = rod.id;
    if (hook && fish && rod) start2.hookId = hook.id;
    if (fish && rod && ctx.params.has("bait")) start2.baitId = bait ? bait.id : 0;
    return start2;
  }
  var currentSetup = (state) => ({
    rodId: state.rodId,
    fishId: state.fishId,
    hookId: state.hookId,
    baitId: state.baitId
  });
  var currentKey = (state) => setupKey(currentSetup(state));
  function fillFish(ctx) {
    const collator = new Intl.Collator(ctx.locale);
    const fish = fightableFish(ctx.tables).map((row2) => ({ id: row2.id, label: fishLabel(ctx, row2.id) })).sort((a, b) => collator.compare(a.label, b.label));
    ctx.$("fs-fish").innerHTML = fish.map((row2) => option(row2.id, row2.label, row2.id === ctx.state.fishId)).join("");
  }
  function fillRods(ctx) {
    const rods = rodsOfMethod(ctx.tables, ctx.state.method);
    ctx.$("fs-rod").innerHTML = rods.map((rod) => option(rod.id, rodLabel(ctx, rod.id), rod.id === ctx.state.rodId)).join("");
  }
  function fillSetupControls(ctx) {
    fillFish(ctx);
    ctx.$("fs-method").innerHTML = Object.entries(ctx.text.methods).map(([method, label]) => option(method, label, method === ctx.state.method)).join("");
    fillRods(ctx);
    ctx.$("fs-hook").innerHTML = ctx.tables.hook.map((hook) => option(hook.id, hookLabel(ctx, hook.id), hook.id === ctx.state.hookId)).join("");
    const none = option(0, ctx.text.noBait, ctx.state.baitId === 0);
    ctx.$("fs-bait").innerHTML = none + usableBaits(ctx.tables).map((bait) => option(bait.id, baitLabel(ctx, bait.id), bait.id === ctx.state.baitId)).join("");
  }
  function fishFacts(ctx) {
    const fish = findRow(ctx, "fish", ctx.state.fishId);
    const middle = fish.sizeLow + fish.sizeHigh >> 1;
    const value = startingFightValue2(ctx.tables, currentSetup(ctx.state), middle);
    const steps2 = value.toString(2).replace(/0/g, "").length;
    return `${ctx.text.sizeLine(fish.sizeLow, fish.sizeHigh)} ${ctx.text.startMeter(steps2)}`;
  }
  function readControls(ctx, changed) {
    const state = { ...ctx.state };
    if (changed === "fs-fish" || changed === "fs-method") {
      const fishId = Number(ctx.$("fs-fish").value);
      const method = ctx.$("fs-method").value;
      return Object.assign(state, bestState(ctx, fishId, method));
    }
    state.rodId = Number(ctx.$("fs-rod").value);
    state.hookId = Number(ctx.$("fs-hook").value);
    state.baitId = Number(ctx.$("fs-bait").value);
    return state;
  }

  // src/pages/fight-sim/describe.js
  function describePolicy(spec, text) {
    const words = text.policy;
    const frames = (value) => seconds(value);
    const lines = [words.rest(spec.wait ? frames(spec.wait) : 0), words.hold];
    lines.push(words.release(spec.stop ?? 0, spec.slow ?? 0, frames(spec.stop ?? 0)));
    if (spec.cap) lines.push(words.cap(frames(spec.cap)));
    if (spec.first && spec.first < 12) lines.push(words.first(frames(spec.first)));
    lines.push(spec.taps ? words.taps(frames(spec.tapEvery)) : words.run);
    return lines;
  }

  // src/pages/fight-sim/results.js
  var SEGMENTS = [
    ["c", "caught", "fs-caught"],
    ["e", "escaped", "fs-escaped"],
    ["l", "lost", "fs-lost"],
    ["s", "unfinished", "fs-unfinished"]
  ];
  function outcomeBar(m, text) {
    const label = text.finder.column;
    const parts = SEGMENTS.filter(([key]) => m[key] > 0).map(
      ([key, name, css]) => `<span class="fs-seg ${css}" style="width:${m[key]}%" title="${escapeHtml(label[name])}: ${percent(m[key])}"></span>`
    );
    const summary = SEGMENTS.map(([key, name]) => `${label[name]} ${percent(m[key])}`).join(", ");
    return `<div class="fs-bar" role="img" aria-label="${escapeHtml(summary)}">${parts.join("")}</div>`;
  }
  var legend = (text) => `<ul class="fs-legend">${SEGMENTS.map(
    ([, name, css]) => `<li><span class="fs-swatch ${css}" aria-hidden="true"></span>${escapeHtml(text.finder.column[name])}</li>`
  ).join("")}</ul>`;
  function headline(entry, text) {
    const { m } = entry;
    const average = m.f === null ? "" : ` ${text.finder.average(seconds(m.f))}`;
    return `<p class="fs-headline"><strong>${escapeHtml(text.finder.landed(percent(m.c), SAMPLE.final))}</strong>${escapeHtml(average)}</p>`;
  }
  function steps(spec, text) {
    const items = describePolicy(spec, text).map((line) => `<li>${escapeHtml(line)}</li>`);
    return `<ol class="fs-steps">${items.join("")}</ol>`;
  }
  function bestCard(record, text) {
    const { plain } = record;
    return `<article class="fs-card fs-best"><h3>${escapeHtml(text.finder.best)}</h3>
${headline(plain, text)}${steps(plain.spec, text)}${outcomeBar(plain.m, text)}${legend(text)}</article>`;
  }
  function row(label, m, text, css = "") {
    const cells = SEGMENTS.map(([key]) => `<td>${percent(m[key])}</td>`).join("");
    return `<tr class="${css}"><th scope="row">${escapeHtml(label)}</th>${cells}</tr>`;
  }
  function baselineCard(record, text) {
    const words = text.finder;
    const head = SEGMENTS.map(([, name]) => `<th scope="col">${escapeHtml(words.column[name])}</th>`);
    const rows = [
      row(words.base.hold, record.base.hold, text),
      row(words.base.mash, record.base.mash, text),
      row(words.base.plain, record.plain.m, text, "fs-rec"),
      row(words.base.reference, record.base.reference, text, "fs-ref")
    ];
    return `<article class="fs-card"><h3>${escapeHtml(words.baselines)}</h3>
<div class="fs-scroll"><table class="fs-table"><thead><tr><th></th>${head.join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>
<p class="fs-note">${escapeHtml(words.referenceNote)}</p></article>`;
  }
  function trickCard(record, text) {
    if (!record.trick) return "";
    const words = text.finder;
    return `<article class="fs-card"><h3>${escapeHtml(words.trick)}</h3>
<p class="fs-note">${escapeHtml(words.trickNote)}</p>${headline(record.trick, text)}${steps(record.trick.spec, text)}${outcomeBar(record.trick.m, text)}</article>`;
  }
  function ceilingCard(record, text) {
    const words = text.finder;
    const gain = record.ceiling.m.c - Math.max(record.plain.m.c, record.trick?.m.c ?? 0);
    if (gain < 2) return `<p class="fs-note">${escapeHtml(words.noGain)}</p>`;
    return `<article class="fs-card"><h3>${escapeHtml(words.ceiling)}</h3>
<p class="fs-note">${escapeHtml(words.ceilingNote)}</p>${headline(record.ceiling, text)}${steps(record.ceiling.spec, text)}${outcomeBar(record.ceiling.m, text)}</article>`;
  }
  function notesLine(text) {
    const frames = REACTION.human;
    return `<p class="fs-note">${escapeHtml(text.finder.reaction(frames, seconds(frames)))} ${escapeHtml(text.finder.sample(SAMPLE.final))}</p>`;
  }
  function missingCard(text) {
    return `<article class="fs-card"><p>${escapeHtml(text.finder.notComputed)}</p>
<button type="button" class="route-button" data-fs-run>${escapeHtml(text.finder.run)}</button></article>`;
  }

  // src/pages/fight-sim/worker-client.js
  function runInWorker(tables, setup) {
    return new Promise((resolve, reject) => {
      if (typeof Worker === "undefined") {
        reject(new Error("Web Workers are not available"));
        return;
      }
      const worker = new Worker("fight-sim-worker.js?v=32d0b839577e5f5b");
      worker.onmessage = (event) => {
        worker.terminate();
        resolve(event.data);
      };
      worker.onerror = (event) => {
        worker.terminate();
        reject(new Error(event.message));
      };
      worker.postMessage({ tables, setup });
    });
  }

  // src/pages/fight-sim/finder.js
  var currentRecord = (ctx) => ctx.policies.combos[currentKey(ctx.state)] ?? ctx.live.get(currentKey(ctx.state));
  function renderFinder(ctx) {
    const record = currentRecord(ctx);
    ctx.$("fs-facts").textContent = fishFacts(ctx);
    ctx.$("fs-results").innerHTML = record ? bestCard(record, ctx.text) + baselineCard(record, ctx.text) + trickCard(record, ctx.text) + ceilingCard(record, ctx.text) + notesLine(ctx.text) : missingCard(ctx.text);
  }
  function runLive(ctx) {
    const key = currentKey(ctx.state);
    const button = ctx.$("fs-results").querySelector("[data-fs-run]");
    if (button) {
      button.disabled = true;
      button.textContent = ctx.text.finder.running;
    }
    return runInWorker(ctx.tables, currentSetup(ctx.state)).then((record) => {
      ctx.live.set(key, record);
      if (key === currentKey(ctx.state)) ctx.onFinderChange();
    }).catch(() => {
      ctx.$("fs-results").innerHTML = `<p class="fs-note">${ctx.text.finder.liveFailed}</p>`;
    });
  }
  function bindFinder(ctx) {
    ctx.$("fs-results").addEventListener("click", (event) => {
      if (event.target.closest("[data-fs-run]")) runLive(ctx).catch(() => void 0);
    });
  }

  // src/pages/fight-sim/load.js
  function getJson(url) {
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      return response.json();
    });
  }
  function loadData() {
    return Promise.all([
      getJson("../data/fight-tables.json"),
      getJson("../data/fight-policies.json")
    ]).then(([tables, policies]) => {
      setFightTables(tables);
      return { tables, policies };
    });
  }

  // src/pages/fight-sim/input.js
  var KEYS = /* @__PURE__ */ new Set([" ", "z", "a"]);
  var isHeld = (ctx) => ctx.input.pointer || ctx.input.keys.size > 0;
  function sync(ctx) {
    const button = ctx.$("a-button");
    const held = isHeld(ctx);
    button.setAttribute("aria-pressed", String(held));
    button.classList.toggle("is-down", held);
  }
  function bindPointer(ctx) {
    const button = ctx.$("a-button");
    const release = () => {
      ctx.input.pointer = false;
      sync(ctx);
    };
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      ctx.input.pointer = true;
      sync(ctx);
    });
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
      button.addEventListener(name, release);
    }
    for (const name of ["contextmenu", "selectstart", "dragstart"])
      button.addEventListener(name, (event) => event.preventDefault());
  }
  function bindKeyboard(ctx) {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (!KEYS.has(key) || event.ctrlKey || event.metaKey || event.altKey) return;
      if (!ctx.play.running) return;
      event.preventDefault();
      if (event.repeat) return;
      ctx.input.keys.add(key);
      sync(ctx);
    });
    window.addEventListener("keyup", (event) => {
      ctx.input.keys.delete(event.key.toLowerCase());
      sync(ctx);
    });
    window.addEventListener("blur", () => releaseAll(ctx));
  }
  function releaseAll(ctx) {
    ctx.input.pointer = false;
    ctx.input.keys.clear();
    sync(ctx);
  }
  function bindInputs(ctx) {
    ctx.input = { pointer: false, keys: /* @__PURE__ */ new Set() };
    bindPointer(ctx);
    bindKeyboard(ctx);
  }

  // src/pages/fight-sim/draw.js
  var DEEPEST = 420;
  var METER_STEPS = 6;
  function readColors() {
    const style = getComputedStyle(document.documentElement);
    const pick = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
    return {
      ink: pick("--ink", "#233b33"),
      muted: pick("--muted", "#5c6f65"),
      paper: pick("--paper", "#f4f5ef"),
      line: pick("--line", "#d5dfd4"),
      green: pick("--green", "#24664f"),
      deep: pick("--deep", "#173e31"),
      gold: pick("--gold", "#9b731e"),
      alert: "#a23b2a"
    };
  }
  function fitCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(280, Math.round(canvas.clientWidth));
    const height = Math.round(width * 0.58);
    canvas.style.height = `${height}px`;
    if (canvas.width !== Math.round(width * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return { width, height };
  }
  var meterSteps = (fightValue) => fightValue.toString(2).replace(/0/g, "").length;
  function layout({ width, height }, view) {
    const sky = Math.round(height * 0.16);
    const left = Math.round(width * 0.09);
    const right = width - Math.round(width * 0.04);
    const range = Math.max(view.boundary * 1.06, 1200);
    const x = (distance) => left + (right - left) * Math.min(distance, range) / range;
    const bottom = height - Math.round(height * 0.13);
    const signed = (depth) => depth >= 32768 ? depth - 65536 : depth;
    const y = (depth) => sky + 14 + (bottom - sky - 24) * Math.max(0, Math.min(signed(depth), DEEPEST)) / DEEPEST;
    return { sky, left, right, bottom, x, y };
  }
  function drawWater(g, size, geo, colors) {
    g.fillStyle = colors.paper;
    g.fillRect(0, 0, size.width, geo.sky);
    const water = g.createLinearGradient(0, geo.sky, 0, size.height);
    water.addColorStop(0, "#cfe6e3");
    water.addColorStop(1, "#6f9fa0");
    g.fillStyle = water;
    g.fillRect(0, geo.sky, size.width, size.height - geo.sky);
    g.strokeStyle = colors.deep;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0, geo.sky);
    g.lineTo(size.width, geo.sky);
    g.stroke();
  }
  function drawBoundary(g, geo, view, text, colors, size) {
    const edge = geo.x(view.boundary);
    g.save();
    g.setLineDash([6, 5]);
    g.strokeStyle = colors.alert;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(edge, geo.sky);
    g.lineTo(edge, geo.bottom);
    g.stroke();
    g.restore();
    g.fillStyle = colors.alert;
    g.font = `600 ${Math.max(11, size.width / 52)}px system-ui, sans-serif`;
    g.textAlign = "right";
    g.fillText(text.play.range, edge - 6, geo.bottom - 4);
  }
  function drawAngler(g, geo, text, colors, size) {
    g.fillStyle = colors.deep;
    g.beginPath();
    g.arc(geo.left - 14, geo.sky - 20, 7, 0, Math.PI * 2);
    g.fill();
    g.fillRect(geo.left - 19, geo.sky - 13, 10, 13);
    g.strokeStyle = colors.deep;
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(geo.left - 8, geo.sky - 10);
    g.lineTo(geo.left + 14, geo.sky - 34);
    g.stroke();
    g.fillStyle = colors.ink;
    g.font = `600 ${Math.max(11, size.width / 52)}px system-ui, sans-serif`;
    g.textAlign = "left";
    g.fillText(text.play.you, geo.left - 24, geo.sky + 15);
  }
  function drawFish(g, at, facing, fill, alpha, scale) {
    g.save();
    g.globalAlpha = alpha;
    g.translate(at.x, at.y);
    g.scale(facing * scale, scale);
    g.fillStyle = fill;
    g.beginPath();
    g.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.moveTo(-13, 0);
    g.lineTo(-23, -7);
    g.lineTo(-23, 7);
    g.closePath();
    g.fill();
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(8, -2, 2, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  var facingOf = (view) => view.fishRunning ? 1 : -1;
  function drawLine(g, geo, at, view, colors) {
    const strain = meterSteps(view.fightValue);
    g.strokeStyle = strain >= 5 ? colors.alert : colors.ink;
    g.lineWidth = view.holding ? 2.5 : 1.2;
    g.beginPath();
    g.moveTo(geo.left + 14, geo.sky - 34);
    g.lineTo(at.x, at.y);
    g.stroke();
  }
  function drawMeter(g, size, geo, view, text, colors) {
    const lit = meterSteps(view.fightValue);
    const cell = Math.min(34, size.width / 14);
    const top = size.height - Math.round(size.height * 0.1);
    g.font = `600 ${Math.max(11, size.width / 52)}px system-ui, sans-serif`;
    g.fillStyle = colors.ink;
    g.textAlign = "left";
    g.fillText(text.play.meter, 8, top + cell * 0.6);
    const start2 = 8 + g.measureText(text.play.meter).width + 10;
    for (let step = 0; step < METER_STEPS; step++) {
      g.fillStyle = step < lit ? step >= 4 ? colors.alert : colors.gold : "rgba(255,255,255,.6)";
      g.fillRect(start2 + step * (cell + 3), top, cell, cell * 0.7);
    }
  }
  function drawBadge(g, size, status, colors, held, text) {
    g.font = `700 ${Math.max(12, size.width / 46)}px system-ui, sans-serif`;
    g.textAlign = "right";
    g.fillStyle = held ? colors.green : colors.muted;
    g.fillText(held ? text.play.held : text.play.released, size.width - 8, 18);
    g.fillStyle = colors.ink;
    g.fillText(status, size.width - 8, 18 + Math.max(16, size.width / 38));
  }
  function drawScene(canvas, scene) {
    const size = fitCanvas(canvas);
    const g = canvas.getContext("2d");
    const { view, ghostView, text, colors } = scene;
    const geo = layout(size, view);
    drawWater(g, size, geo, colors);
    drawBoundary(g, geo, view, text, colors, size);
    drawAngler(g, geo, text, colors, size);
    const at = { x: geo.x(view.fishPos), y: geo.y(view.fishHeight) };
    if (ghostView && !ghostView.outcome) {
      const ghost = { x: geo.x(ghostView.fishPos), y: geo.y(ghostView.fishHeight) };
      drawFish(g, ghost, facingOf(ghostView), colors.deep, 0.35, 0.9);
    }
    drawLine(g, geo, at, view, colors);
    drawFish(g, at, facingOf(view), colors.gold, 1, 1.1);
    drawMeter(g, size, geo, view, text, colors);
    g.fillStyle = colors.ink;
    g.font = `600 ${Math.max(12, size.width / 46)}px system-ui, sans-serif`;
    g.textAlign = "left";
    g.textAlign = "center";
    g.fillText(`${seconds(view.frame)} s`, size.width / 2, 18);
    drawBadge(g, size, scene.status, colors, scene.held, text);
  }

  // src/pages/fight-sim/play.js
  var STEP_MS = 1e3 / FRAME_RATE;
  var MAX_CATCH_UP = 6;
  var FALLBACK_GHOST = { kind: "rhythm", wait: 0, stop: 3, slow: 0, cap: 0, first: 12 };
  function visibleStatus(view, held, pulled) {
    if (view.phase === "escaping") return "escaping";
    if (view.phase === "resting") return "resting";
    if (view.reeling) return "reeling";
    if (held) return pulled ? "stalled" : view.fishRunning ? "pressed" : "reeling";
    return "running";
  }
  function ghostSpec(ctx) {
    const stored = unpackEntry(currentRecord(ctx)?.plain);
    return stored?.spec ?? { ...FALLBACK_GHOST, lag: REACTION.human };
  }
  function randomStart(ctx) {
    const fish = findRow(ctx, "fish", ctx.state.fishId);
    const rod = findRow(ctx, "rod", ctx.state.rodId);
    return sampleStarts(fish, rod, 1, 1 + Math.floor(Math.random() * 4294967294))[0];
  }
  function newRun(ctx, start2) {
    const options = fightOptions(currentSetup(ctx.state), start2);
    const fight = createFight(options, ctx.tables);
    const ghost = createFight(options, ctx.tables);
    return {
      start: start2,
      fight,
      ghost,
      policy: createPolicy(ghostSpec(ctx)),
      view: fight.view(),
      ghostView: ghost.view(),
      pulled: false
    };
  }
  function stepGhost(run) {
    if (run.ghostView.outcome) return;
    run.ghostView = run.ghost.step({ a: run.policy.next(run.ghostView) });
  }
  function tick(run, held) {
    run.pulled = held && (run.pulled || run.view.reeling);
    run.view = run.fight.step({ a: held });
    stepGhost(run);
  }
  function finishGhost(run) {
    while (!run.ghostView.outcome && run.ghostView.frame < FRAME_CAP) stepGhost(run);
  }
  function ghostMessage(ctx, run) {
    const words = ctx.text.play.ghost;
    const { outcome, frame: frame2 } = run.ghostView;
    if (outcome === "caught") return words.caught(seconds(frame2));
    if (outcome === "escaped") return words.escaped;
    if (outcome === "lost-tackle") return words.lost;
    return words.unfinished;
  }
  function resultMessage(ctx, outcome, frames) {
    const words = ctx.text.play.result;
    if (outcome === "caught") return words.caught(seconds(frames));
    if (outcome === "lost-tackle") return words.lost;
    return outcome === "escaped" ? words.escaped : words.gaveUp;
  }
  function render(ctx) {
    const { run } = ctx.play;
    const held = isHeld(ctx);
    const status = visibleStatus(run.view, held, run.pulled);
    drawScene(ctx.$("fight-canvas"), {
      view: run.view,
      ghostView: ctx.$("show-ghost").checked ? run.ghostView : null,
      held,
      status: ctx.text.play.short[status],
      text: ctx.text,
      colors: ctx.colors
    });
    if (ctx.play.statusKey !== status) {
      ctx.play.statusKey = status;
      ctx.$("fight-phase").textContent = ctx.text.play.status[status];
    }
    renderHidden(ctx, run.view);
  }
  function renderHidden(ctx, view) {
    const panel = ctx.$("hidden-values");
    panel.hidden = !ctx.$("show-hidden").checked;
    if (panel.hidden) return;
    const words = ctx.text.play.hidden;
    const rows = [
      [words.stamina, view.stamina],
      [words.fightValue, `${view.fightValue} (${meterSteps(view.fightValue)}/6)`],
      [words.distance, view.fishPos],
      [words.boundary, view.boundary],
      [words.runTimer, view.restTimer],
      [words.restTimer, view.idleTimer],
      [words.frame, view.frame]
    ];
    panel.innerHTML = rows.map(([name, value]) => `<dt>${escapeHtml(name)}</dt><dd>${value}</dd>`).join("");
  }
  function showResult(ctx, outcome) {
    const { run } = ctx.play;
    finishGhost(run);
    const kind = outcome === "caught" ? "caught" : outcome === "lost-tackle" ? "lost" : "escaped";
    const message = resultMessage(ctx, outcome, run.view.frame);
    const size = ctx.text.play.sizeLine(run.start.size);
    ctx.$("fight-result").innerHTML = `<p class="fs-result fs-result-${kind}">${escapeHtml(message)}</p>
<p class="fs-note">${escapeHtml(size)} ${escapeHtml(ghostMessage(ctx, run))}</p>`;
  }
  function setRunning(ctx, running) {
    ctx.play.running = running;
    ctx.$("fight-giveup").disabled = !running;
    ctx.$("fight-start").textContent = running ? ctx.text.play.again : ctx.text.play.start;
    ctx.$("fight-retry").hidden = running || !ctx.play.run;
    if (!running) releaseAll(ctx);
  }
  function stop(ctx, outcome) {
    cancelAnimationFrame(ctx.play.frameId);
    setRunning(ctx, false);
    render(ctx);
    ctx.$("fight-phase").textContent = "";
    ctx.play.statusKey = "";
    showResult(ctx, outcome);
  }
  function frame(ctx, now) {
    const play = ctx.play;
    if (!play.running) return;
    play.accumulated += Math.min(now - play.last, STEP_MS * MAX_CATCH_UP);
    play.last = now;
    while (play.accumulated >= STEP_MS && !play.run.view.outcome) {
      tick(play.run, isHeld(ctx));
      play.accumulated -= STEP_MS;
    }
    render(ctx);
    if (play.run.view.outcome) stop(ctx, play.run.view.outcome);
    else play.frameId = requestAnimationFrame((time) => frame(ctx, time));
  }
  function startFight(ctx, start2 = randomStart(ctx)) {
    cancelAnimationFrame(ctx.play.frameId);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    Object.assign(ctx.play, { run: newRun(ctx, start2), accumulated: 0, statusKey: "" });
    ctx.$("fight-result").replaceChildren();
    setRunning(ctx, true);
    render(ctx);
    ctx.play.last = performance.now();
    ctx.play.frameId = requestAnimationFrame((time) => frame(ctx, time));
  }
  function giveUp(ctx) {
    if (!ctx.play.running) return;
    ctx.play.run.view = { ...ctx.play.run.view, outcome: "gave-up" };
    stop(ctx, "gave-up");
  }
  function showIdle(ctx) {
    if (ctx.play.running) return;
    const start2 = randomStart(ctx);
    ctx.play.run = newRun(ctx, start2);
    ctx.play.statusKey = "";
    ctx.$("fight-phase").textContent = ctx.text.play.waiting;
    ctx.$("fight-retry").hidden = true;
    ctx.$("fight-result").replaceChildren();
    drawIdle(ctx);
  }
  function drawIdle(ctx) {
    const { run } = ctx.play;
    drawScene(ctx.$("fight-canvas"), {
      view: run.view,
      ghostView: null,
      held: false,
      status: ctx.text.play.short.running,
      text: ctx.text,
      colors: ctx.colors
    });
  }
  function bindPlay(ctx) {
    ctx.colors = readColors();
    ctx.play = { running: false, run: null, frameId: 0, accumulated: 0, last: 0, statusKey: "" };
    ctx.$("fight-start").addEventListener("click", () => startFight(ctx));
    ctx.$("fight-retry").addEventListener("click", () => startFight(ctx, ctx.play.run.start));
    ctx.$("fight-giveup").addEventListener("click", () => giveUp(ctx));
    for (const id of ["show-hidden", "show-ghost"])
      ctx.$(id).addEventListener("change", () => ctx.play.running ? render(ctx) : drawIdle(ctx));
    window.addEventListener("resize", () => ctx.play.running ? render(ctx) : drawIdle(ctx));
  }

  // src/pages/fight-sim/index.js
  var suffixes = { en: "", th: ".th", ja: ".ja" };
  function setupContext(ctx) {
    const locale = document.documentElement.dataset.locale;
    ctx.locale = ["th", "ja"].includes(locale) ? locale : "en";
    ctx.text = copy[ctx.locale];
    ctx.$ = (id) => document.getElementById(id);
    ctx.params = new URLSearchParams(location.search);
    ctx.live = /* @__PURE__ */ new Map();
  }
  function syncAddress(ctx) {
    const { fishId, rodId, hookId, baitId } = currentSetup(ctx.state);
    const query = new URLSearchParams({ fish: fishId, rod: rodId, hook: hookId, bait: baitId });
    history.replaceState(null, "", `${location.pathname}?${query}${location.hash}`);
    for (const [locale, suffix] of Object.entries(suffixes))
      ctx.$(`language-${locale}`).href = `fight-sim${suffix}.html?${query}`;
  }
  function refresh(ctx) {
    fillSetupControls(ctx);
    syncAddress(ctx);
    renderFinder(ctx);
    ctx.$("play-setup").textContent = setupSummary(ctx);
    showIdle(ctx);
  }
  function bindSetup(ctx) {
    ctx.$("fs-setup").addEventListener("change", (event) => {
      ctx.state = readControls(ctx, event.target.id);
      refresh(ctx);
    });
    ctx.$("fs-reset").addEventListener("click", () => {
      ctx.state = bestState(ctx, ctx.state.fishId, ctx.state.method);
      refresh(ctx);
    });
    ctx.onFinderChange = () => renderFinder(ctx);
  }
  function ready(ctx) {
    ctx.state = stateFromAddress(ctx);
    renderComparison(ctx);
    fillTipNumbers(ctx);
    bindSetup(ctx);
    bindFinder(ctx);
    bindInputs(ctx);
    bindPlay(ctx);
    refresh(ctx);
    ctx.$("page-status").hidden = true;
    document.querySelector('.compendium-links [aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function failed(ctx) {
    const status = ctx.$("page-status");
    status.hidden = false;
    status.innerHTML = "";
    status.append(ctx.text.failed, " ");
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "route-button";
    retry.textContent = ctx.text.retry;
    retry.addEventListener("click", () => start(ctx));
    status.append(retry);
  }
  function start(ctx) {
    const status = ctx.$("page-status");
    status.hidden = false;
    status.textContent = ctx.text.loading;
    loadData().then((data) => {
      Object.assign(ctx, data);
      ready(ctx);
    }).catch((error) => {
      console.error(error);
      failed(ctx);
    });
  }
  function initialize(ctx) {
    setupContext(ctx);
    start(ctx);
  }

  // src/shared/lib/index.js
  function createPageRuntime(api) {
    const runtime = {};
    for (const [name, value] of Object.entries(api)) {
      if (name !== "initialize") runtime[name] = value.bind(null, runtime);
    }
    return runtime;
  }

  // src/app/fight-sim.js
  var runtimeContext = createPageRuntime(fight_sim_exports);
  initialize(runtimeContext);
})();
