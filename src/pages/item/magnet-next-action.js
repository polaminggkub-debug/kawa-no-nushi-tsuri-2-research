const copy = {
  th: {
    title: 'ด่าน 6 ใช้แม่เหล็กแล้วไม่บอกทิศ: ทำอะไรต่อ?',
    action:
      'ยังไม่ต้องซื้อแม่เหล็กเพิ่ม ใช้แผนที่เลือกปลาและจุดตกได้เลยระหว่างตรวจความคืบหน้าเรื่องราว',
    notebook:
      'รวมจำนวนจากสมุดเกมทั้ง 6 หน้า ต้องบันทึกอย่างน้อย 65 ชนิดที่ต่างกันจาก 66 ชนิด ไม่ใช่ตก 65 ครั้ง และยังมีเงื่อนไขเรื่องราวอีกด้วย ครบ 65 ชนิดอย่างเดียวจึงไม่รับประกันว่าจะบอกทิศ',
    checklist: 'เทียบชื่อปลากับเช็กลิสต์สมุด',
    map: 'เลือกจุดตกด่าน 6 บนแผนที่',
    postcard:
      'หลังเทียบสมุด ให้อ่านไปรษณียบัตรที่ได้รับ (06) ในเกม ถ้าข้อความหมอขอปลาไหลใหญ่ปรากฏ การอ่านครั้งนั้นจะเปิดทิศแม่เหล็กด่าน 6 ถ้ายังไม่ปรากฏ เงื่อนไขเรื่องราวอาจยังไม่ครบ',
    mail: 'ดูคำแนะนำไปรษณียบัตรและจุดปลาไหลใหญ่',
    evidence: 'เงื่อนไขที่ยืนยันและสิ่งที่ยังต้องค้นคว้า',
    limit:
      'ROM ยืนยันจำนวนช่องสมุดและเงื่อนไขเรื่องราว แต่ยังไม่มีลำดับการเล่นตามปกติที่ยืนยันครบเพื่อเปิดเงื่อนไขนั้น เช็กลิสต์เว็บไม่อ่านเซฟเกมและไม่ปลดล็อกเกม',
    source: 'อ่านหลักฐานเงื่อนไขเรื่องราว',
    noticeSource: 'หลักฐานการอ่านไปรษณียบัตร',
    general: 'วิธีใช้แม่เหล็กทั่วไปและคำแนะนำซื้อ',
  },
  en: {
    title: 'No Magnet heading in Area 6: what next?',
    action:
      'Do not buy another Magnet yet. Use the map to choose fish and fishing spots while checking story progress.',
    notebook:
      'Add the counts on all six in-game notebook pages. At least 65 distinct species records out of 66 are required, not 65 catches. A story prerequisite is also required, so 65 records alone do not guarantee a heading.',
    checklist: 'Compare fish names with the notebook checklist',
    map: 'Choose Area 6 fishing spots on the map',
    postcard:
      'After checking the notebook, read Received postcard 06 in the game. If the doctor’s giant-eel request appears, that read enables the Area 6 Magnet heading. If it does not appear, the story prerequisite may still be missing.',
    mail: 'See postcard guidance and the giant-eel point',
    evidence: 'Verified conditions and remaining research',
    limit:
      'ROM evidence establishes the notebook count and story gate, but a complete ordinary-play sequence to unlock the prerequisite is not yet verified. The web checklist does not read your save or unlock the game.',
    source: 'Read the story-gate evidence',
    noticeSource: 'Postcard reader evidence',
    general: 'General Magnet use and buying advice',
  },
  ja: {
    title: 'エリア6で磁石が方角を示さないときは？',
    action:
      '磁石をもう一つ買う必要はまだありません。物語の進行を確認する間も、地図で魚と釣り場を選べます。',
    notebook:
      'ゲーム内の図鑑6ページの数を合計してください。66種類のうち異なる65種類以上の記録が必要です。65回釣るという意味ではありません。物語の前提条件もあるため、65種類だけで方角が出るとは限りません。',
    checklist: '図鑑チェックリストと魚名を照合する',
    map: '地図でエリア6の釣り場を選ぶ',
    postcard:
      '図鑑を確認したら、ゲーム内で受け取ったハガキ06を読んでください。医者のオオウナギ依頼が出たとき、その読み取りでエリア6の磁石の方角表示が有効になります。出ない場合、物語の前提条件がまだ足りない可能性があります。',
    mail: 'ハガキの案内とオオウナギの地点を見る',
    evidence: '確認した条件と未解決点',
    limit:
      'ROMで図鑑の数と物語の条件を確認していますが、前提条件を解除する通常プレイの全手順は未検証です。ウェブのチェックリストはセーブを読み取らず、ゲームの条件も解除しません。',
    source: '物語条件の根拠を読む',
    noticeSource: 'ハガキ読み取りの根拠',
    general: '磁石の基本操作と購入の目安',
  },
}

function returnQuery(ctx) {
  const query = new URLSearchParams({ stage: '6' })
  const returned = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returned) query.set('return', returned)
  return query
}

function generalUse(ctx, item, c) {
  const summary = ctx.local(item.playerUse?.summary) || ''
  const facts = item.playerUse?.facts?.[ctx.lang] || []
  const note = item[`imageNote${ctx.lang === 'th' ? 'Th' : ctx.lang === 'ja' ? 'Ja' : 'En'}`] || ''
  return `<details class="magnet-general-use"><summary>${ctx.esc(c.general)}</summary><p>${ctx.esc(summary)}</p><ul>${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join('')}</ul><p class="muted">${ctx.esc(note)}</p></details>`
}

export function magnetNextAction(ctx, item, allItems) {
  if (item.category !== 'general_tool' || item.id !== '0E' || Number(ctx.selectedStage) !== 6)
    return ''
  const c = copy[ctx.lang] || copy.en
  const query = returnQuery(ctx)
  const map = `${ctx.mapsPage[ctx.lang]}?${query}`
  const postcard = allItems.find(
    (candidate) => candidate.category === 'general_tool' && candidate.id === '06',
  )
  const mailQuery = returnQuery(ctx)
  mailQuery.set('category', 'general_tool')
  mailQuery.set('id', '06')
  const mail = postcard
    ? `<p>${ctx.esc(c.postcard)}</p><a class="route-button" data-magnet-mail href="${ctx.esc(ctx.localePage[ctx.lang] + '?' + mailQuery)}">${ctx.esc(c.mail)} ↗</a>`
    : ''
  return `<section id="what-to-do" class="decision-panel magnet-next-action" data-magnet-next-action><h2>${ctx.esc(c.title)}</h2><p><strong>${ctx.esc(c.action)}</strong></p><p>${ctx.esc(c.notebook)}</p><p><a class="route-button" data-magnet-notebook href="${ctx.esc(map + '#notebook-guide')}">${ctx.esc(c.checklist)} ↗</a></p><p><a class="route-button" data-magnet-map href="${ctx.esc(map + '#map-view')}">${ctx.esc(c.map)} ↗</a></p>${mail}${generalUse(ctx, item, c)}<details class="magnet-story-evidence"><summary>${ctx.esc(c.evidence)}</summary><p>${ctx.esc(c.limit)}</p><a href="../docs/magnet-story-gate-research.md">${ctx.esc(c.source)} ↗</a><br><a href="../docs/quest-tool-use-research.md">${ctx.esc(c.noticeSource)} ↗</a></details></section>`
}
