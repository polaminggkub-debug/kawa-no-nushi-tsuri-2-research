const copy = {
  th: {
    title: 'ยามาเมะด่าน 1: สู้ปลาและดูผล',
    action:
      'ลองกด A แล้วปล่อยคั่นเป็นช่วง ๆ สำหรับยามาเมะด่าน 1: เป็นข้อเสนอทดลองจากเหตุการณ์เดียวและชุดที่ระบุ ไม่ใช่สูตรรับประกัน',
    surface:
      'เมื่อขึ้นข้อความว่าตกยามาเมะได้แล้ว กด A เพื่อไปต่อจนเห็นขนาด จากนั้นเปิดสมุดบันทึกการตกปลาตรวจบันทึก — A ตรงนี้เลื่อนข้อความผล ไม่ได้พิสูจน์ว่าเป็นปุ่มที่ทำให้จับได้',
    notebook: 'เปิดข้อมูลสมุดบันทึกการตกปลา (ไอเท็ม 05)',
    surfaceEvidence:
      'การเล่นซ้ำจากเซฟเหตุการณ์เดิมให้ผล 23 ซม. ตรงกันทั้งแบบต่อ 4 ช่วงและแบบรวม ในการเทียบช่วงผิวน้ำ 167 เฟรมเท่ากัน แบบกดเฉพาะ A ไปถึงผลและบันทึก 1/23/1 ส่วนไม่กดปุ่ม/กดเฉพาะขึ้น/กดเฉพาะ B ยังอยู่หน้าชื่อปลาที่จับได้และบันทึก 0/0/0 ไม่ใช่หลักฐานว่าปุ่มอื่นทำให้ปลาหนีหรือไม่มีวันไปต่อ',
    caughtName: 'หน้าชื่อปลาที่จับได้ ก่อนเลื่อนไปผลขนาด',
    surfaceResult: 'ผล 23 ซม. หลังใช้เฉพาะ A ในช่วงผิวน้ำ',
    result:
      'จากเหตุการณ์ธรรมชาติหนึ่งครั้ง เมื่อเวลาเล่นรวมและเวลาที่กด A รวมเท่ากัน แบบแบ่งกด/ปล่อยทำให้ปลายังอยู่ ส่วนแบบค้างยาวครั้งเดียวแล้วปล่อยจบด้วยปลาหนี ยังไม่ทราบจังหวะที่ดีที่สุดหรือสูตรที่รับประกันจับได้',
    evidence: 'ดูชุดที่ทดลองและหลักฐาน',
    setup:
      'ชุดที่ทดลอง: คัน 02 (คันคาร์บอนลำธาร 6m) · ทุ่น 04 (ทุ่นลูกบอล) · เบ็ด 06 (เบ็ดทั่วไป) · เหยื่อ 07 (แมลงน้ำ) ก่อนโยน · HP 100 ตามที่เกมทำงาน การกด A/B ค้างกับการปล่อยให้ผลต่างกัน ตราบที่ปลายังไม่ถึงค่าสายขาดยากของคัน',
    continuation:
      'ผล 23 ซม. มาจากการเล่นต่อด้วยปุ่มเพิ่มเติมหลังการเปรียบเทียบ ไม่ใช่ผลจับได้ทันทีจากจังหวะข้างต้น และยังไม่ยืนยันว่าช่วยเพิ่มโอกาสจับในชุดอื่น',
    trace: 'อ่านวิธีทดลอง ข้อจำกัด และโค้ดที่ตรวจ',
    escape: 'ภาพผลปลาหนีจากการกดค้าง',
    catch: 'ภาพ 23 ซม. หลังเล่นต่อแยกต่างหาก',
  },
  en: {
    title: 'Area 1 Yamame: fight and result controls',
    action:
      'Try A presses with release intervals for Area 1 Yamame: an experimental option from one encounter and the listed setup, not a guaranteed rhythm.',
    surface:
      'Once the caught-Yamame message appears, press A to advance to the size result, then check the Fishing Notebook. Here A advances the result message; it is not proven to cause the catch.',
    notebook: 'Open Fishing Notebook (Tool 05) details',
    surfaceEvidence:
      'A fresh replay of the retained encounter reproduced 23 cm with identical four-phase and flattened endpoints. At equal 167-frame surface time, A-only reached the result and record 1/23/1; neutral, Up-only and B-only remained at the caught-name message with record 0/0/0. This does not show other buttons cause escape or can never advance later.',
    caughtName: 'Caught-name message before the size result',
    surfaceResult: '23 cm result after A-only surface inputs',
    result:
      'In one natural encounter, schedules with the same total time and A-held time left the fish in the fight when split into presses and releases; one long hold followed by release ended in escape. No best rhythm or guaranteed catch is established.',
    evidence: 'Tested setup and evidence',
    setup:
      'Tested setup: rod 02 (Mountain stream carbon rod 6 m) · float 04 (Ball float) · hook 06 (Generic hook) · bait 07 (Aquatic insect) before casting · HP 100. In the game, holding A/B and releasing them give different results while the fish has not yet reached the rod’s line-strength limit.',
    continuation:
      'The 23 cm catch required a separate continuation with additional inputs after the comparison. It was not an immediate catch from the pattern above, and no catch advantage is established for other setups.',
    trace: 'Read the experiment, limitations and code trace',
    escape: 'Hold-input escape result',
    catch: '23 cm result after the separate continuation',
  },
  ja: {
    title: 'エリア1のヤマメ：ファイトと釣果表示',
    action:
      'エリア1のヤマメではAを押して離す操作を試せます。同じ1回の遭遇と記載装備に限る実験的な提案で、確実に釣れるリズムではありません。',
    surface:
      'ヤマメを釣りあげたメッセージが出たら、Aで大きさの結果まで進め、釣りノートで記録を確認してください。ここでのAは結果表示を進める操作で、釣れた原因とは証明されていません。',
    notebook: '釣りノート（道具05）の詳細を開く',
    surfaceEvidence:
      '保存した同じ遭遇の再実行で、4段階と連結実行の終了状態は一致し23cmを再現しました。水面側の167フレーム比較ではAのみが結果と記録1/23/1に進み、無入力・上のみ・Bのみは釣れた魚の名前表示で記録0/0/0でした。他のボタンで逃げる、または後で進めないという証明ではありません。',
    caughtName: '大きさの結果前の釣れた魚の名前表示',
    surfaceResult: '水面側でAのみを使った後の23cm結果',
    result:
      '自然発生した1回のファイトで、経過時間とAを押した合計時間を同じにすると、押す・離すを分けた操作では魚が残り、長く1回押してから離す操作では逃げられました。最適なリズムや必ず釣れる操作は未確認です。',
    evidence: '実験した装備と根拠',
    setup:
      '実験装備：竿02（渓流カーボン竿6m）・ウキ04（玉ウキ）・ハリ06（ハリ）・投げる前のエサ07（カワムシ）・HP100。ゲームでは、魚が竿の切れにくさの限界に達するまでは、A/Bを押している状態と離した状態を別に処理します。',
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
  const query = new URLSearchParams({
    category: 'general_tool',
    id: '05',
    stage: '1',
    return: ctx.currentFishPath(stage),
  })
  const notebookHref = `${ctx.itemPath()}?${query}`
  return `<section id="fight-controls" class="detail-section"><h2>${esc(text.title)}</h2><p><strong>${esc(text.action)}</strong></p><p data-fight-surface-progression>${esc(text.surface)} <a data-fight-notebook-action href="${esc(notebookHref)}">${esc(text.notebook)} ↗</a></p><details id="fight-controls-evidence"><summary>${esc(text.evidence)}</summary><p>${esc(text.result)}</p><p>${esc(text.setup)}</p><p>${esc(text.continuation)}</p><p>${esc(text.surfaceEvidence)} <a href="../research/assets/fight-a-surface-result.png">${esc(text.surfaceResult)} ↗</a></p><p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fight-input-research.md">${esc(text.trace)} ↗</a></p><div class="fight-captures"><figure><a href="../research/assets/fight-hold-escape.png"><img src="../research/assets/fight-hold-escape.png" alt="${esc(text.escape)}" loading="lazy"></a><figcaption>${esc(text.escape)}</figcaption></figure><figure><a href="../research/assets/fight-release-catch.png"><img src="../research/assets/fight-release-catch.png" alt="${esc(text.catch)}" loading="lazy"></a><figcaption>${esc(text.catch)}</figcaption></figure><figure><a href="../research/assets/fight-caught-name.png"><img src="../research/assets/fight-caught-name.png" alt="${esc(text.caughtName)}" loading="lazy"></a><figcaption>${esc(text.caughtName)}</figcaption></figure></div></details></section>`
}
