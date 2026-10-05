const copy = {
  th: {
    title: 'ยามาเมะหนีตอนกด A ค้าง? ลองเปลี่ยนจังหวะ',
    action: 'ลองกด A แล้วปล่อยคั่นเป็นช่วง ๆ เป็นทางเลือกทดลองสำหรับยามาเมะด่าน 1',
    result:
      'จากเหตุการณ์ธรรมชาติหนึ่งครั้ง เมื่อเวลาเล่นรวมและเวลาที่กด A รวมเท่ากัน แบบแบ่งกด/ปล่อยทำให้ปลายังอยู่ ส่วนแบบค้างยาวครั้งเดียวแล้วปล่อยจบด้วยปลาหนี ยังไม่ทราบจังหวะที่ดีที่สุดหรือสูตรที่รับประกันจับได้',
    evidence: 'ดูชุดที่ทดลองและหลักฐาน',
    setup:
      'ชุดที่ทดลอง: คัน 02 · ทุ่น 04 · ตะขอ 06 · เหยื่อ 07 ก่อนโยน · HP 100 เกมอ่านการกด A/B ค้างกับการปล่อยต่างกันในแขนงที่ตรวจ ขณะปลายังไม่ถึงขอบเขตของคัน',
    continuation:
      'ผล 23 ซม. มาจากการเล่นต่อด้วยปุ่มเพิ่มเติมหลังการเปรียบเทียบ ไม่ใช่ผลจับได้ทันทีจากจังหวะข้างต้น และยังไม่ยืนยันว่าช่วยเพิ่มโอกาสจับในชุดอื่น',
    trace: 'อ่านวิธีทดลอง ข้อจำกัด และโค้ดที่ตรวจ',
    escape: 'ภาพผลปลาหนีจากการกดค้าง',
    catch: 'ภาพ 23 ซม. หลังเล่นต่อแยกต่างหาก',
  },
  en: {
    title: 'Yamame escaping while you hold A? Try changing the rhythm',
    action: 'Try pressing A with release intervals as an experimental option for Area 1 Yamame.',
    result:
      'In one natural encounter, schedules with the same total time and A-held time left the fish in the fight when split into presses and releases; one long hold followed by release ended in escape. No best rhythm or guaranteed catch is established.',
    evidence: 'Tested setup and evidence',
    setup:
      'Tested setup: rod 02 · float 04 · hook 06 · bait 07 before casting · HP 100. The traced game branch treats held A/B and released input differently while the fish remains below the rod boundary.',
    continuation:
      'The 23 cm catch required a separate continuation with additional inputs after the comparison. It was not an immediate catch from the pattern above, and no catch advantage is established for other setups.',
    trace: 'Read the experiment, limitations and code trace',
    escape: 'Hold-input escape result',
    catch: '23 cm result after the separate continuation',
  },
  ja: {
    title: 'Aを押し続けるとヤマメに逃げられる？ 押し方を変えてみる',
    action: 'エリア1のヤマメでは、Aを押して離す操作を試す選択肢があります。実験段階の提案です。',
    result:
      '自然発生した1回のファイトで、経過時間とAを押した合計時間を同じにすると、押す・離すを分けた操作では魚が残り、長く1回押してから離す操作では逃げられました。最適なリズムや必ず釣れる操作は未確認です。',
    evidence: '実験した装備と根拠',
    setup:
      '実験装備：竿02・ウキ04・ハリ06・投げる前のエサ07・HP100。調べたゲーム分岐では、魚が竿の境界に達するまではA/Bを押している状態と離した状態を別に処理します。',
    continuation:
      '23cmの釣果は比較後に別の追加操作を行った結果です。上のリズムだけで直ちに釣れた結果ではなく、他の装備で釣果が上がることも未確認です。',
    trace: '実験方法・制限・コードを読む',
    escape: '押し続けた操作の逃走結果',
    catch: '別の追加操作後の23cmの結果',
  },
}

export function renderFightControls(ctx, stage) {
  if (ctx.id !== '03' || String(stage) !== '1') return ''
  const text = copy[ctx.locale] || copy.en
  const esc = ctx.escapeHtml
  return `<section id="fight-controls" class="detail-section"><h2>${esc(text.title)}</h2><p><strong>${esc(text.action)}</strong></p><p>${esc(text.result)}</p><details id="fight-controls-evidence"><summary>${esc(text.evidence)}</summary><p>${esc(text.setup)}</p><p>${esc(text.continuation)}</p><p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fight-input-research.md">${esc(text.trace)} ↗</a></p><div class="fight-captures"><figure><a href="../research/assets/fight-hold-escape.png"><img src="../research/assets/fight-hold-escape.png" alt="${esc(text.escape)}" loading="lazy"></a><figcaption>${esc(text.escape)}</figcaption></figure><figure><a href="../research/assets/fight-release-catch.png"><img src="../research/assets/fight-release-catch.png" alt="${esc(text.catch)}" loading="lazy"></a><figcaption>${esc(text.catch)}</figcaption></figure></div></details></section>`
}
