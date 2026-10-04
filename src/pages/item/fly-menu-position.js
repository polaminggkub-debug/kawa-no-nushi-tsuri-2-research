const text = {
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
    evidence: 'หลักฐานและขอบเขต',
    limit:
      'ยืนยันตำแหน่งเฉพาะเมนูเมย์ฟลายในร้านด่าน 1 ตำแหน่งบอกว่าชิ้นไหน ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย',
    notes: 'อ่านการวิจัยตำแหน่งเมนู',
  },
}

export function flyMenuPosition(ctx, item) {
  const choice = item.flyMakerMenuChoice
  if (!choice) return ''
  const c = text[ctx.lang] || text.en
  const moves = [
    choice.column > 1 ? c.right(choice.column - 1) : '',
    choice.row > 1 ? c.down(choice.row - 1) : '',
    c.confirm,
  ].filter(Boolean)
  const instructions = moves.join(' → ')
  const position = c.position(choice.row, choice.column)
  const omitTail =
    choice.part === 'tail' ? `<p class="fly-menu-none-tail">${ctx.esc(c.noneTail)}</p>` : ''
  return `<section id="fly-menu-position" class="detail-section fly-menu-position" data-fly-menu-position="${ctx.esc(item.category)}:${ctx.esc(item.id)}"><h2>${ctx.esc(c.title)}</h2><p>${ctx.esc(c.scope)}</p><p><strong>${ctx.esc(position)}</strong> · ${ctx.esc(c.start)}</p><p class="rod-verdict">${ctx.esc(instructions)}</p>${omitTail}<figure><a href="${ctx.esc(choice.image)}" target="_blank" rel="noopener"><img src="${ctx.esc(choice.image)}" alt="${ctx.esc(position)}" width="256" height="224" loading="lazy"></a><figcaption>${ctx.esc(c.caption)}</figcaption></figure><details><summary>${ctx.esc(c.evidence)}</summary><p>${ctx.esc(c.limit)}</p><a href="${ctx.esc(choice.evidenceHref)}">${ctx.esc(c.notes)} ↗</a></details></section>`
}
