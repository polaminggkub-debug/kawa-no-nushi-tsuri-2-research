#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const gallery = read('catalogue/gallery-data.json');
const acceptance = read('data/fish-acceptance.json');
const stock = read('data/shop-stock-rom.json');
const itemRecords = read('data/item-table-records.json');
const stockByKey = stock.items;
const stages = [1, 2, 3, 4, 5, 6];
const refs = (category, id) => ({ category, id });
const sortIds = values => [...new Set(values || [])].sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
const sameSet = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
const covers = (candidate, target) => Object.keys(target).every(route => {
  const candidateSet = new Set(candidate[route] || []);
  return (target[route] || []).every(id => candidateSet.has(id));
});
const areaName = (availableStages, language) => {
  if (language === 'en') return `area${availableStages.length === 1 ? '' : 's'} ${availableStages.join(', ')}`;
  if (language === 'ja') return `エリア${availableStages.join('・')}`;
  return `ด่าน ${availableStages.join(', ')}`;
};
const itemName = (item, language) => language === 'th'
  ? item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn
  : language === 'ja'
    ? item.playerUse?.displayName?.ja || item.nameJa || item.nameEn
    : item.playerUse?.displayName?.en || item.nameEn || item.nameJa;
const localizedCondition = condition => {
  if (!condition || !condition.includes('sell at least one Ayu')) return null;
  return {
    en: 'after selling at least one Ayu; each purchase subtracts 9 from the sold-Ayu counter (minimum 0)',
    ja: 'アユを1匹以上売った後に購入可能。購入ごとに売却アユ数を9減らす（0未満にはならない）',
    th: 'ซื้อได้หลังขายปลาอายุอย่างน้อย 1 ตัว; ซื้อแต่ละครั้งจะหักจำนวนปลาอายุที่ขายไป 9 (ต่ำสุด 0)'
  };
};
const itemSources = category => category === 'bait'
  ? ['data/fish-acceptance.json', 'data/shop-stock-rom.json', 'data/item-table-records.json', 'docs/fish-acceptance-research.md', 'docs/gear-effects.md', 'docs/shop-stock-research.md']
  : ['data/fish-acceptance.json', 'data/lure-coverage.json', 'data/shop-stock-rom.json', 'data/item-table-records.json', 'docs/fish-acceptance-research.md', 'docs/gear-effects.md', 'docs/shop-stock-research.md'];

const effects = read('data/gear-effects.json');
const names = {};
for (const [id, visual] of Object.entries(gallery.fishVisuals || {})) {
  const latin = visual.nameLatin || '';
  names[id] = {
    en: visual.nameEn || latin || visual.nameJa || id,
    ja: visual.nameJa || id,
    th: visual.nameTh || (visual.nameThVariants || []).join(' / ') || latin || visual.nameJa || id
  };
}
const t = (en, ja, th) => ({ en, ja, th });
// Facts: ROM audit 2026-10-07 (rom-analysis/audit-2026-10-07/acceptance/report.md) and data/gear-effects.json.
const BAIT_RULE = t(
  'A bait bites when it is on the fish\'s list and your float is on the fish\'s exact tile: about 2 seconds on a float rig, about 10 seconds on a sinker rig (bottom fish only). Time of day, weather, rod, hook and HP change nothing. A fish that ignores you is on another tile or does not list this bait, so move the cast instead of swapping the bait.',
  'エサは、魚のリストにあり、ウキが魚と同じマスにあれば食いつく。ウキ仕掛けは約2秒、オモリ仕掛けは約10秒（底の魚のみ）。時間帯・天気・竿・ハリ・HPは関係ない。反応しない魚は別のマスにいるか、このエサがリストにない。エサを替えず、投げる位置を変える。',
  'เหยื่อกินได้เมื่ออยู่ในรายชื่อของปลาและทุ่นอยู่ช่องเดียวกับปลา ชุดทุ่นราว 2 วินาที ชุดตะกั่วราว 10 วินาที (ปลาหน้าดินเท่านั้น) เวลา อากาศ คัน เบ็ด และ HP ไม่มีผล ปลาที่ไม่สนใจอยู่คนละช่องหรือเหยื่อไม่อยู่ในรายชื่อ ให้ขยับจุดปล่อย ไม่ใช่เปลี่ยนเหยื่อ'
);
const LURE_RULE = t(
  'A lure\'s fish list decides which fish chase it, and the fish must be on the lure\'s tile. Keep tapping A or B while the lure is in the water; when a fish is level with the lure, press A once to hook it. Two lures cover all 38 lure fish: lure 17 or lure 2E, plus lure 23. Time of day, weather and rod do not change who follows.',
  'ルアーのリストが、どの魚が追うかを決める。魚はルアーと同じマスにいる必要がある。ルアーが水中にある間はAかBを連打し、魚がルアーと同じ高さに来たらAを1回押してかける。ルアー2つで全38種をカバーできる：ルアー17またはルアー2E、＋ルアー23。時間帯・天気・竿は、魚が追うかどうかに関係ない。',
  'รายชื่อปลาของลัวร์ตัดสินว่าปลาตัวไหนว่ายตาม และปลาต้องอยู่ช่องเดียวกับลัวร์ กด A หรือ B ต่อเนื่องตอนลัวร์อยู่ในน้ำ พอปลาอยู่ระดับเดียวกับลัวร์ให้กด A หนึ่งครั้งเพื่อเกี่ยวปลา ลัวร์สองชิ้นก็ครอบคลุมปลาลัวร์ทั้ง 38 ชนิด คือลัวร์ 17 หรือลัวร์ 2E คู่กับลัวร์ 23 เวลา อากาศ และคันไม่มีผลต่อการที่ปลาตาม'
);
const LURE_CLASS = [
  t('Its size class helps against fish up to 15 cm and hurts against fish over 35 cm in the fight.', 'サイズ区分は、ファイトで15cm以下の魚に有利、35cm超の魚には不利。', 'กลุ่มขนาดของลัวร์นี้ช่วยตอนสู้กับปลาไม่เกิน 15 ซม. และเสียเปรียบกับปลาใหญ่กว่า 35 ซม.'),
  t('Its size class helps against fish of 16 to 35 cm in the fight.', 'サイズ区分は、ファイトで16〜35cmの魚に有利。', 'กลุ่มขนาดของลัวร์นี้ช่วยตอนสู้กับปลา 16–35 ซม.'),
  t('Its size class helps against fish over 35 cm and hurts against fish up to 15 cm in the fight.', 'サイズ区分は、ファイトで35cm超の魚に有利、15cm以下の魚には不利。', 'กลุ่มขนาดของลัวร์นี้ช่วยตอนสู้กับปลาใหญ่กว่า 35 ซม. และเสียเปรียบกับปลาไม่เกิน 15 ซม.')
];
const matchedFishOf = (category, item) => {
  const match = item.rawFields?.['+1'];
  return category === 'bait' && match && item.id !== '17' ? match.toString(16).toUpperCase().padStart(2, '0') : null;
};
const fightClassOf = (category, item) => category === 'lure' ? effects.items.lure[String(parseInt(item.id, 16))].sel : null;

function createCopy(category, item, gate, cheaperOptions, offerStages) {
  const bait = category === 'bait';
  const matched = matchedFishOf(category, item);
  const fightClass = fightClassOf(category, item);
  const floatCount = bait ? gate.float.length : 0;
  const sinkerCount = bait ? gate.sinker.length : 0;
  const lureCount = bait ? 0 : gate.all.length;
  const does = {
    en: bait
      ? `${floatCount} fish take this bait on a float rig${sinkerCount ? ` and ${sinkerCount} on a sinker rig (bottom fish)` : '; it does not work on a sinker rig'}.`
      : `${lureCount} fish chase this lure.`,
    ja: bait
      ? `ウキ仕掛けで${floatCount}種${sinkerCount ? `、オモリ仕掛けで${sinkerCount}種（底の魚）` : '（オモリ仕掛けでは使えない）'}がこのエサを食べる。`
      : `${lureCount}種がこのルアーを追う。`,
    th: bait
      ? `ปลา ${floatCount} ชนิดกินเหยื่อนี้ในสายทุ่น${sinkerCount ? ` และ ${sinkerCount} ชนิดในสายตะกั่ว (ปลาหน้าดิน)` : ' (ใช้กับสายตะกั่วไม่ได้)'}`
      : `ปลา ${lureCount} ชนิดว่ายตามลัวร์นี้`
  };
  const todo = bait
    ? t('Put the float on the tile the fish is on and wait a few seconds.', 'ウキを魚と同じマスに置き、数秒待つ。', 'วางทุ่นให้ตรงช่องที่ปลาอยู่ แล้วรอไม่กี่วินาที')
    : t('Tap A or B while the lure is in the water, then press A once when the fish is level with it.', 'ルアーが水中にある間はAかBを連打し、魚が同じ高さに来たらAを1回押す。', 'กด A หรือ B ต่อเนื่องตอนลัวร์อยู่ในน้ำ แล้วกด A หนึ่งครั้งเมื่อปลาอยู่ระดับเดียวกับลัวร์');
  const fightNote = {
    en: matched ? `This bait names ${names[matched]?.en}: against that fish the fight starts with half the mistakes counted (like a hook named for it, not stacked with one). A cheaper bait does not give you that.` : bait ? '' : LURE_CLASS[fightClass].en,
    ja: matched ? `このエサは${names[matched]?.ja}の名前を持つ。この魚とのファイトは開始値が半分になる（魚名つきのハリと同じ効果で、重ならない）。安いエサにはこの効果がない。` : bait ? '' : LURE_CLASS[fightClass].ja,
    th: matched ? `เหยื่อนี้ระบุชื่อ${names[matched]?.th}: ตอนสู้กับปลานี้ค่าเริ่มสู้ลดลงครึ่งหนึ่ง (เหมือนตะขอที่ระบุชื่อปลา และไม่ซ้อนกับตะขอ) เหยื่อที่ถูกกว่าไม่ได้ข้อนี้` : bait ? '' : LURE_CLASS[fightClass].th
  };
  const cheapest = cheaperOptions.slice(0, 3);
  const localizedNames = Object.fromEntries(['en', 'ja', 'th'].map(language => [language, cheapest.map(option => {
    const alt = gallery.items.find(row => row.category === category && row.id === option.id);
    const areas = stages.filter(stage => (stockByKey[`${category}:${option.id}`] || []).some(row => row.stage === stage));
    if (language === 'en') return `ID ${option.id} ${itemName(alt, language)} (¥${option.priceYen}, ¥${item.priceYen-option.priceYen} less, ${areaName(areas, language)}; covers the same fish or more)`;
    if (language === 'ja') return `ID ${option.id} ${itemName(alt, language)}（${option.priceYen}円、${item.priceYen-option.priceYen}円安い、${areaName(areas, language)}、同じ魚かそれ以上に対応）`;
    return `ID ${option.id} ${itemName(alt, language)} (¥${option.priceYen}, ถูกกว่า ¥${item.priceYen-option.priceYen}, ${areaName(areas, language)}; ปลาในรายชื่อครบเท่าเดิม)`;
  })]));

  const copy = {};
  for (const language of ['en', 'ja', 'th']) {
    const hasOffers = offerStages.length > 0;
    const join = language === 'ja' ? '、' : '; ';
    const fight = fightNote[language] ? ` ${fightNote[language]}` : '';
    let label;
    let buy;
    if (!hasOffers) {
      label = { en: 'Not sold in any of the six areas', ja: '6エリアの店頭在庫なし', th: 'ไม่มีขายในร้านทั้ง 6 ด่าน' }[language];
      buy = {
        en: 'No shop in the six areas sells it, so use it only if you already own it, or open a fish page to find an item a shop does sell.',
        ja: '6エリアのどの店にも売っていない。すでに持っているときだけ使うか、魚ページで店売りの品を探す。',
        th: 'ไม่มีร้านใน 6 ด่านขายชิ้นนี้ ใช้ได้เมื่อมีอยู่แล้ว หรือเปิดหน้าปลาเพื่อหาชิ้นที่ร้านขายแทน'
      }[language];
      if (bait && item.id === '0D') {
        label = { en: 'Gather in town with the magnifier', ja: '町で虫めがねを使って採る', th: 'ใช้แว่นขยายหาเหยื่อนี้ในเมือง' }[language];
        buy = {
          en: 'If you own magnifier 03, enter town through its second recorded entrance (arrival X7,Y29), stop and use it on a tile different from the last magnifier-use tile. The town Y16–31 band selects this bait; obtain 1–4 pieces, clamped to stack9, with room in the existing stack or a free bait slot. Area 6’s town was tested directly; the other five towns use the same game check. No shop in the six areas sells this bait. The stocked bait with the same fish lists is ID 0E (¥25, area 4) and ID 0F (¥25, area 5).',
          ja: '虫めがね03を持っているなら、町の2番目の入口（到着X7,Y29）から入り、前回虫めがねを使ったタイルとは別のタイルで立ち止まって使用する。町のY16–31ではこのエサを選び、エサ欄に空きがあれば1–4個（所持上限9）を得る。エリア6の町で実測し、他の5町は同じゲーム内の判定に基づく。6エリアのどの店にもこのエサはない。同じ魚リストの店売りはID 0E（25円、エリア4）とID 0F（25円、エリア5）。',
          th: 'ถ้ามีแว่นขยาย 03 ให้เข้าเมืองทางเข้าลำดับที่ 2 (เข้ามาที่ X7,Y29) หยุดเดินแล้วใช้บนช่องที่ต่างจากช่องที่ใช้แว่นขยายครั้งก่อน แถบ Y16–31 ในเมืองเลือกเหยื่อนี้ ได้ 1–4 ชิ้นตามช่องว่างของกอง สูงสุด 9 กองเหยื่อเดิมต้องยังไม่เต็ม 9 หรือมีช่องเหยื่อว่าง ทดสอบตรงในเมืองด่าน 6 แล้ว อีกห้าเมืองใช้เงื่อนไขเดียวกันในเกม ร้านทั้งหกด่านไม่ขายชิ้นนี้ ชิ้นที่ร้านขายและมีรายชื่อปลาเดียวกันคือ ID 0E (¥25 ด่าน 4) และ ID 0F (¥25 ด่าน 5)'
        }[language];
      }
    } else if (cheaperOptions.length) {
      const classNote = !bait && cheapest.some(option => fightClassOf('lure', option) !== fightClass)
        ? { en: ' The cheaper lure is in a different size class, so the fight starts differently.', ja: ' 安いルアーはサイズ区分が違うので、ファイトの開始値も違う。', th: ' แต่ลัวร์ที่ถูกกว่าอยู่คนละกลุ่มขนาด จึงเริ่มสู้ได้ไม่เหมือนชิ้นนี้' }[language]
        : '';
      label = { en: 'Cheaper items cover the same fish', ja: '同じ魚をカバーする安い品がある', th: 'มีตัวเลือกที่ถูกกว่าและกินปลาเท่ากัน' }[language];
      buy = {
        en: `Keep it if you own it. To buy new, take ${localizedNames[language].join(join)} instead: cheaper, and the fish list is the same or longer. The area-by-area list shows the lowest qualifying offer for each stage.${classNote}`,
        ja: `持っているなら使い続ける。新しく買うなら、代わりに${localizedNames[language].join(join)}がよい：安く、魚リストは同じかそれ以上。エリア別の一覧に各エリアの最安の該当品を示す。${classNote}`,
        th: `ถ้ามีอยู่แล้วใช้ต่อได้ ถ้าจะซื้อใหม่ ให้ซื้อ ${localizedNames[language].join(join)} แทน ถูกกว่าและรายชื่อปลาเท่ากันหรือกว้างกว่า รายการแยกตามด่านแสดงตัวเลือกที่ถูกที่สุดของแต่ละด่าน${classNote}`
      }[language];
    } else {
      label = { en: 'Buy it: no cheaper item covers the same fish', ja: '買ってよい：同じ魚をカバーする安い品はない', th: 'ซื้อได้: ไม่มีชิ้นถูกกว่าที่กินปลาเท่ากัน' }[language];
      buy = {
        en: `Keep it if you own it. No cheaper item in the six area shops covers the same fish, so buying it new is fine (¥${item.priceYen} in ${areaName(offerStages, language)}).`,
        ja: `持っているなら使い続ける。6エリアの店に、同じ魚をカバーする安い品はないので、新しく買ってよい（${areaName(offerStages, language)}で${item.priceYen}円）。`,
        th: `ถ้ามีอยู่แล้วใช้ต่อได้ ไม่มีชิ้นไหนในร้านทั้ง 6 ด่านที่ถูกกว่าแล้วกินปลาเท่ากัน จึงซื้อชิ้นนี้ได้เลย (¥${item.priceYen} ที่${areaName(offerStages, language)})`
      }[language];
    }
    const recommendation = `${does[language]} ${buy}${fight} ${todo[language]}`;
    const rule = bait ? BAIT_RULE : LURE_RULE;
    let reason;
    if (bait && hasOffers && !cheaperOptions.length && item.id !== '0D')
      reason = { en: `${rule.en} No lower-price shop choice covers both full fish lists; for one target fish, its page may show a cheaper bait on its list.`, ja: `${rule.ja} 両方の魚リスト全体を覆う安い店売り品はない。狙う魚が1種類なら、魚ページで、その魚のリストにある安いエサを確認できる。`, th: `${rule.th} ยังไม่มีตัวเลือกในร้านที่ถูกกว่าและครอบคลุมรายชื่อปลาทั้งสองสาย หากเล็งปลาชนิดเดียว หน้าปลานั้นอาจมีเหยื่อที่ถูกกว่าซึ่งอยู่ในรายชื่อ` }[language];
    else if (!bait && hasOffers && !cheaperOptions.length)
      reason = { en: `${rule.en} No lower-price shop choice covers the full fish list; for one target fish, its page may show a cheaper lure on its list.`, ja: `${rule.ja} 魚リスト全体を覆う安い店売り品はない。狙う魚が1種類なら、魚ページで、その魚のリストにある安いルアーを確認できる。`, th: `${rule.th} ยังไม่มีตัวเลือกในร้านที่ถูกกว่าและครอบคลุมรายชื่อปลาทั้งหมด หากเล็งปลาชนิดเดียว หน้าปลานั้นอาจมีลัวร์ที่ถูกกว่าซึ่งอยู่ในรายชื่อ` }[language];
    else reason = rule[language];
    copy[language] = { label, recommendation, reason };
  }
  return copy;
}

const output = {
  schemaVersion: 1,
  rom: {
    sha1: acceptance.rom.sha1,
    sizeBytes: acceptance.rom.size_bytes,
    identity: acceptance.rom.identity
  },
  scope: {
    en: 'Purchase choices use the supplied Japanese game’s item data, the fish lists of baits and lures, the six areas’ shop lists and the ROM audit of 2026-10-07: an item on a fish’s list bites once the float or lure is on the fish’s tile. Named baits and the lure size class also change how the fight starts.',
    ja: '購入判断は、提供された日本版ゲームのアイテムデータ、エサ・ルアーの魚リスト、全6エリアの店の品ぞろえ、2026-10-07のROM監査に基づきます。魚のリストにある品は、ウキやルアーが魚と同じマスにあれば食いつきます。魚名つきのエサとルアーのサイズ区分は、ファイトの開始値にも影響します。',
    th: 'คำแนะนำการซื้อดูจากข้อมูลไอเท็มในเกมญี่ปุ่นที่ให้มา รายชื่อปลาของเหยื่อและลัวร์ รายการสินค้าของร้านทั้ง 6 ด่าน และการตรวจ ROM ปี 2026-10-07 ของที่อยู่ในรายชื่อปลาจะถูกกินเมื่อทุ่นหรือลัวร์อยู่ช่องเดียวกับปลา เหยื่อที่ระบุชื่อปลาและกลุ่มขนาดของลัวร์ยังเปลี่ยนจุดเริ่มสู้ด้วย'
  },
  gateRules: {
    bait: 'Float: bait-mask overlap and nonzero fish-profile threshold. Sinker: bait-mask overlap plus fish-profile +13 bit 08 and nonzero +3 threshold. With the float on the fish\'s exact tile this gate is the whole species check: every tested fish that passed it bit (ROM audit 2026-10-07).',
    lure: 'Lure-mask/fish-profile overlap at the lure gate. The fish must be on the lure\'s tile and A or B must be pressed; every tested fish that passed bit (ROM audit 2026-10-07). The chase and strike that follow are the lure fight.',
    cheaperByStage: 'For each area, list only the cheapest lower-price stocked item(s) whose route-paired gates cover the current item’s entire accepted profile set. This preserves fish-list coverage only; a bait that names a fish also helps the fight and a lure\'s size class changes the fight start, so equal lists do not mean an equal fight.',
    equalPriceByStage: 'Same-category, same-price alternatives unconditionally stocked alongside the original in that area. Each alternative covers every original accepted profile on every compared rig and adds at least one profile. Fish-list coverage only; the fight start can still differ (named baits, lure size class).',
    prices: 'A price stored in the game data is shown as a shop price only when the item appears in the six areas’ shop lists. Conditional stock requirements are retained.'
  },
  sources: ['data/fish-acceptance.json', 'data/shop-stock-rom.json', 'data/item-table-records.json', 'docs/fish-acceptance-research.md', 'docs/shop-stock-research.md'],
  items: {}
};

const acceptedRecords = { bait: acceptance.baits, lure: acceptance.lures };
for (const category of ['bait', 'lure']) {
  const itemRows = gallery.items.filter(item => item.category === category).sort((a, b) => parseInt(a.id, 16) - parseInt(b.id, 16));
  const gatesById = {};
  for (const item of itemRows) {
    const record = acceptedRecords[category].find(row => row.id_hex === item.id);
    if (!record) throw new Error(`No ROM gate record for ${category}:${item.id}`);
    if (category === 'bait') {
      const maskSet = sortIds(record.fish_ids_passing_mask_gate);
      const floatSet = sortIds(record.mode0_fish_ids_with_nonzero_random_threshold);
      const sinkerSet = sortIds(maskSet.filter(id => record['mode1_fish_ids_passing_profile_byte_+13_gate'].includes(id) && record['mode1_fish_ids_with_nonzero_random_threshold_+3'].includes(id)));
      if (!sameSet(floatSet, sortIds(item.playerUse.fishIdsByRoute.float))) throw new Error(`Float gate mismatch for bait:${item.id}`);
      if (!sameSet(sinkerSet, sortIds(item.playerUse.fishIdsByRoute.sinker))) throw new Error(`Sinker gate mismatch for bait:${item.id}`);
      gatesById[item.id] = { float: floatSet, sinker: sinkerSet, maskHex: record.acceptance_mask_hex };
    } else {
      const fishSet = sortIds(record.fish_ids_passing_mask_gate);
      if (!sameSet(fishSet, sortIds(item.playerUse.fishIds))) throw new Error(`Lure gate mismatch for lure:${item.id}`);
      gatesById[item.id] = { all: fishSet, maskHex: record.acceptance_mask_hex };
    }
    const priceRecord = itemRecords[category].records.find(row => row.id === item.id);
    if (!priceRecord || priceRecord.price_field !== item.priceYen) throw new Error(`ROM item-table price mismatch for ${category}:${item.id}`);
    if (category === 'bait' && record.base_price_yen !== item.priceYen) throw new Error(`ROM acceptance price mismatch for ${category}:${item.id}`);
  }

  const groups = {};
  for (const item of itemRows) {
    const gate = gatesById[item.id];
    const signature = category === 'bait' ? `${JSON.stringify(gate.float)}|${JSON.stringify(gate.sinker)}` : JSON.stringify(gate.all);
    (groups[signature] ||= []).push(item.id);
  }

  for (const item of itemRows) {
    const gate = gatesById[item.id];
    const signature = category === 'bait' ? `${JSON.stringify(gate.float)}|${JSON.stringify(gate.sinker)}` : JSON.stringify(gate.all);
    const ownOffers = stockByKey[`${category}:${item.id}`] || [];
    const offerStages = [...new Set(ownOffers.map(row => row.stage))].sort((a, b) => a - b);
    const manifestStages = stock.areas.filter(area => area.items.some(entry => entry.category === category && entry.id === item.id)).map(area => area.stage).sort((a, b) => a - b);
    if (JSON.stringify(offerStages) !== JSON.stringify(manifestStages)) throw new Error(`Shop stage index mismatch for ${category}:${item.id}`);
    const shopOffersByStage = {};
    for (const offer of ownOffers) {
      const offerEntry = { priceYen: item.priceYen };
      const condition = localizedCondition(offer.condition);
      if (condition) offerEntry.condition = condition;
      shopOffersByStage[String(offer.stage)] = offerEntry;
    }
    const itemGate = category === 'bait' ? { float: gate.float, sinker: gate.sinker } : { all: gate.all };
    const lowerCandidates = itemRows.filter(candidate => {
      if (candidate.id === item.id || candidate.priceYen >= item.priceYen) return false;
      const candidateGate = gatesById[candidate.id];
      const gateObject = category === 'bait' ? { float: candidateGate.float, sinker: candidateGate.sinker } : { all: candidateGate.all };
      return covers(gateObject, itemGate);
    });
    const cheaperByStage = {};
    if (offerStages.length) {
      for (const stage of stages) {
        const available = lowerCandidates.filter(candidate => (stockByKey[`${category}:${candidate.id}`] || []).some(row => row.stage === stage));
        if (!available.length) continue;
        const lowest = Math.min(...available.map(candidate => candidate.priceYen));
        cheaperByStage[String(stage)] = available.filter(candidate => candidate.priceYen === lowest)
          .sort((a, b) => parseInt(a.id, 16) - parseInt(b.id, 16))
          .map(candidate => ({ category, id: candidate.id, priceYen: candidate.priceYen }));
      }
    }
    const equalPriceByStage = {};
    for (const stage of offerStages) {
      if (!ownOffers.some(row => row.stage === stage && !row.condition)) continue;
      const peers = itemRows.filter(candidate => {
        if (candidate.id === item.id || candidate.priceYen !== item.priceYen) return false;
        const other = gatesById[candidate.id];
        const routes = category === 'bait' ? { float: other.float, sinker: other.sinker } : { all: other.all };
        return covers(routes, itemGate) && Object.keys(itemGate).some(route => routes[route].length > itemGate[route].length)
          && (stockByKey[`${category}:${candidate.id}`] || []).some(row => row.stage === stage && !row.condition);
      });
      if (peers.length) equalPriceByStage[String(stage)] = peers.map(candidate => ({ category, id: candidate.id, priceYen: candidate.priceYen }));
    }
    const stageAlternatives = [...new Map(Object.values(cheaperByStage).flat().map(reference => [reference.id, reference])).values()]
      .sort((a, b) => a.priceYen - b.priceYen || parseInt(a.id, 16) - parseInt(b.id, 16));
    const alternatives = stageAlternatives.slice(0, 2).map(row => refs(category, row.id));
    if (!offerStages.length && alternatives.length < 2) {
      const stockedPeers = itemRows.filter(candidate => candidate.id !== item.id && groups[signature].includes(candidate.id) && (stockByKey[`${category}:${candidate.id}`] || []).length)
        .sort((a, b) => a.priceYen - b.priceYen || parseInt(a.id, 16) - parseInt(b.id, 16));
      for (const candidate of stockedPeers) {
        if (alternatives.length >= 2) break;
        alternatives.push(refs(category, candidate.id));
      }
    }
    const copy = createCopy(category, item, gate, stageAlternatives, offerStages);
    output.items[`${category}:${item.id}`] = {
      category,
      id: item.id,
      label: Object.fromEntries(['en', 'ja', 'th'].map(language => [language, copy[language].label])),
      recommendation: Object.fromEntries(['en', 'ja', 'th'].map(language => [language, copy[language].recommendation])),
      reason: Object.fromEntries(['en', 'ja', 'th'].map(language => [language, copy[language].reason])),
      alternatives: alternatives.slice(0, 3),
      sources: [...itemSources(category), ...(category === 'bait' && item.id === '0D' ? ['docs/town-paste-bait-research.md', 'data/town-paste-bait-evidence.json'] : [])],
      exactGatePeers: groups[signature].filter(id => id !== item.id).map(id => refs(category, id)),
      gate: category === 'bait'
        ? { maskHex: gate.maskHex, fishIdsByRoute: { float: gate.float, sinker: gate.sinker } }
        : { maskHex: gate.maskHex, fishIds: gate.all },
      fightClass: fightClassOf(category, item),
      matchedFish: matchedFishOf(category, item),
      romRecordPriceYen: item.priceYen,
      fullShopPriceYen: offerStages.length ? item.priceYen : null,
      shopOffersByStage,
      cheaperByStage,
      equalPriceByStage
    };
  }
}

// The "two lures" decision card on the lure category page (the catalogue swaps in the per-area pair at run time).
const decisionsPath = path.join(root, 'data/player-decisions.json');
const decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const pairIndex = decisions.sections.findIndex(section => section.id === 'lure_coverage_pair');
if (pairIndex < 0) throw new Error('lure_coverage_pair missing');
decisions.sections[pairIndex] = {
  ...decisions.sections[pairIndex],
  title: t(
    'Two lures are enough: the pair that covers all 38 lure fish',
    'ルアーは2つで十分：対象38種すべてをカバーする組み合わせ',
    'ลัวร์สองชิ้นก็พอ: คู่ที่ครอบคลุมปลาลัวร์ทั้ง 38 ชนิด'
  ),
  recommendation: t(
    'Starting a new kit in area 1: buy lure 2E for ¥25 and lure 23 for ¥30, ¥55 total. Starting a new kit in area 4: buy lure 17 for ¥20 with lure 23, ¥50 total. If you already own lure 2E and lure 23, buying lure 17 does not save ¥5.',
    'エリア1で新しく揃えるなら、ルアー2E（25円）とルアー23（30円）で合計55円。エリア4ならルアー17（20円）とルアー23で合計50円。すでにルアー2Eとルアー23を持っていれば、ルアー17を買い足しても5円の節約にはなりません。',
    'ถ้าเริ่มชุดใหม่ที่ด่าน 1 ซื้อลัวร์ 2E ราคา ¥25 กับลัวร์ 23 ราคา ¥30 รวม ¥55 ถ้าเริ่มชุดใหม่ที่ด่าน 4 ซื้อลัวร์ 17 ราคา ¥20 กับลัวร์ 23 รวม ¥50 ถ้ามีลัวร์ 2E กับลัวร์ 23 อยู่แล้ว ไม่ต้องซื้อลัวร์ 17 เพิ่มเพื่อหวังประหยัด ¥5'
  ),
  reason: t(
    'A fish on a lure\'s list chases it once it is on the lure\'s tile, and these two together cover all 38 lure fish, so you carry fewer lures.',
    'ルアーのリストにある魚は、ルアーと同じマスにいれば追ってくる。この2つで全38種をカバーできるので、持つルアーが少なくて済む。',
    'ปลาในรายชื่อของลัวร์ว่ายตามเมื่ออยู่ช่องเดียวกับลัวร์ และสองชิ้นนี้ครอบคลุมปลาลัวร์ครบทั้ง 38 ชนิด ช่วยลดจำนวนชิ้นที่ต้องพก'
  ),
  scope: t(
    'Keep tapping A or B while the lure is in the water, then press A once when the fish is level with the lure. The two lures sit in different size classes, so the fight starts differently by fish size (see the class on each lure card); for fish over 35 cm a lure whose class helps big fish starts the fight better.',
    'ルアーが水中にある間はAかBを連打し、魚が同じ高さに来たらAを1回。この2つはサイズ区分が違うため、魚のサイズでファイトの開始値が変わる（各ルアーのカードで区分を確認）。35cm超の魚には、大型に有利な区分のルアーのほうが有利に始められる。',
    'กด A หรือ B ต่อเนื่องตอนลัวร์อยู่ในน้ำ แล้วกด A หนึ่งครั้งเมื่อปลาอยู่ระดับเดียวกับลัวร์ ลัวร์สองชิ้นนี้อยู่คนละกลุ่มขนาด ตอนสู้จึงเริ่มต่างกันตามขนาดปลา (ดูกลุ่มขนาดบนการ์ดลัวร์) ปลาใหญ่กว่า 35 ซม. เลือกลัวร์ในกลุ่มที่ช่วยปลาใหญ่จะเริ่มสู้ได้ดีกว่า'
  )
};
fs.writeFileSync(decisionsPath, `${JSON.stringify(decisions, null, 2)}\n`);

const baitCount = Object.keys(output.items).filter(key => key.startsWith('bait:')).length;
const lureCount = Object.keys(output.items).filter(key => key.startsWith('lure:')).length;
if (baitCount !== 23 || lureCount !== 81) throw new Error(`Expected 23 bait and 81 lure records, got ${baitCount} and ${lureCount}`);
fs.writeFileSync(path.join(root, 'data/bait-lure-player-choices.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${baitCount} bait and ${lureCount} lure choices.`);
