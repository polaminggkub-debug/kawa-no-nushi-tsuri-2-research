const copy = {
  th: {
    title: 'สัญลักษณ์บนผิวน้ำในเกม',
    imageNote:
      'ขยายกราฟิกไอคอนต้นฉบับจากเกมบนพื้นเรียบเพื่อให้เห็นชัด ภาพในเกมมีหลายทิศและหลายเฟรม',
    small: 'ปลาเล็ก: ต่ำกว่า 50 ซม.',
    large: 'ปลาใหญ่: ตั้งแต่ 50 ซม.',
    bubble: 'ฟอง: บางชนิดใช้ภาพนี้ทุกขนาด',
    note: 'ภาพปลาใช้ขนาดตอนสร้างไอคอน ปลาโตต่อได้โดยภาพไม่เปลี่ยนทันที จึงไม่รับประกันขนาดตอนตกได้ ฟองไม่บอกขนาด และไอคอนอย่างเดียวบอกชนิดปลาไม่ได้ ภาพหมุดบนเว็บคือรูปชนิดปลา ไม่ใช่ไอคอนในเกม',
    detail: 'ดูไอคอนที่ปลานี้แสดงได้',
  },
  en: {
    title: 'Water marks in the game',
    imageNote:
      'Original game icon pixels enlarged on a plain backdrop for clarity. Other directions and animation frames appear in play.',
    small: 'Small: under 50 cm',
    large: 'Large: at least 50 cm',
    bubble: 'Bubbles: certain species, any size',
    note: 'Fish marks read size when created and do not immediately refresh as fish grow; they do not guarantee landed size. Bubbles do not reveal size; a mark alone cannot identify the species. Website pins show species portraits, not in-game marks.',
    detail: 'See this fish’s possible marks',
  },
  ja: {
    title: 'ゲーム内の水面マーク',
    imageNote:
      '原作のマークを単色背景で拡大しています。ゲームでは方向やアニメーションにより形が変わります。',
    small: '小魚影：50cm未満',
    large: '大魚影：50cm以上',
    bubble: '泡：特定の魚種、サイズ不問',
    note: '魚影は作成時のサイズを示し、成長しても直ちに更新されません。釣り上げ時のサイズは保証しません。泡ではサイズを判断できず、マークだけでは魚種も特定できません。地図のピンは魚種の画像で、ゲーム内のマークではありません。',
    detail: 'この魚のマークを確認',
  },
}

export function renderWaterKey(ctx) {
  const node = ctx.$('water-icon-key')
  const data = ctx.waterIcons
  if (!node || !data?.classes) return
  const c = copy[ctx.lang]
  const profile = data.profiles?.[ctx.selectedFish]
  const classes = profile?.possibleClasses || ['small', 'large', 'bubble']
  const cards = classes
    .filter((key) => data.classes[key]?.image)
    .map(
      (key) =>
        `<li><img src="${ctx.esc(data.classes[key].image + '?v=native-20261005')}" alt=""><span>${ctx.esc(c[key])}</span></li>`,
    )
    .join('')
  const link = profile
    ? `<a href="${ctx.esc(ctx.fishHref(ctx.selectedFish))}#water-icons">${ctx.esc(c.detail)} ↗</a>`
    : ''
  node.innerHTML = `<h4>${ctx.esc(c.title)}</h4><ul>${cards}</ul><p class="water-icon-image-note">${ctx.esc(c.imageNote)}</p><p>${ctx.esc(c.note)}</p>${link}`
  node.hidden = !cards
}
