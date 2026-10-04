(() => {
  'use strict';
  const lang = ['th', 'ja'].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : 'en';
  const localePage = {en: 'item.html', th: 'item.th.html', ja: 'item.ja.html'};
  const cataloguePage = {en: 'index.html', th: 'index.th.html', ja: 'index.ja.html'};
  const mapsPage = {en: 'maps.html', th: 'maps.th.html', ja: 'maps.ja.html'};
  const copy = {
    en: {
      allItems:'Browse all items', back:'← Back to where you came from', invalidTitle:'Item not found', invalidBody:'This item link is incomplete or its ID is not in the catalogue.',
      category:'Category', itemId:'Item ID', use:'What it does', details:'Practical notes', shop:'Where to get it', shopArea:n=>`Area ${n}`, price:n=>`¥${n}`,
      priceFromRom:'ROM price field', stockAt:'Stock recorded in this area', bundleAt:n=>`Ready-made fly sold in area ${n}`,
      noShop:'No shop stock for this item is recorded in the current ROM data.', shopMap:'Find this shop', mapNote:'Open the shop page to see the town entrance, seller location, and recorded stock. Outdoor and town maps are shown separately.',
      unlock:'How to unlock this offer:', ayuOffer:'Sell at least one Ayu from your keepnet to make decoy Ayu appear in the Area 3 shop. Buying it sets the stack to 9 and subtracts 9 from the sold-Ayu counter (down to 0). If it disappears, sell more Ayu before trying again.', unknownShopCondition:'This shop offer has an additional purchase condition that has not been explained yet.',
      noShopMap:'The ROM data does not record a stage for this item’s use or sale.', fish:'Fish that pass this item’s recorded check', fishScope:'Passing this item check does not guarantee a bite or a landed fish.', routeFloat:'Float rig', routeSinker:'Sinker rig', fishProfile:'Open fish profile ↗', mapFish:'Open this fish on the map ↗', noFish:'No fish-specific compatibility list is established for this item.',
      target:'Your selected fish', targetYes:'This fish is in the item’s recorded compatible list.', targetNo:'This fish is not in this item’s recorded compatible list.', targetUnknown:'This item has no recorded fish compatibility list.',
      assembly:'Shop bundle parts', completePrice:'Complete set', component:'Open item details ↗', usedIn:'Recorded ready-made sets that include this part',
      useLocations:'Where to obtain or use it', area:n=>`Area ${n}`, noUse:'No separate use location is recorded for this item.',
      tech:'ROM and evidence details', source:'Research source', raw:'Raw record', offset:'File offset', bytes:'ROM record bytes', fields:'Decoded fields', itemPrice:'Price field in ROM', targets:'Special response conditions', evidenceNotes:'Technical notes', openFrame:'Open uncropped source image ↗',
      sourced:'Names and practical notes are based on the ROM research in this project.', routeReturn:'Back to the item page', stageWord:'area'
    },
    th: {
      allItems:'ดูรายการไอเท็มทั้งหมด', back:'← กลับหน้าที่เข้ามา', invalidTitle:'ไม่พบไอเท็ม', invalidBody:'ลิงก์นี้ไม่มีรหัสไอเท็มหรือรหัสไม่อยู่ในแค็ตตาล็อก',
      category:'หมวด', itemId:'รหัสไอเท็ม', use:'ไอเท็มนี้ใช้ทำอะไร', details:'วิธีใช้และข้อควรรู้', shop:'หาซื้อได้ที่ไหน', shopArea:n=>`ด่าน ${n}`, price:n=>`${n} เยน`,
      priceFromRom:'ช่องราคาใน ROM', stockAt:'มีข้อมูลร้านค้าในด่านนี้', bundleAt:n=>`ชุดฟลายสำเร็จรูปที่ร้านด่าน ${n}`,
      noShop:'ไม่พบข้อมูลว่ามีร้านขายไอเท็มชิ้นนี้ใน ROM ที่ตรวจ', shopMap:'ดูร้านที่ขายของนี้', mapNote:'เปิดหน้าร้านเพื่อดูทางเข้าเมือง ตำแหน่งคนขาย และรายการสินค้า โดยแยกแผนที่กลางแจ้งกับในเมือง',
      unlock:'วิธีปลดล็อกรายการนี้:', ayuOffer:'ขายปลาอายุจากข้องอย่างน้อย 1 ตัว เพื่อให้เหยื่อล่อปลาอายุปรากฏในร้านด่าน 3 เมื่อซื้อ จำนวนในช่องจะเต็มเป็น 9 ชิ้น และตัวนับปลาอายุที่ขายจะลดลง 9 (ต่ำสุด 0) ถ้าเหยื่อหายจากรายการ ให้ขายปลาอายุเพิ่มก่อนลองซื้ออีกครั้ง', unknownShopCondition:'รายการนี้มีเงื่อนไขซื้อเพิ่มเติมที่ยังถอดความหมายไม่ได้',
      noShopMap:'ข้อมูล ROM ยังไม่ระบุด่านที่ใช้หรือขายไอเท็มนี้', fish:'ปลาที่ผ่านเงื่อนไขของไอเท็มชิ้นนี้', fishScope:'การผ่านเงื่อนไขนี้ไม่ได้รับประกันว่าปลาจะกินเหยื่อหรือตกขึ้นมาได้', routeFloat:'ชุดทุ่น', routeSinker:'ชุดตะกั่ว', fishProfile:'เปิดหน้าข้อมูลปลานี้ ↗', mapFish:'เปิดแผนที่พร้อมเลือกปลานี้ ↗', noFish:'ยังไม่มีรายชื่อความเข้ากันได้กับปลาเฉพาะสำหรับไอเท็มนี้',
      target:'ปลาที่คุณเลือก', targetYes:'ปลานี้อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข', targetNo:'ปลานี้ไม่อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข', targetUnknown:'ไอเท็มนี้ไม่มีรายชื่อความเข้ากันได้กับปลาที่บันทึกไว้',
      assembly:'ชิ้นส่วนในชุดที่ร้านขาย', completePrice:'ราคาทั้งชุด', component:'เปิดรายละเอียดไอเท็ม ↗', usedIn:'ชุดสำเร็จรูปที่มีชิ้นส่วนนี้',
      useLocations:'จุดรับและใช้งานไอเท็ม', area:n=>`ด่าน ${n}`, noUse:'ไม่มีการบันทึกตำแหน่งใช้งานแยกสำหรับไอเท็มนี้',
      tech:'รายละเอียด ROM และหลักฐาน', source:'เอกสารวิจัย', raw:'ข้อมูลดิบของรายการ', offset:'ตำแหน่งในไฟล์', bytes:'ไบต์ของรายการใน ROM', fields:'ฟิลด์ที่ถอดความหมายแล้ว', itemPrice:'ช่องราคาใน ROM', targets:'เงื่อนไขตอบสนองเฉพาะ', evidenceNotes:'บันทึกเชิงเทคนิค', openFrame:'เปิดภาพต้นฉบับเต็ม ↗',
      sourced:'ชื่อและวิธีใช้สรุปจากงานแกะ ROM ในโครงการนี้', routeReturn:'กลับหน้ารายละเอียดไอเท็ม', stageWord:'ด่าน'
    },
    ja: {
      allItems:'道具一覧を見る', back:'← 前のページへ戻る', invalidTitle:'道具が見つかりません', invalidBody:'道具IDがないか、カタログに登録されていません。',
      category:'カテゴリ', itemId:'道具ID', use:'この道具の使い方', details:'使い方と注意点', shop:'入手場所', shopArea:n=>`エリア${n}`, price:n=>`${n}円`,
      priceFromRom:'ROM内の価格欄', stockAt:'このエリアの店頭記録', bundleAt:n=>`エリア${n}の店売り毛バリセット`,
      noShop:'現在のROMデータでは、この道具の店頭在庫を確認できません。', shopMap:'販売店を見る', mapNote:'店のページで町への入口、店員の位置、在庫を確認できます。屋外と町内のマップは別々に表示します。',
      unlock:'この品を買えるようにするには：', ayuOffer:'びくからアユを1匹以上売ると、おとりアユがエリア3の店に表示されます。購入すると所持数が9個になり、売却アユ数のカウンターが9減ります（0未満にはなりません）。表示から消えたら、追加でアユを売ってください。', unknownShopCondition:'この商品には追加の購入条件がありますが、内容はまだ確認できていません。',
      noShopMap:'ROMデータに使用・販売エリアの記録がありません。', fish:'この道具の判定を通る魚', fishScope:'この判定を通っても、食いつきや取り込みは保証されません。', routeFloat:'ウキ仕掛け', routeSinker:'オモリ仕掛け', fishProfile:'魚の詳細を開く ↗', mapFish:'この魚をマップで見る ↗', noFish:'この道具の魚別適合リストは確認されていません。',
      target:'選択中の魚', targetYes:'この魚は道具の適合リストに含まれています。', targetNo:'この魚は道具の適合リストに含まれていません。', targetUnknown:'この道具には魚別の適合リストがありません。',
      assembly:'店売りセットの構成品', completePrice:'セット価格', component:'道具の詳細を開く ↗', usedIn:'この部品を含む店売りセット',
      useLocations:'入手・使用場所', area:n=>`エリア${n}`, noUse:'この道具の個別の使用場所は記録されていません。',
      tech:'ROMと根拠の詳細', source:'研究資料', raw:'ROMレコード', offset:'ファイル位置', bytes:'ROMレコードのバイト', fields:'解析済みフィールド', itemPrice:'ROM内の価格欄', targets:'魚別応答条件', evidenceNotes:'技術メモ', openFrame:'切り抜き前の画像を開く ↗',
      sourced:'名称と実用情報は、このプロジェクトで行ったROM解析に基づきます。', routeReturn:'道具の詳細に戻る', stageWord:'エリア'
    }
  }[lang];
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const local = value => typeof value === 'string' ? value : value?.[lang] || value?.en || value?.ja || value?.th || '';
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || '';
  const normalizeId = value => {
    const raw=String(value||'').trim();
    if(!/^(?:0x)?[0-9a-f]{1,2}$/i.test(raw))return '';
    return Number.parseInt(raw.replace(/^0x/i,''),16).toString(16).toUpperCase().padStart(2,'0');
  };
  const requestedId = normalizeId(params.get('id'));
  let selectedFish = normalizeId(params.get('fish'));
  const selectedStage = /^[1-6]$/.test(params.get('stage')||'') ? Number(params.get('stage')) : 0;
  const selectedRoute = ['float','sinker'].includes(params.get('route')) ? params.get('route') : '';
  const baseDir = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
  const routeFiles = {
    catalogue:/^\/(?:[^/]+\/)?catalogue\/(?:index(?:\.th|\.ja)?|maps(?:\.th|\.ja)?|fish(?:\.th|\.ja)?|item(?:\.th|\.ja)?|shops(?:\.th|\.ja)?)\.html$/,
    research:/^\/(?:[^/]+\/)?research\/index(?:\.th|\.ja)?\.html$/
  };
  function safeLocalRoute(raw) {
    if (!raw) return '';
    try {
      const url = new URL(raw, location.href);
      if (url.origin !== location.origin || !(routeFiles.catalogue.test(url.pathname) || routeFiles.research.test(url.pathname))) return '';
      return `${url.pathname}${url.search}${url.hash}`;
    } catch { return ''; }
  }
  function fallbackBack() {
    const p = new URLSearchParams();
    if (category) p.set('category',['fly','fly_wing','fly_tail'].includes(category)?'flymaker':category);
    if (['fly','fly_wing','fly_tail'].includes(category))p.set('part',category);
    if (selectedFish&&['bait','lure','fly','fly_wing','fly_tail','float_weight'].includes(category)) p.set('fish',selectedFish);
    if (selectedStage) p.set('stage',String(selectedStage));
    return `${cataloguePage[lang]}${p.size ? `?${p}` : ''}#catalogue`;
  }
  function currentLocalRoute() { return `${location.pathname}${location.search}${location.hash}`; }
  function localizeReturn(raw, toLang) {
    const route = safeLocalRoute(raw);
    if (!route) return '';
    const url = new URL(route, location.href);
    const basename = url.pathname.split('/').pop();
    const root = basename.replace(/(?:\.(?:th|ja))?\.html$/, '');
    if (['index','maps','fish','item','shops'].includes(root)) {
      const directory = url.pathname.slice(0,url.pathname.lastIndexOf('/')+1);
      url.pathname = `${directory}${root}${toLang==='en'?'':`.${toLang}`}.html`;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  }
  function setNavigation() {
    const rawReturn = params.get('return') || '';
    $('detail-back').href = safeLocalRoute(rawReturn) || fallbackBack();
    $('detail-back').textContent = copy.back;
    document.querySelectorAll('.language-links a').forEach(link => {
      const targetLang = link.getAttribute('hreflang');
      if (!targetLang) return;
      const next = new URLSearchParams(location.search);
      const returned = localizeReturn(rawReturn,targetLang);
      if (returned) next.set('return',returned);
      link.href = `${localePage[targetLang]}${next.size?`?${next}`:''}${location.hash||''}`;
      if (targetLang===lang) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
  }
  function imageName(item) { return lang==='th' ? (item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id) : lang==='ja' ? (item.playerUse?.displayName?.ja || item.nameJa || item.nameEn || item.id) : (item.playerUse?.displayName?.en || item.nameEn || item.nameJa || item.id); }
  function fishName(id, fishVisuals) {
    const fish=fishVisuals[id]||{};
    if(lang==='th')return fish.nameTh || fish.nameThVariants?.join(' / ') || fish.nameLatin || fish.nameJa || `ปลา ${id}`;
    if(lang==='ja')return fish.nameJa || `魚 ${id}`;
    return fish.nameEn || fish.nameLatin || fish.nameLatinVariants?.slice().sort((a,b)=>b.length-a.length)[0] || fish.nameJa || `Fish ${id}`;
  }
  function currentCategoryLink() {
    const p=new URLSearchParams(), fly=['fly','fly_wing','fly_tail'].includes(category);
    p.set('category',fly?'flymaker':category||'all');
    if(fly)p.set('part',category);
    if(selectedFish&&['bait','lure','fly','fly_wing','fly_tail','float_weight'].includes(category))p.set('fish',selectedFish);
    if(selectedStage)p.set('stage',String(selectedStage));
    if(selectedRoute&&category==='bait')p.set('route',selectedRoute);
    return `${cataloguePage[lang]}?${p}#catalogue`;
  }
  function detailItemLink(item, returnRoute=currentLocalRoute()) {
    const p=new URLSearchParams();p.set('category',item.category);p.set('id',item.id);
    if(selectedFish)p.set('fish',selectedFish);if(selectedStage)p.set('stage',String(selectedStage));
    if(selectedRoute&&item.category==='bait')p.set('route',selectedRoute);
    const safe=safeLocalRoute(returnRoute);if(safe)p.set('return',safe);
    return `item${lang==='en'?'':`.${lang}`}.html?${p}`;
  }
  function mapLink(stage, fish='') {
    const p=new URLSearchParams();p.set('stage',String(stage));if(fish)p.set('fish',fish);
    const returnRoute=safeLocalRoute(currentLocalRoute());if(returnRoute)p.set('return',returnRoute);
    return `${mapsPage[lang]}?${p}`;
  }
  function fishProfileLink(id, fishLocations) {
    const locations=fishLocations[id]?.locations||[];
    const location=locations.find(loc=>Number(loc.stage)===selectedStage)||locations[0];
    const p=new URLSearchParams({id});
    if(location?.stage)p.set('stage',String(location.stage));
    const returnRoute=safeLocalRoute(currentLocalRoute());if(returnRoute)p.set('return',returnRoute);
    return `fish${lang==='en'?'':`.${lang}`}.html?${p}`;
  }
  function categoryLabel(item) { return lang==='th'?(item.categoryTh||item.categoryEn):lang==='ja'?(item.categoryJa||item.categoryEn):(item.categoryEn||item.category); }
  function categoryName(c) {
    const maps={
      th:{rod:'คันเบ็ด',lure:'ลัวร์',fly:'ฟลาย',fly_wing:'ปีกฟลาย',fly_tail:'หางฟลาย',hook:'เบ็ด',float_weight:'ทุ่นและตะกั่ว',bait:'เหยื่อจริง',food:'อาหาร',general_tool:'อุปกรณ์ทั่วไป'},
      ja:{rod:'竿',lure:'ルアー',fly:'毛バリ',fly_wing:'ウィング',fly_tail:'テール',hook:'ハリ',float_weight:'ウキ・オモリ',bait:'エサ',food:'食料',general_tool:'道具'},
      en:{rod:'Rod',lure:'Lure',fly:'Fly body',fly_wing:'Fly wing',fly_tail:'Fly tail',hook:'Hook',float_weight:'Float / sinker',bait:'Natural bait',food:'Food',general_tool:'General tool'}
    };
    return maps[lang][c] || c;
  }
  function stageName(stage, fishLocations) {
    for (const record of Object.values(fishLocations)) for (const loc of record.locations||[]) if(Number(loc.stage)===Number(stage)) return local(loc.stageName)||copy.shopArea(stage);
    return copy.shopArea(stage);
  }
  function stageButton(stage, fishLocations, label=copy.shopMap) {
    const name=stageName(stage,fishLocations), p=new URLSearchParams({stage:String(stage),place:'town',category,id:requestedId});
    if(selectedFish)p.set('fish',selectedFish);
    const returned=safeLocalRoute(currentLocalRoute());if(returned)p.set('return',returned);
    const shops=`shops${lang==='en'?'':`.${lang}`}.html?${p}`;
    return `<a class="route-button" href="${esc(shops)}">${esc(label)} · ${esc(name)} ↗</a>`;
  }
  function componentLink(item, label='') {
    if(!item)return '';
    if(item.category===category&&item.id===requestedId)return `<div class="entity-link" aria-current="true"><img loading="lazy" src="${esc(item.image)}" alt=""><span>${esc(label||imageName(item))}<small>${lang==='th'?'ชิ้นที่กำลังดู':lang==='ja'?'表示中の部品':'Part currently shown'}</small></span></div>`;
    return `<a class="entity-link" href="${esc(detailItemLink(item))}"><img loading="lazy" src="${esc(item.image)}" alt=""><span>${esc(label||imageName(item))}<small>ID ${esc(item.id)} · ${esc(copy.component)}</small></span></a>`;
  }
  function flyAssemblies(item, allItems) {
    const id=item.id, parts=[];
    for(const body of allItems.filter(i=>i.category==='fly')) for(const shop of body.playerUse?.shops||[]) {
      const b=shop.bundle;if(!b)continue;
      const belongs=(item.category==='fly'&&b.body===id)||(item.category==='fly_wing'&&b.wing===id)||(item.category==='fly_tail'&&b.tail===id);
      if(!belongs)continue;
      const key=[shop.stage,b.body,b.wing,b.tail,b.shopPriceYen].join('|');if(parts.some(p=>p.key===key))continue;
      parts.push({key,stage:Number(shop.stage),bundle:b,body});
    }
    return parts.sort((a,b)=>a.stage-b.stage||a.bundle.shopPriceYen-b.bundle.shopPriceYen);
  }
  function shopCondition(item, offer, fishLocations) {
    if(!offer?.condition)return '';
    const knownAyuCondition=item.category==='bait'&&item.id==='17'&&offer.condition.includes('sell at least one Ayu');
    const message=knownAyuCondition?copy.ayuOffer:copy.unknownShopCondition;
    const action=knownAyuCondition?`<a class="route-button" href="${esc(fishProfileLink('38',fishLocations))}">${esc(lang==='th'?'ดูจุดตกและเหยื่อสำหรับปลาอายุ':lang==='ja'?'アユの釣り場と対応エサを見る':'Find Ayu fishing spots and compatible bait')} ↗</a>`:'';
    return `<p class="shop-condition"><strong>${esc(copy.unlock)}</strong> ${esc(message)}</p>${action}`;
  }
  function shopSection(item, allItems, fishLocations) {
    const shops=item.playerUse?.shops||[];
    const isFly=['fly','fly_wing','fly_tail'].includes(item.category);
    if(isFly) {
      const assemblies=flyAssemblies(item,allItems);
      if(!assemblies.length)return `<section class="detail-section"><h2>${esc(copy.shop)}</h2><p class="muted">${esc(copy.noShop)}</p></section>`;
      return `<section class="detail-section"><h2>${esc(copy.shop)}</h2>${item.category!=='fly'?`<p>${esc(copy.usedIn)}</p>`:''}<div class="detail-grid">${assemblies.map(({stage,bundle})=>{
        const refs=[['fly',bundle.body],['fly_wing',bundle.wing],['fly_tail',bundle.tail]].filter(([,id])=>id&&id!=='00').map(([c,id])=>allItems.find(i=>i.category===c&&i.id===id)).filter(Boolean);
        return `<article class="detail-section"><h3>${esc(copy.bundleAt(stage))}</h3><p><strong>${esc(copy.completePrice)} · ${esc(copy.price(bundle.shopPriceYen))}</strong></p><div class="detail-grid">${refs.map(part=>componentLink(part)).join('')}</div>${stageButton(stage,fishLocations)}<p class="muted">${esc(copy.mapNote)}</p></article>`;
      }).join('')}</div></section>`;
    }
    if(!shops.length)return `<section class="detail-section"><h2>${esc(copy.shop)}</h2><p class="muted">${esc(copy.noShop)}</p></section>`;
    const stageRows=[...new Set(shops.map(s=>Number(s.stage)).filter(n=>n>=1&&n<=6))].sort((a,b)=>a-b);
    return `<section class="detail-section"><h2>${esc(copy.shop)}</h2>${item.priceYen!=null?`<p><strong>${esc(copy.price(item.priceYen))}</strong> <span class="muted">· ${esc(copy.stockAt)} · ${esc(copy.priceFromRom)}</span></p>`:''}<div class="detail-grid">${stageRows.map(stage=>{
      const offer=shops.find(s=>Number(s.stage)===stage);
      const seller=offer?.shop==='special_rod_shop'?(lang==='th'?'ร้านคันเบ็ดพิเศษในเมือง':lang==='ja'?'町の専用竿店':'Special rod shop'):(lang==='th'?'ร้านในด่านนี้':lang==='ja'?'エリア内の店':'Store stock in this area');
      return `<article class="detail-section"><h3>${esc(stageName(stage,fishLocations))}</h3><p>${esc(seller)}${item.priceYen!=null?` · ${esc(copy.price(item.priceYen))}`:''}</p>${shopCondition(item,offer,fishLocations)}${stageButton(stage,fishLocations)}</article>`;
    }).join('')}</div><p class="muted">${esc(copy.mapNote)}</p></section>`;
  }
  function buyingDecision(item, allItems, decisions) {
    const rodPaths={1:'float_rod_path',2:'casting_rod_path',4:'lure_rod_path',8:'fly_rod_path'};
    const path=item.category==='rod'?rodPaths[item.decodedFields?.styleCode]:item.category==='hook'?'hook_purchase_caution':'';
    const sections=decisions.filter(section=>path?section.id===path:!selectedFish&&section.category===item.category&&['lure','food'].includes(item.category)&&(section.items||[]).some(ref=>ref.category===item.category&&ref.id===item.id));
    if(!sections.length)return '';
    return `<section class="detail-section buying-decision"><h2>${lang==='th'?'ควรซื้อหรือเปลี่ยนมาใช้อันนี้ไหม?':lang==='ja'?'買う・替えるべき？':'Should I buy or switch to this?'}</h2>${sections.map(section=>{
      const refs=(section.items||[]).filter(ref=>ref.category===item.category&&ref.id!==item.id).map(ref=>allItems.find(i=>i.category===ref.category&&i.id===ref.id)).filter(Boolean);
      return `<h3>${esc(local(section.title))}</h3><p>${esc(local(section.recommendation))}</p>${refs.length?`<div class="detail-grid">${refs.map(ref=>componentLink(ref)).join('')}</div>`:''}<p class="muted">${esc(local(section.scope))}</p>`;
    }).join('')}</section>`;
  }

  function visibleUsage(item) {
    const use=item.playerUse||{};
    if(item.baitLureDecision)return {summary:local(item.baitLureDecision.recommendation),facts:[local(item.baitLureDecision.reason)].filter(Boolean)};
    if(item.gearDecision)return {summary:local(item.gearDecision.recommendation),facts:[local(item.gearDecision.reason)].filter(Boolean)};
    if(item.category==='rod'&&item.rodDecision)return {summary:local(item.rodDecision.recommendation),facts:[local(item.rodDecision.reason)].filter(Boolean)};
    if(item.category==='hook')return {summary:local(use.summary),facts:use.facts?.[lang]||[]};
    if(item.category==='fly_wing')return {summary:lang==='th'?'ประกอบเองให้เริ่มจากปีกที่มีอยู่และตรวจราคาเสนอก่อนจ่าย ไม่ต้องซื้อปีกแพงเพื่อหวังโบนัสจับปลา เพราะยังไม่มีหลักฐานรองรับ':lang==='ja'?'作成するなら手持ちのウィングから始め、確定前に見積額を確認する。釣果ボーナスを期待して高価なウィングを買う根拠はない。':'For a custom fly, start with a wing you have and check the quote before paying. There is no established catch bonus that justifies buying an expensive wing.',facts:use.facts?.[lang]||[]};
    if(item.category==='fly_tail')return {summary:lang==='th'?'เลือกหางนี้ถ้าชอบรูปและยอมรับราคาเสนอ หรือเลือก “ไม่มี” ในเมนูประกอบที่มีตัวเลือกนั้น ยังไม่มีหลักฐานว่าหางนี้เพิ่มโอกาสจับปลา':lang==='ja'?'見た目と見積額で選ぶ。「無し」がある作成画面では省略できる。このテールの釣果ボーナスは確認していない。':'Choose this tail for its appearance and quoted price, or choose “None” where the maker offers it. A catch advantage from this tail is not established.',facts:[]};
    if(item.category==='float_weight')return {summary:local(use.summary),facts:use.facts?.[lang]||[]};
    if(item.category==='food'&&item.id==='08')return {summary:lang==='th'?'ตรวจชื่อปลาที่เมนูแสดงก่อนกิน เพราะเกมกินตัวแรกในข้อง ถ้าเป็นคุซะฟุกุอย่ากิน: HP จะเหลือ 0':lang==='ja'?'食べる前に表示された魚名を確認する。びくの先頭を食べる。クサフグなら食べない：HPが0になる。':'Check the displayed fish name before eating: the game eats the first keepnet fish. Do not eat Kusafugu; it sets HP to zero.',facts:use.facts?.[lang]||[]};
    const facts=use.specialResponseTarget?[]:(use.facts?.[lang]||use.facts?.en||[]);
    return {summary:local(use.summary)||'',facts};
  }
  function fishTile(id, fishVisuals, fishLocations, stage) {
    const fish=fishVisuals[id]||{}, record=fishLocations[id];
    const locs=(record?.locations||[]).filter(l=>!stage||Number(l.stage)===Number(stage));
    const actualStage=locs[0]?.stage||(record?.locations||[])[0]?.stage||0;
    const src=fish.image||'';
    const main=`<a class="entity-link-name fish-profile-link" href="${esc(fishProfileLink(id,fishLocations))}">${src?`<img loading="lazy" src="${esc(src)}" alt="">`:''}<span><strong>${esc(fishName(id,fishVisuals))}</strong><small>ID ${esc(id)} · ${esc(copy.fishProfile)}</small></span></a>`;
    const map=actualStage?`<a class="route-button" href="${esc(mapLink(actualStage,id))}">${esc(copy.mapFish)} · ${esc(copy.area(actualStage))}</a>`:'';
    return `<article class="entity-link">${main}${map}</article>`;
  }
  function fishSection(item, fishVisuals, fishLocations) {
    const use=item.playerUse||{}, routes=use.fishIdsByRoute||{};
    const steering=item.category==='general_tool'&&['08','09','0A'].includes(item.id);
    const steeringCopy={th:{title:'ปลาและสัตว์ที่ชี้ทิศให้เข้าหาจุดโปรยได้',yes:'โปรไฟล์นี้อยู่ในรายชื่อที่หันทิศเข้าหาจุดโปรยได้',no:'โปรไฟล์นี้ไม่อยู่ในรายชื่อที่หันทิศเข้าหาจุดโปรยได้'},en:{title:'Creatures whose movement can be steered toward chum',yes:'This profile is in the movement-steering list.',no:'This profile is not in the movement-steering list.'},ja:{title:'寄せエサの地点へ進行方向を向けられる魚・生き物',yes:'このプロフィールは進行方向の誘導リストに含まれる。',no:'このプロフィールは進行方向の誘導リストに含まれない。'}}[lang];
    const heading=steering?steeringCopy.title:copy.fish;

    const routeKeys=Object.keys(routes).filter(route=>Array.isArray(routes[route])&&routes[route].length);
    const ids=Array.isArray(use.fishIds)?[...new Set(use.fishIds.map(x=>String(x).toUpperCase().padStart(2,'0')))]:[];
    const supportedCategories=['lure','fly','bait','float_weight','general_tool'];
    const hasCompatibility=supportedCategories.includes(item.category)&&(ids.length>0||routeKeys.length>0);
    if(!hasCompatibility)return '';
    const routeGroup=(key,routeIds)=>`<div id="rig-${esc(key)}" class="detail-section" ${selectedRoute===key?'data-active="true"':''}><h3>${esc(key==='float'?copy.routeFloat:copy.routeSinker)} · ${new Set(routeIds).size}</h3><div class="detail-grid">${[...new Set(routeIds.map(x=>String(x).toUpperCase().padStart(2,'0')))].map(id=>fishTile(id,fishVisuals,fishLocations,selectedStage)).join('')}</div></div>`;
    const groups=routeKeys.length?routeKeys.map(key=>routeGroup(key,routes[key])).join(''):`<div class="detail-grid">${ids.map(id=>fishTile(id,fishVisuals,fishLocations,selectedStage)).join('')}</div>`;
    const activeRoute=selectedRoute&&Object.hasOwn(routes,selectedRoute)?selectedRoute:null;
    const targetAccepted=activeRoute?(routes[activeRoute]||[]).map(x=>String(x).toUpperCase().padStart(2,'0')).includes(selectedFish):ids.includes(selectedFish)||routeKeys.some(k=>(routes[k]||[]).map(x=>String(x).toUpperCase().padStart(2,'0')).includes(selectedFish));
    const targetStatus=selectedFish?(activeRoute?(activeRoute==='float'?copy.routeFloat:copy.routeSinker)+': ':'')+(targetAccepted?(steering?steeringCopy.yes:copy.targetYes):(steering?steeringCopy.no:copy.targetNo)):'';
    const fishTarget=selectedFish?`<p class="play-target"><strong>${esc(copy.target)} · ${esc(fishName(selectedFish,fishVisuals))} (${esc(selectedFish)})</strong><br>${esc(targetStatus)}</p>`:'';
    const scope=local(use.fishScope)||copy.fishScope;
    return `<section class="detail-section"><h2>${esc(heading)} · ${ids.length||Object.values(routes).flat().length}</h2>${fishTarget}<p>${esc(scope)}</p>${groups}<p class="muted">${esc(steering?(lang==='th'?'รายชื่อนี้บอกผลต่อทิศการเคลื่อนที่ ไม่ใช่เหยื่อที่กินหรือโบนัสโอกาสกัด':lang==='ja'?'進行方向の効果であり、食べられるエサや食いつき率のボーナスを示さない。':'This list describes movement steering, not edible bait or a bite-rate bonus.'):copy.fishScope)}</p></section>`;
  }
  function technicalSection(item) {
    const use=item.playerUse||{}, sources=[...new Set([...(use.evidence?.sources||[]),...(item.rodDecision?.sources||[]),...(item.gearDecision?.sources||[]),...(item.baitLureDecision?.sources||[])])];
    const decoded=item.decodedFields||{}, targets=use.targetMatches?(Array.isArray(use.targetMatches)?use.targetMatches:[use.targetMatches]):[];
    const noteArray=use.evidenceNotes?.[lang]||use.evidenceNotes?.en||[];
    const sourceLinks=sources.map(path=>`<li><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${encodeURI(path)}" target="_blank" rel="noopener">${esc(path)} ↗</a></li>`).join('');
    const techTargets=targets.length?`<h3>${esc(copy.targets)}</h3><ul>${targets.map(t=>`<li>${esc(t.nameTh&&lang==='th'?t.nameTh:t.nameJa||t.fishId)} · ID ${esc(t.fishId)} — ${esc(local(use.targetMatchScope))}</li>`).join('')}</ul>`:'';
    const renderedDecoded=Object.entries(decoded).map(([key,value])=>`<dt>${esc(key)}</dt><dd><code>${esc(typeof value==='object'?JSON.stringify(value):value)}</code></dd>`).join('');
    const rawFields=Object.entries(item.rawFields||{}).map(([key,value])=>`<dt>${esc(key)}</dt><dd><code>${esc(typeof value==='object'?JSON.stringify(value):value)}</code></dd>`).join('');
    const rodMechanics=(item.category==='rod'||item.gearDecision)?`<h3>${lang==='th'?'การทำงานที่แกะได้':lang==='ja'?'解読した動作':'Decoded mechanics'}</h3><p>${esc(local(use.summary))}</p><ul>${(use.facts?.[lang]||[]).map(fact=>`<li>${esc(fact)}</li>`).join('')}</ul>`:'';
    const notes=noteArray.map(note=>`<li>${esc(note)}</li>`).join('');
    return `<details class="evidence"><summary>${esc(copy.tech)}</summary><div class="detail-content"><p><strong>${esc(copy.itemPrice)}:</strong> ${item.priceYen==null?'—':`¥${esc(item.priceYen)}`}</p><p><strong>${esc(copy.offset)}:</strong> <code>${esc(item.fileOffset||'—')}</code></p><p><strong>${esc(copy.bytes)}:</strong> <code>${esc(item.recordBytesHex||'—')}</code></p>${techTargets}${rodMechanics}${renderedDecoded?`<h3>${esc(copy.fields)}</h3><dl>${renderedDecoded}</dl>`:''}${rawFields?`<h3>${esc(copy.raw)}</h3><dl>${rawFields}</dl>`:''}${notes?`<h3>${esc(copy.evidenceNotes)}</h3><ul>${notes}</ul>`:''}${sources.length?`<h3>${esc(copy.source)}</h3><ul>${sourceLinks}</ul>`:''}<a href="${esc(item.frame||item.image)}" target="_blank" rel="noopener">${esc(copy.openFrame)}</a></div></details>`;
  }
  function useLocationSection(item, fishLocations, allItems) {
    const locations=item.playerUse?.useLocations||[];
    if(!locations.length)return '';
    const text={th:{pin:'รูปไอเท็มชี้ตำแหน่งที่ต้องไป',forage:'รูปเหยื่อชี้ช่องตัวอย่างที่ค้นหาได้ ถ้ามีสองรูปคือผลลัพธ์ทางเลือก ไม่ได้รับทั้งคู่ ขยับช่องก่อนค้นซ้ำ',open:'เปิดภาพบริเวณนี้เต็ม',full:'เปิดภาพฉากทั้งด่าน',window:'ยืนใช้ไอเท็มในช่วง'},en:{pin:'The item portrait marks where to go.',forage:'Bait portraits mark an example search tile. Two portraits mean alternative results, not both at once. Move to another tile before searching again.',open:'Open this location image',full:'Open full area terrain',window:'Stand and use the item within'},ja:{pin:'道具画像が目的の場所を示す。',forage:'エサ画像は探索できるタイル例。2枚なら結果の候補で、両方同時ではない。再探索前に別タイルへ移動する。',open:'この場所の画像を開く',full:'エリア全体の地形を開く',window:'この範囲で道具を使う'}}[lang];
    return `<section class="detail-section" id="use-locations"><h2>${esc(copy.useLocations)}</h2><div class="detail-grid tool-location-grid ${locations.length===1?'single-location':''}">${locations.map(loc=>{
      const stage=Number(loc.stage)||0, refs=loc.markerItems||(loc.markerItem?[loc.markerItem]:[{category:item.category,id:item.id}]);
      const markers=refs.map(ref=>allItems.find(i=>i.category===ref.category&&i.id===ref.id)).filter(Boolean);
      const visual=loc.image&&loc.pin?`<div class="tool-use-map" style="aspect-ratio:${Number(loc.width)||1}/${Number(loc.height)||1}"><img class="tool-use-ground" src="${esc(loc.image)}" alt="${esc(local(loc.name))}"><span class="tool-use-pin" style="left:${Number(loc.pin.x)*100}%;top:${Number(loc.pin.y)*100}%">${markers.map(marker=>`<a href="${esc(marker.category===item.category&&marker.id===item.id?loc.image:loc.kind==='runtime_net_use'?areaItemLink(marker,stage):detailItemLink(marker))}" ${marker.category===item.category&&marker.id===item.id?'target="_blank" rel="noopener"':''} aria-label="${esc(marker.category===item.category&&marker.id===item.id?text.open:imageName(marker))}"><img src="${esc(marker.image)}" alt="${esc(imageName(marker))}"></a>`).join('')}</span></div><p class="muted">${esc(loc.kind==='runtime_net_use'?(lang==='th'?'รูปแมลงน้ำชี้ช่องที่ทดลองใช้ตาข่ายสำเร็จ':lang==='ja'?'カワムシ画像はアミ使用に成功したタイルを示す。':'The aquatic insect portrait marks the successfully tested net tile.'):loc.forage?text.forage:text.pin)}</p>`:'';
      const entranceInfo=loc.approach;
      const entranceTitle=lang==='th'?'เริ่มจากทางเข้าเมืองนี้บนแผนที่ด่าน':lang==='ja'?'屋外ではこの町入口から入る':'Start at this town entrance on the outdoor map';
      const entranceGuide=entranceInfo?`<details class="town-approach"><summary>${esc(entranceTitle)}</summary><p>${esc(lang==='th'?'เข้าประตูที่รูปไอเท็มชี้ แล้วไปหีบในห้องที่แสดงด้านบน':lang==='ja'?'道具画像が示す入口に入り、上の部屋画像の宝箱へ進みます。':'Enter through the door marked by the item portrait, then find the chest in the room shown above.')}</p><div class="tool-use-map" style="aspect-ratio:${entranceInfo.width}/${entranceInfo.height}"><img class="tool-use-ground" src="${esc(entranceInfo.image)}" alt="${esc(entranceTitle)}"><span class="tool-use-pin" style="left:${entranceInfo.pin.x*100}%;top:${entranceInfo.pin.y*100}%"><a href="${esc(entranceInfo.image)}" target="_blank" rel="noopener"><img src="${esc(item.image)}" alt="${esc(imageName(item))}"></a></span></div><p>X ${entranceInfo.tileX}, Y ${entranceInfo.tileY}</p><a href="${esc(entranceInfo.fullImage)}" target="_blank" rel="noopener">${esc(text.full)} ↗</a></details>`:'';
      const reward=loc.rewardItem?allItems.find(candidate=>candidate.category===loc.rewardItem.category&&candidate.id===loc.rewardItem.id):null;
      const required=loc.requiredItem?allItems.find(candidate=>candidate.category===loc.requiredItem.category&&candidate.id===loc.requiredItem.id):null;
      const requirement=required?`<p>${esc(lang==='th'?'ต้องพก:':lang==='ja'?'必要な道具：':'Bring:')} ${required.category===item.category&&required.id===item.id?esc(imageName(required)):`<a href="${esc(detailItemLink(required))}">${esc(imageName(required))} ↗</a>`}</p>`:'';
      const rewardAction=reward?`<p>${esc(loc.context==='town'?(lang==='th'?'ของในหีบ:':lang==='ja'?'宝箱の中身：':'Chest reward:'):(lang==='th'?'ของที่ได้รับ:':lang==='ja'?'受け取る道具：':'Reward:'))} ${reward.category===item.category&&reward.id===item.id?esc(imageName(reward)):`<a href="${esc(detailItemLink(reward))}">${esc(imageName(reward))} ↗</a>`}</p>`:'';
      const townLabel=loc.context==='town'?(lang==='th'?' · ในเมือง':lang==='ja'?' · 町内':' · In town'):'';
      const entrance=Number.isInteger(loc.townEntranceOrdinal)?`<p>${esc(lang==='th'?'ห้องของทางเข้าเมืองที่ '+(loc.townEntranceOrdinal+1):lang==='ja'?'町入口'+(loc.townEntranceOrdinal+1)+'につながる部屋':'Room reached from town entrance '+(loc.townEntranceOrdinal+1))}</p>`:'';
      const fullLabel=loc.context==='town'?(lang==='th'?'เปิดภาพในเมืองทั้งห้าห้อง':lang==='ja'?'町内の5部屋の画像を開く':'Open all five town rooms'):text.full;
      const window=loc.useWindow?`<p>${esc(text.window)} X ${loc.useWindow.xMin}–${loc.useWindow.xMax}, Y ${loc.useWindow.yMin}–${loc.useWindow.yMax}</p>`:'';
      return `<article class="detail-section" ${loc.kind==='compass_exit'?'id="compass-exit-'+stage+'"':''}><h3>${esc(stage?copy.area(stage)+' · '+stageName(stage,fishLocations):'')+townLabel}</h3>${entrance}${requirement}${rewardAction}${loc.action?`<p class="acquisition-action">${esc(local(loc.action))}</p>`:''}<p>${esc(local(loc.description)||local(loc.name)||'')}</p>${visual}<p>X ${esc(loc.tileX)}, Y ${esc(loc.tileY)}</p>${window}${loc.image?`<a href="${esc(loc.image)}" target="_blank" rel="noopener">${esc(text.open)} ↗</a>`:''}${loc.fullImage?` · <a href="${esc(loc.fullImage)}" target="_blank" rel="noopener">${esc(fullLabel)} ↗</a>`:''}${entranceGuide}</article>`;
    }).join('')}</div></section>`;
  }


  const flyMakerLink=item=>item.category.startsWith('fly')?`<p><a class="route-button" data-fly-maker href="${esc(currentCategoryLink().split('#')[0]+'#fly-instructions')}">${lang==='th'?'ดูขั้นตอนประกอบฟลายเองและตรวจราคาในเกม':lang==='ja'?'自作フライの手順とゲーム内見積額を確認':'See custom fly steps and check the in-game quote'} ↗</a></p>`:'';
  function gearNextActions(item,fishVisuals,fishLocations,allItems){
    if(!item.gearDecision)return '';
    if(item.category==='float_weight')return `<p><a class="route-button" data-float-price-guide href="index${lang==='en'?'':'.'+lang}.html?category=float_weight#category-decisions">${lang==='th'?'ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน':lang==='ja'?'6エリアの最安ウキ・オモリを見る':'See the cheapest float and sinker in each of six areas'} ↗</a></p>`;

    const ids=(item.gearDecision.targetFish||[]).filter(id=>fishVisuals[id]);
    const hookBudget=item.category==='hook'?`<p><a class="route-button" data-hook-price-guide href="index${lang==='en'?'':'.'+lang}.html?category=hook#category-decisions">${lang==='th'?'เบ็ดหายหรือยังไม่มี? ดูเบ็ดทั่วไปที่ถูกสุดทั้งหกด่าน':lang==='ja'?'針を失った・持っていない？6エリアの最安汎用針を見る':'Lost your hook or have none? See the cheapest generic hook in each area'} ↗</a></p>`:'';
    if(item.category==='hook'&&!ids.length)return hookBudget;
    if(item.category==='hook'&&ids.length)return hookBudget+`<p>${lang==='th'?'ดูเหยื่อและจุดตกของปลาที่ชื่อเบ็ดอ้างถึง (ไม่ได้แนะนำให้ใช้เบ็ดนี้จับง่ายกว่า)':lang==='ja'?'ハリ名が参照する魚のエサ・場所を確認（このハリの優位性を示すものではありません）':'See bait and locations for the fish named by this hook (not a claim this hook lands it more easily)'}</p>${ids.map(id=>`<a class="route-button" href="${esc(fishProfileLink(id,fishLocations))}">${esc(fishName(id,fishVisuals))} ↗</a>`).join('')}`;
    if(item.category.startsWith('fly')){
      const target=selectedFish&&fishVisuals[selectedFish]?selectedFish:'';
      if(target){const supported=allItems.some(candidate=>candidate.category==='fly'&&candidate.playerUse?.fishIds?.includes(target));return `<p><a class="route-button" data-fly-next href="${esc(fishProfileLink(target,fishLocations))}${supported?'#fly-backup':''}">${supported?(lang==='th'?'ดูชุดฟลายเริ่มต้นและชุดสำรองสำหรับปลาที่เลือก':lang==='ja'?'選んだ魚の最初の毛バリと予備を見る':'See starter and backup flies for the selected fish'):(lang==='th'?'ปลานี้ไม่ผ่านเงื่อนไขฟลาย: ดูเหยื่อและวิธีอื่น':lang==='ja'?'この魚はフライ判定に不適合：他のエサ・釣法を見る':'This fish fails the fly profile check: see other bait and methods')} ↗</a></p>`;}

      if(item.category==='fly')return `<p>${lang==='th'?'เลือกปลาในรายชื่อด้านล่าง เพื่อดูจุดตกและชุดฟลายเริ่มต้น/สำรองของปลานั้น':lang==='ja'?'下の魚一覧から選び、場所と最初の毛バリ・予備を確認してください。':'Choose a fish in the list below to see its locations and starter/backup flies.'}</p>`;
      return `<p><a class="route-button" data-fly-next href="item${lang==='en'?'':'.'+lang}.html?category=fly&id=01&return=${encodeURIComponent(currentLocalRoute())}">${lang==='th'?'เลือกปลาจากรายชื่อบอดี้ แล้วดูชุดฟลายในหน้าปลา':lang==='ja'?'ボディの魚一覧から選び、魚ページで毛バリ候補を見る':'Choose a fish from the body list, then see flies on its profile'} ↗</a></p>`;
    }
    return '';
  }
  function areaItemLink(item,stage,hash='') {
    // Switching areas of this item keeps the entry page as the back destination.
    const sameItem=item.category===category&&item.id===requestedId;
    const returnRoute=sameItem?(safeLocalRoute(params.get('return'))||fallbackBack()):currentLocalRoute();
    const [page,query]=detailItemLink(item,returnRoute).split('?');
    const linkParams=new URLSearchParams(query);linkParams.set('stage',String(stage));
    if(selectedRoute)linkParams.set('route',selectedRoute);
    return page+'?'+linkParams+hash;
  }
  function compassUseChoice(item) {
    if(item.category!=='general_tool'||item.id!=='0E')return '';
    const locations=item.playerUse?.useLocations||[];if(!locations.length)return '';
    const label=lang==='th'?'หลงทาง? ดูจุดออกของด่านที่อยู่':lang==='ja'?'迷ったら現在エリアの出口地点を見る':'Lost? See the exit point for your current area';
    return `<aside class="detail-section compass-exit-choice" data-compass-exit-choice><h3>${label}</h3><p>${lang==='th'?'เลือกด่าน แล้วดูรูปแม่เหล็กที่ชี้จุดทางเชื่อม เข็มจะหยุดเมื่อถึงช่องเป้าหมาย แต่คำบอกทิศไม่ใช่เส้นทางหลบสิ่งกีดขวาง':lang==='ja'?'エリアを選び、磁石画像が示す連絡路の地点を確認します。目標タイルで針が止まりますが、方角表示は障害物を避ける経路案内ではありません。':'Choose an area and find the connecting-route point marked by the magnet portrait. The needle stops at its target tile; the heading does not supply a route around obstacles.'}</p>${locations.map(loc=>`<p><a data-compass-location href="${esc(areaItemLink(item,loc.stage,'#compass-exit-'+loc.stage))}">${lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area'} ${loc.stage} · ${lang==='th'?'ดูจุดที่เข็มหยุด':lang==='ja'?'針が止まる地点を見る':'See where the needle stops'} ↗</a></p>`).join('')}</aside>`;
  }
  function gatheredBaitChoices(item,allItems){
    if(!item.gatheredBaitByArea)return '';
    const title=lang==='th'?'เหยื่อที่ตาข่ายหาได้: เลือกดูว่าใช้ตกปลาอะไร':lang==='ja'?'金アミで採れるエサ：対応魚を見る':'Baits gathered with the net: see which fish accept them';
    return `<section class="detail-section gathered-bait"><h3>${title}</h3>${item.playerUse?.useLocations?.some(l=>l.kind==='runtime_net_use')?`<p class="net-location-choice" data-net-location-choice><a href="${esc(areaItemLink(item,1,'#use-locations'))}">${lang==='th'?'ด่าน 1: ดูภาพช่องน้ำตื้นที่ทดลองใช้ตาข่ายสำเร็จ':lang==='ja'?'エリア1：アミ使用に成功した浅瀬を見る':'Area 1: see the shallow tile where net use succeeded'} ↗</a><br>${lang==='th'?'ยังไม่ยืนยันเส้นทางเดินจากทางเข้า; หากไปถึงช่องนี้แล้วจึงใช้ตำแหน่งนี้ได้':lang==='ja'?'入口からの経路は未確認。このタイルに到達した場合の使用地点です。':'The walking route from the entrance remains unconfirmed; use this location if you reach the tile.'}</p>`:''}${Object.entries(item.gatheredBaitByArea).map(([stage,id])=>{const bait=allItems.find(i=>i.category==='bait'&&i.id===id);return `<p>${lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area'} ${stage} · <a data-gathered-bait href="${esc(areaItemLink(bait,stage))}">${esc(imageName(bait))} (${id}) ↗</a></p>`;}).join('')}</section>`;
  }
  function baitGatherChoice(item){
    if(!item.netGatherArea)return '';
    const note=lang==='th'?`ถ้ามีตาข่ายสีทองอยู่แล้ว หาเหยื่อนี้ได้ในด่าน ${item.netGatherArea}: ยืนในน้ำตื้น ใช้ตาข่าย แล้วขยับช่องก่อนใช้ซ้ำ แทนการซื้อเหยื่อเพิ่ม` :lang==='ja'?`金アミを持っているならエリア${item.netGatherArea}の浅瀬でこのエサを採れます。浅瀬に立って使い、次は別のタイルへ移動してください。追加購入の代わりになります。`:`If you already own the gold net, gather this bait in area ${item.netGatherArea} instead of buying more: stand in shallow water, use the net, then move to a new tile before using it again.`;
    const label=lang==='th'?'ดูวิธีใช้ตาข่ายและจำนวนที่เก็บได้':lang==='ja'?'金アミの使い方と採れる個数を見る':'See net use and gathering amounts';
    return `<aside class="detail-section bait-gather-choice" data-bait-gather-choice><p>${esc(note)}</p><a href="${esc(areaItemLink({category:'general_tool',id:'04'},item.netGatherArea,item.netGatherArea===1?'#use-locations':''))}">${label} ↗</a></aside>`;
  }
  function daikonFishChoice(item,fishLocations){
    if(!item.exchangeFishId)return '';
    const fishLabel=item.exchangeFishId==='22'?(lang==='th'?'ฮาริโยะ':lang==='ja'?'ハリヨ':'Hariyo'):(lang==='th'?'ปลายามาโนะคามิ':lang==='ja'?'ヤマノカミ':'Yamanokami');
    const label=lang==='th'?'ดู'+fishLabel+': จุดตกและเหยื่อ':lang==='ja'?fishLabel+'の場所・エサを確認':'See '+fishLabel+' locations and bait';
    const href=fishProfileLink(item.exchangeFishId,fishLocations);
    return `<aside class="detail-section daikon-fish-choice" ${item.tubExchange?'data-tub-choice':'data-daikon-choice'}><a class="route-button" href="${esc(href)}">${esc(label)} ↗</a></aside>`;
  }
  function keepnetAlternatives(item,items){
    if(!item.keepnetCapacity)return '';
    const quest=items.find(candidate=>candidate.category==='food'&&candidate.id==='07');
    const questLabel=lang==='th'?'จะเก็บยามาโนะคามิแลกหัวไชเท้า? อ่านผลต่ออาหารก่อน':lang==='ja'?'ヤマノカミを大根交換用に残す？ 食料への影響を先に確認':'Keeping Yamanokami for Daikon? Read the food-inventory effect first';
    const questLink=quest?`<p><a href="${esc(detailItemLink(quest))}">${esc(questLabel)} ↗</a></p>`:'';
    const title=lang==='th'?'เทียบข้องขนาดอื่น':lang==='ja'?'他のびくと比較':'Compare keepnet sizes';
    return `<aside class="detail-section keepnet-alternatives" data-keepnet-choice><h3>${esc(title)}</h3>${items.filter(candidate=>candidate.keepnetCapacity&&candidate.id!==item.id).map(candidate=>`<p><a href="${esc(detailItemLink(candidate))}">${esc(imageName(candidate))} · ${candidate.keepnetCapacity} ${lang==='th'?'ตัว':lang==='ja'?'匹':'fish'} · ¥${candidate.priceYen} ↗</a></p>`).join('')}${questLink}</aside>`;
  }
  function baitLurePriceChoices(item,items){
    const rows=Object.entries(item.baitLureDecision?.cheaperByStage||{});
    if(!rows.length)return '';
    const groups=new Map();
    for(const [stage,refs] of rows){const key=JSON.stringify(refs);if(!groups.has(key))groups.set(key,{stages:[],refs});groups.get(key).stages.push(stage);}
    const title=lang==='th'?'ถ้าซื้อใหม่: ตัวเลือกถูกกว่าแยกตามด่าน':lang==='ja'?'新規購入：エリア別の安い候補':'Buying new: cheaper choices by area';
    return `<aside class="detail-section" data-bait-lure-prices><h3>${title}</h3>${[...groups.values()].map(group=>`<p><strong>${esc(copy.area(group.stages.join(' / ')))}</strong> · ${group.refs.map(ref=>{const other=items.find(i=>i.category===ref.category&&i.id===ref.id);return other?`<a href="${esc(detailItemLink(other))}">${esc(imageName(other))} (${esc(other.id)}) · ¥${esc(ref.priceYen)} ↗</a>`:'';}).join(' / ')}</p>`).join('')}</aside>`;
  }
  function mushroomAlternative(item){
    if(item.category!=='food'||!['09','0A'].includes(item.id))return '';
    return `<p><a class="route-button" data-mushroom-alternative href="item${lang==='en'?'':'.'+lang}.html?category=food&id=01&return=${encodeURIComponent(currentLocalRoute())}">${lang==='th'?'ดูส้ม: ฟื้น 5 HP ราคา ¥5 พร้อมร้านที่ขาย':lang==='ja'?'みかんを見る：5HP回復・5円、販売場所付き':'See oranges: restore 5 HP for ¥5, with shops'} ↗</a></p>`;
  }
  function acquisitionChoice(item){
    const entries=item.acquisitionOptions||[];
    if(!entries.length)return '';
    const title=item.playerUse?.shops?.length?(lang==='th'?'รับจากหีบก่อนซื้อซ้ำ':lang==='ja'?'重複購入の前に宝箱から入手':'Check the chest before buying another copy'):(lang==='th'?'รับไอเท็มนี้จากหีบ':lang==='ja'?'この道具を宝箱から入手':'Get this item from a chest');
    const open=lang==='th'?'ดูจุดรับของและทางเข้าเมือง':lang==='ja'?'入手地点と町の入口を見る':'See the reward location and town entrance';
    return `<aside class="detail-section acquisition-choice" data-acquisition-choice><h2>${title}</h2>${entries.map(loc=>`<p><strong>${lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area'} ${loc.stage}</strong> · ${esc(local(loc.name))}</p><p>${esc(local(loc.action))}</p>`).join('')}<a class="route-button" href="#use-locations">${open} ↓</a></aside>`;
  }
  function render(item, allItems, fishVisuals, fishLocations, decisions) {
    setNavigation();
    const name=imageName(item), categoryText=categoryLabel(item), usage=visibleUsage(item), summary=usage.summary||local(item.playerUse?.summary)||'';
    const facts=usage.facts||[];
    const japanese=item.nameJa&&lang!=='ja'?`<p class="muted" lang="ja">${esc(item.nameJa)}</p>`:'';
    const image=`<a class="detail-portrait-link" href="${esc(item.frame||item.image)}" target="_blank" rel="noopener" aria-label="${esc(copy.openFrame)}"><img class="detail-portrait" src="${esc(item.image)}" alt="${esc(name)}" fetchpriority="high"></a>`;
    const targetFish=selectedFish?fishVisuals[selectedFish]:null;
    const baitRoutes=item.playerUse?.fishIdsByRoute||{};
    const activeBaitRoute=item.category==='bait'&&selectedFish&&selectedRoute&&Object.hasOwn(baitRoutes,selectedRoute)?selectedRoute:null;
    const baitAccepted=activeBaitRoute&&(baitRoutes[activeBaitRoute]||[]).includes(selectedFish);
    const otherBaitRoute=activeBaitRoute==='float'?'sinker':'float';
    const switchBaitRoute=activeBaitRoute&&!baitAccepted&&(baitRoutes[otherBaitRoute]||[]).includes(selectedFish);
    const routeQuery=new URLSearchParams(location.search);routeQuery.set('route',otherBaitRoute);
    const baitTargetAction=activeBaitRoute?`<section class="detail-section bait-target-action" data-bait-target-action="${baitAccepted?'accepted':'rejected'}"><h2>${esc(activeBaitRoute==='float'?copy.routeFloat:copy.routeSinker)} · ${esc(fishName(selectedFish,fishVisuals))}</h2><p>${esc(baitAccepted?(lang==='th'?'เหยื่อนี้ผ่านเงื่อนไขของปลาที่เลือกด้วยชุดนี้ ถ้ามีอยู่แล้วใช้ต่อได้':lang==='ja'?'この仕掛けでは選択した魚のエサ判定を通る。持っているならそのまま使える。':'This bait passes the selected fish’s check with this rig. Keep using it if you have it.'):(lang==='th'?'เหยื่อนี้ไม่ผ่านเงื่อนไขของปลาที่เลือกด้วยชุดนี้ อย่าซื้อเพื่อใช้กับชุดนี้':lang==='ja'?'この仕掛けでは選択した魚のエサ判定を通らない。この目的で購入しない。':'This bait does not pass the selected fish’s check with this rig. Do not buy it for this setup.'))}</p>${switchBaitRoute?`<a class="route-button" data-switch-bait-route href="${esc(localePage[lang]+'?'+routeQuery)}">${esc(lang==='th'?'เหยื่อเดิมใช้กับปลานี้ได้เมื่อเปลี่ยนเป็น'+(otherBaitRoute==='float'?'ชุดทุ่น':'ชุดตะกั่ว'):lang==='ja'?'同じエサを使うなら'+(otherBaitRoute==='float'?'ウキ':'オモリ')+'仕掛けへ':'Use this bait by switching to the '+(otherBaitRoute==='float'?'float':'sinker')+' rig')} ↗</a>`:''}${!baitAccepted?` <a class="route-button" href="${esc(fishProfileLink(selectedFish,fishLocations))}">${esc(copy.fishProfile)}</a>`:''}</section>`:'';
    const targetContext=selectedFish?`<aside class="detail-section play-target"><strong>${esc(copy.target)} · ${esc(fishName(selectedFish,fishVisuals))} (${esc(selectedFish)})</strong>${targetFish?.image?`<a href="${esc(fishProfileLink(selectedFish,fishLocations))}" aria-label="${esc(copy.fishProfile)}"><img class="detail-target-fish" src="${esc(targetFish.image)}" alt="${esc(fishName(selectedFish,fishVisuals))}"></a>`:''}<p><a class="route-button" href="${esc(fishProfileLink(selectedFish,fishLocations))}">${esc(copy.fishProfile)}</a>${(fishLocations[selectedFish]?.locations||[]).length?` <a class="route-button" href="${esc(mapLink(selectedStage&&fishLocations[selectedFish].locations.some(loc=>Number(loc.stage)===selectedStage)?selectedStage:fishLocations[selectedFish].locations[0].stage,selectedFish))}">${esc(copy.mapFish)}</a>`:''}</p></aside>`:'';
    const imageNote=item[`imageNote${lang==='th'?'Th':lang==='ja'?'Ja':'En'}`]||'';
    const identity=`<div class="detail-identity"><p class="detail-kicker">${esc(categoryText)} · ${esc(copy.itemId)} ${esc(item.id)}</p><h1>${esc(name)}</h1>${japanese}<p class="muted">${esc(copy.category)}: ${esc(categoryText)}</p></div>`;
    const factsHtml=facts.length?`<ul>${facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:'';
    const rodAdvice=item.rodDecision||item.gearDecision||item.baitLureDecision;
    const isRod=item.category==='rod';
    const adviceTitle=lang==='th'?'ควรเลือกคันนี้เมื่อไร?':lang==='ja'?'この竿を選ぶときは？':'When should I choose this rod?';
    const alternatives=rodAdvice?.alternatives?.map(ref=>allItems.find(candidate=>candidate.category===ref.category&&candidate.id===ref.id)).filter(Boolean)||[];
    const compareLinks=alternatives.length?`<div class="detail-grid rod-alternatives">${alternatives.map(other=>componentLink(other)).join('')}</div>`:'';
    const actionSection=`<section class="detail-section ${rodAdvice?'buying-decision rod-decision':''}" ${rodAdvice?(isRod?'data-rod-decision':item.baitLureDecision?'data-bait-lure-decision':'data-gear-decision')+'="'+esc(item.id)+'"':''}><h2>${esc(rodAdvice?(isRod?adviceTitle:(lang==='th'?'ควรซื้อหรือใช้ชิ้นนี้เมื่อไร?':lang==='ja'?'この道具を買う・使うときは？':'When should I buy or use this?')):copy.use)}</h2>${rodAdvice?`<p class="rod-verdict">${esc(local(rodAdvice.label))}</p>`:''}<p>${esc(summary||copy.noFish)}</p>${factsHtml?`<h3>${esc(rodAdvice?(lang==='th'?'เหตุผลที่เลือกหรือใช้ต่อ':lang==='ja'?'選ぶ・使い続ける理由':'Why choose or keep it'):copy.details)}</h3>${factsHtml}`:''}${compareLinks}${gearNextActions(item,fishVisuals,fishLocations,allItems)}${flyMakerLink(item)}${imageNote?`<p class="muted">${esc(imageNote)}</p>`:''}</section>`;
    const categoryHref=currentCategoryLink();
    const intro=`<nav class="detail-breadcrumb"><a href="${esc(categoryHref)}">${esc(copy.allItems)} · ${esc(categoryText)}</a></nav>`;
    const moreLink=`<p class="detail-back-to-list"><a class="route-button" href="${esc(categoryHref)}">${esc(copy.allItems)} · ${esc(categoryText)} ↗</a></p>`;
    $('detail-root').innerHTML=`${intro}<section class="detail-hero">${image}${identity}</section>${targetContext}${baitTargetAction}${actionSection}${baitLurePriceChoices(item,allItems)}${compassUseChoice(item)}${gatheredBaitChoices(item,allItems)}${baitGatherChoice(item)}${mushroomAlternative(item)}${keepnetAlternatives(item,allItems)}${daikonFishChoice(item,fishLocations)}${acquisitionChoice(item)}${rodAdvice?'':buyingDecision(item,allItems,decisions)}${shopSection(item,allItems,fishLocations)}${useLocationSection(item,fishLocations,allItems)}${fishSection(item,fishVisuals,fishLocations)}${moreLink}${technicalSection(item)}<p class="muted">${esc(copy.sourced)}</p>`;
    if(location.hash.startsWith('#compass-exit-'))document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'});
    if(location.hash==='#use-locations')document.getElementById('use-locations')?.scrollIntoView({block:'start'});
    document.title=`${name} · ${categoryText} · ${lang==='th'?'ตกปลาทาโร่ 2':lang==='ja'?'川のぬし釣り2':'Kawa no Nushi Tsuri 2'}`;
  }
  function emptyState() {
    setNavigation();
    $('detail-root').innerHTML=`<section class="empty-state"><h1>${esc(copy.invalidTitle)}</h1><p>${esc(copy.invalidBody)}</p><a class="route-button" href="${esc(fallbackBack())}">${esc(copy.allItems)} ↗</a></section>`;
  }
  fetch('gallery-data.json?v=player-usefulness-20261004-18').then(response=>{if(!response.ok)throw new Error('catalogue data unavailable');return response.json();}).then(data=>{
    if(selectedFish&&!data.fishVisuals?.[selectedFish])selectedFish='';
    const item=(data.items||[]).find(candidate=>candidate.category===category&&candidate.id===requestedId)||null;
    if(!item){emptyState();return;}
    render(item,data.items||[],data.fishVisuals||{},data.fishLocations||{},data.playerDecisions?.sections||[]);
  }).catch(()=>emptyState());
})();
