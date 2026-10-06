import { readableEvidenceHref } from '../../shared/lib/index.js'
import { flyMakerAccess } from './fly-maker-access.js'

const mayfly = {
  en: {
    title: 'Find this component in the game menu',
    scope: 'Area 1 · choose Mayfly (メイフライ) at the fly maker',
    start: 'Each part starts at the top-left cursor.',
    right: (n) => `Right ${n} time${n === 1 ? '' : 's'}`,
    down: (n) => `Down ${n} time${n === 1 ? '' : 's'}`,
    confirm: 'A to select',
    position: (r, c) => `Row ${r}, column ${c}`,
    caption: 'Original game frame: the cursor marks this choice. Tap to enlarge.',
    noneTail: 'To omit the tail, start at top-left: Right 2 → Down 1 → A (無し).',
    evidence: 'Evidence and limits',
    limit:
      'Verified in this Area 1 Mayfly menu only. Position identifies the component; it does not establish a bite or landing advantage. Check the final quote before paying.',
    notes: 'Read the menu-position research',
  },
  ja: {
    title: 'ゲームのメニューでこの部品を選ぶ',
    scope: 'エリア1 · 毛バリ作成で「メイフライ」を選択',
    start: '各部品の初期カーソルは左上です。',
    right: (n) => `右${n}回`,
    down: (n) => `下${n}回`,
    confirm: 'Aで決定',
    position: (r, c) => `${r}行目・${c}列目`,
    caption: 'ゲームの元画像。カーソルがこの選択肢を示します。タップで拡大。',
    noneTail: 'テールを付けない場合：左上から右に2回、下に1回移動し、「無し」でAを押します。',
    evidence: '根拠と確認範囲',
    limit:
      'エリア1のメイフライ画面で確認した位置です。部品の識別であり、食いつきや取り込み効果の証明ではありません。支払い前に見積額を確認してください。',
    notes: 'メニュー位置の調査を読む',
  },
  th: {
    title: 'เลือกชิ้นนี้ตรงไหนในเมนูเกม?',
    scope: 'ร้านด่าน 1 · เลือกเมย์ฟลาย (メイフライ) ตอนประกอบฟลาย',
    start: 'แต่ละเมนูเริ่มจากเคอร์เซอร์ซ้ายบน',
    right: (n) => `ขวา ${n} ครั้ง`,
    down: (n) => `ลง ${n} ครั้ง`,
    confirm: 'กด A เลือก',
    position: (r, c) => `แถว ${r} · คอลัมน์ ${c}`,
    caption: 'ภาพเกมจริง เคอร์เซอร์ชี้ตัวเลือกนี้ แตะรูปเพื่อขยาย',
    noneTail: 'ถ้าไม่ใส่หาง ให้เริ่มจากซ้ายบน: กดขวา 2 ครั้ง → ลง 1 ครั้ง → A ที่ “ไม่มี” (無し)',
    evidence: 'หลักฐานและข้อจำกัด',
    limit:
      'ยืนยันตำแหน่งเฉพาะเมนูเมย์ฟลายในร้านด่าน 1 ตำแหน่งบอกว่าชิ้นไหน ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย',
    notes: 'อ่านการวิจัยตำแหน่งเมนู',
  },
}

const otherFamilies = {
  en: {
    family: {
      カディス: 'Caddis',
      テレストリアル: 'Terrestrial',
      ディプテラ: 'Diptera',
      ストーンフライ: 'Stonefly',
    },
    scope: (area, family, familyJa) =>
      `Area ${area} · choose ${family} (${familyJa}) at the fly maker`,
    none: (part, instructions) =>
      `To choose None for the ${part}, start at top-left: ${instructions} (無し).`,
    directQuote:
      'After selecting this Terrestrial body, the game skips wing and tail selection and opens the quote.',
    limit: (area, family) =>
      `Verified only in this Area ${area} ${family} menu. Position identifies the component; it does not establish a bite or landing advantage. Check the final quote before paying.`,
    controlledScope: (family, familyJa) =>
      `When the maker offers ${family} (${familyJa}), choose that family first.`,
    controlledLimit:
      'These positions were independently replayed in a controlled even-area menu fixture. This verifies the palette, not the walking route or natural shop access. No bite or landing advantage is established; check the final quote before paying.',
  },
  ja: {
    family: {
      カディス: 'カディス',
      テレストリアル: 'テレストリアル',
      ディプテラ: 'ディプテラ',
      ストーンフライ: 'ストーンフライ',
    },
    scope: (area, family) => `エリア${area} · 「${family}」のフライを作成`,
    none: (part, instructions) => `「${part}」で「無し」を選ぶ場合：左上から${instructions}`,
    directQuote:
      'このテレストリアル・ボディを選ぶと、ウィングとテールの選択画面を飛ばして見積額へ進みます。',
    limit: (area, family) =>
      `確認したのはエリア${area}の${family}メニューだけです。位置は部品の識別であり、食いつきや取り込み効果を示しません。支払前に見積額を確認してください。`,
    controlledScope: (family) => `作成メニューに「${family}」がある場合、まずその系統を選びます。`,
    controlledLimit:
      '偶数エリアのメニューを再現した制御条件で、部品位置を独立に再確認しました。通常プレイでの店への経路や利用可能時期の証明ではありません。釣果の優位も未確認です。支払前に見積額を確認してください。',
  },
  th: {
    family: {
      カディス: 'แคดดิส',
      テレストリアル: 'แมลงบก',
      ディプテラ: 'ดิปเทอรา',
      ストーンフライ: 'สโตนฟลาย',
    },
    scope: (area, family, familyJa) =>
      `ร้านด่าน ${area} · เลือก${family} (${familyJa}) ตอนประกอบฟลาย`,
    none: (part, instructions) =>
      `ถ้าจะเลือก “ไม่มี” (無し) ในเมนู${part} ให้เริ่มจากซ้ายบน: ${instructions}`,
    directQuote: 'หลังเลือกบอดี้แมลงบกนี้ เกมข้ามเมนูปีกและหาง แล้วไปหน้าเสนอราคาเลย',
    limit: (area, family) =>
      `ยืนยันตำแหน่งเฉพาะเมนู${family}ในร้านด่าน ${area} ตำแหน่งบอกว่าชิ้นไหน ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย`,
    controlledScope: (family, familyJa) =>
      `เมื่อร้านมีตัวเลือก${family} (${familyJa}) ให้เลือกตระกูลนี้ก่อน`,
    controlledLimit:
      'ตรวจตำแหน่งซ้ำอย่างอิสระจากเมนูด่านเลขคู่ที่จำลองในสภาวะควบคุม ยืนยันช่องเลือกชิ้นส่วน แต่ยังไม่ได้ยืนยันเส้นทางเดินหรือการเข้าร้านจากการเล่นปกติ ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย',
  },
}

function instructionsFor(copy, row, column) {
  return [column > 1 ? copy.right(column - 1) : '', row > 1 ? copy.down(row - 1) : '', copy.confirm]
    .filter(Boolean)
    .join(' → ')
}

function otherFamilyCopy(lang, choice) {
  const copy = otherFamilies[lang] || otherFamilies.en
  const family = copy.family[choice.familyJa] || choice.familyJa
  const area = choice.area || 1
  return {
    ...mayfly[lang],
    scope:
      choice.controlledFixture && !choice.access
        ? copy.controlledScope(family, choice.familyJa)
        : copy.scope(area, family, choice.familyJa),
    limit: choice.controlledFixture ? copy.controlledLimit : copy.limit(area, family),
    none: copy.none,
    directQuote: copy.directQuote,
  }
}

function nonePositionInstructions(copy, choice, lang) {
  const row = choice.nonePosition?.row
  const column = choice.nonePosition?.column
  if (!row || !column) return ''
  const movement = [
    column > 1 ? copy.right(column - 1) : '',
    row > 1 ? copy.down(row - 1) : '',
    copy.confirm,
  ]
    .filter(Boolean)
    .join(' → ')
  const part =
    choice.part === 'wing'
      ? { en: 'wing', ja: 'ウィング', th: 'ปีก' }
      : { en: 'tail', ja: 'テール', th: 'หาง' }
  return copy.none(part[lang], movement)
}

export function flyMenuPosition(ctx, item) {
  const choice = item.flyMakerMenuChoice
  if (!choice) return ''
  const lang = ctx.lang in mayfly ? ctx.lang : 'en'
  const isMayfly = !choice.familyJa || choice.familyJa === 'メイフライ'
  const copy = isMayfly ? mayfly[lang] : otherFamilyCopy(lang, choice)
  const instructions = instructionsFor(copy, choice.row, choice.column)
  const position = copy.position(choice.row, choice.column)
  const scope = choice.access
    ? copy.scope.replace(/^(?:Area \d+|ร้านด่าน \d+|エリア\d+) · /, '')
    : copy.scope
  const noneInstructions =
    isMayfly && choice.part === 'tail'
      ? `<p class="fly-menu-none-tail">${ctx.esc(copy.noneTail)}</p>`
      : choice.nonePosition
        ? `<p class="fly-menu-none-tail">${ctx.esc(nonePositionInstructions(copy, choice, lang))}</p>`
        : ''
  const nextStep =
    choice.nextStep === 'quote'
      ? `<p class="fly-menu-next-step rod-verdict">${ctx.esc(copy.directQuote)}</p>`
      : ''
  return `<section id="fly-menu-position" class="detail-section fly-menu-position" data-fly-menu-position="${ctx.esc(item.category)}:${ctx.esc(item.id)}"><h2>${ctx.esc(copy.title)}</h2><p>${ctx.esc(scope)}</p>${flyMakerAccess(ctx, item)}<p><strong>${ctx.esc(position)}</strong> · ${ctx.esc(copy.start)}</p><p class="rod-verdict">${ctx.esc(instructions)}</p>${noneInstructions}${nextStep}<figure><a href="${ctx.esc(choice.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(choice.image)}" alt="${ctx.esc(position)}" width="256" height="224" loading="lazy"></a><figcaption>${ctx.esc(copy.caption)}</figcaption></figure><details><summary>${ctx.esc(copy.evidence)}</summary><p>${ctx.esc(copy.limit)}</p><a href="${ctx.esc(readableEvidenceHref(choice.evidenceHref))}">${ctx.esc(copy.notes)} ↗</a></details></section>`
}
