import { capitalizeSentenceStarts, rodRefName } from './rod-ref-name.js'

const COPY = {
  en: {
    styles: { 1: 'Float/Ayu', 2: 'casting', 4: 'lure', 8: 'fly' },
    labels: {
      only: '{area}: only same-style rod listed',
      dominated: '{area}: buy {otherId} instead — {betterReason}{hpNote}',
      dual: '{area}: lowest price, most time to aim{hpNote} and the line that breaks least easily',
      cheapest: '{area}: lowest new-purchase price',
      aim: '{area}: most time to aim{hpNote}',
      aimChoice: '{area}: choose {id} when {comparison}{hpNote}',
      boundary: '{area}: choose for the line that breaks least easily',
      boundaryPeerCheapest:
        '{area}: choose {id} for the hardest-to-break line at the lowest price among those rods',
      boundaryPeerAim:
        '{area}: choose {id} for more time to aim than {otherId}, with the same hardest-to-break line{hpNote}',
      tradeoff: '{area}: choose {id} when {comparison}{hpNote}',
      tradeoffFallback: '{area}: choose {id} when {comparison}{hpNote}',
      itemMissing:
        '{area}: {id} is not sold here; the cheapest local option is {budgetId} ({budgetPrice})',
      styleMissing:
        '{area}: no same-style rod sold here; the {direction} area that sells one is Area {nextStage}: {nextId}',
      styleNever: '{area}: no same-style rod is sold in any of the six areas',
    },
    comparison: {
      aimMore: 'you get more time to aim than with the cheaper {id}',
      aimLess: 'you get less time to aim than with the cheaper {id}',
      boundaryMore: 'the line breaks less easily than with the cheaper {id}',
      boundaryLess: 'the line breaks more easily than with the cheaper {id}',
      aimMoreAny: 'you get more time to aim than with {id}',
      aimLessAny: 'you get less time to aim than with {id}',
      boundaryMoreAny: 'the line breaks less easily than with {id}',
      boundaryLessAny: 'the line breaks more easily than with {id}',
      versus: '{benefits}',
      higherPrice: '{id} costs more at {price}; {comparison}{hpNote}.',
      cheaper: 'a lower full new-purchase price',
      samePrice: 'the same full new-purchase price',
      and: ' and ',
      but: ', but ',
    },
    recommendation: {
      only: 'This is the only {style} rod sold in {area}: {stats}. Choose it if you need this style here; if you already own it, keep using it.',
      dominated:
        'For a new {style} rod in {area}, choose {otherId} ({otherStats}) over {id} ({stats}): {betterReason}. If you already own {id}, keep using it; effects on specific fish are unconfirmed.',
      dual: 'Choose {id} in {area} if you need a new {style} rod: it has the lowest full price ({price}), the most time to aim ({aim}){hpNote}, and the line that breaks least easily (×{boundary}). If you already own a rod, keep using it.',
      cheapest:
        'Choose {id} to pay the lowest full price in {area} ({price}). {aimLine} {boundaryLine} These are full new-purchase prices, not trade-in costs; if you already own a rod, keep using it.',
      aim: 'Choose {id} in {area} when you want more time to aim: its aim time ({aim}){hpNote} is the highest among the {style} rods sold here. {budgetLine} {boundaryLine}',
      aimChoice:
        'Choose {id} at the full new-purchase price {price} when {comparison}{hpNote}. The cheaper option is {lowerId} at {lowerPrice}; if you already own a rod, keep using it.',
      boundary:
        'Choose {id} in {area} when you want the line that breaks least easily (×{boundary}). {budgetLine} {aimLine}',
      boundaryPeerCheapest:
        'Choose {id} for the hardest-to-break line at the lowest full price among rods tied on that ({price}). {otherId} costs {otherPrice} and gives more time to aim{hpNote} with the same line strength.',
      boundaryPeerAim:
        'Choose {id} when you want more time to aim than with {otherId}{hpNote} and the same hardest-to-break line. Full new-purchase price: {price} versus {otherPrice}.',
      tradeoff:
        '{id} is a trade-off among the {style} rods sold here: {lowerLine} {higherLine} Decide by the full new-purchase price, the time to aim and how hard the line is to break.',
      itemMissing:
        '{id} is not sold in {area}. The same-style rods sold here are {options}. If you already own {id}, keep using it. If you are buying new: {budgetLine} {aimLine} {boundaryLine} This only compares price, time to aim and line strength; it does not rank catch success.',
      styleMissing:
        '{area} does not sell a {style} rod. The {direction} area that does is Area {nextStage}: {options}. If you already own {id}, keep using it. This only covers shop stock; the rod may be available some other way.',
      aimLeader: 'The most time to aim: {id} ({stats}).',
      aimOther: '{id} ({stats}) gives more time to aim than this rod.',
      boundaryLeader: 'The line that breaks least easily: {id} ({stats}).',
      boundaryOther: '{id} ({stats}) breaks less easily than this rod.',
      budgetLeader: 'The lowest full price: {id} ({stats}).',
      budgetOther: '{id} ({stats}) has the lowest full price.',
      step: 'Compared with {otherId} ({otherStats}), {choiceId} has full price {price} (from {otherPrice}), aim time {aim} (from {otherAim}), and line strength ×{boundary} (from ×{otherBoundary}).',
      area: 'Area {stage}',
      reason:
        'This advice uses only the same-style rods the shops sell, their full prices, and two measured values: time to aim and line strength.',
      styleNever:
        'No {style} rod is sold in any of the six areas. If you already own {id}, keep using it; no shop that sells one has been found.',
      tradeoffChoice:
        'Choose {id} at the full new-purchase price {price} when {comparison}{hpNote}. {higherLine} If you already own a rod, keep using it. Effects on specific fish are unconfirmed.',
      noHigher: '',
      scope:
        'What is compared: rods of the same style that shops sell, full new-purchase price, time to aim, and how hard the line is to break (the fish can pull farther before tackle is lost). Bite rate, catch rate and fish-specific advantages are not ranked.{hp}{fly}',
      hp: ' Aim time for lure/casting rods is measured at HP 100 and gets shorter when HP is lower.',
      fly: ' The fly rod’s second hidden value is left out because its effect is unknown.',
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
      only: 'ด่าน {stage}: ร้านขายคันแบบนี้คันเดียว',
      dominated: 'ด่าน {stage}: ซื้อ {otherId} แทน — {betterReason}{hpNote}',
      dual: 'ด่าน {stage}: ถูกสุด มีเวลาเล็งนานสุด{hpNote} และสายขาดยากสุด',
      cheapest: 'ด่าน {stage}: ราคาซื้อใหม่ถูกสุด',
      aim: 'ด่าน {stage}: มีเวลาเล็งนานสุด{hpNote}',
      aimChoice: 'ด่าน {stage}: เลือก {id} เพราะ{comparison}{hpNote}',
      boundary: 'ด่าน {stage}: เลือกถ้าอยากให้สายขาดยากสุด',
      boundaryPeerCheapest: 'ด่าน {stage}: เลือก {id} ถ้าอยากได้สายขาดยากสุดในราคาถูกสุดของกลุ่ม',
      boundaryPeerAim:
        'ด่าน {stage}: เลือก {id} ถ้าอยากมีเวลาเล็งนานกว่า {otherId} โดยยังได้สายขาดยากสุดเท่ากัน{hpNote}',
      tradeoff: 'ด่าน {stage}: เลือก {id} เพราะ{comparison}{hpNote}',
      tradeoffFallback: 'ด่าน {stage}: เลือก {id} เพราะ{comparison}{hpNote}',
      itemMissing:
        'ด่าน {stage}: ร้านไม่ขาย {id}; ตัวเลือกที่ถูกสุดในด่านนี้คือ {budgetId} ({budgetPrice})',
      styleMissing:
        'ด่าน {stage}: ร้านไม่ขายคันแบบนี้; ด่าน{direction}ที่มีขายคือด่าน {nextStage}: {nextId}',
      styleNever: 'ด่าน {stage}: ไม่มีร้านไหนขายคันแบบนี้ทั้ง 6 ด่าน',
    },
    comparison: {
      aimMore: 'มีเวลาเล็งนานกว่า {id} ที่ถูกกว่า',
      aimLess: 'มีเวลาเล็งน้อยกว่า {id} ที่ถูกกว่า',
      boundaryMore: 'สายขาดยากกว่า {id} ที่ถูกกว่า',
      boundaryLess: 'สายขาดง่ายกว่า {id} ที่ถูกกว่า',
      aimMoreAny: 'มีเวลาเล็งนานกว่า {id}',
      aimLessAny: 'มีเวลาเล็งน้อยกว่า {id}',
      boundaryMoreAny: 'สายขาดยากกว่า {id}',
      boundaryLessAny: 'สายขาดง่ายกว่า {id}',
      versus: '{benefits}',
      higherPrice: '{id} ราคาเต็มสูงกว่า ({price}) และ{comparison}{hpNote}',
      cheaper: 'ราคาซื้อใหม่ถูกกว่า',
      samePrice: 'ราคาซื้อใหม่เท่ากัน',
      and: ' และ',
      but: ' แต่',
    },
    recommendation: {
      only: '{area} มีคัน{style}ขายแค่คันนี้: {stats} ถ้าต้องใช้คันแบบนี้ก็ซื้อได้ ถ้ามีอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่',
      dominated:
        'ถ้าจะซื้อคัน{style}ใหม่ใน{area} ให้เลือก {otherId} ({otherStats}) แทน {id} ({stats}): {betterReason} ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ส่วนผลกับปลาแต่ละชนิดยังไม่ยืนยัน',
      dual: 'ถ้าต้องซื้อคัน{style}ใหม่ใน{area} ให้เลือก {id}: ราคาเต็มถูกสุด ({price}) มีเวลาเล็งนานสุด ({aim}){hpNote} และสายขาดยากสุด (×{boundary}) ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่',
      cheapest:
        'เลือก {id} ถ้าอยากจ่ายถูกสุดใน{area} ({price}) {aimLine} {boundaryLine} ราคานี้คือราคาเต็มซื้อใหม่ ไม่ใช่ราคาหลังหักคันเก่า ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่',
      aim: 'เลือก {id} ใน{area} ถ้าอยากมีเวลาเล็งนานขึ้น: เวลาเล็ง ({aim}){hpNote} มากสุดในกลุ่มคัน{style}ที่ขายในด่านนี้ {budgetLine} {boundaryLine}',
      aimChoice:
        'เลือก {id} ราคาเต็มซื้อใหม่ {price} เพราะ{comparison}{hpNote} ตัวเลือกที่ถูกกว่าคือ {lowerId} ราคา {lowerPrice} ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่',
      boundary: 'เลือก {id} ใน{area} ถ้าอยากให้สายขาดยากสุด (×{boundary}) {budgetLine} {aimLine}',
      boundaryPeerCheapest:
        'เลือก {id} ถ้าอยากได้สายขาดยากสุดในราคาเต็มถูกสุดของกลุ่มที่เท่ากัน ({price}) ส่วน {otherId} ราคา {otherPrice} มีเวลาเล็งนานกว่า{hpNote} และสายขาดยากเท่ากัน',
      boundaryPeerAim:
        'เลือก {id} ถ้าอยากมีเวลาเล็งนานกว่า {otherId}{hpNote} โดยยังได้สายขาดยากสุดเท่ากัน ราคาเต็มซื้อใหม่ {price} เทียบกับ {otherPrice}',
      tradeoff:
        '{id} มีข้อแลกเปลี่ยนเมื่อเทียบกับคัน{style}ที่ขายในด่านนี้: {lowerLine} {higherLine} ให้เลือกโดยดูราคาเต็มซื้อใหม่ เวลาเล็ง และความยากที่สายจะขาด',
      itemMissing:
        'ร้านใน{area} ไม่ขาย {id}; คัน{style}ที่ขายคือ {options} ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ถ้าจะซื้อใหม่: {budgetLine} {aimLine} {boundaryLine} นี่เทียบแค่ราคา เวลาเล็ง และความยากที่สายจะขาด ไม่ได้จัดอันดับโอกาสจับปลา',
      styleMissing:
        '{area} ไม่มีร้านขายคัน{style}; ด่าน{direction}ที่มีขายคือด่าน {nextStage}: {options} ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ข้อมูลนี้บอกแค่ของที่วางขายในร้าน ไม่ได้บอกว่าหาทางอื่นไม่ได้',
      aimLeader: 'มีเวลาเล็งนานสุด: {id} ({stats})',
      aimOther: '{id} ({stats}) มีเวลาเล็งนานกว่าคันนี้',
      boundaryLeader: 'สายขาดยากสุด: {id} ({stats})',
      boundaryOther: '{id} ({stats}) สายขาดยากกว่าคันนี้',
      budgetLeader: 'ราคาเต็มถูกสุด: {id} ({stats})',
      budgetOther: '{id} ({stats}) ราคาเต็มถูกสุด',
      step: 'เทียบ {otherId} ({otherStats}) กับ {choiceId}: ราคาเต็ม {price} (เดิม {otherPrice}), เวลาเล็ง {aim} (เดิม {otherAim}), สายขาดยาก ×{boundary} (เดิม ×{otherBoundary})',
      area: 'ด่าน {stage}',
      reason:
        'คำแนะนำนี้ดูจากคันแบบเดียวกันที่ร้านขาย ราคาเต็ม และตัวเลขที่วัดได้สองค่า คือเวลาเล็งกับความยากที่สายจะขาด',
      styleNever:
        'ไม่มีร้านไหนขายคัน{style}ทั้ง 6 ด่าน ถ้ามี {id} อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่; ยังไม่พบร้านที่ขายคันแบบนี้',
      tradeoffChoice:
        'เลือก {id} ในราคาเต็มซื้อใหม่ {price} เพราะ{comparison}{hpNote} {higherLine} ถ้ามีคันเดิมอยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่ ส่วนผลกับปลาแต่ละชนิดยังไม่ยืนยัน',
      noHigher: '',
      scope:
        'สิ่งที่เทียบ: คันแบบเดียวกันที่ร้านขาย ราคาเต็มซื้อใหม่ เวลาเล็ง และความยากที่สายจะขาด (ปลาดึงหนีได้ไกลกว่าก่อนอุปกรณ์หลุด) ไม่ได้จัดอันดับโอกาสที่ปลากินเหยื่อหรือจับขึ้น{hp}{fly}',
      hp: ' เวลาเล็งของคันลัวร์/ตีเหยื่อวัดที่ HP 100 และสั้นลงเมื่อ HP ต่ำกว่า 100',
      fly: ' ไม่รวมค่าที่สองของคันฟลาย เพราะยังไม่รู้ว่ามีผลอะไร',
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
      only: 'エリア{stage}：同じ釣り方で売っているのはこの竿だけ',
      dominated: 'エリア{stage}：{id}より{otherId}を買う — {betterReason}{hpNote}',
      dual: 'エリア{stage}：最安で、狙う時間も最長{hpNote}、糸も最も切れにくい',
      cheapest: 'エリア{stage}：新品の全額が最安',
      aim: 'エリア{stage}：狙う時間が最長{hpNote}',
      aimChoice: 'エリア{stage}：{id}は{comparison}{hpNote}',
      boundary: 'エリア{stage}：糸が最も切れにくい竿を選ぶ',
      boundaryPeerCheapest: 'エリア{stage}：糸が最も切れにくい竿の中で最安の{id}を選ぶ',
      boundaryPeerAim:
        'エリア{stage}：{otherId}より狙う時間が長く、糸の切れにくさは最高で同じ{id}を選ぶ{hpNote}',
      tradeoff: 'エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}',
      tradeoffFallback: 'エリア{stage}：{comparison}ので{id}を選ぶ{hpNote}',
      itemMissing:
        'エリア{stage}：{id}は売っていません。同エリアの最安候補は{budgetId}（{budgetPrice}）',
      styleMissing:
        'エリア{stage}：同じ釣り方の竿は売っていません。{direction}エリアで売っているのは、エリア{nextStage}の{nextId}',
      styleNever: 'エリア{stage}：同じ釣り方の竿は全6エリアのどの店にもありません',
    },
    comparison: {
      aimMore: '安い{id}より狙う時間が長い',
      aimLess: '安い{id}より狙う時間が短い',
      boundaryMore: '安い{id}より糸が切れにくい',
      boundaryLess: '安い{id}より糸が切れやすい',
      aimMoreAny: '{id}より狙う時間が長い',
      aimLessAny: '{id}より狙う時間が短い',
      boundaryMoreAny: '{id}より糸が切れにくい',
      boundaryLessAny: '{id}より糸が切れやすい',
      versus: '{benefits}',
      higherPrice: '高い{id}（新品の全額{price}）なら、{comparison}{hpNote}',
      cheaper: '新品の全額が安い',
      samePrice: '新品の全額が同じ',
      and: '、',
      but: 'が、その一方で',
    },
    recommendation: {
      only: 'エリア{stage}で売っている{style}竿はこれだけです：{stats}。この釣り方が必要なら買ってください。すでに持っていれば、そのまま使えます。',
      dominated:
        'エリア{stage}で{style}竿を新しく買うなら、{id}（{stats}）より{otherId}（{otherStats}）がおすすめです：{betterReason}。{id}をすでに持っていれば、そのまま使えます。魚ごとの差はまだ分かっていません。',
      dual: 'エリア{stage}で{style}竿を新しく買うなら{id}。新品の全額が最安（{price}）で、狙う時間（{aim}）{hpNote}も最長、糸も最も切れにくい（×{boundary}）竿です。すでに持っていれば、そのまま使えます。',
      cheapest:
        'エリア{stage}で新品の全額を抑えるなら{id}（{price}）が最安です。{aimLine} {boundaryLine} 下取りを引いた値段ではなく、新品の全額です。すでに持っていれば、そのまま使えます。',
      aim: '狙う時間を長くしたいなら、エリア{stage}の{id}（{aim}）{hpNote}です。ここで売っている{style}竿で最長です。{budgetLine} {boundaryLine}',
      aimChoice:
        '新品の全額{price}の{id}を選びます。{comparison}{hpNote}。出費を抑えるなら{lowerId}（{lowerPrice}）です。持っている竿はそのまま使えます。',
      boundary:
        '糸が最も切れにくい竿がよければ、エリア{stage}の{id}（×{boundary}）を選びます。{budgetLine} {aimLine}',
      boundaryPeerCheapest:
        '糸が最も切れにくい竿の中で、新品の全額が最安なのは{id}（{price}）です。{otherId}（{otherPrice}）なら糸の切れにくさは同じまま、狙う時間がもっと長くなります{hpNote}。',
      boundaryPeerAim:
        '糸が最も切れにくいまま、{otherId}より狙う時間を長くしたいなら{id}を選びます{hpNote}。新品の全額は{price}で、{otherId}は{otherPrice}です。',
      tradeoff:
        '{id}は、エリア{stage}で売っている{style}竿の中で、値段・狙う時間・糸の切れにくさに一長一短があります。{lowerLine} {higherLine} 新品の全額と、必要な狙う時間・糸の切れにくさで選んでください。',
      itemMissing:
        '{id}はエリア{stage}で売っていません。同じ釣り方でこのエリアで売っている竿は{options}です。{id}を持っていれば、そのまま使えます。新しく買うなら：{budgetLine} {aimLine} {boundaryLine} 比べているのは値段・狙う時間・糸の切れにくさだけで、釣れやすさの順位ではありません。',
      styleMissing:
        'エリア{stage}に{style}竿は売っていません。同じ釣り方の竿を売っている{direction}エリアは、エリア{nextStage}です：{options}。{id}を持っていれば、そのまま使えます。分かるのは店の品ぞろえだけで、他の入手方法がないとは言えません。',
      styleNever:
        '6エリアのどの店にも{style}竿はありません。{id}を持っていれば、そのまま使えます。買える店は見つかっていません。',
      tradeoffChoice:
        '新品の全額{price}の{id}を選びます。{comparison}{hpNote}。{higherLine}。持っている竿はそのまま使えます。魚ごとの差はまだ分かっていません。',
      noHigher: '',
      aimLeader: '狙う時間が最長なのは{id}（{stats}）。',
      aimOther: '{id}（{stats}）の方が狙う時間が長いです。',
      boundaryLeader: '糸が最も切れにくいのは{id}（{stats}）。',
      boundaryOther: '{id}（{stats}）の方が糸が切れにくいです。',
      budgetLeader: '新品の全額が最安なのは{id}（{stats}）。',
      budgetOther: '新品の全額が最安なのは{id}（{stats}）です。',
      step: '{otherId}（{otherStats}）と{choiceId}の比較：新品の全額 {price}（{otherPrice}から）、狙う時間 {aim}（{otherAim}から）、切れにくさ ×{boundary}（×{otherBoundary}から）。',
      area: 'エリア{stage}',
      reason:
        '同じ釣り方の店の品ぞろえ、新品の全額、測定できた2つの値（狙う時間・切れにくさ）だけで比べています。',
      scope:
        '比べているもの：同じ釣り方で店が売っている竿、新品の全額、狙う時間、糸の切れにくさ（魚が遠くまで引いても道具を失いにくい）。食いつきや釣れやすさ、魚ごとの相性は順位付けしていません。{hp}{fly}',
      hp: ' ルアー竿・投げ竿の狙う時間はHP100のときの値で、HPが減ると短くなります。',
      fly: ' フライ竿のもう1つの隠れた値は、効果が分からないため比べていません。',
      noHp: '',
      noFly: '',
      next: '次の',
      previous: '前の',
      and: '、',
    },
  },
}

// Rods are mentioned by name; the hex ID stays on the card label and in links only.
const ID_KEYS = new Set(['id', 'otherId', 'lowerId', 'budgetId', 'nextId', 'choiceId'])

function interpolate(template, values, lang) {
  const text = template.replace(/\{([a-zA-Z]+)\}/g, (_match, key) => {
    const value = values[key] ?? ''
    return String(ID_KEYS.has(key) && lang ? rodRefName(lang, value) : value)
  })
  return lang === 'en' ? capitalizeSentenceStarts(text) : text
}

export function rodAreaCopy(lang, type, key, values = {}) {
  const locale = COPY[lang] || COPY.en
  return interpolate(locale[type][key], values, lang)
}

export function rodAreaScope(lang, styleCode) {
  const locale = COPY[lang] || COPY.en
  const hp = [2, 4].includes(styleCode) ? locale.recommendation.hp : ''
  const fly = styleCode === 8 ? locale.recommendation.fly : ''
  return interpolate(locale.recommendation.scope, { hp, fly })
}
