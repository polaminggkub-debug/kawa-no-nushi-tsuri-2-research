const secs = (value) => `${value}秒`

export default {
  loading: 'ファイトのデータを読み込み中…',
  failed: '読み込めませんでした。',
  retry: '再試行',
  back: '← 装備を選ぶ',
  compare: {
    caption: 'シミュレーションで釣り上げた割合',
    hold: 'Aを押しっぱなし',
    mash: 'Aを連打（1秒に約10回）',
    rhythm: '休んだら押し、近づかなくなったら離す',
    tackle: (fish, rod, hook) => `${fish}：${rod}、${hook}。`,
  },
  methods: { float: 'ウキ竿（エサ）', casting: '投げ竿' },
  rodGroups: { float: 'ウキ竿', casting: '投げ竿' },
  noBait: 'エサなし',
  setupLine: (fish, rod, hook, bait) => `${fish}・${rod}・${hook}${bait ? `・${bait}` : ''}`,
  sizeLine: (low, high) => (low === high ? `大きさ ${low}cm。` : `大きさ ${low}〜${high}cm。`),
  startMeter: (steps) =>
    steps === 0
      ? 'ラインの負荷メーターは空から始まります。'
      : `ラインの負荷メーターは6段階中${steps}段から始まります。`,
  finder: {
    best: 'このセットで一番よいAの押し方',
    landed: (pct, n) => `ランダムな${n}回のファイトのうち${pct}で釣り上げ`,
    average: (time) => `釣り上げたときの平均は${secs(time)}。`,
    outcomes: {
      escaped: '逃げられた',
      lost: 'ライン切れ（ハリを失う・HP1〜4減）',
      unfinished: '100秒たっても決着せず',
    },
    baselines: 'おすすめのリズムの結果',
    base: {
      hold: 'Aを押しっぱなし',
      mash: 'Aを連打（1秒に約10回）',
      plain: '上のリズム',
      reference: '隠れたスタミナが見えるとした同じリズム',
    },
    referenceNote:
      '実際のゲームでは不可能です。隠れた値にどれだけ価値があるかを示すための参考です。',
    column: {
      caught: '釣り上げ',
      escaped: '逃げられた',
      lost: 'ライン切れ',
      unfinished: '決着せず',
    },
    trick: '上級：魚が全力で走る間にAを小刻みに押す',
    trickNote:
      '魚が全速力で走っているときだけ効くため、よく見る必要があります。釣り上げは増えますが、逃げられることも増えます。',
    ceiling: 'フレーム単位で完璧に押せた場合',
    ceilingNote:
      '反応の遅れがゼロなら、同じ考え方でどこまで届くか。手で再現するのは現実的ではありません。',
    noGain: '完璧に押しても大きな差はありません。',
    reaction: (frames, time) => `この数字は反応に${frames}フレーム（約${time}秒）かかる前提です。`,
    sample: (n) =>
      `開始条件の違う${n}回のファイトで計算しました（見えない乱数、タイミング、投げた距離、魚の大きさ）。割合はシミュレーション上のもので、保証ではありません。`,
    notComputed:
      'このセットは事前に計算していません。ボタンを押すとこのページで計算します（数秒、最も難しい魚で10秒ほど）。',
    run: '計算する',
    running: '計算中…',
    liveFailed: 'このブラウザでは計算できませんでした。',
  },
  policy: {
    rest: (wait) =>
      wait === 0 ? '魚が止まって休んだら、すぐAを押す。' : `魚が約${secs(wait)}休んだらAを押す。`,
    hold: '魚が近づいてくる間は、Aを押したままにする。',
    release: (stop, slow, time) => {
      const when =
        stop <= 3 ? '魚が近づかなくなった瞬間' : `魚が約${secs(time)}近づかなくなったとき`
      return slow ? `${when}、またはほとんど進まなくなったらAを離す。` : `${when}にAを離す。`
    },
    cap: (cap) => `一度に${secs(cap)}より長く押さない。離して次の休みを待つ。`,
    first: (first) => `${secs(first)}たっても魚が近づかなければ、離して待つ。`,
    run: '魚が逃げている間は、Aに触らない。',
    taps: (every) =>
      `魚が全速力で走っている間は、約${secs(every)}ごとにAを軽く押して離す。遅くなったら押すのをやめて走らせる。`,
  },
  play: {
    start: 'ファイトを始める',
    again: '新しいファイト',
    retry: '同じファイトをもう一度',
    giveUp: 'あきらめる',
    waiting: '「ファイトを始める」を押してください。始まった時点で魚はすでに走っています。',
    short: {
      running: '逃げている',
      resting: '休んでいる',
      reeling: '巻いている',
      stalled: '止まった！',
      pressed: '巻けていない',
      escaping: '逃げた',
    },
    status: {
      running: '魚が逃げている。Aは離したまま。',
      resting: '魚が止まって休んでいる。今Aを押す。',
      reeling: '巻き上げ中。Aを押したまま。',
      stalled: '魚が近づかなくなった。Aを離す！',
      pressed: 'Aを押しているが、魚は近づいていない。',
      escaping: '魚はもう逃げた。最後まで巻いて終わらせる。',
    },
    result: {
      caught: (time) => `釣り上げた！ ${secs(time)}で取り込みました。`,
      escaped: '逃げられた。ハリは残っていて、失ったのは魚だけ。',
      lost: 'ラインが切れた！ ハリを失い、HPが1〜4減る。',
      gaveUp: 'この魚はあきらめた。',
    },
    ghost: {
      label: 'ゴースト：おすすめのリズムで、まったく同じファイトを再現',
      caught: (time) => `ゴースト：${secs(time)}で釣り上げ。`,
      escaped: 'ゴースト：逃げられた。',
      lost: 'ゴースト：ライン切れ。',
      unfinished: 'ゴースト：100秒たっても決着せず。',
      shown: 'ゴーストを表示',
    },
    hiddenShown: '隠れた値を表示',
    hidden: {
      stamina: '魚のスタミナ（巻ける量）',
      fightValue: '負荷の値（0〜63）',
      distance: '自分からの距離',
      boundary: '竿の限界線',
      runTimer: '走るタイマー',
      restTimer: '休むタイマー',
      frame: 'フレーム',
    },
    held: 'A押下中',
    released: 'A離した',
    meter: '負荷',
    meterFull: '満タンで魚が外れるかライン切れ',
    range: '竿の限界',
    you: '自分',
    sizeLine: (cm) => `この魚は${cm}cm。`,
    canvas: '水中を横から見た図。左の自分と右の竿の限界線のあいだを魚が泳ぎます。',
  },
}
