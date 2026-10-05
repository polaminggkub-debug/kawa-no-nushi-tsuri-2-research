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
    th: 'ซื้อได้หลังขายปลาอายุอย่างน้อย 1 ตัว; แต่ละครั้งหักตัวนับปลาที่ขายไป 9 (ต่ำสุด 0)'
  };
};
const itemSources = category => category === 'bait'
  ? ['data/fish-acceptance.json', 'data/shop-stock-rom.json', 'data/item-table-records.json', 'docs/fish-acceptance-research.md', 'docs/hook-practical-research.md', 'docs/shop-stock-research.md']
  : ['data/fish-acceptance.json', 'data/lure-coverage.json', 'data/shop-stock-rom.json', 'data/item-table-records.json', 'docs/fish-acceptance-research.md', 'docs/shop-stock-research.md'];

function createCopy(category, item, gate, cheaperOptions, offerStages) {
  const owned = {
    en: 'Keep using this item if you already own it and your target fish passes its check for your fishing method.',
    ja: 'すでに持っていて、使う釣り方で対象魚が適合するなら、そのまま使えます。',
    th: 'ถ้ามีชิ้นนี้อยู่แล้วและปลาเป้าหมายผ่านเงื่อนไขของวิธีตกที่ใช้ ให้ใช้ต่อได้'
  };
  const limits = {
    en: 'This helps compare which fish each item can cover; it does not show which one gets more bites or is better in a fight or landing.',
    ja: 'これは対応する魚を比べるための情報です。どちらがよく食いつかれるか、ファイトや取り込みで有利かは示していません。',
    th: 'ข้อมูลนี้ใช้เทียบว่ารองรับปลาตัวไหนได้บ้าง แต่ไม่ได้บอกว่าอันไหนทำให้ปลากินมากกว่า หรือได้เปรียบตอนสู้และตกขึ้น'
  };
  const cheapest = cheaperOptions.slice(0, 3);
  const localizedNames = Object.fromEntries(['en', 'ja', 'th'].map(language => [language, cheapest.map(option => {
    const alt = gallery.items.find(row => row.category === category && row.id === option.id);
    const areas = stages.filter(stage => (stockByKey[`${category}:${option.id}`] || []).some(row => row.stage === stage));
    if (language === 'en') return `ID ${option.id} ${itemName(alt, language)} (¥${option.priceYen}, ¥${item.priceYen-option.priceYen} less than buying this item new, ${areaName(areas, language)}, same-or-broader fish list)`;
    if (language === 'ja') return `ID ${option.id} ${itemName(alt, language)}（${option.priceYen}円、この品の新規購入より${item.priceYen-option.priceYen}円安い、${areaName(areas, language)}、同じか広い対応魚リスト）`;
    return `ID ${option.id} ${itemName(alt, language)} (¥${option.priceYen}, ถูกกว่าซื้อชิ้นนี้ใหม่ ¥${item.priceYen-option.priceYen}, ${areaName(areas, language)}; รองรับรายชื่อปลาเดิมทั้งหมด)`;
  })]));

  const copy = {};
  for (const language of ['en', 'ja', 'th']) {
    const hasOffers = offerStages.length > 0;
    let label;
    let recommendation;
    if (!hasOffers) {
      label = { en: 'No offer in six decoded shop lists', ja: '6エリアの店頭在庫なし', th: 'ไม่พบขายในรายการร้าน 6 ด่าน' }[language];
      recommendation = {
        en: `${owned.en} No offer for this ID appears in the six decoded shop lists, so its ROM item-record price is not proof of a purchase location. Check the fish page for an item with a confirmed shop offer; no other acquisition route is inferred.`,
        ja: `${owned.ja} このIDは復号した6エリアの店頭在庫にありません。ROM内のアイテム価格欄だけでは購入場所を確認できません。店頭販売が確認された適合アイテムは魚ページで確認してください。別の入手経路は推定していません。`,
        th: `${owned.th} ไม่พบ ID นี้ในรายการสินค้าร้านทั้ง 6 ด่าน ช่องราคาในระเบียน ROM จึงยังไม่ยืนยันว่าซื้อที่ไหนได้ เปิดหน้าปลาเพื่อดูชิ้นที่มีตำแหน่งขายยืนยันแล้ว; ไม่อนุมานช่องทางได้มาอื่น`
      }[language];
      if (category === 'bait' && item.id === '0D') {
        label = { en: 'Gather in town with the magnifier', ja: '町で虫めがねを使って採る', th: 'ใช้แว่นขยายหาเหยื่อนี้ในเมือง' }[language];
        recommendation = {
          en: 'If you own magnifier 03, enter town through its second recorded entrance (arrival X7,Y29), stop and use it on a tile different from the last magnifier-use tile. The town Y16–31 band selects this bait; obtain 1–4 pieces, clamped to stack9, with room in the existing stack or a free bait slot. Town6 is directly tested; the other five follow the same ROM branch. No shop offers this ID in the six decoded lists.',
          ja: '虫めがね03を持っているなら、町の2番目の入口（到着X7,Y29）から入り、前回虫めがねを使ったタイルとは別のタイルで立ち止まって使用する。町のY16–31ではこのエサを選び、エサ欄に空きがあれば1–4個（所持上限9）を得る。エリア6の町で実測し、他の5町は同じROM分岐に基づく。復号した全6エリアの店頭にはこのIDはない。',
          th: 'ถ้ามีแว่นขยาย 03 ให้เข้าเมืองทางเข้าลำดับที่ 2 (เข้ามาที่ X7,Y29) หยุดเดินแล้วใช้บนช่องที่ต่างจากช่องที่ใช้แว่นขยายครั้งก่อน แถบ Y16–31 ในเมืองเลือกเหยื่อนี้ ได้ 1–4 ชิ้นตามช่องว่างของกอง สูงสุด 9 กองเหยื่อเดิมต้องยังไม่เต็ม 9 หรือมีช่องเหยื่อว่าง ทดสอบตรงในเมืองด่าน 6 แล้ว อีกห้าเมืองอ้างจากเงื่อนไข ROM เดียวกัน ไม่พบ ID นี้ในสต็อกร้านทั้งหกด่าน'
        }[language];
        recommendation += {
          en: ' For the same route-paired profile set, the stocked peers linked below are ID 0E (¥25, area 4) and ID 0F (¥25, area 5).',
          ja: ' 同じ経路別プロフィール集合を通る店頭品として、下のリンクにID 0E（25円、エリア4）とID 0F（25円、エリア5）を示します。',
          th: ' ชิ้นที่ขายและมีรายชื่อปลาตรงกันตามเส้นทางอยู่ในลิงก์ด้านล่าง: ID 0E (¥25 ด่าน 4) และ ID 0F (¥25 ด่าน 5)'
        }[language];
      }
    } else if (cheaperOptions.length) {
      label = { en: 'Use owned; compare cheaper gate coverage', ja: '所持品を使い、安い適合品を比較', th: 'ใช้ของที่มี แล้วเทียบตัวเลือกที่ครอบคลุมรายชื่อปลาถูกกว่า' }[language];
      const list = localizedNames[language].join(language === 'ja' ? '、' : '; ');
      recommendation = {
        en: `${owned.en} When buying for this gate set, the lower-price shop choices are ${list}. The area-by-area list shows the lowest qualifying offer for each stage.`,
        ja: `${owned.ja} この適合ゲート用に買う場合の下位価格品は、${list}です。エリア別一覧に各エリアで最安の該当品を示します。`,
        th: `${owned.th} ถ้าจะซื้อเพื่อให้ตรงกับรายชื่อปลาชุดนี้ ตัวเลือกที่ราคาต่ำกว่าคือ ${list} รายการแยกพื้นที่แสดงตัวเลือกที่ถูกที่สุดซึ่งครอบคลุมเงื่อนไขชนิดปลานี้`
      }[language];
    } else {
      label = { en: 'Use if target passes; no cheaper full-set offer', ja: '対象が適合すれば使用、全体を覆う安い店売りなし', th: 'ใช้ถ้าปลาเป้าหมายผ่าน; ไม่พบตัวเลือกถูกกว่าที่ครอบคลุมทั้งชุด' }[language];
      recommendation = {
        en: `${owned.en} The decoded shop lists contain no lower-priced item with the same-or-broader gate set. ${offerStages.length ? `Full shop price is ¥${item.priceYen} in ${areaName(offerStages, language)}.` : ''} Do not read this as a bite or fight advantage.`,
        ja: `${owned.ja} 復号した店頭在庫に、同じか広い適合ゲートを持つ安価な品はありません。${offerStages.length ? `${areaName(offerStages, language)}での全額購入価格は${item.priceYen}円です。` : ''} 食いつきやファイト上の優位を意味しません。`,
        th: `${owned.th} ไม่พบไอเท็มราคาต่ำกว่าที่มีเงื่อนไขชนิดปลาเท่ากันหรือครอบคลุมกว่าในรายการร้านที่ถอดได้ ${offerStages.length ? `ราคาซื้อเต็ม ¥${item.priceYen} มีขายที่${areaName(offerStages, language)} ` : ''}อย่าตีความว่าเพิ่มโอกาสกินเหยื่อหรือได้เปรียบตอนสู้`
      }[language];
    }

    const hasCheaperFullSetChoice = cheaperOptions.length > 0;
    let reason;
    if (category === 'bait') {
      reason = {
        en: hasCheaperFullSetChoice
          ? 'The fish listed for each rig on this card pass that bait’s compatibility checks. The lower-price items shown above cover those same float and sinker fish lists, or a broader set, in the areas named.'
          : item.id === '0D'
            ? 'The fish listed for each rig on this card pass this bait’s compatibility checks. IDs 0E and 0F share the same fish lists and have confirmed shop offers in areas 4 and 5; this ID has no decoded shop offer.'
            : offerStages.length
              ? 'The fish listed for each rig on this card pass that bait’s compatibility checks. No lower-price shop choice shown here covers both full fish lists; for one target fish, its page may show a cheaper compatible option.'
              : 'The fish listed for each rig on this card pass that bait’s compatibility checks. No shop offer for this ID was found in the six decoded lists; check a target fish page for a confirmed stocked option.',
        ja: hasCheaperFullSetChoice
          ? 'このカードの各仕掛けに表示された魚は、このエサの適合条件を通ります。上に表示された安い品は、記載エリアでウキ・オモリ両方の同じ魚、またはそれ以上の魚に対応します。'
          : item.id === '0D'
            ? 'このカードの各仕掛けに表示された魚は、このエサの適合条件を通ります。ID 0Eと0Fは同じ魚に対応し、エリア4と5での販売が確認されています。このIDの店頭販売は確認できていません。'
            : offerStages.length
              ? 'このカードの各仕掛けに表示された魚は、このエサの適合条件を通ります。両方の魚リスト全体を覆う安い店売り品は表示されていません。狙う魚が1種類なら、魚ページで安い適合品を確認できます。'
              : 'このカードの各仕掛けに表示された魚は、このエサの適合条件を通ります。このIDは復号した6エリアの店頭在庫にありません。魚ページで販売確認済みの品を確認してください。',
        th: hasCheaperFullSetChoice
          ? 'ปลาที่แสดงแยกตามสายทุ่นและสายตะกั่วบนการ์ดนี้ผ่านเงื่อนไขของเหยื่อ ตัวเลือกที่ถูกกว่าด้านบนรองรับรายชื่อปลาทั้งสองสายชุดเดิมหรือกว้างกว่าในด่านที่ระบุ'
          : item.id === '0D'
            ? 'ปลาที่แสดงแยกตามสายทุ่นและสายตะกั่วบนการ์ดนี้ผ่านเงื่อนไขของเหยื่อ ID 0E และ 0F รองรับรายชื่อปลาเดียวกัน และยืนยันว่ามีขายในด่าน 4 และ 5; ยังไม่พบรายการขายของ ID นี้'
            : offerStages.length
              ? 'ปลาที่แสดงแยกตามสายทุ่นและสายตะกั่วบนการ์ดนี้ผ่านเงื่อนไขของเหยื่อ ยังไม่มีตัวเลือกในร้านที่ถูกกว่าและครอบคลุมรายชื่อปลาทั้งสองสายครบ หากเล็งปลาเพียงชนิดเดียว ให้เปิดหน้าปลานั้นเพื่อดูตัวเลือกที่ถูกกว่าซึ่งใช้ได้'
              : 'ปลาที่แสดงแยกตามสายทุ่นและสายตะกั่วบนการ์ดนี้ผ่านเงื่อนไขของเหยื่อ แต่ยังไม่พบ ID นี้ในรายการสินค้าร้านทั้ง 6 ด่าน ให้เปิดหน้าปลาเป้าหมายเพื่อดูของที่ยืนยันว่ามีขาย'
      }[language];
    } else {
      reason = {
        en: hasCheaperFullSetChoice
          ? 'The fish listed on this card pass this lure’s compatibility check. The lower-price items shown above cover the same fish list, or a broader set, in the areas named.'
          : offerStages.length
            ? 'The fish listed on this card pass this lure’s compatibility check. No lower-price shop choice shown here covers the full fish list; for one target fish, its page may show a cheaper compatible option.'
            : 'The fish listed on this card pass this lure’s compatibility check. No shop offer for this ID was found in the six decoded lists; check a target fish page for a confirmed stocked option.',
        ja: hasCheaperFullSetChoice
          ? 'このカードに表示された魚は、このルアーの適合条件を通ります。上に表示された安い品は、記載エリアで同じ魚、またはそれ以上の魚に対応します。'
          : offerStages.length
            ? 'このカードに表示された魚は、このルアーの適合条件を通ります。魚リスト全体を覆う安い店売り品は表示されていません。狙う魚が1種類なら、魚ページで安い適合品を確認できます。'
            : 'このカードに表示された魚は、このルアーの適合条件を通ります。このIDは復号した6エリアの店頭在庫にありません。魚ページで販売確認済みの品を確認してください。',
        th: hasCheaperFullSetChoice
          ? 'ปลาที่แสดงบนการ์ดนี้ผ่านเงื่อนไขความเข้ากันได้ของลัวร์ ตัวเลือกที่ถูกกว่าด้านบนรองรับรายชื่อปลาเดียวกันหรือกว้างกว่าในด่านที่ระบุ'
          : offerStages.length
            ? 'ปลาที่แสดงบนการ์ดนี้ผ่านเงื่อนไขความเข้ากันได้ของลัวร์ แต่ยังไม่มีตัวเลือกในร้านที่ถูกกว่าและครอบคลุมรายชื่อปลาทั้งหมด หากเล็งปลาเพียงชนิดเดียว ให้เปิดหน้าปลานั้นเพื่อดูตัวเลือกที่ถูกกว่าซึ่งใช้ได้'
            : 'ปลาที่แสดงบนการ์ดนี้ผ่านเงื่อนไขความเข้ากันได้ของลัวร์ แต่ยังไม่พบ ID นี้ในรายการสินค้าร้านทั้ง 6 ด่าน ให้เปิดหน้าปลาเป้าหมายเพื่อดูของที่ยืนยันว่ามีขาย'
      }[language];
    }
    copy[language] = { label, recommendation, reason: `${reason} ${limits[language]}` };
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
    en: 'Purchase choices use the supplied Japanese ROM item records, live fish-profile compatibility gates, and six decoded area-shop lists. Compatibility is not bite probability, fight advantage, or landing success.',
    ja: '購入判断は、提供された日本版ROMのアイテム記録、魚プロフィール適合ゲート、復号した全6エリアの店頭在庫に基づきます。適合は食いつき率、ファイト上の優位、取り込み成功を意味しません。',
    th: 'คำแนะนำการซื้ออ้างจากระเบียนไอเท็มใน ROM ญี่ปุ่นที่ให้มา เงื่อนไขโปรไฟล์ปลา และรายการร้าน 6 ด่านที่ถอดจาก ROM ความเข้ากันได้ไม่ใช่โอกาสกินเหยื่อ ความได้เปรียบตอนสู้ หรือโอกาสตกขึ้น'
  },
  gateRules: {
    bait: 'Float: bait-mask overlap and nonzero fish-profile threshold. Sinker: bait-mask overlap plus fish-profile +13 bit 08 and nonzero +3 threshold. These are necessary profile checks, not bite results.',
    lure: 'Lure-mask/fish-profile overlap at the lure gate; candidate position, periodic selection, and input-state checks still apply.',
    cheaperByStage: 'For each area, list only the cheapest lower-price stocked item(s) whose route-paired gates cover the current item’s entire accepted profile set. This preserves compatibility coverage only; it does not assert equal fight behavior or catch odds.',
    equalPriceByStage: 'Same-category, same-price alternatives unconditionally stocked alongside the original in that area. Each alternative covers every original accepted profile on every compared rig and adds at least one profile. Compatibility coverage only, not bite probability or fight/landing superiority.',
    prices: 'A ROM item-record price is presented as a shop purchase quote only when the item appears in the six decoded area stock lists. Conditional stock requirements are retained.'
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
      romRecordPriceYen: item.priceYen,
      fullShopPriceYen: offerStages.length ? item.priceYen : null,
      shopOffersByStage,
      cheaperByStage,
      equalPriceByStage
    };
  }
}

const baitCount = Object.keys(output.items).filter(key => key.startsWith('bait:')).length;
const lureCount = Object.keys(output.items).filter(key => key.startsWith('lure:')).length;
if (baitCount !== 23 || lureCount !== 81) throw new Error(`Expected 23 bait and 81 lure records, got ${baitCount} and ${lureCount}`);
fs.writeFileSync(path.join(root, 'data/bait-lure-player-choices.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${baitCount} bait and ${lureCount} lure choices.`);
