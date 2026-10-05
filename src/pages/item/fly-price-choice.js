import { flyAssemblies } from './purchases.js'

const categories = ['fly', 'fly_wing', 'fly_tail']
const copy = {
  th: {
    title: 'ซื้อสำเร็จรูปหรือประกอบเอง?',
    contribution: (price) => `ชิ้นนี้เพิ่ม ${price} เยนในราคาฟลายที่ประกอบเอง`,
    rule: 'ร้านประกอบคิดราคาบอดี้ + ปีก + หาง ไม่ต้องซื้อชิ้นส่วนแยก เลือก “ไม่มี” คิด 0 เยน ตรวจราคาสุทธิก่อนจ่ายและเหลือช่องเก็บฟลายด้วย',
    composition: (ids) => `ชุด ${ids}`,
    ready: (stage, price) => `สำเร็จรูปด่าน ${stage}: ¥${price}`,
    custom: (area, price) => `ประกอบชุดนี้ในเมนูที่ตรวจแล้ว ด่าน ${area}: ¥${price}`,
    cheaper: (saving) =>
      `ถ้าต้องการชิ้นส่วนชุดนี้ ซื้อสำเร็จรูปประหยัด ${saving} เยน ประกอบเองเมื่ออยากเปลี่ยนชิ้นส่วน`,
    equal: 'ราคาเท่ากัน ถ้าต้องการชุดนี้เลือกสำเร็จรูปได้เลย ประกอบเองเมื่ออยากเปลี่ยนชิ้นส่วน',
    diy: (saving) => `ประกอบชุดนี้เองประหยัด ${saving} เยน หากเข้าถึงเมนูที่ระบุได้`,
    shop: 'ดูร้านและชิ้นส่วนชุดสำเร็จรูป',
    menu: 'ดูตำแหน่งชิ้นนี้ในเมนูประกอบ',
    evidence: 'หลักฐานราคาและขอบเขตการเปรียบเทียบ',
    limit:
      'เทียบรหัสชิ้นส่วนชุดเดียวกันและราคา ไม่ใช่อันดับโอกาสกัดหรือจับสำเร็จ เมนูที่ตรวจอาจอยู่คนละด่านกับร้านสำเร็จรูป จึงไม่ได้หมายความว่าประกอบชุดนี้ได้ในทุกร้าน',
    sources: 'อ่านวิธีคิดราคาจาก ROM',
  },
  en: {
    title: 'Ready-made or custom fly?',
    contribution: (price) => `This component adds ¥${price} to a custom fly quote`,
    rule: 'The maker charges body + wing + tail; you do not buy loose parts first. None adds ¥0. Check the final quote and keep a free fly slot.',
    composition: (ids) => `Composition ${ids}`,
    ready: (stage, price) => `Ready-made in Area ${stage}: ¥${price}`,
    custom: (area, price) => `Make these parts in the verified Area ${area} menu: ¥${price}`,
    cheaper: (saving) =>
      `For these exact parts, buy ready-made to save ¥${saving}. Customize when you want different parts.`,
    equal:
      'The prices match. Buy ready-made for these parts; customize when you want different parts.',
    diy: (saving) => `Making these parts saves ¥${saving}, if you can reach the listed menu.`,
    shop: 'See ready-made shops and components',
    menu: 'Find this part in the maker menu',
    evidence: 'Price evidence and comparison limits',
    limit:
      'This compares identical component IDs and prices, not bite or landing odds. The verified maker menu may be in a different area from the ready-made shop; this does not establish availability in every maker.',
    sources: 'Read the ROM pricing research',
  },
  ja: {
    title: '既製フライと自作、どちらを選ぶ？',
    contribution: (price) => `この部品は自作フライの見積額に${price}円を加える`,
    rule: '自作の料金はボディ＋ウイング＋テールの合計。部品を先に購入する必要はない。「なし」は0円。支払う前に見積額とフライの空き枠を確認する。',
    composition: (ids) => `構成 ${ids}`,
    ready: (stage, price) => `エリア${stage}の既製品：${price}円`,
    custom: (area, price) => `確認済みのエリア${area}のメニューで自作：${price}円`,
    cheaper: (saving) =>
      `同じ部品の組み合わせなら既製品で${saving}円節約。部品を変えたいときに自作する。`,
    equal: '料金は同じ。この組み合わせなら既製品を選べる。部品を変えたいときに自作する。',
    diy: (saving) => `記載のメニューに行けるなら、自作で${saving}円節約できる。`,
    shop: '既製品の店と部品を見る',
    menu: '自作メニューでこの部品を探す',
    evidence: '料金の根拠と比較の範囲',
    limit:
      '同じ部品IDと料金の比較であり、食いつきや取り込み成功率の順位ではない。確認した自作メニューと既製品の店は別エリアの場合がある。すべての店で作れることは示していない。',
    sources: 'ROMの料金調査を読む',
  },
}

function verifiedMenu(item) {
  const choice = item?.flyMakerMenuChoice
  if (!item || !choice) return false
  return (
    choice?.id === item.id &&
    choice.category === item.category &&
    Number.isInteger(choice.area) &&
    choice.area >= 1 &&
    choice.area <= 6 &&
    typeof choice.familyJa === 'string' &&
    choice.familyJa.length > 0
  )
}

function verifiedQuote(bundle, allItems) {
  if (!bundle.body || bundle.body === '00') return null
  const refs = [
    ['fly', bundle.body],
    ['fly_wing', bundle.wing],
    ['fly_tail', bundle.tail],
  ]
  const parts = refs
    .filter(([, id]) => id !== '00')
    .map(([category, id]) => allItems.find((item) => item.category === category && item.id === id))
  if (
    !parts.length ||
    parts.some(
      (part) => !verifiedMenu(part) || !Number.isFinite(part.priceYen) || part.priceYen < 0,
    )
  )
    return null
  const menu = parts[0].flyMakerMenuChoice
  if (
    parts.some(
      (part) =>
        part.flyMakerMenuChoice.area !== menu.area ||
        part.flyMakerMenuChoice.familyJa !== menu.familyJa,
    )
  )
    return null
  if (menu.familyJa === 'テレストリアル' && (bundle.wing !== '00' || bundle.tail !== '00'))
    return null
  return {
    area: menu.area,
    price: Math.min(
      10000,
      parts.reduce((sum, part) => sum + part.priceYen, 0),
    ),
  }
}

function comparisonMarkup(ctx, assembly, allItems, c) {
  const quote = verifiedQuote(assembly.bundle, allItems)
  const ready = assembly.bundle.shopPriceYen
  if (!quote || !Number.isFinite(ready) || ready < 0) return ''
  const saving = quote.price - ready
  const decision = saving > 0 ? c.cheaper(saving) : saving === 0 ? c.equal : c.diy(-saving)
  const ids = [assembly.bundle.body, assembly.bundle.wing, assembly.bundle.tail].join(' / ')
  return `<article class="detail-section" data-fly-price-comparison="${ctx.esc(ids)}"><h3>${ctx.esc(c.composition(ids))}</h3><p><strong>${ctx.esc(c.ready(assembly.stage, ready))}</strong><br>${ctx.esc(c.custom(quote.area, quote.price))}</p><p class="rod-verdict">${ctx.esc(decision)}</p><a class="route-button" href="#fly-purchases">${ctx.esc(c.shop)} ↘</a></article>`
}

export function flyPriceChoice(ctx, item, allItems) {
  if (
    !categories.includes(item.category) ||
    !verifiedMenu(item) ||
    !Number.isFinite(item.priceYen) ||
    item.priceYen < 0
  )
    return ''
  const c = copy[ctx.lang] || copy.en
  const comparisons = flyAssemblies(ctx, item, allItems)
    .map((assembly) => comparisonMarkup(ctx, assembly, allItems, c))
    .join('')
  return `<section id="fly-price-choice" class="detail-section fly-price-choice" data-fly-price-choice="${ctx.esc(item.category)}:${ctx.esc(item.id)}"><h2>${ctx.esc(c.title)}</h2><p><strong>${ctx.esc(c.contribution(item.priceYen))}</strong></p><p>${ctx.esc(c.rule)}</p>${comparisons ? `<div class="detail-grid">${comparisons}</div>` : ''}<a class="route-button" href="#fly-menu-position">${ctx.esc(c.menu)} ↘</a><details class="fly-price-evidence"><summary>${ctx.esc(c.evidence)}</summary><p>${ctx.esc(c.limit)}</p><a href="../docs/fly-maker-menu-research.md">${ctx.esc(c.sources)} ↗</a></details></section>`
}
