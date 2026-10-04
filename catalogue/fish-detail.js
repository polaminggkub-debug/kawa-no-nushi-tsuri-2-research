(() => {
  'use strict';

  const locale = document.documentElement.dataset.locale || 'en';
  const copy = {
    en: {
      pageTitle: 'Fish profile', missing: 'Choose a fish from the catalogue or map.', invalid: 'This fish profile is not in the extracted catalogue.',
      catalogue: 'Browse fish and equipment', back: 'Back to previous page', map: 'Open this fish on the map',
      areas: 'Confirmed areas and fishing spots', bait: 'Live bait', lure: 'Lures', fly: 'Fly bodies',
      compatible: 'ROM-confirmed compatibility', compatibilityNote: 'These entries pass the recorded bait, lure, or fly fish check for this profile. That does not guarantee a bite or a landed catch. Rod or hook bonuses for this individual fish are not established here.',
      mapAction: 'Open map and fish points', configuredPoints: n => `${n} configured point${n === 1 ? '' : 's'}`,
      spawnSlots: n => `${n} spawn slots in the ROM table`, stage: n => `Area ${n}`, unknownArea: 'No confirmed spawn locations were found for this profile in the extracted ROM location table.',
      unknownFish: id => `Unknown fish profile · ID ${id}`, unknownName: id => `Fish profile ${id}`, noSprite: 'No extracted fish portrait is available for this profile.',
      chooseArea: 'Select an area to see its map', float: 'Float rig', sinker: 'Sinker rig', viewItem: 'View item', noCompatibility: 'No compatible bait, lure, or fly body is recorded for this profile.',
      evidence: 'ROM evidence and coordinates', evidenceIntro: 'The counts and locations below come from the extracted fish spawn table for the supplied Japanese ROM.',
      profile: 'Fish profile ID', profileOffset: 'Fish profile record offset', source: 'Source table', coords: 'Configured coordinates', reference: 'Compatibility sources',
      legacyName: 'Other catalogue names', recovery: 'Catalogue data could not be loaded. Return to the catalogue and try again.'
    },
    th: {
      pageTitle: 'ข้อมูลปลา', missing: 'เลือกปลาจากหน้าแผนที่หรือแคตตาล็อกก่อนครับ', invalid: 'ไม่พบโปรไฟล์ปลานี้ในรายการที่ถอดข้อมูลไว้',
      catalogue: 'ดูรายชื่อปลาและอุปกรณ์', back: 'กลับหน้าก่อนหน้า', map: 'เปิดแผนที่ของปลานี้',
      areas: 'ด่านและจุดตกที่ยืนยันจากเกม', bait: 'เหยื่อจริง', lure: 'เหยื่อปลอม', fly: 'ตัวฟลาย',
      compatible: 'เหยื่อที่ผ่านเงื่อนไขใน ROM', compatibilityNote: 'รายการนี้ผ่านด่านตรวจเหยื่อจริง เหยื่อปลอม หรือตัวฟลายของโปรไฟล์ปลานี้ ไม่ได้รับประกันว่าปลาจะกินหรือดึงขึ้นมาได้ และยังไม่มีหลักฐานว่าคันหรือตะขอได้โบนัสเฉพาะปลาชนิดนี้',
      mapAction: 'เปิดแผนที่และจุดของปลา', configuredPoints: n => `${n} จุดที่เกมกำหนด`,
      spawnSlots: n => `${n} ช่องเกิดปลาในตาราง ROM`, stage: n => `ด่าน ${n}`, unknownArea: 'ยังไม่พบตำแหน่งเกิดปลาที่ยืนยันได้ในตารางตำแหน่งที่ถอดจาก ROM',
      unknownFish: id => `โปรไฟล์ปลาที่ยังระบุชนิดไม่ได้ · ID ${id}`, unknownName: id => `โปรไฟล์ปลา ${id}`, noSprite: 'ยังไม่มีรูปปลาที่ถอดจากโปรไฟล์นี้',
      chooseArea: 'เลือกด่านเพื่อเปิดแผนที่', float: 'ชุดทุ่น', sinker: 'ชุดตะกั่ว', viewItem: 'ดูข้อมูลไอเท็ม', noCompatibility: 'ยังไม่มีเหยื่อจริง เหยื่อปลอม หรือตัวฟลายที่ยืนยันว่าผ่านเงื่อนไขของโปรไฟล์นี้',
      evidence: 'หลักฐาน ROM และพิกัด', evidenceIntro: 'จำนวนและตำแหน่งด้านล่างมาจากตารางจุดเกิดปลาที่ถอดจาก ROM ญี่ปุ่นต้นฉบับซึ่งใช้ในงานนี้',
      profile: 'ID โปรไฟล์ปลา', profileOffset: 'ตำแหน่งข้อมูลโปรไฟล์ปลา', source: 'ตารางต้นทาง', coords: 'พิกัดที่เกมกำหนด', reference: 'แหล่งข้อมูลเงื่อนไขเหยื่อ',
      legacyName: 'ชื่ออื่นในแคตตาล็อก', recovery: 'โหลดข้อมูลไม่สำเร็จ กลับไปหน้าแคตตาล็อกแล้วลองอีกครั้ง'
    },
    ja: {
      pageTitle: '魚の情報', missing: 'マップまたはカタログから魚を選んでください。', invalid: '抽出済みカタログにこの魚プロフィールはありません。',
      catalogue: '魚と道具の一覧', back: '前のページに戻る', map: 'この魚のマップを開く',
      areas: '確認済みエリアと釣りポイント', bait: 'エサ', lure: 'ルアー', fly: 'フライ本体',
      compatible: 'ROMで確認した対応条件', compatibilityNote: '各項目は、このプロフィールに対するエサ・ルアー・フライの魚判定を通過します。食いつきや取り込みを保証しません。この魚だけに有効な竿やハリのボーナスも確認していません。',
      mapAction: 'マップと魚の位置を開く', configuredPoints: n => `設定されたポイント ${n}か所`,
      spawnSlots: n => `ROMテーブルの出現枠 ${n}`, stage: n => `エリア${n}`, unknownArea: '抽出したROM出現テーブルに確認済みの場所はありません。',
      unknownFish: id => `種類未特定の魚プロフィール · ID ${id}`, unknownName: id => `魚プロフィール ${id}`, noSprite: 'このプロフィールの魚画像は未抽出です。',
      chooseArea: 'エリアを選んでマップを表示', float: 'ウキ仕掛け', sinker: 'オモリ仕掛け', viewItem: 'アイテムを見る', noCompatibility: 'このプロフィールに対応する確認済みのエサ・ルアー・フライ本体はありません。',
      evidence: 'ROM根拠と座標', evidenceIntro: '以下の場所と数は、調査に使用した日本版ROMから抽出した魚の出現テーブルによります。',
      profile: '魚プロフィールID', profileOffset: '魚プロフィールのROM位置', source: '出現テーブル', coords: 'ゲーム内の設定座標', reference: '対応条件の資料',
      legacyName: 'カタログの別名', recovery: 'カタログを読み込めません。カタログに戻って再度お試しください。'
    }
  }[locale] || null;

  const page = document.getElementById('fish-detail');
  const params = new URLSearchParams(window.location.search);
  const originalReturn = params.get('return') || '';
  const id = normalizeId(params.get('id'));
  let requestedStage = validStage(params.get('stage'));
  const localReturn = safeLocalReturn(originalReturn);

  function normalizeId(value) {
    if (!value || !/^(?:0x)?[0-9a-f]{1,2}$/i.test(value.trim())) return '';
    return Number.parseInt(value.trim().replace(/^0x/i, ''), 16).toString(16).toUpperCase().padStart(2, '0');
  }

  function validStage(value) {
    return /^[1-6]$/.test(value || '') ? value : '';
  }

  function safeLocalReturn(value) {
    if (!value || value.startsWith('//') || value.includes('\\') || /^[a-z][a-z0-9+.-]*:/i.test(value)) return '';
    let target;
    const catalogueDirectory = new URL('.', window.location.href);
    try { target = new URL(value, catalogueDirectory); } catch { return ''; }
    if (target.origin !== window.location.origin) return '';
    const catalogueNames = ['index.html', 'index.th.html', 'index.ja.html', 'maps.html', 'maps.th.html', 'maps.ja.html', 'fish.html', 'fish.th.html', 'fish.ja.html', 'item.html', 'item.th.html', 'item.ja.html', 'shops.html', 'shops.th.html', 'shops.ja.html'];
    const researchNames = ['index.html', 'index.th.html', 'index.ja.html'];
    const allowed = new Set([
      ...catalogueNames.map(name => new URL(name, catalogueDirectory).pathname),
      ...researchNames.map(name => new URL(`../research/${name}`, catalogueDirectory).pathname)
    ]);
    if (!allowed.has(target.pathname)) return '';
    const relativePath = target.pathname.startsWith(catalogueDirectory.pathname)
      ? target.pathname.slice(catalogueDirectory.pathname.length)
      : `../research/${target.pathname.split('/').pop()}`;
    return `${relativePath}${target.search}${target.hash}`;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function currentFishPath(stage = requestedStage) {
    const query = new URLSearchParams();
    if (id) query.set('id', id);
    if (stage) query.set('stage', stage);
    if (localReturn) query.set('return', localReturn);
    return `${window.location.pathname.split('/').pop()}?${query.toString()}`;
  }

  function localizedFishName(fish, profileId) {
    const latin = fish.nameLatin || (fish.nameLatinVariants || []).slice().sort((a, b) => b.length - a.length)[0];
    if (locale === 'th') return fish.nameTh || (fish.nameThVariants || []).join(' / ') || latin || fish.nameJa || copy.unknownName(profileId);
    if (locale === 'ja') return fish.nameJa || copy.unknownFish(profileId);
    return fish.nameEn || latin || fish.nameJa || copy.unknownFish(profileId);
  }

  function localizedItemName(item) {
    if (locale === 'th') return item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id;
    if (locale === 'ja') return item.nameJa || item.nameEn || item.id;
    return item.nameEn || item.nameJa || item.id;
  }

  function mapPath() { return locale === 'th' ? 'maps.th.html' : locale === 'ja' ? 'maps.ja.html' : 'maps.html'; }
  function cataloguePath() { return locale === 'th' ? 'index.th.html' : locale === 'ja' ? 'index.ja.html' : 'index.html'; }
  function itemPath() { return locale === 'th' ? 'item.th.html' : locale === 'ja' ? 'item.ja.html' : 'item.html'; }

  function setNavigation(stage) {
    const mapQuery = new URLSearchParams({ fish: id });
    if (stage) mapQuery.set('stage', stage);
    mapQuery.set('return', currentFishPath(stage));
    const mapHref = `${mapPath()}?${mapQuery.toString()}`;
    const back = document.getElementById('fish-back');
    back.href = localReturn || (stage ? mapHref : cataloguePath());
    back.textContent = localReturn ? copy.back : stage ? copy.map : copy.catalogue;
    document.getElementById('fish-map-link').href = stage ? mapHref : cataloguePath();
    document.getElementById('fish-map-link').hidden = !stage;

    for (const lang of ['en', 'th', 'ja']) {
      const href = lang === 'th' ? 'fish.th.html' : lang === 'ja' ? 'fish.ja.html' : 'fish.html';
      const link = document.getElementById(`language-${lang}`);
      const query = new URLSearchParams();
      if (id) query.set('id', id);
      if (stage) query.set('stage', stage);
      if (localReturn) query.set('return', localReturn);
      link.href = `${href}${query.size ? `?${query.toString()}` : ''}${location.hash||''}`;
    }
  }

  function getLocations(locationData) {
    const table = locationData?.fish || locationData || {};
    return table[id]?.locations || [];
  }

  function matchingItems(items) {
    const found = new Map();
    for (const item of items) {
      const use = item.playerUse || {};
      if (!['bait', 'lure', 'fly'].includes(item.category)) continue;
      if (item.category === 'bait') {
        const routes = use.fishIdsByRoute || {};
        const allowedRoutes = ['float', 'sinker'].filter(route => (routes[route] || []).includes(id));
        if (allowedRoutes.length) found.set(`${item.category}:${item.id}`, { item, routes: allowedRoutes });
      } else if ((use.fishIds || []).includes(id)) {
        found.set(`${item.category}:${item.id}`, { item, routes: [] });
      }
    }
    return [...found.values()].sort((a, b) => localizedItemName(a.item).localeCompare(localizedItemName(b.item), locale) || a.item.id.localeCompare(b.item.id));
  }

  function itemLink(entry, stage) {
    const item = entry.item;
    const query = new URLSearchParams({ category: item.category, id: item.id, fish: id });
    if (stage) query.set('stage', stage);
    query.set('return', currentFishPath(stage));
    const itemHref = `${itemPath()}?${query.toString()}`;
    const image = item.image ? `<a class="entity-link-image" href="${escapeHtml(itemHref)}" aria-label="${escapeHtml(copy.viewItem)}: ${escapeHtml(localizedItemName(item))}"><img loading="lazy" src="${escapeHtml(item.image)}" alt=""></a>` : '';
    const routeLinks = entry.routes.length ? `<span class="item-routes">${entry.routes.map(route => {
      const routeQuery = new URLSearchParams(query);
      routeQuery.set('route', route);
      return `<a href="${escapeHtml(itemPath())}?${routeQuery.toString()}" class="route-button item-route">${escapeHtml(route === 'float' ? copy.float : copy.sinker)}</a>`;
    }).join('')}</span>` : '';
    return `<article class="entity-link">${image}<a class="entity-link-name" href="${escapeHtml(itemHref)}"><strong>${escapeHtml(localizedItemName(item))}</strong><span class="muted">ID ${escapeHtml(item.id)}</span></a>${routeLinks}</article>`;
  }

  const shoppingCopy={
    th:{title:'เริ่มซื้ออะไรสำหรับปลานี้?',area:'เลือกด่านที่จะตก',intro:'ถ้าต้องซื้อใหม่ เลือกตัวเลือกที่ราคาต่ำสุดและมีขายในด่านนี้ โดยผ่านเงื่อนไขของปลานี้แล้ว ถ้ามีเหยื่อที่ผ่านเงื่อนไขอยู่แล้ว ใช้ต่อได้ ไม่ต้องซื้อซ้ำ',scope:'ราคาถูกสุดในแต่ละวิธีตก ไม่ใช่อันดับโอกาสกัดหรือดึงขึ้นสำเร็จ รายการที่ต้องปลดล็อกร้านก่อนยังไม่รวมในชุดเริ่มต้นนี้',fly:'ฟลาย: ราคานี้เป็นชุดสำเร็จรูปตามส่วนประกอบในรายละเอียด บางชุดไม่มีปีกหรือหาง ยังมีเงื่อนไขบอดี้/ปีกที่ซ่อนอยู่ซึ่งอาจทำให้ไม่กินเหยื่อ',none:'ไม่มีของที่ผ่านเงื่อนไขและมีขายแบบไม่ต้องปลดล็อกในด่านนี้ เลือกจากรายการเหยื่อทั้งหมดด้านล่าง แล้วเปิดรายละเอียดเพื่อดูด่านที่ขายหรือวิธีหา',cost:'ราคา',bundle:'ชุดฟลายสำเร็จรูป',all:'เหยื่อทั้งหมดที่ใช้ด้วยได้',buy:'เปิดวิธีใช้และร้าน'},
    en:{title:'What should I buy for this fish?',area:'Choose your fishing area',intro:'If buying new tackle, start with the lowest-priced stocked option for each method below. Each passes this fish’s recorded check. Keep compatible tackle you already own; there is no need to buy a duplicate.',scope:'Lowest price within each method, not a bite or landing-success ranking. Offers requiring a shop unlock are excluded from these starter choices.',fly:'Fly: this price is for the ready-made set and its recorded parts; some sets omit a wing or tail. Hidden body/wing conditions may still prevent a bite.',none:'No compatible offer without an unlock is recorded here. Choose from all compatible tackle below, then open its details for purchase areas or acquisition instructions.',cost:'Price',bundle:'Ready-made fly set',all:'All compatible tackle',buy:'Open use and shop details'},
    ja:{title:'この魚には何を買う？',area:'釣るエリアを選ぶ',intro:'新しく買うなら、下の釣り方ごとに店頭在庫がある最安の候補から選べる。各候補はこの魚の判定を通る。対応する道具を持っているなら、同じものを買い直す必要はない。',scope:'各釣り方の最安価格であり、食いつき・取り込み成功率の順位ではない。店の解放が必要な販売は最初の候補から除いている。',fly:'フライの表示額は詳細にある店売りセット全体。ウィングやテールを含まないセットもある。隠れた本体・ウィング条件で食いつかない場合もある。',none:'このエリアでは、解放不要で販売される対応道具を確認できない。下の対応道具一覧から選び、詳細で販売エリアや入手方法を確認する。',cost:'価格',bundle:'店売りフライセット',all:'対応道具の全一覧',buy:'使い方と店の詳細を見る'}
  }[locale];

  function starterOffers(entries, stage) {
    const methods=[['float',copy.float],['sinker',copy.sinker],['lure',copy.lure],['fly',copy.fly]];
    return methods.flatMap(([method,label])=>{
      const candidates=[];
      for(const entry of entries){
        const item=entry.item;
        if(method==='float'||method==='sinker'){if(item.category!=='bait'||!entry.routes.includes(method))continue;}
        else if(item.category!==method)continue;
        for(const shop of item.playerUse?.shops||[]){
          if(String(shop.stage)!==stage||shop.condition)continue;
          const price=method==='fly'?shop.bundle?.shopPriceYen:item.priceYen;
          if(!Number.isFinite(price)||price<0)continue;
          candidates.push({entry,method,label,price,bundle:shop.bundle||null});
        }
      }
      candidates.sort((a,b)=>a.price-b.price||a.entry.item.id.localeCompare(b.entry.item.id));
      return candidates.length?[candidates[0]]:[];
    });
  }


  function renderReusableKit(items, stage) {
    const lures=items.filter(item=>item.category==='lure');
    const allProfiles=new Set(lures.flatMap(item=>item.playerUse?.fishIds||[]));
    if(!allProfiles.has(id))return '';
    const stocked=item=>(item.playerUse?.shops||[]).some(shop=>String(shop.stage)===stage&&!shop.condition);
    const pairs=[['2E','23'],['17','23']].map(ids=>ids.map(key=>lures.find(item=>item.id===key))).filter(pair=>pair.every(Boolean)&&pair.every(item=>Number.isFinite(item.priceYen))&&new Set(pair.flatMap(item=>item.playerUse?.fishIds||[])).size===allProfiles.size);
    pairs.sort((a,b)=>Number(b.every(stocked))-Number(a.every(stocked))||a.reduce((sum,item)=>sum+item.priceYen,0)-b.reduce((sum,item)=>sum+item.priceYen,0));
    const localPair=pairs.find(pair=>pair.every(stocked));
    const pair=localPair||pairs[0];
    if(!pair)return '';
    const title=locale==='th'?'ถ้าจะตกปลาอื่นด้วย: ชุดลัวร์สองชิ้น':locale==='ja'?'ほかの魚も狙うなら：ルアー2種類のセット':'Fishing for other species too? A two-lure kit';
    const total=pair.reduce((sum,item)=>sum+item.priceYen,0), count=allProfiles.size;
    const intro=locale==='th'?'ชุดราคาต่ำสุดด้านบนเลือกเพื่อปลาตัวนี้เท่านั้น ถ้าจะพกลัวร์สำหรับปลาหลายชนิด คู่ด้านล่างครอบคลุม '+count+' โปรไฟล์ที่ผ่านเงื่อนไขลัวร์ รวมราคาซื้อใหม่ ¥'+total+'. ไม่ต้องซื้อทุกตัวเลือก: ถ้ามีคู่สปูนกับยางหนอนอยู่แล้ว ใช้ต่อได้':locale==='ja'?'上の最安候補はこの魚だけを狙う選択です。ほかの魚も狙うなら、下の組み合わせでルアー判定を通る'+count+'プロフィールをカバーでき、新規購入は合計'+total+'円です。全部買う必要はありません。スプーンとワームの組を持っているなら、そのまま使用できます。':'The cheapest choice above is for this fish alone. For a kit to use across species, the pair below covers all '+count+' profiles that pass the lure check, for ¥'+total+' when buying new. Do not buy every alternative: keep the Spoon-and-worm pair if you already own it.';
    const availability=locale==='th'?(localPair?'ซื้อครบคู่นี้ได้ในด่านที่เลือก':'ด่านที่เลือกขายไม่ครบคู่นี้ ใช้ตัวเลือกสำหรับปลาตัวนี้ด้านบน หรือดูด่านที่ขายแต่ละชิ้นด้านล่าง'):locale==='ja'?(localPair?'選択中エリアで両方買えます。':'選択中エリアでは両方は揃いません。上の対象魚用候補を使うか、下の販売エリアを確認してください。'):(localPair?'Both items are stocked in your selected area.':'The selected area does not stock the full pair. Use the single-fish choice above or check each item’s sale areas below.');
    const cards=pair.map(item=>{
      const stages=[...new Set((item.playerUse?.shops||[]).filter(shop=>!shop.condition).map(shop=>shop.stage))].sort((a,b)=>a-b);
      const query=new URLSearchParams({category:'lure',id:item.id,fish:id,stage,return:currentFishPath(stage)});
      const accepts=(item.playerUse?.fishIds||[]).includes(id);
      const target=locale==='th'?(accepts?'ใช้กับปลาที่กำลังดูได้':'ชิ้นนี้ไว้ครอบคลุมปลาอื่นในชุด'):locale==='ja'?(accepts?'表示中の魚に対応':'このセットでほかの魚を担当'):(accepts?'Works for the fish you are viewing':'Covers other fish in this kit');
      return '<article class="detail-section kit-item" data-item="lure:'+item.id+'"><a class="entity-link" href="'+escapeHtml(itemPath()+'?'+query)+'"><img src="'+escapeHtml(item.image)+'" alt=""><span><strong>'+escapeHtml(localizedItemName(item))+'</strong><small>¥'+item.priceYen+' · '+stages.map(n=>escapeHtml(copy.stage(n))).join(' / ')+'</small><small>'+escapeHtml(target)+'</small></span></a></article>';
    }).join('');
    return '<section class="detail-section reusable-kit" data-kit="'+pair.map(item=>item.id).join('+')+'" data-coverage="'+count+'" data-total="'+total+'" data-local="'+Boolean(localPair)+'"><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(intro)+'</p><p><strong>'+escapeHtml(availability)+'</strong></p><div class="detail-grid">'+cards+'</div><p class="muted">'+escapeHtml(locale==='th'?'ครอบคลุมเงื่อนไขชนิดเหยื่อ ไม่ได้รับประกันว่าปลาจะกินหรือดึงขึ้นสำเร็จ':locale==='ja'?'ルアー種類の判定をカバーするもので、食いつきや取り込みの保証ではありません。':'Coverage is lure-type compatibility, not a guarantee of a bite or landing.')+'</p></section>';
  }


  function renderFlyFallback(items, stage, choices) {
    const definitions=choices?.profiles?.[id]?.bundles||[];
    if(definitions.length!==3)return '';
    const offers=definitions.map(def=>{
      const body=items.find(item=>item.category==='fly'&&item.id===def.body);
      const shop=body?.playerUse?.shops?.find(shop=>shop.stage===def.stage&&shop.bundle?.body===def.body&&shop.bundle?.wing===def.wing&&shop.bundle?.tail===def.tail);
      return {def,body,bundle:shop?.bundle};
    });
    if(!offers.every(offer=>offer.body?.playerUse?.fishIds?.includes(id)&&offer.bundle))return '';
    const total=offers.reduce((sum,offer)=>sum+offer.bundle.shopPriceYen,0);
    const title=locale==='th'?'ปลาไม่กินฟลาย? ทางเลือกเพื่อผ่านเงื่อนไขซ่อนหนึ่งข้อ':locale==='ja'?'フライに反応しない？ 隠れた判定1つを避ける候補':'No bite on a fly? Alternatives for one hidden check';
    const intro=locale==='th'?'ถ้าจะเตรียมฟลายสำรอง ชุดด้านล่างมีราคารวมต่ำที่สุดในกลุ่มที่ซื้อชุดสำเร็จรูป 3 ชุดจากร้านทั้ง 6 ด่านแล้วผ่านเงื่อนไขนี้สำหรับปลาตัวนี้ ซื้อใหม่รวม ¥'+total+' และบอดี้ทั้งสามผ่านเงื่อนไขของปลาที่กำลังดู เก็บไว้เป็นชุดสำรอง ไม่จำเป็นต้องซื้อทั้งหมดเพื่อเริ่มตก':locale==='ja'?'予備を用意するなら、この魚の条件を満たす店売り3セットのうち、全6エリアの在庫で合計価格が最安の候補です。新規購入は合計'+total+'円で、3つの本体すべてが表示中の魚の判定を通ります。最初から全部買う必要はありません。':'For backup flies, these are the lowest-total-price three ready-made sets across all six recorded area stocks that satisfy this check for the current fish. They cost ¥'+total+' in total when buying new. All three bodies pass the current fish’s profile check. You do not need to buy all three to start fishing.';
    const action=locale==='th'?'สลับลองสามชุดในฉากที่โหลดอยู่เดิม โดยไม่พักโรงแรมหรือออกไปโหลดฉากใหม่ ตามโค้ดอย่างน้อยหนึ่งชุดจะไม่ติดเงื่อนไขซ่อนที่บล็อกจากบอดี้หรือปีก เมื่อค่าซ่อนคงเดิม การตีชุดเดิมซ้ำไม่ได้สุ่มค่านี้ใหม่':locale==='ja'?'宿泊やフィールド再生成を挟まず、同じ読み込み済みフィールドで3セットを切り替えます。隠れた値が一定なら、コード上は少なくとも1セットがボディ・ウィングの一致による遮断を避けます。同じセットの投げ直しはこの値を再抽選しません。':'Switch among the three sets in the same loaded field, without an inn stay or field reload. With the stored hidden values unchanged, the code guarantees at least one avoids the body/wing equality block. Recasting the same set does not reroll those values.';
    const scope=locale==='th'?'นี่ผ่านเงื่อนไขซ่อนเพียงหนึ่งข้อ ไม่รับประกันว่าปลาจะกินหรือตกขึ้นได้ ยังมีตำแหน่ง จังหวะ และเงื่อนไขอื่น เส้นทางสลับชุดนี้เป็นข้อสรุปจากโค้ด ยังไม่มีผลทดลองตกจริงยืนยันชุดนี้':locale==='ja'?'回避するのは隠れた判定1つだけで、食いつき・取り込みの保証ではありません。位置・タイミング・別条件も残ります。この切替手順はコードに基づく結論で、実釣比較は未実施です。':'This avoids only one hidden check. Position, timing and other checks still apply; it does not guarantee a bite or landing. The switching strategy is derived from code and has not been confirmed by a controlled fishing trial.';
    const cards=offers.map(({def,body,bundle})=>{
      const location=locale==='th'?'ร้านด่าน '+def.stage+' · รายการฟลายที่ '+(def.slot+1):locale==='ja'?'エリア'+def.stage+'の店・フライ一覧の'+(def.slot+1)+'番目':'Area '+def.stage+' shop · fly entry '+(def.slot+1);
      const shopParams=new URLSearchParams({stage:String(def.stage),place:'town',category:'fly',id:def.body,fish:id,return:currentFishPath(stage)});
      const buyLink=`shops${locale==='en'?'':'.'+locale}.html?${shopParams}`;
      const buyLabel=locale==='th'?'ดูร้านที่ขายชุดนี้':locale==='ja'?'このセットの販売店を見る':'Find the shop for this set';
      const parts=[['fly',def.body],['fly_wing',def.wing],['fly_tail',def.tail]].filter(([,id])=>id!=='00').map(([category,id])=>items.find(item=>item.category===category&&item.id===id)).filter(Boolean);
      return '<article class="detail-section fly-backup" data-bundle="'+def.body+'/'+def.wing+'/'+def.tail+'" data-price="'+bundle.shopPriceYen+'"><h4>'+escapeHtml(location)+' · ¥'+bundle.shopPriceYen+'</h4><p>'+escapeHtml(locale==='th'?'รูปด้านล่างคือชิ้นส่วนในชุดสำเร็จรูปนี้ ซื้อเป็นชุดตามรายการร้านด้านบน ไม่ใช่ซื้อแต่ละชิ้นแยกกัน':locale==='ja'?'下の画像はこの完成セットの構成品です。上記の店頭項目でセットとして買い、部品を個別購入する意味ではありません。':'The images below are parts of this ready-made set. Buy the listed shop bundle, not these parts separately.')+'</p>'+parts.map(item=>itemLink({item,routes:[]},stage)).join('')+'<a class="route-button" href="'+escapeHtml(buyLink)+'">'+escapeHtml(buyLabel)+' ↗</a></article>';
    }).join('');
    return '<details id="fly-backup" class="detail-section fly-fallback" data-total="'+total+'"><summary>'+escapeHtml(title)+'</summary><p>'+escapeHtml(intro)+'</p><p><strong>'+escapeHtml(action)+'</strong></p><div class="detail-grid">'+cards+'</div><p class="muted">'+escapeHtml(scope)+'</p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fly-selection-practical-research.md">'+escapeHtml(copy.evidence)+' ↗</a></details>';
  }

  function renderShopping(entries, locations, stage, allItems, flyChoices) {
    if(!locations.length)return '';
    const offers=starterOffers(entries,stage), text=shoppingCopy;
    const cards=offers.map(offer=>{
      const query=new URLSearchParams({category:offer.entry.item.category,id:offer.entry.item.id,fish:id,stage,return:currentFishPath(stage)});
      if(['float','sinker'].includes(offer.method))query.set('route',offer.method);
      const link=`${itemPath()}?${query}`;
      const aimTip=offer.method==='lure'?`<p class="aim-tip">${escapeHtml(locale==='th'?'ก่อนใช้คันลัวร์ เติม HP ให้ถึง 100 เพื่อให้ได้เวลาเล็งเต็มของคันนั้น ไม่ใช่โบนัสโอกาสปลากิน':locale==='ja'?'ルアー竿を使う前にHPを100まで回復すると、竿本来の照準時間になります。食いつき率のボーナスではありません。':'Restore HP to 100 before lure fishing to get the rod’s full aim window. This does not add a bite-rate bonus.')}</p>`:'';
      return `<article class="detail-section starter-offer" data-method="${offer.method}" data-item="${offer.entry.item.category}:${offer.entry.item.id}" data-price="${offer.price}"><h3>${escapeHtml(offer.label)}</h3><a class="entity-link" href="${escapeHtml(link)}"><img src="${escapeHtml(offer.entry.item.image)}" alt=""><span><strong>${escapeHtml(localizedItemName(offer.entry.item))}</strong><small>${escapeHtml(text.cost)} ¥${offer.price}${offer.bundle?` · ${escapeHtml(text.bundle)}`:''}</small></span></a>${aimTip}${offer.bundle?`<p class="muted">${escapeHtml(text.fly)}</p>`:''}<a class="route-button" href="${escapeHtml(link)}">${escapeHtml(text.buy)} ↗</a></article>`;
    }).join('');
    return `<section class="detail-section shopping-plan"><h2>${escapeHtml(text.title)}</h2><label for="shopping-area">${escapeHtml(text.area)}</label><select id="shopping-area">${locations.map(loc=>`<option value="${loc.stage}" ${String(loc.stage)===stage?'selected':''}>${escapeHtml(copy.stage(loc.stage))} · ${escapeHtml(loc.stageName?.[locale]||loc.stageName?.en||'')}</option>`).join('')}</select><p>${escapeHtml(text.intro)}</p>${offers.length?`<div class="detail-grid">${cards}</div>`:`<p>${escapeHtml(text.none)}</p>`}<p class="muted">${escapeHtml(text.scope)}</p><a href="#all-compatible">${escapeHtml(text.all)} ↓</a>${renderReusableKit(allItems,stage)}${renderFlyFallback(allItems,stage,flyChoices)}</section>`;
  }

  function renderCompatibility(entries, stage) {
    const byCategory = {
      bait: entries.filter(entry => entry.item.category === 'bait'),
      lure: entries.filter(entry => entry.item.category === 'lure'),
      fly: entries.filter(entry => entry.item.category === 'fly')
    };
    const groups = [
      ['bait', copy.bait], ['lure', copy.lure], ['fly', copy.fly]
    ].map(([category, title]) => {
      const group = byCategory[category];
      if (!group.length) return '';
      return `<details class="detail-section" ><summary><span class="detail-section-title" role="heading" aria-level="2">${escapeHtml(title)}</span><span class="muted">${group.length}</span></summary><div class="detail-grid">${group.map(entry => itemLink(entry, stage)).join('')}</div></details>`;
    }).join('');
    return groups || `<p class="empty-state">${escapeHtml(copy.noCompatibility)}</p>`;
  }

  function pointCount(location) { return (location.points || []).length; }
  function slotCount(location) {
    return (location.points || []).reduce((sum, point) => sum + (point.slotIndices?.length || 1), 0);
  }

  function renderAreas(locations, activeStage) {
    if (!locations.length) return `<p class="empty-state">${escapeHtml(copy.unknownArea)}</p>`;
    return `<div class="detail-grid">${locations.map(location => {
      const stage = String(location.stage);
      const name = location.stageName?.[locale] || location.stageName?.en || `${copy.stage(stage)}`;
      const query = new URLSearchParams({ fish: id, stage });
      query.set('return', currentFishPath(stage));
      const points = pointCount(location);
      return `<article class="detail-section area-card" ${stage === activeStage ? 'data-active="true"' : ''}><h3>${escapeHtml(copy.stage(stage))} · ${escapeHtml(name)}</h3><p>${escapeHtml(copy.configuredPoints(points))}</p><p class="muted">${escapeHtml(locale==='th'?'เปิดแผนที่เพื่อเลือกจุดตก ถ้าจุดหนึ่งไม่มีปลา ให้ลองจุดอื่นที่แสดงไว้ ปลาเคลื่อนที่ได้และจุดเกิดบางแห่งอาจไม่ทำงานในรอบนั้น':locale==='ja'?'マップで釣る場所を選びます。魚がいなければ、表示された別の場所も確認してください。魚は移動し、出現枠が無効の場合もあります。':'Open the map to choose a fishing spot. If a spot is empty, try another marked point: fish move and some spawn slots may be inactive in that state.')}</p><a class="route-button" href="${escapeHtml(mapPath())}?${query.toString()}">${escapeHtml(copy.mapAction)} ↗</a></article>`;
    }).join('')}</div>`;
  }

  function renderEvidence(fish, locations, compatibleEntries) {
    const sourceSet = new Set();
    for (const entry of compatibleEntries) {
      for (const source of entry.item.playerUse?.evidence?.sources || []) sourceSet.add(source);
    }
    const profileOffset = fish.nameSource?.romProfileFileOffset || '';
    const locationDetails = locations.map(location => {
      const stage = String(location.stage);
      const coords = (location.points || []).map(point => `(${point.x}, ${point.y})`).join(' · ');
      return `<li><strong>${escapeHtml(copy.stage(stage))}:</strong> ${escapeHtml(copy.configuredPoints(pointCount(location)))} · ${escapeHtml(copy.spawnSlots(slotCount(location)))}<br>${escapeHtml(coords || '—')}</li>`;
    }).join('');
    return `<details class="evidence"><summary>${escapeHtml(copy.evidence)}</summary><p>${escapeHtml(copy.evidenceIntro)}</p><dl><dt>${escapeHtml(copy.profile)}</dt><dd>${escapeHtml(id)}</dd>${profileOffset ? `<dt>${escapeHtml(copy.profileOffset)}</dt><dd>${escapeHtml(profileOffset)}</dd>` : ''}<dt>${escapeHtml(copy.source)}</dt><dd>data/rom-fish-locations.json</dd>${sourceSet.size ? `<dt>${escapeHtml(copy.reference)}</dt><dd>${[...sourceSet].map(escapeHtml).join(' · ')}</dd>` : ''}</dl>${locationDetails ? `<h3>${escapeHtml(copy.coords)}</h3><ul>${locationDetails}</ul>` : ''}</details>`;
  }

  function render(fishData, locationData) {
    const visualTable = fishData.fishVisuals || {};
    const fish = visualTable[id];
    if (!id) {
      page.innerHTML = `<h1>${escapeHtml(copy.pageTitle)}</h1><p class="empty-state">${escapeHtml(copy.missing)}</p><p><a class="route-button" href="${escapeHtml(cataloguePath())}">${escapeHtml(copy.catalogue)}</a></p>`;
      setNavigation('');
      return;
    }
    if (!fish) {
      page.innerHTML = `<h1>${escapeHtml(copy.pageTitle)}</h1><p class="empty-state">${escapeHtml(copy.invalid)}</p><p><a class="route-button" href="${escapeHtml(cataloguePath())}">${escapeHtml(copy.catalogue)}</a></p>`;
      setNavigation('');
      return;
    }

    const name = localizedFishName(fish, id);
    const locations = getLocations(locationData);
    const activeStage = locations.some(entry => String(entry.stage) === requestedStage) ? requestedStage : String(locations[0]?.stage || '');
    setNavigation(activeStage);
    const matches = matchingItems(fishData.items || []);
    const altNames = [...new Set([fish.nameJa, fish.nameEn, fish.nameLatin, ...(fish.nameLatinVariants || []), ...(fish.nameThVariants || [])].filter(Boolean).filter(other => other !== name))];
    const sprite = fish.image ? `<figure class="detail-portrait"><img src="${escapeHtml(fish.image)}" alt="${escapeHtml(name)}"><figcaption>${escapeHtml(name)}</figcaption></figure>` : `<div class="detail-portrait empty-state">${escapeHtml(copy.noSprite)}</div>`;
    const unlabelled = !fish.nameJa && !fish.nameEn && !fish.nameLatin && !(fish.nameThVariants || []).length;
    const headline = unlabelled ? copy.unknownFish(id) : name;

    page.innerHTML = `<div class="detail-hero">${sprite}<div><p class="muted">${escapeHtml(copy.pageTitle)} · ID ${escapeHtml(id)}</p><h1>${escapeHtml(headline)}</h1>${altNames.length ? `<p class="muted"><span>${escapeHtml(copy.legacyName)}:</span> ${altNames.map(escapeHtml).join(' · ')}</p>` : ''}</div></div>
      ${renderShopping(matches, locations, activeStage, fishData.items || [], fishData.flyBackupChoices)}
      <section class="detail-section"><h2>${escapeHtml(copy.areas)}</h2>${renderAreas(locations, activeStage)}</section>
      <section id="all-compatible" class="detail-section"><h2>${escapeHtml(copy.compatible)}</h2><p class="muted">${escapeHtml(copy.compatibilityNote)}</p><p>${locale==='th'?'รายการด้านล่างเป็นทางเลือก ไม่จำเป็นต้องซื้อทั้งหมด ทุกชิ้นผ่านเงื่อนไขของปลาที่กำลังดู กดรายละเอียดเพื่อเปรียบเทียบวิธีใช้และด่านที่ขาย':locale==='ja'?'以下は代替候補で、全部買う必要はない。各項目は表示中の魚の判定を通る。詳細で使い方と販売エリアを比較できる。':'The lists below are alternatives; you do not need to buy every entry. Each passes the shown fish’s check. Open details to compare use and purchase areas.'}</p>${renderCompatibility(matches, activeStage)}</section>
      ${renderEvidence(fish, locations, matches)}`;

    if(location.hash==='#fly-backup'){const backup=document.getElementById('fly-backup');backup?.setAttribute('open','');backup?.scrollIntoView({block:'start'});}
    const chooser=document.getElementById('shopping-area');
    if(locations.length)chooser.addEventListener('change',()=>{
      requestedStage=validStage(chooser.value);
      if(typeof history!=='undefined')history.replaceState(null,'',currentFishPath(requestedStage));
      render(fishData,locationData);
    });
    document.title = `${headline} — ${copy.pageTitle} | Kawa no Nushi Tsuri 2`;
  }

  Promise.all([
    fetch('gallery-data.json').then(response => { if (!response.ok) throw new Error('gallery data unavailable'); return response.json(); }),
    fetch('fish-locations.json').then(response => { if (!response.ok) throw new Error('location data unavailable'); return response.json(); })
  ]).then(([fishData, locationData]) => render(fishData, locationData)).catch(() => {
    page.innerHTML = `<h1>${escapeHtml(copy.pageTitle)}</h1><p class="empty-state">${escapeHtml(copy.recovery)}</p><p><a class="route-button" href="${escapeHtml(cataloguePath())}">${escapeHtml(copy.catalogue)}</a></p>`;
  });
})();
