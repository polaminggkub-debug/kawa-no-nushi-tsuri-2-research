#!/usr/bin/env node
// Write the player-facing fly advice (EN / JA / TH) into the data files that feed the catalogue:
//   data/fly-practical-research.json   summary, facts and notes of every fly body, wing and tail
//   data/gear-item-decisions.json      label, recommendation and reason of the fly entries (hooks and floats untouched)
//   data/player-decisions.json         the "fly_bundle_choice" decision (other sections untouched)
// Facts: ROM audit 2026-10-07 (rom-analysis/audit-2026-10-07/acceptance/report.md) and data/gear-effects.json.
// Run after scripts/extract_fly_backup_choices.cjs; build_catalogue.cjs picks the three files up.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const t = (en, ja, th) => ({ en, ja, th });

const gallery = read('catalogue/gallery-data.json');
const stock = read('data/shop-stock-rom.json');
const acceptance = read('data/fish-acceptance.json');
const effects = read('data/gear-effects.json');
const backups = read('data/fly-backup-choices.json');
const research = read('data/fly-practical-research.json');
const gear = read('data/gear-item-decisions.json');
const decisions = read('data/player-decisions.json');

const LOCK = backups.freshSaveLock;
const group = id => parseInt(id, 16) % 4;
const usable = bundle => group(bundle.body) !== LOCK.body && group(bundle.wing) !== LOCK.wing;
const bodies = new Map(acceptance.fly_bodies.map(body => [body.id_hex, body]));
const bundles = stock.areas.flatMap(area => area.flyBundles.map(bundle => ({ stage: area.stage, slot: bundle.slot, body: bundle.body, wing: bundle.wing, tail: bundle.tail, priceYen: bundle.shopPriceYen })));
const nameOf = (category, id) => gallery.items.find(item => item.category === category && item.id === id);
const isDry = id => bodies.get(id).acceptance_mask_hex === '0x0004' || /dry|terrestrial/i.test(nameOf('fly', id).nameEn);
const countOf = id => bodies.get(id).fish_ids_passing_mask_gate.length;
const cheapest = list => list.slice().sort((a, b) => a.priceYen - b.priceYen || a.stage - b.stage || a.slot - b.slot)[0];
const wetStarter = cheapest(bundles.filter(bundle => usable(bundle) && !isDry(bundle.body)));
const dryStarter = cheapest(bundles.filter(bundle => usable(bundle) && isDry(bundle.body)));
const wetFishCount = Math.max(...gallery.items.filter(item => item.category === 'fly' && !isDry(item.id)).map(item => countOf(item.id)));
const dryFishCount = Math.max(...gallery.items.filter(item => item.category === 'fly' && isDry(item.id)).map(item => countOf(item.id)));
const wetInsurance = Object.values(backups.profiles).find(profile => profile.totalYen === 30).bundles;
const dryInsurance = Object.values(backups.profiles).find(profile => profile.totalYen === 17).bundles;
const idsOf = bundle => `${bundle.body}/${bundle.wing}/${bundle.tail}`;
const setText = set => set.map(bundle => `${idsOf(bundle)} ¥${bundle.priceYen}`).join(', ');
const setTotal = set => set.reduce((sum, bundle) => sum + bundle.priceYen, 0);
if (wetFishCount !== 33 || dryFishCount !== 17) throw new Error('Unexpected fly fish counts');

// ---- shared phrases -------------------------------------------------------------------------------------
const LOCK_SHORT = t(
  `Every save hides a lock: a fly whose body is in group ${LOCK.body} or whose wing is in group ${LOCK.wing} never bites on a fresh save (a group is the part's ID in decimal divided by 4, remainder only). An inn rest has about a 34% chance of changing the lock, so re-equip your fly after resting.`,
  `どのセーブにも隠しロックがある。新規セーブでは、ボディがグループ${LOCK.body}、またはウィングがグループ${LOCK.wing}の毛バリは一切食いつかない（グループは部品ID（10進）を4で割った余り）。宿泊でロックが変わる確率は約34%なので、泊まったら毛バリを装備し直す。`,
  `ทุกเซฟมีล็อกลับ: ฟลายที่บอดี้อยู่กลุ่ม ${LOCK.body} หรือปีกอยู่กลุ่ม ${LOCK.wing} ไม่กินเลยบนเซฟใหม่ (กลุ่ม = ID ของชิ้นส่วนฐานสิบหารด้วย 4 เอาเศษ) การนอนโรงแรมมีโอกาสราว 34% ที่ล็อกเปลี่ยน นอนแล้วให้ใส่ฟลายอีกครั้ง`,
);
const PART_ROLES = t(
  'The body decides which fish bite (wet bodies 33 fish, dry and terrestrial bodies 17) and how the fight starts. The wing is only a ticket past the lock. The tail is only looks.',
  'ボディが食いつく魚（ウェット33種、ドライ・テレストリアル17種）とファイトの開始値を決める。ウィングはロックを通るための部品でしかなく、テールは見た目だけ。',
  'บอดี้เป็นตัวเลือกปลาที่กิน (แบบเปียก 33 ชนิด แบบแห้งและแมลงบก 17 ชนิด) และกำหนดจุดเริ่มสู้ ปีกมีหน้าที่แค่ผ่านล็อก หางเป็นแค่หน้าตา',
);

const fightText = selector => selector === 1
  ? t(
    'Fight: this body family (Caddis and hopper) helps against fish of 16 to 35 cm; the fight starts with half the mistakes counted. Other sizes feel no difference.',
    'ファイト：この系統（カディス・ホッパー）は16〜35cmの魚に有利で、ファイトの開始値が半分になる。他のサイズでは差が出ない。',
    'ตอนสู้: บอดี้ตระกูลนี้ (แมลงหนอนปลอกน้ำ Caddis และตั๊กแตน hopper) ช่วยปลา 16–35 ซม. ค่าเริ่มสู้ลดลงครึ่งหนึ่ง ปลาขนาดอื่นไม่มีผล',
  )
  : t(
    'Fight: this body family helps against fish up to 15 cm (half the mistakes counted at the start) and hurts against fish over 35 cm.',
    'ファイト：この系統は15cm以下の魚に有利（開始値が半分）で、35cm超の魚には不利。',
    'ตอนสู้: บอดี้ตระกูลนี้ช่วยปลาไม่เกิน 15 ซม. (ค่าเริ่มสู้ลดลงครึ่ง) แต่เสียเปรียบกับปลาใหญ่กว่า 35 ซม.',
  );

// ---- bodies ---------------------------------------------------------------------------------------------
function bodyFacts(id) {
  const item = nameOf('fly', id);
  const effect = effects.items.fly[String(parseInt(id, 16))];
  const own = bundles.filter(bundle => bundle.body === id);
  const safe = own.filter(usable);
  const best = safe.length ? cheapest(safe) : null;
  const dry = isDry(id);
  const recommended = best && ((!dry && best === wetStarter) || (dry && best === dryStarter));
  return { item, effect, own, safe, best, dry, count: countOf(id), g: group(id), recommended };
}

function bodyLabel(f) {
  const n = f.count;
  if (f.g === LOCK.body) {
    return t(
      'Locked on a fresh save: a group-1 body never bites until the lock changes',
      '新規セーブでは使えない：グループ1のボディは、ロックが変わるまで食いつかない',
      'ล็อกบนเซฟใหม่: บอดี้กลุ่ม 1 ไม่กินเลยจนกว่าล็อกจะเปลี่ยน',
    );
  }
  if (f.best) {
    return t(
      `${f.recommended ? 'Recommended · ' : ''}Works on a fresh save · ${n} fish · ready-made set ¥${f.best.priceYen} in Area ${f.best.stage}`,
      `${f.recommended ? 'おすすめ · ' : ''}新規セーブで使える · ${n}種 · 完成品${f.best.priceYen}円（エリア${f.best.stage}）`,
      `${f.recommended ? 'แนะนำ · ' : ''}ใช้ได้บนเซฟใหม่ · ปลา ${n} ชนิด · ชุดสำเร็จรูป ¥${f.best.priceYen} ที่ด่าน ${f.best.stage}`,
    );
  }
  if (f.own.length) {
    return t(
      `${n} fish · the ready-made set uses a wing the fresh-save lock blocks; build it with a wing outside group ${LOCK.wing}`,
      `${n}種 · 完成品は新規セーブのロックに引っかかるウィング付き。グループ${LOCK.wing}以外のウィングで自作する`,
      `ปลา ${n} ชนิด · ชุดสำเร็จรูปใช้ปีกที่ติดล็อกของเซฟใหม่ ให้ประกอบเองด้วยปีกที่ไม่ใช่กลุ่ม ${LOCK.wing}`,
    );
  }
  return t(
    `${n} fish · not sold ready-made; build it at the fly maker with a wing outside group ${LOCK.wing}`,
    `${n}種 · 完成品の販売なし。毛バリ職人でグループ${LOCK.wing}以外のウィングを選んで自作する`,
    `ปลา ${n} ชนิด · ไม่มีขายสำเร็จรูป ประกอบเองที่ร้านทำฟลายด้วยปีกที่ไม่ใช่กลุ่ม ${LOCK.wing}`,
  );
}

function bodyAdvice(f) {
  const kind = f.dry
    ? t(
      `Dry and terrestrial bodies work on ${f.count} fish, all of which also take wet bodies.`,
      `ドライ・テレストリアルのボディは${f.count}種に使える。この魚たちはウェットのボディにも食いつく。`,
      `บอดี้แบบแห้งและแมลงบกใช้กับปลา ${f.count} ชนิด ปลาเหล่านี้กินบอดี้แบบเปียกได้ด้วย`,
    )
    : t(
      `Wet bodies work on ${f.count} fish (the list is below).`,
      `ウェットのボディは${f.count}種に使える（下のリスト）。`,
      `บอดี้แบบเปียกใช้กับปลา ${f.count} ชนิด (รายชื่ออยู่ด้านล่าง)`,
    );
  const alt = f.dry ? dryStarter : wetStarter;
  let act;
  if (f.g === LOCK.body) {
    act = t(
      `This body is group ${f.g}, the group a fresh save locks. A fly built on it never bites. Until you have rested at an inn, use body ${alt.body} (ready-made set ${idsOf(alt)}, ¥${alt.priceYen} in Area ${alt.stage}) instead.`,
      `このボディはグループ${f.g}で、新規セーブがロックしているグループ。これを使った毛バリは一切食いつかない。宿に泊まるまでは、代わりにボディ${alt.body}（完成品${idsOf(alt)}、エリア${alt.stage}で${alt.priceYen}円）を使う。`,
      `บอดี้นี้อยู่กลุ่ม ${f.g} ซึ่งเป็นกลุ่มที่เซฟใหม่ล็อกไว้ ฟลายที่ใช้บอดี้นี้จะไม่กินเลย ถ้ายังไม่เคยนอนโรงแรมให้ใช้บอดี้ ${alt.body} แทน (ชุดสำเร็จรูป ${idsOf(alt)} ¥${alt.priceYen} ที่ด่าน ${alt.stage})`,
    );
  } else if (f.best) {
    act = t(
      `Buy the ready-made set ${idsOf(f.best)} for ¥${f.best.priceYen} in Area ${f.best.stage}; it works on a fresh save.${f.recommended ? ' It is the cheapest working set for these fish.' : ''}`,
      `完成品${idsOf(f.best)}をエリア${f.best.stage}で${f.best.priceYen}円で買う。新規セーブで使える。${f.recommended ? 'この魚たちに使える最安のセット。' : ''}`,
      `ซื้อชุดสำเร็จรูป ${idsOf(f.best)} ¥${f.best.priceYen} ที่ด่าน ${f.best.stage} ใช้ได้บนเซฟใหม่${f.recommended ? ' เป็นชุดที่ถูกที่สุดที่ใช้ได้กับปลากลุ่มนี้' : ''}`,
    );
  } else if (f.own.length) {
    act = t(
      `The ready-made set carries a wing from group ${LOCK.wing}, which a fresh save locks. Build the body yourself with another wing, or use body ${alt.body}.`,
      `完成品のウィングはグループ${LOCK.wing}で、新規セーブではロックされる。別のウィングで自作するか、ボディ${alt.body}を使う。`,
      `ชุดสำเร็จรูปใช้ปีกกลุ่ม ${LOCK.wing} ซึ่งเซฟใหม่ล็อกไว้ ให้ประกอบเองด้วยปีกอื่น หรือใช้บอดี้ ${alt.body}`,
    );
  } else {
    act = t(
      `No shop sells this body ready-made. Build it at the fly maker with a wing outside group ${LOCK.wing}, or use body ${alt.body}, which a shop sells.`,
      `この本体を完成品で売る店はない。毛バリ職人でグループ${LOCK.wing}以外のウィングを選んで自作するか、店で買えるボディ${alt.body}を使う。`,
      `ไม่มีร้านขายบอดี้นี้แบบสำเร็จรูป ให้ประกอบเองที่ร้านทำฟลายด้วยปีกที่ไม่ใช่กลุ่ม ${LOCK.wing} หรือใช้บอดี้ ${alt.body} ที่ร้านขาย`,
    );
  }
  return { kind, act };
}

function standing(f) {
  return f.g === LOCK.body
    ? t(`Body group ${f.g} matches the fresh-save lock.`, `ボディのグループ${f.g}は新規セーブのロックと一致。`, `บอดี้กลุ่ม ${f.g} ตรงกับล็อกของเซฟใหม่`)
    : t(`Body group ${f.g} does not match the fresh-save lock (group ${LOCK.body}).`, `ボディのグループ${f.g}は新規セーブのロック（グループ${LOCK.body}）と一致しない。`, `บอดี้กลุ่ม ${f.g} ไม่ตรงกับล็อกของเซฟใหม่ (กลุ่ม ${LOCK.body})`);
}

function bodyReason(f) {
  return fightText(f.effect.sel);
}

// The summary feeds the catalogue search, so it carries no counts or prices: searching an item ID must not match it.
function bodySummary(f) {
  if (f.g === LOCK.body) {
    return t(
      'Locked on a fresh save: a group-1 body never bites until the lock changes',
      '新規セーブでは使えない：グループ1のボディは、ロックが変わるまで食いつかない',
      'ล็อกบนเซฟใหม่: บอดี้กลุ่ม 1 ไม่กินเลยจนกว่าล็อกจะเปลี่ยน',
    );
  }
  return f.dry
    ? t(
      'Dry or terrestrial body: it picks the fish that bite, and the whole fly must also get past the save’s lock.',
      'ドライ・テレストリアルのボディ：食いつく魚を決める。毛バリ全体がセーブのロックも通る必要がある。',
      'บอดี้แบบแห้งหรือแมลงบก: เลือกปลาที่กิน และฟลายทั้งชุดต้องไม่ติดล็อกของเซฟ',
    )
    : t(
      'Wet body: it picks the fish that bite, and the whole fly must also get past the save’s lock.',
      'ウェットのボディ：食いつく魚を決める。毛バリ全体がセーブのロックも通る必要がある。',
      'บอดี้แบบเปียก: เลือกปลาที่กิน และฟลายทั้งชุดต้องไม่ติดล็อกของเซฟ',
    );
}

function bodyUse(f) {
  const advice = bodyAdvice(f);
  const label = bodyLabel(f);
  const reason = bodyReason(f);
  const fish = f.dry ? dryFishCount : wetFishCount;
  return {
    label,
    recommendation: t(`${advice.kind.en} ${advice.act.en}`, `${advice.kind.ja}${advice.act.ja}`, `${advice.kind.th} ${advice.act.th}`),
    reason,
    summary: bodySummary(f),
    facts: {
      en: [advice.kind.en, advice.act.en, standing(f).en, PART_ROLES.en, reason.en],
      ja: [advice.kind.ja, advice.act.ja, standing(f).ja, PART_ROLES.ja, reason.ja],
      th: [advice.kind.th, advice.act.th, standing(f).th, PART_ROLES.th, reason.th],
    },
    fishScope: t(
      `These ${fish} fish take a fly with this body, as long as the whole fly gets past the lock.`,
      `ここに出る${fish}種は、毛バリ全体がロックを通れば、このボディに食いつく。`,
      `ปลา ${fish} ชนิดนี้กินฟลายที่ใช้บอดี้นี้ เมื่อฟลายทั้งชุดผ่านล็อกของเซฟ`,
    ),
    evidenceNotes: {
      en: [`ROM audit 2026-10-07, tested on an emulator: every fish on the list bit a fly with this kind of body once the fly passed the lock (wet 33 of 33, dry 17 of 17). A fly whose body ID or wing ID leaves the same remainder when divided by 4 as the save's hidden values never bit; the lock is written once when the save is formatted and again only by an inn rest. Tail IDs are never read. The body's size selector (${f.effect.sel}) and dry flag (${f.effect.flag}) set the fight start (docs/gear-effects.md).`],
      ja: [`ROM監査2026-10-07（エミュレータで検証）：ロックを通ったこの種のボディの毛バリには、リストの魚がすべて食いついた（ウェット33/33、ドライ17/17）。ボディIDまたはウィングIDを4で割った余りが隠し値と同じ毛バリは一度も食いつかない。ロックはセーブ作成時に1回、あとは宿泊でのみ書き換わる。テールIDは参照されない。ボディのサイズ区分（${f.effect.sel}）とドライ旗（${f.effect.flag}）がファイトの開始値を決める（docs/gear-effects.md）。`],
      th: [`ตรวจ ROM ปี 2026-10-07 และทดสอบบนอีมูเลเตอร์: ปลาทุกตัวในรายชื่อกินฟลายที่ใช้บอดี้แบบนี้เมื่อฟลายผ่านล็อก (เปียก 33/33 แห้ง 17/17) ฟลายที่เศษของ ID บอดี้หรือ ID ปีกหารด้วย 4 ตรงกับค่าลับของเซฟไม่เคยถูกกินเลย ล็อกถูกเขียนครั้งเดียวตอนสร้างเซฟ และเขียนใหม่ได้เฉพาะตอนนอนโรงแรม ไม่อ่าน ID ของหาง ตัวเลือกขนาดของบอดี้ (${f.effect.sel}) และธงแบบแห้ง (${f.effect.flag}) กำหนดจุดเริ่มสู้ (docs/gear-effects.md)`],
    },
  };
}

// ---- wings and tails -----------------------------------------------------------------------------------
function wingUse(id) {
  const g = group(id);
  const sets = bundles.filter(bundle => bundle.wing === id);
  const blocked = g === LOCK.wing;
  const inMaker = Boolean(nameOf('fly_wing', id).flyMakerMenuChoice);
  const source = !sets.length && !inMaker
    ? t(
      'This wing is in no shop and not in the fly maker, so you cannot get it. Skip it.',
      'このウィングは店にも毛バリ職人にもないので入手できない。無視してよい。',
      'ปีกนี้ไม่มีทั้งในร้านและในร้านทำฟลาย จึงหาไม่ได้เลย ข้ามไปได้',
    )
    : !inMaker
      ? t(
        'The fly maker does not offer this wing; you can only get it inside the ready-made set below.',
        'このウィングは毛バリ職人では選べず、下の完成品の中でしか手に入らない。',
        'ร้านทำฟลายไม่มีปีกนี้ ได้เฉพาะในชุดสำเร็จรูปด้านล่างเท่านั้น',
      )
      : null;
  const setLine = sets.length
    ? t(
      `Ready-made sets with this wing: ${sets.map(bundle => `${idsOf(bundle)} ¥${bundle.priceYen} (Area ${bundle.stage})`).join(', ')}.`,
      `このウィングを含む完成品：${sets.map(bundle => `${idsOf(bundle)} ${bundle.priceYen}円（エリア${bundle.stage}）`).join('、')}。`,
      `ชุดสำเร็จรูปที่มีปีกนี้: ${sets.map(bundle => `${idsOf(bundle)} ¥${bundle.priceYen} (ด่าน ${bundle.stage})`).join(', ')}`,
    )
    : t('No shop set carries this wing.', 'このウィングを含む完成品の販売はない。', 'ไม่มีชุดสำเร็จรูปในร้านที่ใช้ปีกนี้');
  const label = blocked
    ? t(
      `Locked on a fresh save: a group-${g} wing never bites until the lock changes`,
      `新規セーブでは使えない：グループ${g}のウィングは、ロックが変わるまで食いつかない`,
      `ล็อกบนเซฟใหม่: ปีกกลุ่ม ${g} ไม่กินเลยจนกว่าล็อกจะเปลี่ยน`,
    )
    : t(
      `Works on a fresh save · group ${g} · only a ticket past the lock`,
      `新規セーブで使える · グループ${g} · ロックを通るためだけの部品`,
      `ใช้ได้บนเซฟใหม่ · กลุ่ม ${g} · ใช้แค่ผ่านล็อก`,
    );
  const body = blocked
    ? t(
      `The wing does one job: it decides whether the fly gets past the lock. Group ${g} is the wing group a fresh save locks, so a fly with this wing never bites. Pick a wing from another group.`,
      `ウィングの役目はロックを通るかどうかだけ。グループ${g}は新規セーブがロックしているウィングのグループで、このウィングの毛バリは一切食いつかない。別のグループのウィングを選ぶ。`,
      `ปีกมีหน้าที่เดียวคือผ่านล็อกหรือไม่ผ่าน กลุ่ม ${g} เป็นกลุ่มปีกที่เซฟใหม่ล็อกไว้ ฟลายที่ใช้ปีกนี้จะไม่กินเลย ให้เลือกปีกกลุ่มอื่น`,
    )
    : t(
      `The wing does one job: it decides whether the fly gets past the lock. Group ${g} is not the group a fresh save locks (group ${LOCK.wing}), so it works as long as the body is not group ${LOCK.body}. It does not choose fish and does not change the fight.`,
      `ウィングの役目はロックを通るかどうかだけ。グループ${g}は新規セーブがロックするグループ（${LOCK.wing}）ではないので、ボディがグループ${LOCK.body}でなければ使える。魚は選ばず、ファイトも変えない。`,
      `ปีกมีหน้าที่เดียวคือผ่านล็อกหรือไม่ผ่าน กลุ่ม ${g} ไม่ใช่กลุ่มที่เซฟใหม่ล็อก (กลุ่ม ${LOCK.wing}) จึงใช้ได้ถ้าบอดี้ไม่ใช่กลุ่ม ${LOCK.body} ปีกไม่เลือกปลาและไม่เปลี่ยนการสู้`,
    );
  const cost = t(
    'Choose the cheapest wing outside the locked group; no wing is better than another.',
    'ロックされたグループ以外で最も安いウィングを選ぶ。ウィング同士に優劣はない。',
    'เลือกปีกที่ถูกที่สุดในกลุ่มที่ไม่ถูกล็อก ปีกไม่มีชิ้นไหนดีกว่าชิ้นอื่น',
  );
  const unobtainable = !sets.length && !inMaker;
  const shownLabel = unobtainable ? source : label;
  return {
    label: shownLabel,
    recommendation: source
      ? t(`${source.en} ${body.en} ${setLine.en}`, `${source.ja}${body.ja}${setLine.ja}`, `${source.th} ${body.th} ${setLine.th}`)
      : t(`${body.en} ${cost.en}`, `${body.ja}${cost.ja}`, `${body.th} ${cost.th}`),
    reason: t(
      `${PART_ROLES.en} ${setLine.en}`,
      `${PART_ROLES.ja}${setLine.ja}`,
      `${PART_ROLES.th} ${setLine.th}`,
    ),
    summary: shownLabel,
    facts: { en: [body.en, cost.en, setLine.en], ja: [body.ja, cost.ja, setLine.ja], th: [body.th, cost.th, setLine.th] },
    evidenceNotes: {
      en: ['ROM audit 2026-10-07, tested on an emulator: only the wing ID divided by 4 (remainder) is read, never the wing itself; wing IDs with the same remainder and any tail gave identical timelines. A fly whose wing remainder equals the save\'s hidden wing value never bit.'],
      ja: ['ROM監査2026-10-07（エミュレータで検証）：参照されるのはウィングIDを4で割った余りだけで、ウィング自体は読まれない。同じ余りのウィングとどのテールでも、まったく同じ経過になった。ウィングの余りが隠し値と同じ毛バリは一度も食いつかなかった。'],
      th: ['ตรวจ ROM ปี 2026-10-07 และทดสอบบนอีมูเลเตอร์: อ่านเฉพาะเศษของ ID ปีกที่หารด้วย 4 ไม่ได้อ่านตัวปีก ปีกที่เศษเท่ากันกับหางใดก็ได้ให้ผลเหมือนกันทุกประการ ฟลายที่เศษของปีกตรงกับค่าลับของเซฟไม่เคยถูกกินเลย'],
    },
  };
}

function tailUse(id) {
  const sets = bundles.filter(bundle => bundle.tail === id);
  const setLine = sets.length
    ? t(
      `Ready-made sets with this tail: ${sets.map(bundle => `${idsOf(bundle)} ¥${bundle.priceYen} (Area ${bundle.stage})`).join(', ')}.`,
      `このテールを含む完成品：${sets.map(bundle => `${idsOf(bundle)} ${bundle.priceYen}円（エリア${bundle.stage}）`).join('、')}。`,
      `ชุดสำเร็จรูปที่มีหางนี้: ${sets.map(bundle => `${idsOf(bundle)} ¥${bundle.priceYen} (ด่าน ${bundle.stage})`).join(', ')}`,
    )
    : t('No shop set carries this tail.', 'このテールを含む完成品の販売はない。', 'ไม่มีชุดสำเร็จรูปในร้านที่ใช้หางนี้');
  const label = t(
    'Looks only: the tail changes neither bites nor the fight',
    '見た目だけ：テールは食いつきにもファイトにも影響しない',
    'แค่หน้าตา: หางไม่เปลี่ยนการกินและไม่เปลี่ยนการสู้',
  );
  const advice = t(
    'The tail has no effect on biting or on the fight. At the fly maker it only adds to the price, so choose None (¥0) unless you like the look.',
    'テールは食いつきにもファイトにも影響しない。毛バリ職人では料金が増えるだけなので、見た目にこだわらなければ「無し」（0円）を選ぶ。',
    'หางไม่มีผลต่อการกินหรือการสู้ ที่ร้านทำฟลายมีแต่เพิ่มราคา เลือก “ไม่มี” (¥0) ได้เลยถ้าไม่ติดใจหน้าตา',
  );
  return {
    label,
    recommendation: advice,
    reason: t(`${PART_ROLES.en} ${setLine.en}`, `${PART_ROLES.ja}${setLine.ja}`, `${PART_ROLES.th} ${setLine.th}`),
    summary: label,
    facts: { en: [advice.en, setLine.en], ja: [advice.ja, setLine.ja], th: [advice.th, setLine.th] },
    evidenceNotes: {
      en: ['ROM audit 2026-10-07, tested on an emulator: no fishing or fight code reads the tail ID (it is only copied to the inventory and the fly record); different tails gave bit-identical timelines.'],
      ja: ['ROM監査2026-10-07（エミュレータで検証）：釣りにもファイトにもテールIDを読む処理はない（所持品と毛バリ記録へ写されるだけ）。テールを変えても経過は完全に同じだった。'],
      th: ['ตรวจ ROM ปี 2026-10-07 และทดสอบบนอีมูเลเตอร์: ไม่มีโค้ดตกปลาหรือสู้ปลาที่อ่าน ID ของหาง (ถูกคัดลอกไปยังช่องเก็บของและระเบียนฟลายเท่านั้น) หางต่างกันให้ผลเหมือนกันทุกบิต'],
    },
  };
}

// ---- category-level decision ---------------------------------------------------------------------------
function categoryDecision() {
  const wet = wetStarter, dry = dryStarter;
  const unlocked = cheapest(bundles.filter(bundle => !usable(bundle) && !isDry(bundle.body)));
  return {
    id: 'fly_bundle_choice',
    category: 'flymaker',
    title: t(
      'Which fly do I buy?',
      'どの毛バリを買う？',
      'ซื้อฟลายตัวไหนดี?',
    ),
    recommendation: t(
      `On a new save one set is enough. For the ${wetFishCount} fish that take wet bodies, buy the ready-made set ${idsOf(wet)} for ¥${wet.priceYen} in Area ${wet.stage}. For the ${dryFishCount} fish that take dry bodies, buy ${idsOf(dry)} for ¥${dry.priceYen} in Area ${dry.stage}. For insurance against a lock change after an inn rest, carry the three-fly set ${setText(wetInsurance)} (¥${setTotal(wetInsurance)}). Do not buy ${idsOf(unlocked)} (¥${unlocked.priceYen}) on its own: a fresh save never lets it bite.`,
      `新規セーブなら1セットで足りる。ウェットのボディを食べる${wetFishCount}種には、完成品${idsOf(wet)}をエリア${wet.stage}で${wet.priceYen}円。ドライのボディを食べる${dryFishCount}種には、${idsOf(dry)}をエリア${dry.stage}で${dry.priceYen}円。宿泊後のロック変更に備えるなら、3本セット${setText(wetInsurance)}（合計${setTotal(wetInsurance)}円）を持つ。${idsOf(unlocked)}（${unlocked.priceYen}円）を単独で買ってはいけない。新規セーブでは一切食いつかない。`,
      `เซฟใหม่ซื้อชุดเดียวก็พอ ปลา ${wetFishCount} ชนิดที่กินบอดี้แบบเปียก ซื้อชุดสำเร็จรูป ${idsOf(wet)} ¥${wet.priceYen} ที่ด่าน ${wet.stage} ปลา ${dryFishCount} ชนิดที่กินบอดี้แบบแห้งได้ ซื้อ ${idsOf(dry)} ¥${dry.priceYen} ที่ด่าน ${dry.stage} ถ้าอยากกันเหนียวเผื่อล็อกเปลี่ยนหลังนอนโรงแรม พกชุดสามตัว ${setText(wetInsurance)} รวม ¥${setTotal(wetInsurance)} อย่าซื้อ ${idsOf(unlocked)} (¥${unlocked.priceYen}) ตัวเดียว เพราะเซฟใหม่ไม่กินเลย`,
    ),
    reason: t(
      `${PART_ROLES.en} ${LOCK_SHORT.en}`,
      `${PART_ROLES.ja}${LOCK_SHORT.ja}`,
      `${PART_ROLES.th} ${LOCK_SHORT.th}`,
    ),
    scope: t(
      'If a fish turns toward the fly but does not bite, change nothing: the fly is past the lock. If no fish ever reacts although your float is on its tile, swap to a fly whose body AND wing are in different groups from the first one.',
      '魚がこちらを向いたのに食いつかないときは何も変えなくてよい（ロックは通っている）。魚のマスにウキを置いても魚がまったく反応しないときは、ボディもウィングも別グループの毛バリに替える。',
      'ถ้าปลาหันมาทางฟลายแต่ไม่กิน ไม่ต้องเปลี่ยนอะไร แปลว่าฟลายผ่านล็อกแล้ว แต่ถ้าทุ่นอยู่ช่องของปลาแล้วไม่มีปลาตัวไหนสนใจเลย ให้เปลี่ยนไปใช้ฟลายที่บอดี้และปีกอยู่คนละกลุ่มกับตัวเดิมทั้งคู่',
    ),
    items: [
      { category: 'fly', id: wet.body },
      { category: 'fly_wing', id: wet.wing },
      { category: 'fly', id: dry.body },
      { category: 'fly_wing', id: dry.wing },
      { category: 'fly_tail', id: dry.tail },
    ],
  };
}

// ---- assemble -----------------------------------------------------------------------------------------
const evidenceFor = category => ({
  type: 'rom_trace',
  sources: category === 'fly'
    ? ['data/fish-acceptance.json', 'docs/fish-acceptance-research.md', 'docs/gear-effects.md', 'docs/fly-practical-research.md']
    : ['data/fish-acceptance.json', 'data/fly-customization.json', 'docs/gear-effects.md', 'docs/fly-practical-research.md'],
});
const gearSources = ['docs/fly-practical-research.md', 'docs/fly-selection-practical-research.md', 'docs/gear-effects.md', 'data/fly-backup-choices.json', 'data/shop-stock-rom.json'];

const previous = new Map(research.items.map(entry => [`${entry.category}:${entry.id}`, entry]));
const items = [];
for (const category of ['fly', 'fly_wing', 'fly_tail']) {
  for (const item of gallery.items.filter(entry => entry.category === category)) {
    const copy = category === 'fly' ? bodyUse(bodyFacts(item.id)) : category === 'fly_wing' ? wingUse(item.id) : tailUse(item.id);
    const old = previous.get(`${category}:${item.id}`);
    const playerUse = { summary: copy.summary, facts: copy.facts, fishIds: old?.playerUse.fishIds || [], evidenceNotes: copy.evidenceNotes, evidence: evidenceFor(category) };
    if (copy.fishScope) playerUse.fishScope = copy.fishScope;
    items.push({ category, id: item.id, playerUse });
    gear.items[`${category}:${item.id}`] = { label: copy.label, recommendation: copy.recommendation, reason: copy.reason, sources: gearSources };
  }
}

research.scope = 'Player-facing fly body, wing and tail findings from the supplied Japanese original ROM, the ROM audit of 2026-10-07 and direct original-ROM first-stage maker captures; no guide-derived mechanics.';
research.summary = t(
  `The body decides which fish bite (wet ${wetFishCount}, dry and terrestrial ${dryFishCount}, all inside the wet set) and how the fight starts. The wing is only a ticket past a hidden per-save lock and the tail is only looks. A fly never bites if its body ID or wing ID (divided by 4, remainder) equals the save's hidden pair; a fresh save holds body ${LOCK.body} and wing ${LOCK.wing}, so the ¥5 Mayfly wet set never bites there. Resting at an inn can change the pair.`,
  `ボディが食いつく魚（ウェット${wetFishCount}種、ドライ・テレストリアル${dryFishCount}種でウェットに含まれる）とファイトの開始値を決める。ウィングはセーブごとの隠しロックを通るための部品、テールは見た目だけ。ボディIDまたはウィングID（4で割った余り）が隠しペアと同じ毛バリは食いつかない。新規セーブはボディ${LOCK.body}・ウィング${LOCK.wing}なので、5円のメイフライ・ウェットのセットは食いつかない。宿に泊まるとペアが変わることがある。`,
  `บอดี้เป็นตัวเลือกปลาที่กิน (แบบเปียก ${wetFishCount} ชนิด แบบแห้งและแมลงบก ${dryFishCount} ชนิดซึ่งอยู่ในกลุ่มเปียกทั้งหมด) และกำหนดจุดเริ่มสู้ ปีกคือตัวผ่านล็อกลับของแต่ละเซฟ หางเป็นแค่หน้าตา ฟลายที่ ID ของบอดี้หรือปีก (หารด้วย 4 เอาเศษ) ตรงกับคู่เลขลับของเซฟจะไม่กินเลย เซฟใหม่เป็นบอดี้ ${LOCK.body} และปีก ${LOCK.wing} ชุดเมย์ฟลายแบบเปียก ¥5 จึงไม่กินบนเซฟใหม่ การนอนโรงแรมอาจเปลี่ยนคู่เลขนี้`,
);
research.playerWorkflow = {
  en: [
    'Pick the fish, then the body: wet bodies pass 33 fish, dry and terrestrial bodies 17.',
    `Buy the ready-made set: body ${wetStarter.body} + wing ${wetStarter.wing} (¥${wetStarter.priceYen}) for wet-class fish or body ${dryStarter.body} + wing ${dryStarter.wing} + tail ${dryStarter.tail} (¥${dryStarter.priceYen}) for dry-class fish. Both work on a fresh save.`,
    'Build a fly yourself only for a body and wing combination no shop sells, or for a specific body family. The maker charges body + wing + tail; a shop set charges only the body price.',
    'Rest at an inn and the lock may change: re-equip the fly, and carry the three-fly set if you want insurance.',
  ],
  ja: [
    '魚を決め、次にボディを選ぶ。ウェットは33種、ドライ・テレストリアルは17種に使える。',
    `完成品を買う：ウェットの魚にはボディ${wetStarter.body}＋ウィング${wetStarter.wing}（${wetStarter.priceYen}円）、ドライの魚にはボディ${dryStarter.body}＋ウィング${dryStarter.wing}＋テール${dryStarter.tail}（${dryStarter.priceYen}円）。どちらも新規セーブで使える。`,
    '自作するのは、店に売っていないボディとウィングの組み合わせか、特定のボディ系統が欲しいときだけ。職人はボディ＋ウィング＋テールの料金、店の完成品はボディ分の料金のみ。',
    '宿に泊まるとロックが変わることがある。毛バリを装備し直し、保険がほしければ3本セットを持つ。',
  ],
  th: [
    'เลือกปลาก่อน แล้วเลือกบอดี้: แบบเปียกใช้กับปลา 33 ชนิด แบบแห้งและแมลงบก 17 ชนิด',
    `ซื้อชุดสำเร็จรูป: บอดี้ ${wetStarter.body} + ปีก ${wetStarter.wing} (¥${wetStarter.priceYen}) สำหรับปลากลุ่มเปียก หรือบอดี้ ${dryStarter.body} + ปีก ${dryStarter.wing} + หาง ${dryStarter.tail} (¥${dryStarter.priceYen}) สำหรับปลากลุ่มแห้ง ทั้งสองชุดใช้ได้บนเซฟใหม่`,
    'ประกอบเองเฉพาะเมื่ออยากได้คู่บอดี้กับปีกที่ร้านไม่ขาย หรืออยากได้ตระกูลบอดี้เฉพาะ ร้านประกอบคิดราคาบอดี้ + ปีก + หาง ส่วนชุดในร้านคิดแค่ราคาบอดี้',
    'นอนโรงแรมแล้วล็อกอาจเปลี่ยน ให้ใส่ฟลายอีกครั้ง และพกชุดสามตัวถ้าอยากกันเหนียว',
  ],
};
research.hiddenGate = {
  effect: `A fly never bites when (body ID mod 4) equals the save's hidden body value or (wing ID mod 4) equals the hidden wing value. Casting again does not re-roll it; the value is written when the save is formatted (a blank save gets body ${LOCK.body}, wing ${LOCK.wing}) and again only by an inn rest, about 34% of the time for at least one side.`,
  sourceCpu: ['04:D4AF..D4CD', '04:E6C9..E6D2', '04:EDA0..EDB2', '03:80C7..838x', '01:B705'],
  limit: 'Tested on an emulator with RAM-patched records; the first boot of a blank cart on real hardware was not run. Whether an inn rest also refreshes an already equipped fly is untested, so re-equip the fly after resting.',
};
research.freshSaveLock = {
  body: LOCK.body,
  wing: LOCK.wing,
  note: 'Tested: wet 01/09/13 and 02/0A/14 never bit, 2B/34/00, 3E/43/49, 18/1F/27, 4B/50/53, 6C/70/74 and 77/00/00 did, with the lock at its fresh-save value.',
};
delete research.candidateFourCombinationExperiment;
research.priceAndStock = t(
  'A ready-made set costs the body\'s price only (wings and tails are free in a set). The fly maker (Areas 1 to 3) charges body + wing + tail for the same parts and stores exactly the same fly, so the maker is only worth it for a combination no shop sells. Wings 25, 66 and 67 are in no shop and not in the maker.',
  '店の完成品はボディの価格のみ（セット内のウィング・テールは無料）。毛バリ職人（エリア1〜3）は同じ部品でもボディ＋ウィング＋テールの合計で、できる毛バリはまったく同じ。職人で作る価値があるのは、店に売っていない組み合わせだけ。ウィング25・66・67は店にも職人にもない。',
  'ชุดสำเร็จรูปคิดแค่ราคาของบอดี้ (ปีกกับหางในชุดไม่คิดเงิน) ร้านทำฟลาย (ด่าน 1–3) คิดราคาบอดี้ + ปีก + หางสำหรับชิ้นส่วนชุดเดียวกัน และได้ฟลายเหมือนกันทุกอย่าง จึงคุ้มเฉพาะกับคู่ที่ไม่มีร้านไหนขาย ปีก 25, 66 และ 67 ไม่มีทั้งในร้านและในร้านทำฟลาย',
);
research.items = items;

const decision = categoryDecision();
const index = decisions.sections.findIndex(section => section.id === 'fly_bundle_choice');
if (index < 0) throw new Error('fly_bundle_choice missing');
decisions.sections[index] = decision;

// The file-level scope covers hooks and floats too; the rod/hook/float generator leaves it alone.
gear.scope = t(
  'Player-facing hook, float/sinker and fly-component decisions from the supplied Japanese ROM, decoded six-area shop stock, the ROM audit of 2026-10-07 and direct original-ROM maker capture. A fly bites only if its body is on the fish\'s list and neither its body nor its wing matches the save\'s hidden lock; hooks and fly bodies also change how the fight starts. No external gameplay guide is used as evidence.',
  '針・ウキ／オモリ・フライ部品の判断は、提供された日本版ROM、復号した6エリアの在庫、2026-10-07のROM監査、原作の作成画面キャプチャに基づきます。毛バリは、ボディが魚のリストにあり、ボディもウィングもセーブの隠しロックと一致しないときだけ食いつきます。針とフライのボディはファイトの出だしにも影響します。外部攻略情報は根拠に使っていません。',
  'คำแนะนำตะขอ ทุ่น/ตะกั่ว และชิ้นส่วนฟลายนี้อ้างจาก ROM ญี่ปุ่นที่ผู้ใช้ให้ รายการร้านหกด่านที่ถอดได้ การตรวจ ROM ปี 2026-10-07 และภาพหน้าทำฟลายจากเกมจริง ฟลายจะกินเมื่อบอดี้อยู่ในรายชื่อของปลา และทั้งบอดี้และปีกไม่ตรงกับล็อกลับของเซฟ ตะขอและบอดี้ฟลายยังเปลี่ยนจุดเริ่มสู้ด้วย ไม่ใช้ไกด์เกมภายนอกเป็นหลักฐาน',
);
write('data/fly-practical-research.json', research);
write('data/gear-item-decisions.json', gear);
write('data/player-decisions.json', decisions);
console.log(`Wrote advice for ${items.length} fly parts; wet starter ${idsOf(wetStarter)} ¥${wetStarter.priceYen}, dry starter ${idsOf(dryStarter)} ¥${dryStarter.priceYen}.`);
