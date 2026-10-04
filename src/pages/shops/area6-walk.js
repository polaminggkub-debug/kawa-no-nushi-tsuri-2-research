const copy = {
  th: {
    title: 'เดินไปถึงร้านปกติด่าน 6',
    steps: [
      'ใช้ทางเข้าเมืองหมายเลข 2 ที่แผนที่ด่าน 6: X 2, Y 49 จะถึงห้องเมืองที่ X 7, Y 29',
      'จากจุดถึงเมือง เดินขึ้น 3 ช่อง → ขวา 2 → ขึ้น 3 → ลง 1 → ซ้าย 1 จะยืนที่ X 8, Y 24 หน้าเคาน์เตอร์',
      'หันขึ้น กด A คุยกับร้าน แล้วกดผ่านคำทักทายเพื่อเปิดหมวดสินค้า',
    ],
    image: 'ภาพร้านจริงเมื่อเดินถึง',
    evidence: 'หลักฐานเส้นทางและขอบเขตการทดสอบ',
  },
  en: {
    title: 'Walk to the Area 6 regular shop',
    steps: [
      'Use town entrance 2 at field X 2, Y 49; arrival is town X 7, Y 29.',
      'From arrival, walk up 3 tiles → right 2 → up 3 → down 1 → left 1, reaching X 8, Y 24 in front of the counter.',
      'Face up, press A to talk, then advance the greeting to open the shop categories.',
    ],
    image: 'Original shop screen after walking there',
    evidence: 'Route evidence and test scope',
  },
  ja: {
    title: 'エリア6の通常店への歩き方',
    steps: [
      'フィールドX2、Y49の町入口2から入り、町のX7、Y29へ到着します。',
      '到着点から上3マス→右2→上3→下1→左1。カウンター前のX8、Y24に立ちます。',
      '上を向いてAで話しかけ、挨拶を進めると商品カテゴリが開きます。',
    ],
    image: '歩いて到着した原作の店画面',
    evidence: '経路の根拠と検証範囲',
  },
}

export function area6Walk(ctx, view, node) {
  if (Number(view.stage) !== 6 || node.kind !== 'regular-shop') return ''
  const c = copy[ctx.lang]
  return `<aside class="shop-walk" data-area6-walk><h4>${ctx.esc(c.title)}</h4><ol>${c.steps.map((step) => `<li>${ctx.esc(step)}</li>`).join('')}</ol><details><summary>${ctx.esc(c.image)}</summary><a href="images/shop-routes/area6-regular-shop.png"><img loading="lazy" src="images/shop-routes/area6-regular-shop.png" alt="${ctx.esc(c.image)}"></a><p><a href="../docs/area6-shop-walking-research.md">${ctx.esc(c.evidence)} ↗</a></p></details></aside>`
}
