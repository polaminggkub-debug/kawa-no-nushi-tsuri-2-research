function fishMealAdvice(ctx) {
  return {
    summary:
      ctx.lang === 'th'
        ? 'ตรวจชื่อปลาที่เมนูแสดงก่อนกิน เพราะเกมกินตัวแรกในข้อง ถ้าเป็นคุซะฟุกุอย่ากิน: HP จะเหลือ 0'
        : ctx.lang === 'ja'
          ? '食べる前に表示された魚名を確認する。びくの先頭を食べる。クサフグなら食べない：HPが0になる。'
          : 'Check the displayed fish name before eating: the game eats the first keepnet fish. Do not eat Kusafugu; it sets HP to zero.',
    facts: [
      ctx.lang === 'th'
        ? 'ถ้าต้องการฟื้น HP โดยไม่เสียปลาตัวแรก ให้ซื้ออาหารแทน ปลาปกติฟื้นตามขนาด แต่กินแล้วปลาตัวนั้นหายไป'
        : ctx.lang === 'ja'
          ? '先頭の魚を残して回復したいなら食料を買う。普通の魚はサイズに応じて回復するが、食べると失う。'
          : 'Buy food instead if you want to keep the first fish. Ordinary fish restore HP by size, but eating removes that fish.',
    ],
  }
}

function decisionAdvice(ctx, decision) {
  return {
    summary: ctx.local(decision.recommendation),
    facts: [],
  }
}

function flyWingAdvice(ctx) {
  const summary =
    ctx.lang === 'th'
      ? 'ประกอบเองให้เลือกจากรูปปีกที่ร้านเสนอ ไม่ต้องเตรียมชิ้นส่วนไปเอง ตรวจราคาสุทธิก่อนจ่าย ยังไม่มีหลักฐานว่าปีกแพงเพิ่มโอกาสจับปลา'
      : ctx.lang === 'ja'
        ? '自作するなら店のウィング画像から選ぶ。部品の持参は不要。支払前に最終見積額を確認する。高価なウィングの釣果優位は未確認。'
        : 'Choose from the maker’s wing pictures; you do not need to bring components. Check the final quote before paying. An expensive wing has no established catch advantage.'
  const fact =
    ctx.lang === 'th'
      ? 'เกมมีเงื่อนไขซ่อนที่ตรวจบอดี้กับปีก ถ้าปลาไม่กิน การตีชุดเดิมซ้ำไม่ได้สุ่มเงื่อนไขนี้ใหม่ รายละเอียดอยู่ในหลักฐาน'
      : ctx.lang === 'ja'
        ? '隠しボディ・ウィング条件は同じ構成の投げ直しでは再抽選されない。詳細は根拠を参照。'
        : 'Recasting the same setup does not reroll the hidden body/wing condition; details are in the evidence.'
  return { summary, facts: [fact] }
}

function flyTailAdvice(ctx) {
  return {
    summary:
      ctx.lang === 'th'
        ? 'เลือกหางนี้ถ้าชอบรูปและยอมรับราคาเสนอ หรือเลือก “ไม่มี” ในเมนูประกอบที่มีตัวเลือกนั้น ยังไม่มีหลักฐานว่าหางนี้เพิ่มโอกาสจับปลา'
        : ctx.lang === 'ja'
          ? '見た目と見積額で選ぶ。「無し」がある作成画面では省略できる。このテールの釣果ボーナスは確認していない。'
          : 'Choose this tail for its appearance and quoted price, or choose “None” where the maker offers it. A catch advantage from this tail is not established.',
    facts: [],
  }
}

function genericUse(ctx, item, use) {
  return {
    summary: ctx.local(use.summary) || ctx.player.desc[ctx.groupOf(item)],
    facts: use.specialResponseTarget ? [] : use.facts?.[ctx.lang] || use.facts?.en || [],
  }
}

export function visibleUse(ctx, item) {
  const use = ctx.useOf(item)
  if (item.category === 'food' && item.id === '08') return fishMealAdvice(ctx)
  const decision = item.baitLureDecision || item.gearDecision || item.rodDecision
  if (decision) return decisionAdvice(ctx, decision)
  if (item.category === 'hook' || item.category === 'float_weight')
    return { summary: ctx.local(use.summary), facts: use.facts?.[ctx.lang] || [] }
  if (item.category === 'fly_wing') return flyWingAdvice(ctx)
  if (item.category === 'fly_tail') return flyTailAdvice(ctx)
  return genericUse(ctx, item, use)
}

export function fishHeading(ctx, item) {
  return item.category === 'general_tool' && ['08', '09', '0A'].includes(item.id)
    ? ctx.lang === 'th'
      ? 'ปลาและสัตว์ที่ชี้ทิศเข้าหาจุดโปรยได้'
      : ctx.lang === 'ja'
        ? '寄せエサへ誘導できる魚・生き物'
        : 'Creatures steered toward groundbait'
    : ctx.player.compatible
}

export function fishList(ctx, item) {
  if (item.category === 'rod') return ''
  const use = ctx.useOf(item),
    ids = ctx.fishIdsFor(item)
  const targets = use.targetMatches
    ? Array.isArray(use.targetMatches)
      ? use.targetMatches
      : [use.targetMatches]
    : []
  if (!ids.length && !targets.length) return ''
  const chip = (id) => {
    id = String(id).replace(/^0x/i, '').toUpperCase().padStart(2, '0')
    const f = ctx.fishVisuals[id] || {}
    return `<a class="fish-chip" data-entity="fish" href="${ctx.esc(ctx.fishHref(id))}" aria-label="${ctx.esc(ctx.fishName(id))} — ${ctx.detailLabel}">${f.image ? `<img loading="lazy" src="${ctx.esc(f.image)}" alt="">` : ''}<span>${ctx.esc(ctx.fishName(id))}</span><small>${ctx.detailLabel} ↗</small></a>`
  }
  if (!ids.length) return ''
  return `<div class="compatible-fish"><p class="fish-scope">${ctx.esc(item.category === 'bait' ? (ctx.lang === 'th' ? `สำหรับ${ctx.baitRoute === 'float' ? 'ชุดทุ่น' : 'ชุดตะกั่ว'} — ผ่านเงื่อนไขรับเหยื่อ ยังต้องวางเหยื่อให้เจอปลาและดึงขึ้นสำเร็จ` : ctx.lang === 'ja' ? `${ctx.baitRoute === 'float' ? 'ウキ' : 'オモリ'}仕掛けのエサ判定に適合。位置・タイミング・取り込みも必要。` : `${ctx.baitRoute === 'float' ? 'Float' : 'Sinker'} rig: passes bait-acceptance conditions; position, timing and landing still matter.`) : ctx.local(use.fishScope))}</p><div class="fish-chips">${ids.slice(0, 6).map(chip).join('')}</div>${ids.length > 6 ? `<details class="more-fish"><summary>${ctx.esc(ctx.player.more)} (${ids.length})</summary><div class="fish-chips">${ids.slice(6).map(chip).join('')}</div></details>` : ''}</div>`
}
