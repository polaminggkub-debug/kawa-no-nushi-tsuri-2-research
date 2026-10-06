const areaWord = (list) => `エリア${list.join('・')}`

export default {
  loading: 'セットのデータを読み込み中…',
  failed: 'セットのデータを読み込めませんでした。',
  retry: '再試行',
  sizeLine: (low, high) => (low === high ? `大きさ ${low}cm。` : `大きさ ${low}〜${high}cm。`),
  reachLine: (need) => `リーチ${need}以上の竿が必要です。`,
  methods: {
    float: 'ウキ竿＋エサ',
    casting: '投げ竿＋オモリ',
    lure: 'ルアー竿＋ルアー',
    fly: '毛バリ竿＋毛バリ',
  },
  hints: {
    casting: '底の魚だけで、食うまで約10秒かかります。この魚はウキ竿のセットでも釣れます。',
    lure: 'AかBを連打し、魚がルアーと同じ高さに来たらAを1回押します。',
    fly: '新しいセーブでは食わない毛バリがあります（毛バリのカード参照）。このセットはそれを避けています。',
  },
  slots: {
    rod: '竿',
    hook: 'ハリ',
    bait: 'エサ',
    lure: 'ルアー',
    fly: '毛バリ',
  },
  roles: { buy: '買える中で一番よいセット', enough: 'もっと安くて、ほぼ同じ（差3ポイント以内）' },
  total: (price) => `セット合計 ${price}`,
  from: (price) => `${price}から`,
  extra: (name, price) => `別途必要（どれでもOK）：${name}（${price}）`,
  where: {
    all: '全エリア',
    areas: areaWord,
    special: (list) => `特別な竿屋・${areaWord(list)}`,
    readyMade: '完成品の毛バリ',
  },
  mistakes: (low, high) =>
    `ミスできる回数：${low === high ? low : `${low}〜${high}`}（最大6、多いほど楽）`,
  caught: (pct, n) => `シミュレーション${n}回のうち${pct}で釣り上げ`,
  running: (pct) => `${pct}は100秒たっても決着せず（遅いだけで失敗ではありません）`,
  lost: (pct) => `${pct}で仕掛けを失う`,
  notSimulated: 'ルアーと毛バリの釣り上げ率はシミュレーションしていません。',
  neverSold: (names) =>
    `この魚にいちばん余裕のある竿（${names}）は売っていません。これが買える中で最善です。`,
  flySwapped: (from, to) =>
    `この魚に一番安い毛バリ（${from}）は新しいセーブでは食わないので、このセットは${to}にしています。`,
  simLink: 'このセットをファイトシミュレーターで試す',
  fishLink: 'この魚の居場所を見る',
}
