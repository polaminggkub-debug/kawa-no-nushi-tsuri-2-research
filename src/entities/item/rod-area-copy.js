const COPY = {
  en: {
    styles: { 1: 'Float/Ayu', 2: 'casting', 4: 'lure', 8: 'fly' },
    labels: {
      only: '{area}: only same-style rod listed',
      dominated: '{area}: buy {otherId} instead — {betterReason}{hpNote}',
      dual: '{area}: choose for lowest price, longest aim{hpNote} and farthest traced limit',
      cheapest: '{area}: lowest new-purchase price',
      aim: '{area}: longest aim window{hpNote}',
      aimChoice: '{area}: choose {id} when {comparison}{hpNote}',
      boundary: '{area}: choose for the longest limit before tackle-loss risk',
      boundaryPeerCheapest:
        '{area}: choose {id} for the farthest limit at the lowest price among those rods',
      boundaryPeerAim:
        '{area}: choose {id} for more aim time than {otherId} at the same farthest limit{hpNote}',
      tradeoff: '{area}: choose {id} when {comparison}{hpNote}',
      tradeoffFallback: '{area}: choose {id} when {comparison}{hpNote}',
      itemMissing:
        '{area}: no offer for {id}; lowest-price local option is {budgetId} ({budgetPrice})',
      styleMissing:
        '{area}: no same-style offer; {direction} numbered-area offer: ID {nextId} in Area {nextStage}',
      styleNever: '{area}: no same-style offer recorded in any numbered area',
    },
    comparison: {
      aimMore: 'it gives you more time to adjust the target than the cheaper rod {id}',
      aimLess: 'it gives you less time to adjust the target than the cheaper rod {id}',
      boundaryMore:
        'it lets the fish move farther than with the cheaper rod {id} before the traced tackle-loss branch',
      boundaryLess:
        'the fish reaches the traced tackle-loss branch closer than with the cheaper rod {id}',
      aimMoreAny: 'it gives you more time to adjust the target than rod {id}',
      aimLessAny: 'it gives you less time to adjust the target than rod {id}',
      boundaryMoreAny:
        'it lets the fish move farther than with rod {id} before the traced tackle-loss branch',
      boundaryLessAny: 'the fish reaches the traced tackle-loss branch closer than with rod {id}',
      versus: '{benefits}',
      higherPrice: 'Rod {id} costs more at {price}; {comparison}{hpNote}.',
      cheaper: 'a lower full new-purchase price',
      samePrice: 'the same full new-purchase price',
      and: ' and ',
      but: ', but ',
    },
    recommendation: {
      only: 'This is the only {style} rod with a recorded offer in {area}: {stats}. Its aim cutoff gives more time to move the target; its ×{boundary} value is one traced fish-position limit before a tackle-loss escape. Choose it if you need this style here; keep it if already owned.',
      dominated:
        'For a new {style} rod in {area}, choose {otherId} ({otherStats}) over {id} ({stats}): {betterReason}. Keep {id} if you own it; fish-specific differences remain unresolved.',
      dual: 'Choose {id} in {area} if you need a new {style} rod: it has the lowest full price ({price}), gives the longest time to adjust the target ({aim}){hpNote}, and lets the fish move farthest before one traced tackle-loss branch (×{boundary}). Keep an owned rod.',
      cheapest:
        'Choose {id} to pay the lowest recorded full price in {area} ({price}). {aimLine} {boundaryLine} These are full new-purchase quotes, not trade-in costs; keep a rod you already own.',
      aim: 'Choose {id} in {area} when extra time to move the target matters: its aim cutoff ({aim}){hpNote} is the highest among local {style} offers. {budgetLine} {boundaryLine}',
      aimChoice:
        'Choose {id} at full new-purchase price {price} when {comparison}{hpNote}. The cheaper option is {lowerId} at {lowerPrice}; keep a rod you already own.',
      boundary:
        'Choose {id} in {area} when the largest recorded fish-position limit before one traced tackle-loss escape matters (×{boundary}). {budgetLine} {aimLine}',
      boundaryPeerCheapest:
        'Choose {id} for the farthest recorded fish-position limit at the lowest full price among rods tied on that limit ({price}). {otherId} costs {otherPrice} for more time to adjust the target{hpNote} at the same limit.',
      boundaryPeerAim:
        'Choose {id} when you want more time to adjust the target than {otherId}{hpNote} while keeping the same farthest recorded fish-position limit. Full new-purchase price: {price} versus {otherPrice}.',
      tradeoff:
        '{id} has a tradeoff among local {style} offers: {lowerLine} {higherLine} Choose based on the full new-purchase price and the aim and boundary values you need.',
      itemMissing:
        '{id} has no recorded offer in {area}. The same-style rods listed here are {options}. Keep {id} if owned. For a new purchase: {budgetLine} {aimLine} {boundaryLine} These are only price, aim and traced-boundary comparisons; they do not rank catch success.',
      styleMissing:
        '{area} has no recorded {style} rod offer. The {direction} numbered area with same-style shop records is Area {nextStage}: {options}. Keep {id} if owned; this is a shop-stock route, not a claim that the rod cannot be obtained another way.',
      aimLeader:
        'The longest local aim window is {id} ({stats}), giving more time to move the target.',
      aimOther: '{id} ({stats}) gives more time to move the target.',
      boundaryLeader:
        'The largest local limit is {id} ({stats}); it lets the fish move farther before one traced tackle-loss escape branch.',
      boundaryOther:
        '{id} ({stats}) has a larger limit before one traced tackle-loss escape branch.',
      budgetLeader: 'The lowest full-price quote is {id} ({stats}).',
      budgetOther: '{id} ({stats}) has the lowest full-price quote.',
      step: 'Compared with {otherId} ({otherStats}), {choiceId} has full price {price} (from {otherPrice}), aim cutoff {aim} (from {otherAim}), and loss limit ×{boundary} (from ×{otherBoundary}).',
      area: 'Area {stage}',
      reason:
        'This choice is based on recorded same-style shop offers and the listed price and two decoded values only.',
      styleNever:
        'No {style} rod has a recorded shop offer in the six areas. Keep {id} if owned; no shop purchase location is established.',
      tradeoffChoice:
        'Choose {id} at the full new-purchase price {price} when {comparison}{hpNote}. {higherLine} Keep a rod you already own. Fish-specific advantage remains unresolved.',
      noHigher: '',
      scope:
        'Comparison scope: recorded same-style shop stock, full new-purchase price, aim cutoff and one traced fish-position threshold before a tackle-loss escape. This does not rank bites, landed fish or fish-specific advantage.{hp}{fly}',
      hp: ' Aim values for lure/casting rods assume HP 100 and shorten below 100.',
      fly: ' The fly rod’s separate half-value threshold is omitted because its effect is unresolved.',
      noHp: '',
      noFly: '',
      next: 'next',
      previous: 'previous',
      and: ' and ',
    },
  },
  th: {
    styles: { 1: 'สายทุ่น/อายุ', 2: 'ตีเหยื่อ', 4: 'ลัวร์', 8: 'ฟลาย' },
    labels: {
      only: 'ด่าน {stage}: มีคันรูปแบบนี้ขายเพียงคันเดียว',
      dominated: 'ด่าน {stage}: ซื้อคัน {otherId} แทน — {betterReason}{hpNote}',
      dual: 'ด่าน {stage}: เลือกเมื่ออยากจ่ายถูกสุด ได้เวลาเล็งนานสุด{hpNote}และปลาออกได้ไกลสุด',
      cheapest: 'ด่าน {stage}: ซื้อใหม่ราคาเต็มต่ำสุด',
      aim: 'ด่าน {stage}: เวลาเล็งสูงสุด{hpNote}',
      aimChoice: 'ด่าน {stage}: เลือกคัน {id} เมื่อ{comparison}{hpNote}',
      boundary: 'ด่าน {stage}: เลือกเมื่ออยากให้ปลาออกไปได้ไกลก่อนเสี่ยงเสียอุปกรณ์',
      boundaryPeerCheapest: 'ด่าน {stage}: เลือกคัน {id} เพื่อได้ขอบเขตไกลสุดในราคาต่ำสุดของกลุ่ม',
      boundaryPeerAim:
        'ด่าน {stage}: เลือกคัน {id} เพื่อเล็งได้นานกว่าคัน {otherId} โดยยังได้ขอบเขตไกลสุด{hpNote}',
      tradeoff: 'ด่าน {stage}: เลือกคัน {id} เมื่อ{comparison}{hpNote}',
      tradeoffFallback: 'ด่าน {stage}: เลือกคัน {id} เมื่อ{comparison}{hpNote}',
      itemMissing:
        'ด่าน {stage}: ไม่มีรายการขายคัน {id}; ตัวเลือกถูกสุดในด่านนี้คือ {budgetId} ({budgetPrice})',
      styleMissing:
        'ด่าน {stage}: ไม่มีรายการขายรูปแบบนี้; ด่าน{direction}ที่มีคือคัน {nextId} ในด่าน {nextStage}',
      styleNever: 'ด่าน {stage}: ไม่พบรายการขายคันรูปแบบนี้ที่บันทึกไว้ทั้งหกด่าน',
    },
    comparison: {
      aimMore: 'ให้เวลาขยับเป้าได้นานกว่าคันราคาต่ำกว่า {id}',
      aimLess: 'ให้เวลาขยับเป้าได้น้อยกว่าคันราคาต่ำกว่า {id}',
      boundaryMore: 'ปลาออกไปได้ไกลกว่าคันราคาต่ำกว่า {id} ก่อนเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์',
      boundaryLess: 'ปลาเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์เมื่ออยู่ใกล้กว่าคันราคาต่ำกว่า {id}',
      aimMoreAny: 'ให้เวลาขยับเป้าได้นานกว่าคัน {id}',
      aimLessAny: 'ให้เวลาขยับเป้าได้น้อยกว่าคัน {id}',
      boundaryMoreAny: 'ปลาออกไปได้ไกลกว่าคัน {id} ก่อนเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์',
      boundaryLessAny: 'ปลาเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์เมื่ออยู่ใกล้กว่าคัน {id}',
      versus: '{benefits}',
      higherPrice: 'คัน {id} ราคาเต็มสูงกว่า ({price}) และ{comparison}{hpNote}',
      cheaper: 'ราคาเต็มซื้อใหม่ถูกกว่า',
      samePrice: 'ราคาเต็มซื้อใหม่เท่ากัน',
      and: ' และ',
      but: ' แต่',
    },
    recommendation: {
      only: 'นี่เป็นคัน{style}คันเดียวที่มีรายการขายใน{area}: {stats} เวลาเล็งที่สูงขึ้นเพิ่มเวลาขยับเป้าหมาย; ค่า ×{boundary} คือขอบเขตตำแหน่งปลาก่อนเข้าเส้นทางเสียอุปกรณ์หนึ่งแบบ เลือกเมื่อจำเป็นต้องใช้รูปแบบนี้ในด่านนี้; ถ้ามีอยู่แล้วใช้ต่อได้',
      dominated:
        'ถ้าจะซื้อคัน{style}ใหม่ใน{area} ให้เลือกคัน {otherId} ({otherStats}) แทนคัน {id} ({stats}): {betterReason} ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้; ผลเฉพาะปลายังไม่ยืนยัน',
      dual: 'ถ้าต้องซื้อคัน{style}ใหม่ใน{area} ให้เลือกคัน {id}: ราคาเต็มต่ำสุด ({price}), มีเวลาเล็งขยับเป้านานสุด ({aim}){hpNote} และให้ปลาออกไปได้ไกลสุดก่อนเข้าเงื่อนไขเสี่ยงเสียอุปกรณ์ที่แกะได้หนึ่งแบบ (×{boundary}) ถ้ามีคันอยู่แล้วใช้ต่อได้',
      cheapest:
        'เลือกคัน {id} ถ้าต้องการจ่ายราคาเต็มต่ำสุดใน{area} ({price}) {aimLine} {boundaryLine} เป็นราคาเต็มซื้อใหม่ ไม่ใช่ค่าหักคันเก่า; ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้',
      aim: 'เลือกคัน {id} ใน{area} ถ้าต้องการเวลาขยับเป้าหมายนานขึ้น: ค่าเวลาเล็ง ({aim}){hpNote} สูงสุดในกลุ่ม{style}ที่มีขายในด่านนี้ {budgetLine} {boundaryLine}',
      aimChoice:
        'เลือกคัน {id} ราคาเต็มซื้อใหม่ {price} เมื่อ{comparison}{hpNote} ตัวเลือกที่ถูกกว่าคือคัน {lowerId} ราคา {lowerPrice}; ถ้ามีคันอยู่แล้วใช้ต่อได้',
      boundary:
        'เลือกคัน {id} ใน{area} ถ้าต้องการขอบเขตตำแหน่งปลาสูงสุดก่อนเข้าเส้นทางเสียอุปกรณ์ที่ตรวจพบหนึ่งแบบ (×{boundary}) {budgetLine} {aimLine}',
      boundaryPeerCheapest:
        'เลือกคัน {id} ถ้าต้องการขอบเขตตำแหน่งปลาไกลสุดในราคาเต็มต่ำสุดของกลุ่มที่มีขอบเขตเท่ากัน ({price}) คัน {otherId} ราคา {otherPrice} ให้เวลาขยับเป้านานกว่า{hpNote} โดยยังได้ขอบเขตเท่ากัน',
      boundaryPeerAim:
        'เลือกคัน {id} ถ้าต้องการเวลาขยับเป้านานกว่าคัน {otherId}{hpNote} โดยยังได้ขอบเขตตำแหน่งปลาไกลสุดเท่ากัน ราคาเต็มซื้อใหม่ {price} เทียบกับ {otherPrice}',
      tradeoff:
        'คัน {id} มีข้อแลกเปลี่ยนเมื่อเทียบกับคัน{style}ที่มีขาย: {lowerLine} {higherLine} เลือกโดยดูราคาเต็มซื้อใหม่ เวลาเล็ง และขอบเขตที่ต้องการ',
      itemMissing:
        'ไม่มีรายการขายคัน {id} ใน{area}; คัน{style}ที่มีขายคือ {options} ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้ ถ้าจะซื้อใหม่: {budgetLine} {aimLine} {boundaryLine} นี่เป็นการเทียบราคา เวลาเล็ง และขอบเขตที่ตรวจพบเท่านั้น ไม่ได้จัดอันดับโอกาสจับปลา',
      styleMissing:
        '{area} ไม่มีรายการขายคัน{style}ที่บันทึกไว้; ด่าน{direction}ที่มีรายการขายรูปแบบเดียวกันคือด่าน {nextStage}: {options} ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้ ข้อมูลนี้บอกเฉพาะรายการขายในร้าน ไม่ได้ยืนยันว่าหาได้จากทางอื่นไม่ได้',
      aimLeader: 'คันที่มีเวลาเล็งสูงสุดคือ {id} ({stats}) จึงขยับเป้าหมายได้นานกว่า',
      aimOther: 'คัน {id} ({stats}) เพิ่มเวลาขยับเป้าหมาย',
      boundaryLeader:
        'ขอบเขตสูงสุดคือคัน {id} ({stats}); ปลาขยับออกไปได้ไกลกว่าก่อนเข้าเส้นทางเสียอุปกรณ์หนึ่งแบบ',
      boundaryOther: 'คัน {id} ({stats}) มีขอบเขตก่อนเส้นทางเสียอุปกรณ์หนึ่งแบบสูงกว่า',
      budgetLeader: 'ราคาเต็มต่ำสุดคือคัน {id} ({stats})',
      budgetOther: 'คัน {id} ({stats}) มีราคาเต็มต่ำสุด',
      step: 'เทียบคัน {otherId} ({otherStats}) กับคัน {choiceId}: ราคาเต็ม {price} (เดิม {otherPrice}), เวลาเล็ง {aim} (เดิม {otherAim}), ขอบเขต ×{boundary} (เดิม ×{otherBoundary})',
      area: 'ด่าน {stage}',
      reason: 'คำแนะนำนี้ใช้รายการขายคันรูปแบบเดียวกัน ราคา และค่าที่ถอดจากโค้ดสองค่าเท่านั้น',
      styleNever:
        'ไม่พบคัน{style}ในรายการขายทั้งหกด่าน ถ้ามีคัน {id} อยู่แล้วใช้ต่อได้; ยังไม่มีตำแหน่งร้านที่ยืนยันให้ซื้อคันรูปแบบนี้',
      tradeoffChoice:
        'เลือกคัน {id} ในราคาเต็มซื้อใหม่ {price} เมื่อ{comparison}{hpNote} {higherLine} ถ้ามีคันอยู่แล้วใช้ต่อได้ และยังไม่ยืนยันข้อได้เปรียบเฉพาะปลา',
      noHigher: '',
      scope:
        'ขอบเขตการเทียบ: สต็อกร้านรูปแบบเดียวกัน ราคาเต็มซื้อใหม่ เวลาเล็ง และเกณฑ์ตำแหน่งปลาก่อนเส้นทางเสียอุปกรณ์หนึ่งแบบ ไม่ได้จัดอันดับปลากิน จับขึ้น หรือข้อได้เปรียบเฉพาะปลา{hp}{fly}',
      hp: ' ค่าเล็งคันลัวร์/ตีเหยื่ออิง HP 100 และลดลงเมื่อ HP ต่ำกว่า 100',
      fly: ' ไม่รวมเกณฑ์ครึ่งหนึ่งอีกชุดของคันฟลาย เพราะยังไม่ทราบผลแยก',
      noHp: '',
      noFly: '',
      next: 'ถัดไป',
      previous: 'ก่อนหน้า',
      and: ' และ',
    },
  },
  ja: {
    styles: { 1: 'ウキ・アユ', 2: '投げ釣り', 4: 'ルアー', 8: 'フライ' },
    labels: {
      only: 'エリア{stage}：同じ釣り方で唯一の店頭記録',
      dominated: 'エリア{stage}：新品購入は{id}より{otherId} — {betterReason}{hpNote}',
      dual: 'エリア{stage}：最安で照準時間{hpNote}・確認境界も最大',
      cheapest: 'エリア{stage}：新品全額が最安',
      aim: 'エリア{stage}：照準時間が最長{hpNote}',
      aimChoice: 'エリア{stage}：{id}は{comparison}{hpNote}',
      boundary: 'エリア{stage}：魚が道具喪失リスクに達する前に遠くへ動ける値で選ぶ',
      boundaryPeerCheapest: 'エリア{stage}：最遠境界の竿では新品全額が最安の{id}を選ぶ',
      boundaryPeerAim:
        'エリア{stage}：{otherId}より照準時間が長い{id}を、同じ最遠境界で選ぶ{hpNote}',
      tradeoff: 'エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}',
      tradeoffFallback: 'エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}',
      itemMissing:
        'エリア{stage}：{id}の販売記録なし。同エリアの最安候補は{budgetId}（{budgetPrice}）',
      styleMissing:
        'エリア{stage}：同じ釣り方の記録なし。{direction}番号エリア{nextStage}に{nextId}の販売記録',
      styleNever: 'エリア{stage}：同じ釣り方の販売記録は全6エリアにありません',
    },
    comparison: {
      aimMore: '安い竿{id}より照準時間が長い',
      aimLess: '安い竿{id}より照準時間が短い',
      boundaryMore: '安い竿{id}より魚が遠くまで移動してから確認済みの道具喪失分岐に入る',
      boundaryLess: '安い竿{id}より魚が近い位置で確認済みの道具喪失分岐に入る',
      aimMoreAny: '竿{id}より照準時間が長く、狙う位置を動かせる時間が延びる',
      aimLessAny: '竿{id}より照準時間が短く、狙う位置を動かせる時間が減る',
      boundaryMoreAny: '竿{id}より魚が遠くへ進んでから確認済みの道具喪失分岐に入る',
      boundaryLessAny: '竿{id}より魚が近い位置で確認済みの道具喪失分岐に入る',
      versus: '{benefits}',
      higherPrice: '高価な竿{id}（新品全額{price}）なら、{comparison}{hpNote}',
      cheaper: '新品全額が安い',
      samePrice: '新品全額が同じ',
      and: '、',
      but: 'が、その一方で',
    },
    recommendation: {
      only: 'エリア{stage}で販売記録がある{style}竿はこれだけです：{stats}。照準上限は狙うタイルを動かせる時間に関係します。×{boundary}は特定の道具喪失分岐までの魚位置しきい値です。この釣り方が必要なら選び、所持していれば継続できます。',
      dominated:
        'エリア{stage}で{style}竿を新しく買うなら{id}（{stats}）より{otherId}（{otherStats}）を選びます：{betterReason}。所持していれば{id}を使い続けられます。魚別の差は未解明です。',
      dual: 'エリア{stage}で{style}竿を新しく買うなら{id}。新品全額が最安（{price}）で、狙う位置を動かせる時間（{aim}）{hpNote}と、確認した道具喪失分岐まで魚が進める距離（×{boundary}）も最大です。所持していれば使い続けられます。',
      cheapest:
        'エリア{stage}で新品全額を抑えるなら{id}（{price}）が最安です。{aimLine} {boundaryLine} 所持品の下取り価格ではなく、新品の全額です。すでに持っていれば継続できます。',
      aim: '照準時間を優先するなら、エリア{stage}の{id}（{aim}）{hpNote}を選びます。同じ釣り方の店頭在庫で最長です。{budgetLine} {boundaryLine}',
      aimChoice:
        '新品全額{price}の{id}を選びます。{comparison}{hpNote}。出費を抑えるなら{lowerId}（{lowerPrice}）です。所持している竿は継続できます。',
      boundary:
        '特定の道具喪失分岐までの魚位置しきい値を優先するなら、エリア{stage}の{id}（×{boundary}）を選びます。{budgetLine} {aimLine}',
      boundaryPeerCheapest:
        '同じ最遠境界の竿で新品全額が最安なのは{id}（{price}）です。{otherId}（{otherPrice}）なら境界を保ったまま狙う位置を動かせる時間が長くなります{hpNote}。',
      boundaryPeerAim:
        '同じ最遠境界を保ちながら{otherId}より狙う位置を動かせる時間を延ばすなら{id}を選びます{hpNote}。新品全額は{price}で、{otherId}は{otherPrice}です。',
      tradeoff:
        '{id}はエリア{stage}の{style}販売記録の中で、価格・照準・境界にトレードオフがあります。{lowerLine} {higherLine} 新品全額と必要な照準時間・境界で選びます。',
      itemMissing:
        '{id}の販売記録はエリア{stage}にありません。同じ釣り方でこのエリアに販売記録がある竿は{options}です。{id}を所持していれば継続できます。新しく買うなら：{budgetLine} {aimLine} {boundaryLine} 価格・照準・確認済み境界だけの比較で、釣果全体の優劣は判断できません。',
      styleMissing:
        'エリア{stage}に{style}竿の販売記録はありません。同じ釣り方で販売記録がある{direction}番号エリアはエリア{nextStage}です：{options}。所持している竿は継続できます。店頭記録から他の入手方法までは判断できません。',
      styleNever:
        '6エリアの販売記録に{style}竿はありません。{id}を所持していれば継続できます。店頭での購入場所は確認できません。',
      tradeoffChoice:
        '新品全額{price}の{id}を選びます。{comparison}{hpNote}。{higherLine}。所持している竿は継続でき、魚別の優位性は未解明です。',
      noHigher: '',
      aimLeader: '照準時間が最長なのは{id}（{stats}）。狙うタイルを動かせる時間が長くなります。',
      aimOther: '{id}（{stats}）の方が狙うタイルを動かせる時間が長いです。',
      boundaryLeader:
        '確認済み境界が最大なのは{id}（{stats}）。特定の道具喪失分岐まで魚が遠くへ移動できます。',
      boundaryOther: '{id}（{stats}）の方が特定の道具喪失分岐までの境界が大きいです。',
      budgetLeader: '新品全額の最安は{id}（{stats}）。',
      budgetOther: '新品全額は{id}（{stats}）が最安です。',
      step: '{otherId}（{otherStats}）と{choiceId}の比較：新品全額 {price}（{otherPrice}から）、照準上限 {aim}（{otherAim}から）、境界 ×{boundary}（×{otherBoundary}から）。',
      area: 'エリア{stage}',
      reason: '同じ釣り方の店頭記録、価格、コードで確認した二つの値だけを使っています。',
      scope:
        '比較範囲：同じ釣り方の店頭在庫、新品全額、照準上限、特定の道具喪失分岐までの魚位置しきい値のみ。食いつき、取り込み、魚別の優位性は順位付けしません。{hp}{fly}',
      hp: ' ルアー竿・投げ竿の照準値はHP100時で、HP100未満では短くなります。',
      fly: ' フライ竿の半値しきい値は効果が未解明のため比較していません。',
      noHp: '',
      noFly: '',
      next: '次の',
      previous: '前の',
      and: '、',
    },
  },
}

function interpolate(template, values) {
  return template.replace(/\{([a-zA-Z]+)\}/g, (_match, key) => String(values[key] ?? ''))
}

export function rodAreaCopy(lang, type, key, values = {}) {
  const locale = COPY[lang] || COPY.en
  return interpolate(locale[type][key], values)
}

export function rodAreaScope(lang, styleCode) {
  const locale = COPY[lang] || COPY.en
  const hp = [2, 4].includes(styleCode) ? locale.recommendation.hp : ''
  const fly = styleCode === 8 ? locale.recommendation.fly : ''
  return interpolate(locale.recommendation.scope, { hp, fly })
}
