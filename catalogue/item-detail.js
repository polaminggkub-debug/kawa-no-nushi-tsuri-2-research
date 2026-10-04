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
      noShop:'No shop stock for this item is recorded in the current ROM data.', shopMap:'Browse fish on this area map ↗', mapNote:'This opens the area map. The exact shopkeeper position is not established here.',
      noShopMap:'The ROM data does not record a stage for this item’s use or sale.', fish:'Fish that pass this item’s recorded check', fishScope:'Passing this item check does not guarantee a bite or a landed fish.', routeFloat:'Float rig', routeSinker:'Sinker rig', fishProfile:'Open fish profile ↗', mapFish:'Open this fish on the map ↗', noFish:'No fish-specific compatibility list is established for this item.',
      target:'Your selected fish', targetYes:'This fish is in the item’s recorded compatible list.', targetNo:'This fish is not in this item’s recorded compatible list.', targetUnknown:'This item has no recorded fish compatibility list.',
      assembly:'Shop bundle parts', completePrice:'Complete set', component:'Open item details ↗', usedIn:'Recorded ready-made sets that include this part',
      useLocations:'Recorded use locations', area:n=>`Area ${n}`, noUse:'No separate use location is recorded for this item.',
      tech:'ROM and evidence details', source:'Research source', raw:'Raw record', offset:'File offset', bytes:'ROM record bytes', fields:'Decoded fields', itemPrice:'Price field in ROM', targets:'Special response conditions', evidenceNotes:'Technical notes', openFrame:'Open uncropped source image ↗',
      sourced:'Names and practical notes are based on the ROM research in this project.', routeReturn:'Back to the item page', stageWord:'area'
    },
    th: {
      allItems:'ดูรายการไอเท็มทั้งหมด', back:'← กลับหน้าที่เข้ามา', invalidTitle:'ไม่พบไอเท็ม', invalidBody:'ลิงก์นี้ไม่มีรหัสไอเท็มหรือรหัสไม่อยู่ในแค็ตตาล็อก',
      category:'หมวด', itemId:'รหัสไอเท็ม', use:'ไอเท็มนี้ใช้ทำอะไร', details:'วิธีใช้และข้อควรรู้', shop:'หาซื้อได้ที่ไหน', shopArea:n=>`ด่าน ${n}`, price:n=>`${n} เยน`,
      priceFromRom:'ช่องราคาใน ROM', stockAt:'มีข้อมูลร้านค้าในด่านนี้', bundleAt:n=>`ชุดฟลายสำเร็จรูปที่ร้านด่าน ${n}`,
      noShop:'ไม่พบข้อมูลว่ามีร้านขายไอเท็มชิ้นนี้ใน ROM ที่ตรวจ', shopMap:'เปิดแผนที่ด่านนี้เพื่อดูปลา ↗', mapNote:'ลิงก์นี้เปิดแผนที่ของด่าน ตำแหน่งร้านค้าในฉากยังไม่ได้ยืนยัน',
      noShopMap:'ข้อมูล ROM ยังไม่ระบุด่านที่ใช้หรือขายไอเท็มนี้', fish:'ปลาที่ผ่านเงื่อนไขของไอเท็มชิ้นนี้', fishScope:'การผ่านเงื่อนไขนี้ไม่ได้รับประกันว่าปลาจะกินเหยื่อหรือตกขึ้นมาได้', routeFloat:'ชุดทุ่น', routeSinker:'ชุดตะกั่ว', fishProfile:'เปิดหน้าข้อมูลปลานี้ ↗', mapFish:'เปิดแผนที่พร้อมเลือกปลานี้ ↗', noFish:'ยังไม่มีรายชื่อความเข้ากันได้กับปลาเฉพาะสำหรับไอเท็มนี้',
      target:'ปลาที่คุณเลือก', targetYes:'ปลานี้อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข', targetNo:'ปลานี้ไม่อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข', targetUnknown:'ไอเท็มนี้ไม่มีรายชื่อความเข้ากันได้กับปลาที่บันทึกไว้',
      assembly:'ชิ้นส่วนในชุดที่ร้านขาย', completePrice:'ราคาทั้งชุด', component:'เปิดรายละเอียดไอเท็ม ↗', usedIn:'ชุดสำเร็จรูปที่มีชิ้นส่วนนี้',
      useLocations:'ตำแหน่งใช้งานที่บันทึกไว้', area:n=>`ด่าน ${n}`, noUse:'ไม่มีการบันทึกตำแหน่งใช้งานแยกสำหรับไอเท็มนี้',
      tech:'รายละเอียด ROM และหลักฐาน', source:'เอกสารวิจัย', raw:'ข้อมูลดิบของรายการ', offset:'ตำแหน่งในไฟล์', bytes:'ไบต์ของรายการใน ROM', fields:'ฟิลด์ที่ถอดความหมายแล้ว', itemPrice:'ช่องราคาใน ROM', targets:'เงื่อนไขตอบสนองเฉพาะ', evidenceNotes:'บันทึกเชิงเทคนิค', openFrame:'เปิดภาพต้นฉบับเต็ม ↗',
      sourced:'ชื่อและวิธีใช้สรุปจากงานแกะ ROM ในโครงการนี้', routeReturn:'กลับหน้ารายละเอียดไอเท็ม', stageWord:'ด่าน'
    },
    ja: {
      allItems:'道具一覧を見る', back:'← 前のページへ戻る', invalidTitle:'道具が見つかりません', invalidBody:'道具IDがないか、カタログに登録されていません。',
      category:'カテゴリ', itemId:'道具ID', use:'この道具の使い方', details:'使い方と注意点', shop:'入手場所', shopArea:n=>`エリア${n}`, price:n=>`${n}円`,
      priceFromRom:'ROM内の価格欄', stockAt:'このエリアの店頭記録', bundleAt:n=>`エリア${n}の店売り毛バリセット`,
      noShop:'現在のROMデータでは、この道具の店頭在庫を確認できません。', shopMap:'このエリアの魚マップを見る ↗', mapNote:'エリアマップを開きます。店員の正確な位置は確認していません。',
      noShopMap:'ROMデータに使用・販売エリアの記録がありません。', fish:'この道具の判定を通る魚', fishScope:'この判定を通っても、食いつきや取り込みは保証されません。', routeFloat:'ウキ仕掛け', routeSinker:'オモリ仕掛け', fishProfile:'魚の詳細を開く ↗', mapFish:'この魚をマップで見る ↗', noFish:'この道具の魚別適合リストは確認されていません。',
      target:'選択中の魚', targetYes:'この魚は道具の適合リストに含まれています。', targetNo:'この魚は道具の適合リストに含まれていません。', targetUnknown:'この道具には魚別の適合リストがありません。',
      assembly:'店売りセットの構成品', completePrice:'セット価格', component:'道具の詳細を開く ↗', usedIn:'この部品を含む店売りセット',
      useLocations:'使用場所の記録', area:n=>`エリア${n}`, noUse:'この道具の個別の使用場所は記録されていません。',
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
  const selectedFish = normalizeId(params.get('fish'));
  const selectedStage = /^[1-6]$/.test(params.get('stage')||'') ? Number(params.get('stage')) : 0;
  const selectedRoute = ['float','sinker'].includes(params.get('route')) ? params.get('route') : '';
  const baseDir = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
  const routeFiles = {
    catalogue:/^\/(?:[^/]+\/)?catalogue\/(?:index(?:\.th|\.ja)?|maps(?:\.th|\.ja)?|fish(?:\.th|\.ja)?|item(?:\.th|\.ja)?)\.html$/,
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
    if (category) p.set('category',category);
    if (selectedFish) p.set('fish',selectedFish);
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
    if (['index','maps','fish','item'].includes(root)) {
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
      link.href = `${localePage[targetLang]}${next.size?`?${next}`:''}`;
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
  function currentCategoryLink() { const p=new URLSearchParams();p.set('category',category||'all');p.set('id',requestedId);const target=selectedFish;if(target)p.set('fish',target);if(selectedStage)p.set('stage',String(selectedStage));return `${cataloguePage[lang]}?${p}#catalogue`; }
  function detailItemLink(item, returnRoute=currentLocalRoute()) {
    const p=new URLSearchParams();p.set('category',item.category);p.set('id',item.id);
    if(selectedFish)p.set('fish',selectedFish);if(selectedStage)p.set('stage',String(selectedStage));
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
    const name=stageName(stage,fishLocations);
    return `<a class="route-button" href="${esc(mapLink(stage))}">${esc(label)} · ${esc(name)} ↗</a>`;
  }
  function componentLink(item, label='') {
    if(!item)return '';
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
      return `<article class="detail-section"><h3>${esc(stageName(stage,fishLocations))}</h3><p>${esc(seller)}${item.priceYen!=null?` · ${esc(copy.price(item.priceYen))}`:''}</p>${stageButton(stage,fishLocations)}</article>`;
    }).join('')}</div><p class="muted">${esc(copy.mapNote)}</p></section>`;
  }
  function visibleUsage(item) {
    const use=item.playerUse||{};
    if(item.category==='hook')return {summary:lang==='th'?'ถ้ามีเบ็ดใช้อยู่แล้ว อย่าเปลี่ยนเพียงเพราะชื่อเบ็ดตรงกับปลา เลือกเหยื่อที่ปลารับได้ก่อน ยังไม่มีหลักฐานว่าซื้อเบ็ดชื่อนี้แล้วจับง่ายขึ้น':lang==='ja'?'ハリを持っているなら、魚と同じ名前だけを理由に買い替えない。まず対応するエサを選ぶ。この名前のハリで取り込みやすくなる根拠はない。':'If you already have a hook, do not replace it solely because its name matches the fish. Choose compatible bait first; a matched name is not an established catch advantage.',facts:[]};
    if(item.category==='fly_wing')return {summary:lang==='th'?'ประกอบเองให้เริ่มจากปีกที่มีอยู่และตรวจราคาเสนอก่อนจ่าย ไม่ต้องซื้อปีกแพงเพื่อหวังโบนัสจับปลา เพราะยังไม่มีหลักฐานรองรับ':lang==='ja'?'作成するなら手持ちのウィングから始め、確定前に見積額を確認する。釣果ボーナスを期待して高価なウィングを買う根拠はない。':'For a custom fly, start with a wing you have and check the quote before paying. There is no established catch bonus that justifies buying an expensive wing.',facts:use.facts?.[lang]||[]};
    if(item.category==='fly_tail')return {summary:lang==='th'?'เลือกหางนี้ถ้าชอบรูปและยอมรับราคาเสนอ หรือเลือก “ไม่มี” ในเมนูประกอบที่มีตัวเลือกนั้น ยังไม่มีหลักฐานว่าหางนี้เพิ่มโอกาสจับปลา':lang==='ja'?'見た目と見積額で選ぶ。「無し」がある作成画面では省略できる。このテールの釣果ボーナスは確認していない。':'Choose this tail for its appearance and quoted price, or choose “None” where the maker offers it. A catch advantage from this tail is not established.',facts:[]};
    if(item.category==='float_weight') {
      let summary='';
      if(lang==='th') summary=item.id==='08'?'ตกฟลายไม่ต้องซื้อเครื่องหมายนี้เพื่อหวังโบนัส เกมใส่เครื่องหมายนี้ให้ตอนเตรียมฟลายอยู่แล้ว':Number.parseInt(item.id,16)<9?'ถ้ามีทุ่นใช้อยู่แล้ว ยังไม่จำเป็นต้องเปลี่ยนรุ่นเพื่อหวังให้ปลากัดมากขึ้น เลือกเหยื่อที่ตรงกับปลาเป็นอันดับแรก':'ใช้ตะกั่วเมื่อปลาที่เลือกอยู่ในรายชื่อด้านล่างและเหยื่อก็ใช้ได้ ถ้าต้องการรายชื่อปลาที่ผ่านเงื่อนไขกว้างกว่า ให้ดูชุดทุ่น';
      else if(lang==='ja') summary=item.id==='08'?'毛バリ準備時にゲームが自動でこの目印を設定する。ボーナスを期待した購入は不要。':Number.parseInt(item.id,16)<9?'ウキを持っているなら、食いつき率を期待してモデルを替える根拠はない。まず魚に合うエサを選ぶ。':'対象魚とエサの両方が合う時にオモリを使う。より広い対象一覧ならウキ仕掛けを確認する。';
      else summary=item.id==='08'?'Fly setup supplies this marker automatically; do not buy it for an expected fly bonus.':Number.parseInt(item.id,16)<9?'Keep your existing float unless you want a different indicator. Choose compatible bait first; a model swap has no established bite-rate bonus.':'Use a sinker when both its fish list and your bait include the target. Check float rigs for broader compatible-fish coverage.';
      return {summary,facts:[]};
    }
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
    const routeKeys=Object.keys(routes).filter(route=>Array.isArray(routes[route])&&routes[route].length);
    const ids=Array.isArray(use.fishIds)?[...new Set(use.fishIds.map(x=>String(x).toUpperCase().padStart(2,'0')))]:[];
    const supportedCategories=['lure','fly','bait','float_weight','general_tool'];
    const hasCompatibility=supportedCategories.includes(item.category)&&(ids.length>0||routeKeys.length>0);
    if(!hasCompatibility)return selectedFish?`<section class="detail-section"><h2>${esc(copy.fish)}</h2><p class="muted">${esc(copy.noFish)}</p></section>`:'';
    const routeGroup=(key,routeIds)=>`<div id="rig-${esc(key)}" class="detail-section" ${selectedRoute===key?'data-active="true"':''}><h3>${esc(key==='float'?copy.routeFloat:copy.routeSinker)} · ${new Set(routeIds).size}</h3><div class="detail-grid">${[...new Set(routeIds.map(x=>String(x).toUpperCase().padStart(2,'0')))].map(id=>fishTile(id,fishVisuals,fishLocations,selectedStage)).join('')}</div></div>`;
    const groups=routeKeys.length?routeKeys.map(key=>routeGroup(key,routes[key])).join(''):`<div class="detail-grid">${ids.map(id=>fishTile(id,fishVisuals,fishLocations,selectedStage)).join('')}</div>`;
    const targetStatus=selectedFish?(ids.includes(selectedFish)||routeKeys.some(k=>(routes[k]||[]).map(x=>String(x).toUpperCase().padStart(2,'0')).includes(selectedFish))?copy.targetYes:copy.targetNo):'';
    const fishTarget=selectedFish?`<p class="play-target"><strong>${esc(copy.target)} · ${esc(fishName(selectedFish,fishVisuals))} (${esc(selectedFish)})</strong><br>${esc(targetStatus)}</p>`:'';
    const scope=local(use.fishScope)||copy.fishScope;
    return `<section class="detail-section"><h2>${esc(copy.fish)} · ${ids.length||Object.values(routes).flat().length}</h2>${fishTarget}<p>${esc(scope)}</p>${groups}<p class="muted">${esc(copy.fishScope)}</p></section>`;
  }
  function technicalSection(item) {
    const use=item.playerUse||{}, sources=use.evidence?.sources||[];
    const decoded=item.decodedFields||{}, targets=use.targetMatches?(Array.isArray(use.targetMatches)?use.targetMatches:[use.targetMatches]):[];
    const noteArray=use.evidenceNotes?.[lang]||use.evidenceNotes?.en||[];
    const sourceLinks=sources.map(path=>`<li><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${encodeURI(path)}" target="_blank" rel="noopener">${esc(path)} ↗</a></li>`).join('');
    const techTargets=targets.length?`<h3>${esc(copy.targets)}</h3><ul>${targets.map(t=>`<li>${esc(t.nameTh&&lang==='th'?t.nameTh:t.nameJa||t.fishId)} · ID ${esc(t.fishId)} — ${esc(local(use.targetMatchScope))}</li>`).join('')}</ul>`:'';
    const renderedDecoded=Object.entries(decoded).map(([key,value])=>`<dt>${esc(key)}</dt><dd><code>${esc(typeof value==='object'?JSON.stringify(value):value)}</code></dd>`).join('');
    const rawFields=Object.entries(item.rawFields||{}).map(([key,value])=>`<dt>${esc(key)}</dt><dd><code>${esc(typeof value==='object'?JSON.stringify(value):value)}</code></dd>`).join('');
    const notes=noteArray.map(note=>`<li>${esc(note)}</li>`).join('');
    return `<details class="evidence"><summary>${esc(copy.tech)}</summary><div class="detail-content"><p><strong>${esc(copy.itemPrice)}:</strong> ${item.priceYen==null?'—':`¥${esc(item.priceYen)}`}</p><p><strong>${esc(copy.offset)}:</strong> <code>${esc(item.fileOffset||'—')}</code></p><p><strong>${esc(copy.bytes)}:</strong> <code>${esc(item.recordBytesHex||'—')}</code></p>${techTargets}${renderedDecoded?`<h3>${esc(copy.fields)}</h3><dl>${renderedDecoded}</dl>`:''}${rawFields?`<h3>${esc(copy.raw)}</h3><dl>${rawFields}</dl>`:''}${notes?`<h3>${esc(copy.evidenceNotes)}</h3><ul>${notes}</ul>`:''}${sources.length?`<h3>${esc(copy.source)}</h3><ul>${sourceLinks}</ul>`:''}<a href="${esc(item.frame||item.image)}" target="_blank" rel="noopener">${esc(copy.openFrame)}</a></div></details>`;
  }
  function useLocationSection(item, fishLocations) {
    const locations=item.playerUse?.useLocations||[];
    if(!locations.length)return '';
    return `<section class="detail-section"><h2>${esc(copy.useLocations)}</h2><div class="detail-grid">${locations.map(loc=>{const stage=Number(loc.stage)||0;return `<article class="detail-section"><h3>${esc(stage?stageName(stage,fishLocations):'')}</h3><p>${esc(local(loc.description)||local(loc.name)||'')}</p>${stage?stageButton(stage,fishLocations):''}</article>`;}).join('')}</div></section>`;
  }
  function render(item, allItems, fishVisuals, fishLocations) {
    setNavigation();
    const name=imageName(item), categoryText=categoryLabel(item), usage=visibleUsage(item), summary=usage.summary||local(item.playerUse?.summary)||'';
    const facts=usage.facts||[];
    const japanese=item.nameJa&&lang!=='ja'?`<p class="muted" lang="ja">${esc(item.nameJa)}</p>`:'';
    const image=`<a class="detail-portrait-link" href="${esc(item.frame||item.image)}" target="_blank" rel="noopener" aria-label="${esc(copy.openFrame)}"><img class="detail-portrait" src="${esc(item.image)}" alt="${esc(name)}" fetchpriority="high"></a>`;
    const targetFish=selectedFish?fishVisuals[selectedFish]:null;
    const targetContext=selectedFish?`<aside class="detail-section play-target"><strong>${esc(copy.target)} · ${esc(fishName(selectedFish,fishVisuals))} (${esc(selectedFish)})</strong>${targetFish?.image?`<a href="${esc(fishProfileLink(selectedFish,fishLocations))}" aria-label="${esc(copy.fishProfile)}"><img class="detail-target-fish" src="${esc(targetFish.image)}" alt="${esc(fishName(selectedFish,fishVisuals))}"></a>`:''}<p><a class="route-button" href="${esc(fishProfileLink(selectedFish,fishLocations))}">${esc(copy.fishProfile)}</a>${(fishLocations[selectedFish]?.locations||[]).length?` <a class="route-button" href="${esc(mapLink(selectedStage&&fishLocations[selectedFish].locations.some(loc=>Number(loc.stage)===selectedStage)?selectedStage:fishLocations[selectedFish].locations[0].stage,selectedFish))}">${esc(copy.mapFish)}</a>`:''}</p></aside>`:'';
    const imageNote=item[`imageNote${lang==='th'?'Th':lang==='ja'?'Ja':'En'}`]||'';
    const identity=`<div class="detail-identity"><p class="detail-kicker">${esc(categoryText)} · ${esc(copy.itemId)} ${esc(item.id)}</p><h1>${esc(name)}</h1>${japanese}<p class="muted">${esc(copy.category)}: ${esc(categoryText)}</p></div>`;
    const factsHtml=facts.length?`<ul>${facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:'';
    const actionSection=`<section class="detail-section"><h2>${esc(copy.use)}</h2><p>${esc(summary||copy.noFish)}</p>${factsHtml?`<h3>${esc(copy.details)}</h3>${factsHtml}`:''}${imageNote?`<p class="muted">${esc(imageNote)}</p>`:''}</section>`;
    const categoryHref=currentCategoryLink();
    const intro=`<nav class="detail-breadcrumb"><a href="${esc(categoryHref)}">${esc(copy.allItems)} · ${esc(categoryText)}</a></nav>`;
    const moreLink=`<p class="detail-back-to-list"><a class="route-button" href="${esc(categoryHref)}">${esc(copy.allItems)} · ${esc(categoryText)} ↗</a></p>`;
    $('detail-root').innerHTML=`${intro}<section class="detail-hero">${image}${identity}</section>${targetContext}${actionSection}${shopSection(item,allItems,fishLocations)}${useLocationSection(item,fishLocations)}${fishSection(item,fishVisuals,fishLocations)}${moreLink}${technicalSection(item)}<p class="muted">${esc(copy.sourced)}</p>`;
    if(selectedRoute&&item.category==='bait')document.getElementById(`rig-${selectedRoute}`)?.scrollIntoView({block:'center'});
    document.title=`${name} · ${categoryText} · ${lang==='th'?'ตกปลาทาโร่ 2':lang==='ja'?'川のぬし釣り2':'Kawa no Nushi Tsuri 2'}`;
  }
  function emptyState() {
    setNavigation();
    $('detail-root').innerHTML=`<section class="empty-state"><h1>${esc(copy.invalidTitle)}</h1><p>${esc(copy.invalidBody)}</p><a class="route-button" href="${esc(fallbackBack())}">${esc(copy.allItems)} ↗</a></section>`;
  }
  fetch('gallery-data.json').then(response=>{if(!response.ok)throw new Error('catalogue data unavailable');return response.json();}).then(data=>{
    const item=(data.items||[]).find(candidate=>candidate.category===category&&candidate.id===requestedId)||null;
    if(!item){emptyState();return;}
    render(item,data.items||[],data.fishVisuals||{},data.fishLocations||{});
  }).catch(()=>emptyState());
})();
