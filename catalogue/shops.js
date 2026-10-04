(() => {
  'use strict';

  const lang = ['th', 'ja'].includes(document.documentElement.dataset.locale)
    ? document.documentElement.dataset.locale : 'en';
  const pages = {
    shops: {en:'shops.html', th:'shops.th.html', ja:'shops.ja.html'},
    item: {en:'item.html', th:'item.th.html', ja:'item.ja.html'},
    fish: {en:'fish.html', th:'fish.th.html', ja:'fish.ja.html'},
    maps: {en:'maps.html', th:'maps.th.html', ja:'maps.ja.html'},
    index: {en:'index.html', th:'index.th.html', ja:'index.ja.html'}
  };
  const text = {
    en: {
      stockLoaded:'Shop stock decoded from the original ROM is ready.',
      stockOnly:'The stock list is ready. Exact shop and entrance map positions are not available in this data yet.',
      loadFailed:'Shop stock could not be loaded. Reload the page or open the item catalogue.',
      area:n=>`Fishing area ${n}`,
      outdoor:n=>`Area ${n} · town entrances`,
      town:n=>`Area ${n} · seller positions`,
      townSummary:n=>`Fishing area ${n} · paired town interior`,
      mapSetEvidence:(place,n)=>`${place==='outdoor'?'Outdoor field':'Town interior'} · map set ${n}`,
      fieldHeading:'Which town entrance?', townHeading:'Which shop / entrance?',
      focusedEntrance:n=>`Showing only entrance ${n+1}, linked to this shop.`,
      mapUnavailable:'No ROM-rendered terrain image is available for this map set.',
      invalidPoints:'Some decoded positions fall outside the valid map bounds. Those markers are hidden instead of guessed.',
      noValidPoint:'No valid map position is available for this area. No location is guessed.',
      fullMap:'Open the full terrain image ↗',
      noLocations:'Stock is confirmed for this area, but the exact shop position and entrances are not present in the available location data.',
      mapNoEntrances:'No field-to-town entrances are recorded for this area in the available location data.',
      entrance:n=>`Entrance ${n+1}`,
      outside:'Field entrance', arrival:'Town arrival',
      regular:'Regular equipment shop', special:'Special rod seller', unclassified:'Other interaction (not identified as a shop)',
      shopPoint:'Seller location', coord:(x,y)=>`Tile X ${x}, Y ${y}`,
      pairNote:'The two points are a verified field entrance and its paired town arrival. No walking route inside the town is implied.',
      endpointNote:'The ROM identifies this shop interaction point. The walking route from an entrance has not been verified.',
      linkedEntrance:(n,arrival)=>`Enter through entrance ${n+1} (arrival at ${arrival.x}, ${arrival.y}). An original-ROM probe opened this seller from that arrival point; the route from other outdoor positions is not verified.`,
      openEntrance:'Show this entrance on the field map ↗', viewOffers:'See what this shop sells ↓', testedInputs:'Tested controller inputs',
      openTownArrival:'Show paired town arrival ↗',
      regularNote:'This interaction opens the regular item category and purchase menu.',
      specialNote:'This interaction opens a fixed selection of special rods.',
      filtered:n=>`${n} matching offer${n===1?'':'s'}`,
      targetFound:'This item is sold in the selected area.',
      targetNotHere:'This item is not listed for sale in the selected area.',
      soldElsewhere:'Recorded sale areas:',
      soldConditional:'This offer is conditional. Follow the unlock steps on the card before looking for it in the shop.',
      none:'No offers match these filters.',
      noCategory:'No matching items are listed for this area and item type.',
      noTarget:'This ID is not in the item catalogue.',
      browseArea:n=>`Show Area ${n}`,
      categoryAll:'All item types',
      types:{rod:'Fishing rods',lure:'Lures',hook:'Hooks',float_weight:'Floats and sinkers',bait:'Bait',fly:'Ready-made flies',fly_wing:'Fly wings in ready-made bundles',fly_tail:'Fly tails in ready-made bundles',food:'Food',general_tool:'Tools and quest items'},
      targetBadge:'Selected item', component:'Open item details', bundle:'Ready-made fly bundle', complete:'Complete bundle price', parts:'Parts in this set', included:'Included in this ready-made bundle',
      conditionTitle:'How to unlock this offer', ayu:'Sell at least one Ayu from your keepnet first. The decoy-Ayu offer then appears in the Area 3 shop. Buying it fills the stack to 9 and subtracts 9 from the sold-Ayu counter (down to 0). If it disappears again, sell more Ayu before trying again.', ayuFish:'Find Ayu fishing spots ↗',
      noPrice:'No separate price confirmed', price:n=>`¥${n}`,
      returnItem:'← Back to the page that opened this shop', returnCatalogue:'← Item catalogue',
      technical:'ROM evidence', evidenceStock:'The offers below come from the decoded six-area ROM stock arrays. A basic item price alone is not treated as proof that a shop sells it.', evidenceBundles:'Fly body, wing and tail entries are decoded as a single ready-made bundle. The listed price is the total bundle quote; parts are not separate offers here.', evidenceLocations:'Map pins mark decoded field-to-town transitions and shop interaction points. An interaction point does not establish a walking route.', source:'Source record', entranceOrdinal:'Entrance index', kind:'Verified role', mode:'Raw interaction mode', slot:'ROM slot',
      stageWord:n=>`Area ${n}`, warningLocations:'Shop stock is available, but map positions could not be loaded. The page does not guess where to walk.', language:'Language'
    },
    th: {
      stockLoaded:'โหลดรายการขายที่แกะจาก ROM ต้นฉบับแล้ว',
      stockOnly:'โหลดรายการขายแล้ว แต่ข้อมูลที่มีตอนนี้ยังไม่มีตำแหน่งร้านและทางเข้าแบบยืนยันจากแผนที่',
      loadFailed:'โหลดรายการร้านไม่ได้ ลองโหลดหน้าใหม่หรือเปิดคลังไอเท็ม',
      area:n=>`พื้นที่ตกปลา ${n}`,
      outdoor:n=>`พื้นที่ ${n} · ทางเข้าเมือง`,
      town:n=>`พื้นที่ ${n} · ตำแหน่งร้าน`,
      townSummary:n=>`พื้นที่ตกปลา ${n} · เมืองที่คู่กัน`,
      mapSetEvidence:(place,n)=>`${place==='outdoor'?'แผนที่พื้นที่กลางแจ้ง':'แผนที่ภายในเมือง'} · ชุดแผนที่ ${n}`,
      fieldHeading:'ควรเข้าทางไหน?', townHeading:'ไปร้านไหน / เข้าทางไหน?',
      focusedEntrance:n=>`กำลังเน้นทางเข้า ${n+1} ซึ่งเชื่อมกับร้านที่เลือก`,
      mapUnavailable:'ไม่มีภาพภูมิประเทศที่สร้างจาก ROM สำหรับแผนที่ชุดนี้',
      invalidPoints:'พิกัดบางรายการอยู่นอกขอบเขตแผนที่ที่ใช้ได้ จึงซ่อนหมุดเหล่านั้นแทนการเดาตำแหน่ง',
      noValidPoint:'พื้นที่นี้ไม่มีพิกัดบนแผนที่ที่ใช้ได้ หน้านี้จะไม่เดาตำแหน่ง',
      fullMap:'เปิดภาพภูมิประเทศทั้งแผนที่ ↗',
      noLocations:'ยืนยันรายการขายของพื้นที่นี้ได้ แต่ข้อมูลตำแหน่งที่มีอยู่ยังไม่ระบุจุดร้านและทางเข้าแบบเจาะจง',
      mapNoEntrances:'ข้อมูลตำแหน่งที่มีอยู่ยังไม่บันทึกทางเข้าจากพื้นที่ไปเมืองนี้',
      entrance:n=>`ทางเข้า ${n+1}`,
      outside:'ทางเข้าจากพื้นที่กลางแจ้ง', arrival:'จุดมาถึงในเมือง',
      regular:'ร้านอุปกรณ์ตกปลาทั่วไป', special:'ร้านขายคันเบ็ดพิเศษ', unclassified:'จุดโต้ตอบอื่น (ยังยืนยันว่าเป็นร้านไม่ได้)',
      shopPoint:'ตำแหน่งร้าน/คนขาย', coord:(x,y)=>`ช่อง X ${x}, Y ${y}`,
      pairNote:'สองตำแหน่งนี้คือทางเข้ากลางแจ้งกับจุดมาถึงในเมืองที่ ROM ระบุว่าเป็นคู่กัน ไม่ได้แปลว่าตรวจเส้นทางเดินภายในเมืองแล้ว',
      endpointNote:'ROM ยืนยันจุดโต้ตอบของร้านนี้ แต่ยังไม่ได้ยืนยันเส้นทางเดินจากทางเข้า',
      linkedEntrance:(n,arrival)=>`เข้าเมืองทางเข้า ${n+1} (จุดมาถึงช่อง ${arrival.x}, ${arrival.y}) แล้วตามหมุดร้าน; การทดสอบบน ROM เปิดเมนูจากจุดมาถึงนี้ได้ แต่ยังไม่ยืนยันวิธีเดินมาถึงประตูจากทุกตำแหน่งกลางแจ้ง`,
      openEntrance:'ดูทางเข้านี้บนแผนที่ด่าน ↗', viewOffers:'ดูของที่ร้านนี้ขาย ↓', testedInputs:'ปุ่มที่ใช้ทดสอบ',
      openTownArrival:'ดูจุดมาถึงในเมืองที่คู่กัน ↗',
      regularNote:'จุดนี้เปิดเมนูเลือกหมวดและซื้อไอเท็มทั่วไป',
      specialNote:'จุดนี้เปิดรายการคันเบ็ดพิเศษที่กำหนดไว้',
      filtered:n=>`ตรงตัวกรอง ${n} รายการ`,
      targetFound:'มีรายการนี้ขายในพื้นที่ที่เลือก',
      targetNotHere:'ไม่มีรายการนี้ในสต็อกของพื้นที่ที่เลือก',
      soldElsewhere:'พื้นที่ที่มีข้อมูลว่าขาย:',
      soldConditional:'รายการนี้มีเงื่อนไขซื้อ ให้อ่านวิธีปลดล็อกบนการ์ดก่อนตามหาในร้าน',
      none:'ไม่พบรายการที่ตรงกับตัวกรองนี้',
      noCategory:'พื้นที่นี้ไม่มีไอเท็มประเภทที่ตรงกับตัวกรอง',
      noTarget:'ไม่พบ ID นี้ในคลังไอเท็ม',
      browseArea:n=>`ดูพื้นที่ ${n}`,
      categoryAll:'ทุกประเภท',
      types:{rod:'คันเบ็ด',lure:'ลัวร์',hook:'เบ็ด',float_weight:'ทุ่นและตะกั่ว',bait:'เหยื่อ',fly:'ฟลายสำเร็จรูป',fly_wing:'ปีกฟลายในชุดสำเร็จรูป',fly_tail:'หางฟลายในชุดสำเร็จรูป',food:'อาหาร',general_tool:'อุปกรณ์และไอเท็มเควสต์'},
      targetBadge:'ไอเท็มที่เลือก', component:'เปิดรายละเอียดไอเท็ม', bundle:'ชุดฟลายสำเร็จรูป', complete:'ราคาทั้งชุด', parts:'ชิ้นส่วนในชุดนี้', included:'ขายรวมอยู่ในชุดสำเร็จรูปนี้',
      conditionTitle:'วิธีปลดล็อกรายการนี้', ayu:'ขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อน แล้วเหยื่อล่อปลาอายุจะปรากฏในร้านพื้นที่ 3 เมื่อซื้อ จำนวนในช่องจะเต็มเป็น 9 ชิ้น และตัวนับปลาอายุที่ขายจะลดลง 9 (ต่ำสุด 0) ถ้ารายการหายไปอีก ให้ขายปลาอายุเพิ่มก่อนลองซื้อ', ayuFish:'ดูจุดตกปลาอายุ ↗',
      noPrice:'ยังไม่มีราคาขายแยกที่ยืนยันได้', price:n=>`${n} เยน`,
      returnItem:'← กลับหน้าที่เปิดร้านนี้', returnCatalogue:'← คลังไอเท็ม',
      technical:'หลักฐานจาก ROM', evidenceStock:'รายการด้านล่างมาจากอาร์เรย์สต็อกหกพื้นที่ที่แกะจาก ROM ช่องราคาพื้นฐานของไอเท็มเพียงอย่างเดียวไม่ถือเป็นหลักฐานว่าร้านขาย', evidenceBundles:'ข้อมูลบอดี้ ปีก และหางฟลายถูกแกะเป็นชุดสำเร็จรูปเดียว ราคาที่แสดงคือราคารวมทั้งชุด ไม่ได้แยกชิ้นส่วนเป็นรายการขาย', evidenceLocations:'หมุดแสดงจุดเปลี่ยนพื้นที่และจุดโต้ตอบร้านที่แกะจาก ROM ได้ จุดโต้ตอบร้านไม่ได้ยืนยันเส้นทางเดิน', source:'ระเบียนหลักฐาน', entranceOrdinal:'หมายเลขทางเข้า', kind:'ประเภทร้านที่ยืนยันได้', mode:'โหมดโต้ตอบดิบ', slot:'ช่องใน ROM',
      stageWord:n=>`พื้นที่ ${n}`, warningLocations:'โหลดรายการขายได้ แต่โหลดข้อมูลตำแหน่งบนแผนที่ไม่ได้ หน้านี้จะไม่เดาเส้นทางให้', language:'ภาษา'
    },
    ja: {
      stockLoaded:'オリジナルROMから解析した販売品を読み込みました。',
      stockOnly:'販売品は読み込めました。店や入口の正確な位置は、現在のデータでは確認できません。',
      loadFailed:'販売品を読み込めませんでした。再読み込みするか、アイテム一覧を開いてください。',
      area:n=>`釣りエリア${n}`,
      outdoor:n=>`エリア${n} · 町の入口`,
      town:n=>`エリア${n} · 店の位置`,
      townSummary:n=>`釣りエリア${n} · 対応する町の中`,
      mapSetEvidence:(place,n)=>`${place==='outdoor'?'屋外フィールド':'町の中'} · マップセット${n}`,
      fieldHeading:'どの入口から町へ？', townHeading:'どの店・入口へ？',
      focusedEntrance:n=>`この店に対応する入口${n+1}を表示しています。`,
      mapUnavailable:'このマップセットのROM地形画像はありません。',
      invalidPoints:'解析された座標の一部が有効なマップ範囲外のため、位置を推測せずマーカーを非表示にしました。',
      noValidPoint:'このエリアに有効なマップ座標がありません。位置は推測しません。',
      fullMap:'地形全体の画像を開く ↗',
      noLocations:'このエリアの販売品は確認できましたが、現在の位置データに店や入口の正確な位置はありません。',
      mapNoEntrances:'現在の位置データに、このエリアから町への入口は記録されていません。',
      entrance:n=>`入口${n+1}`,
      outside:'屋外の入口', arrival:'町側の到着地点',
      regular:'通常の釣り道具店', special:'特別な竿の販売所', unclassified:'その他の操作地点（店とは未確認）',
      shopPoint:'店の場所', coord:(x,y)=>`タイル X ${x}, Y ${y}`,
      pairNote:'この2地点はROMで対応関係を確認した屋外入口と町側の到着地点です。町の中の徒歩ルートを示すものではありません。',
      endpointNote:'ROMで店の操作地点を確認しました。入口からの徒歩ルートは未確認です。',
      linkedEntrance:(n,arrival)=>`入口${n+1}から町に入り（到着タイル ${arrival.x}, ${arrival.y}）、店のマーカーへ進みます。オリジナルROMのテストで、この到着地点から店のメニューが開くことを確認しました。屋外の他の場所から入口までの道順は確認していません。`,
      openEntrance:'この入口をフィールドマップで見る ↗', viewOffers:'この店の販売品を見る ↓', testedInputs:'テスト時のボタン入力',
      openTownArrival:'対応する町の到着地点を見る ↗',
      regularNote:'通常のアイテムカテゴリと購入メニューを開く地点です。',
      specialNote:'固定された特別な竿の一覧を開く地点です。',
      filtered:n=>`該当する販売品：${n}件`,
      targetFound:'選択したエリアで販売されています。',
      targetNotHere:'選択したエリアの販売品には含まれていません。',
      soldElsewhere:'販売記録のあるエリア：',
      soldConditional:'この品には購入条件があります。店を探す前にカードの解放手順を確認してください。',
      none:'条件に一致する販売品はありません。',
      noCategory:'このエリアに一致する種類のアイテムはありません。',
      noTarget:'このIDはアイテム一覧にありません。',
      browseArea:n=>`エリア${n}を見る`,
      categoryAll:'すべての種類',
      types:{rod:'釣り竿',lure:'ルアー',hook:'針',float_weight:'ウキ・オモリ',bait:'エサ',fly:'完成品の毛バリ',fly_wing:'完成品セットのウィング',fly_tail:'完成品セットのテール',food:'食料',general_tool:'道具・クエストアイテム'},
      targetBadge:'選択したアイテム', component:'アイテム詳細を開く', bundle:'完成品の毛バリセット', complete:'セット価格', parts:'セットの構成品', included:'この完成品セットに含まれます',
      conditionTitle:'購入条件を満たす方法', ayu:'まずびくからアユを1匹以上売ってください。おとりアユがエリア3の店に表示されます。購入すると所持数が9個になり、売却アユ数カウンターが9減ります（0未満にはなりません）。再び消えたら、追加でアユを売ってください。', ayuFish:'アユの釣り場を見る ↗',
      noPrice:'個別の販売価格は未確認', price:n=>`${n}円`,
      returnItem:'← 店を開いたページに戻る', returnCatalogue:'← アイテム一覧',
      technical:'ROMの根拠', evidenceStock:'以下の品は、ROMから解析した6エリア分の販売在庫に基づきます。アイテムの基本価格欄だけでは店頭販売を確認したことにはなりません。', evidenceBundles:'毛バリのボディ・ウィング・テールは一つの完成品セットとして解析しています。表示価格はセット全体の見積額で、各部品を別商品として表示していません。', evidenceLocations:'マーカーはROMから解析したエリア間の移動地点と店の操作地点を示します。操作地点から徒歩ルートまでは分かりません。', source:'根拠レコード', entranceOrdinal:'入口番号', kind:'確認済みの店の役割', mode:'ROM操作モード', slot:'ROMスロット',
      stageWord:n=>`エリア${n}`, warningLocations:'販売品は読み込めましたが、地図上の位置を読み込めません。徒歩ルートは推測しません。', language:'言語'
    }
  }[lang];

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const params = new URLSearchParams(location.search);
  const baseDir = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
  const validCategory = value => /^[a-z_]+$/.test(value || '') ? value : '';
  const validId = value => /^(?:0x)?[0-9a-f]{1,2}$/i.test(value || '') ? Number.parseInt(String(value).replace(/^0x/i,''),16).toString(16).toUpperCase().padStart(2,'0') : '';
  const startStage = /^[1-6]$/.test(params.get('stage') || '') ? Number(params.get('stage')) : 1;
  const startPlace = ['area','outdoor'].includes(params.get('place')) ? 'outdoor' : 'town';
  const startCategory = validCategory(params.get('category'));
  const startId = validId(params.get('id'));
  const selectedFish = validId(params.get('fish'));
  const selectedRig = ['float','sinker'].includes(params.get('route')) ? params.get('route') : '';
  let targetCategory = startCategory;
  let targetId = startId;
  let focusedEntrance = /^(?:0|[1-4])$/.test(params.get('entrance')||'') ? Number(params.get('entrance')) : null;
  const allowedReturn = /^\/(?:[^/]+\/)?catalogue\/(?:index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/;
  function safeReturn(raw) {
    if (!raw) return '';
    try {
      const url = new URL(raw, location.href);
      return url.origin === location.origin && allowedReturn.test(url.pathname)
        ? `${url.pathname}${url.search}${url.hash}` : '';
    } catch { return ''; }
  }
  function localizeRoute(raw, locale) {
    const safe = safeReturn(raw);
    if (!safe) return '';
    const url = new URL(safe, location.origin);
    const match = url.pathname.match(/\/catalogue\/(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/);
    if (!match) return '';
    url.pathname = url.pathname.replace(/(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/, pages[match[1]][locale]);
    return `${url.pathname}${url.search}${url.hash}`;
  }
  let returnRoute = safeReturn(params.get('return'));
  const searchValue = params.get('q') || '';

  function stateParams(overrides = {}) {
    const state = {
      stage: String(Number($('stage-select')?.value || startStage)),
      place: (document.querySelector('input[name="place"]:checked')?.value || startPlace) === 'outdoor' ? 'area' : 'town',
      category: $('category-select')?.value || startCategory || 'all',
      id: targetCategory && targetId ? targetId : '',
      entrance: focusedEntrance===null?'':String(focusedEntrance),
      fish: selectedFish,
      route: selectedRig,
      q: $('item-search')?.value || '',
      return: returnRoute,
      ...overrides
    };
    const out = new URLSearchParams();
    for (const [key, value] of Object.entries(state)) if (value && !(key === 'category' && value === 'all')) out.set(key, value);
    return out;
  }
  function refreshUrl() {
    history.replaceState(null, '', `${location.pathname}?${stateParams().toString()}${location.hash}`);
  }
  function targetReturn() {
    return `${location.pathname}?${stateParams().toString()}${location.hash}`;
  }
  function itemHref(item) {
    const query = new URLSearchParams({category:item.category, id:item.id, return:targetReturn()});
    return `${pages.item[lang]}?${query}`;
  }
  function fishHref(id) {
    const query = new URLSearchParams({id, stage:'3', return:targetReturn()});
    return `${pages.fish[lang]}?${query}`;
  }
  function itemName(item) {
    if (lang === 'th') return item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id;
    if (lang === 'ja') return item.playerUse?.displayName?.ja || item.nameJa || item.nameEn || item.id;
    return item.playerUse?.displayName?.en || item.nameEn || item.nameJa || item.id;
  }
  function imagePath(name) {
    if (!name) return '';
    return String(name).startsWith('catalogue/') ? `../${name}` : name;
  }
  function catName(category) { return text.types[category] || category; }
  function mapAsset(path) {
    if (!path) return '';
    const value = String(path);
    if (value.startsWith('catalogue/')) return `../${value}`;
    if (value.startsWith('maps/')) return value;
    return `maps/${value}`;
  }

  function cropCanvas(canvas, imagePathValue, point, imageBounds) {
    const image = new Image();
    image.onload = () => {
      const tilePx = 16;
      const spanTiles = 16;
      const span = spanTiles * tilePx;
      canvas.width = span; canvas.height = span;
      const cx = point.x * tilePx + 8, cy = point.y * tilePx + 8;
      const maxX = Number(imageBounds?.width || image.width), maxY = Number(imageBounds?.height || image.height);
      let sx = Math.max(0, Math.min(maxX - span, Math.round(cx - span / 2)));
      let sy = Math.max(0, Math.min(maxY - span, Math.round(cy - span / 2)));
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, sx, sy, Math.min(span,maxX-sx), Math.min(span,maxY-sy), 0, 0, span, span);
      const px = Math.max(0, Math.min(span, cx - sx)), py = Math.max(0, Math.min(span, cy - sy));
      ctx.save();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(px,py,12,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle = '#d52610'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px,py,12,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle = '#d52610'; ctx.beginPath(); ctx.arc(px,py,5,0,Math.PI*2); ctx.fill();
      ctx.restore();
      canvas.dataset.ready = 'true';
    };
    image.onerror = () => { canvas.hidden = true; const note=canvas.nextElementSibling; if(note) note.textContent=text.mapUnavailable; };
    image.src = imagePathValue;
  }

  function mapCard({heading, role='', note='', image, coord, bounds, source, tech={}, extra=''}) {
    if (!coord) return '';
    const coordinate = text.coord(coord.x,coord.y);
    const evidence = source ? `<details class="technical-point"><summary>${esc(text.technical)}</summary><dl>${Object.entries(tech).filter(([,v])=>v!==undefined&&v!==null&&v!=='').map(([label,value])=>`<dt>${esc(label)}</dt><dd><code>${esc(value)}</code></dd>`).join('')}${source?`<dt>${esc(text.source)}</dt><dd>${esc(source)}</dd>`:''}</dl></details>` : '';
    return `<article class="location-card">
      <h3>${esc(heading)}</h3>${role?`<span class="shop-kind">${esc(role)}</span>`:''}
      <p class="coordinate">${esc(coordinate)}</p>
      ${image?`<a class="map-open" href="${esc(image)}" target="_blank" rel="noopener"><canvas class="map-crop" data-image="${esc(image)}" data-x="${Number(coord.x)}" data-y="${Number(coord.y)}" data-width="${Number(bounds?.width||bounds?.widthPx||0)}" data-height="${Number(bounds?.height||bounds?.heightPx||0)}" aria-label="${esc(heading)} at ${esc(coordinate)}"></canvas><span>${esc(text.fullMap)}</span></a>`:`<p class="empty-state">${esc(text.mapUnavailable)}</p>`}
      ${note?`<p class="seller-description">${esc(note)}</p>`:''}${extra}${evidence}
    </article>`;
  }
  function pointWithin(coord,bounds) {
    if (!coord || !Number.isFinite(Number(coord.x)) || !Number.isFinite(Number(coord.y))) return false;
    const x=Number(coord.x), y=Number(coord.y);
    const tileBounds=bounds?.displayBoundsTiles||bounds?.validTileBounds;
    const xs=Array.isArray(tileBounds?.x)?tileBounds.x:null;
    const ys=Array.isArray(tileBounds?.y)?tileBounds.y:null;
    const widthTiles=Number(bounds?.tileWidth||bounds?.descriptorTiles?.width||(bounds?.widthPx?bounds.widthPx/16:0));
    const heightTiles=Number(bounds?.tileHeight||bounds?.descriptorTiles?.height||(bounds?.heightPx?bounds.heightPx/16:0));
    const minX=xs?Number(xs[0]):0, maxX=xs?Number(xs[1]):widthTiles-1;
    const minY=ys?Number(ys[0]):0, maxY=ys?Number(ys[1]):heightTiles-1;
    return widthTiles>0&&heightTiles>0&&x>=minX&&x<=maxX&&y>=minY&&y<=maxY;
  }
  function drawMapCanvases() {
    document.querySelectorAll('canvas.map-crop[data-image]').forEach(canvas => {
      const width=Number(canvas.dataset.width), height=Number(canvas.dataset.height);
      cropCanvas(canvas,canvas.dataset.image,{x:Number(canvas.dataset.x),y:Number(canvas.dataset.y)},{width,height});
    });
  }

  function updateLanguageLinks() {
    for (const locale of ['en','th','ja']) {
      const link = $(`language-${locale}`);
      if (!link) continue;
      const query = stateParams();
      if (query.has('return')) query.set('return',localizeRoute(query.get('return'),locale) || query.get('return'));
      link.href = `${pages.shops[locale]}?${query.toString()}${location.hash}`;
      if (locale === lang) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    }
    const back = $('back-link');
    if (back) {
      back.href = returnRoute || pages.index[lang];
      back.textContent = returnRoute ? text.returnItem : text.returnCatalogue;
    }
  }

  function setQueryValue(key, value) {
    const next = stateParams();
    if (!value || (key === 'category' && value === 'all')) next.delete(key); else next.set(key, value);
    history.replaceState(null, '', `${location.pathname}?${next.toString()}${location.hash}`);
  }

  function renderLocations(locations, mapManifest, stage, place, items) {
    const area = locations?.areas?.find(a => Number(a.outdoorArea) === stage);
    const visuals = $('location-visuals');
    const mapId = $('location-map-id');
    const summary = $('location-summary');
    const mapSetId = place === 'outdoor' ? stage : stage + 6;
    const fieldMapSet = mapManifest?.mapSets?.[`mapSet${String(stage).padStart(2,'0')}`];
    $('location-area').textContent = place === 'outdoor' ? text.outdoor(stage) : text.town(stage);
    mapId.textContent = text.mapSetEvidence(place,mapSetId);
    $('location-heading').textContent = place === 'outdoor' ? text.fieldHeading : text.townHeading;
    visuals.innerHTML = '';
    if (!area) {
      summary.textContent = locations ? text.noLocations : text.warningLocations;
      visuals.innerHTML = `<p class="empty-state">${esc(locations ? text.mapNoEntrances : text.warningLocations)}</p>`;
      return;
    }
    const fieldMap = mapAsset(fieldMapSet?.fieldMap?.image || fieldMapSet?.fieldMap?.imageUrl);
    const townMap = mapAsset(area.townTerrain?.image);
    summary.textContent = place === 'outdoor'
      ? `${text.area(stage)}. ${fieldMapSet?.name?.[lang] || ''}`
      : `${text.townSummary(stage)}.`;
    let cards = [];
    const allEntrances = Array.isArray(area.entrances) ? area.entrances : [];
    let entrances = allEntrances.filter(entry=>pointWithin(entry.fieldTile,fieldMapSet?.fieldMap)&&pointWithin(entry.townArrival,area.townTerrain)&&(!entry.townArrival?.mapId||Number(entry.townArrival.mapId)===Number(area.townMapId)));
    if(focusedEntrance!==null) entrances=entrances.filter(entry=>Number(entry.ordinal)===focusedEntrance);
    const allInteractions = Array.isArray(area.interactions) ? area.interactions : [];
    const interactions = allInteractions.filter(node=>pointWithin(node.townTile,area.townTerrain));
    const excludedPoints=(allEntrances.length-entrances.length)+(allInteractions.length-interactions.length);
    if(excludedPoints) summary.textContent+=` ${text.invalidPoints}`;
    if(place==='outdoor'&&focusedEntrance!==null) summary.textContent+=` ${text.focusedEntrance(focusedEntrance)}`;
    if (place === 'outdoor') {
      cards = entrances.map(entry => {
        const n = Number(entry.ordinal ?? 0);
        const arrival = entry.townArrival;
        const pair = arrival ? `<p class="seller-description">${esc(text.arrival)} · ${esc(text.coord(arrival.x,arrival.y))}</p><a class="route-button" href="${esc(shopsUrl({place:'town',entrance:String(n)}))}">${esc(text.openTownArrival)}</a>` : '';
        return mapCard({heading:text.entrance(n),role:text.outside,note:text.pairNote,image:fieldMap,coord:entry.fieldTile,bounds:fieldMapSet?.fieldMap,source:entry.source?Object.values(entry.source).join(' · '):'',tech:{[text.entranceOrdinal]:n,[text.kind]:'field-to-town transition'},extra:pair});
      });
      if (!cards.length) visuals.innerHTML = `<p class="empty-state">${esc(excludedPoints?text.noValidPoint:text.mapNoEntrances)}</p>`;
    } else {
      const targetItem=targetCategory&&targetId?findItem(items,targetCategory,targetId):null;
      const targetSpecial=targetItem&&isSpecial(targetItem,stage);
      const relevantKind=targetItem?(targetSpecial?'special-rod-shop':'regular-shop'):'';
      const relevantNodes=interactions.filter(node=>['regular-shop','special-rod-shop'].includes(node.kind)&&(!relevantKind||node.kind===relevantKind));
      const accessFor=node=>(area.verifiedAccess||[]).find(access=>String(access.interactionSlotHex||'').toUpperCase()===String(node.interactionSlotHex||node.slotHex||'').toUpperCase());
      const linkedOrdinals=new Set(relevantNodes.map(node=>accessFor(node)?.entranceOrdinal).filter(value=>value!==undefined&&value!==null&&value!==''&&Number.isInteger(Number(value))).map(Number));
      const visibleEntrances=targetItem&&linkedOrdinals.size?entrances.filter(entry=>linkedOrdinals.has(Number(entry.ordinal))):entrances;
      const entranceCards = targetItem&&linkedOrdinals.size?[]:visibleEntrances.map(entry => {
        const n=Number(entry.ordinal??0);
        const fieldHref=shopsUrl({place:'area',entrance:String(n)});
        const action=`<a class="route-button" href="${esc(fieldHref)}">${esc(text.openEntrance)}</a>`;
        return mapCard({heading:`${text.entrance(n)} · ${text.arrival}`,role:'',note:text.pairNote,image:townMap,coord:entry.townArrival,bounds:area.townTerrain,source:entry.source?Object.values(entry.source).join(' · '):'',tech:{[text.entranceOrdinal]:n,[text.kind]:'paired field transition'},extra:action});
      });
      const shopCards = relevantNodes.map(node=>{
        const role=node.kind==='regular-shop'?text.regular:text.special;
        const detail=node.kind==='regular-shop'?text.regularNote:text.specialNote;
        const access=accessFor(node);
        const hasOrdinal=access?.entranceOrdinal!==undefined&&access?.entranceOrdinal!==null&&Number.isInteger(Number(access.entranceOrdinal));
        const linkedEntrance = hasOrdinal ? entrances.find(e=>Number(e.ordinal)===Number(access.entranceOrdinal)) : null;
        const note=linkedEntrance ? text.linkedEntrance(Number(linkedEntrance.ordinal),linkedEntrance.townArrival) : text.endpointNote;
        const heading = `${role} · ${text.shopPoint}`;
        const fieldHref=linkedEntrance?shopsUrl({place:'area',entrance:String(linkedEntrance.ordinal)}):'';
        const currentTargetIsBundle=targetItem&&['fly','fly_wing','fly_tail'].includes(targetItem.category);
        const stockAnchor=currentTargetIsBundle?'bundle-stock':node.kind==='special-rod-shop'?'special-stock':'regular-stock';
        const stockCategory=targetItem?targetItem.category:node.kind==='special-rod-shop'?'rod':'all';
        const stockQuery=shopsUrl({place:'town',category:stockCategory,id:targetItem?targetItem.id:'',q:''});
        const actions=`${linkedEntrance?`<a class="route-button" href="${esc(fieldHref)}">${esc(text.openEntrance)}</a>`:''}<a class="stock-jump" href="${esc(stockQuery+'#'+stockAnchor)}">${esc(text.viewOffers)}</a>`;
        const tested=access?.probe?.controls?.length?`${text.testedInputs}: ${access.probe.controls.join(' → ')}`:'';
        return mapCard({heading,role,note:`${detail} ${note}`,image:townMap,coord:node.townTile,bounds:area.townTerrain,source:node.source?.description||`${node.source?.pointerFileOffset||''} ${node.source?.pointerFileOffset?'→ ':''}${node.source?.coordinateFileOffset||''}`.trim(),tech:{[text.kind]:role,[text.entranceOrdinal]:access?.entranceOrdinal,[text.slot]:node.interactionSlotHex||node.slotHex,[text.mode]:node.mode,handler:node.handler,[text.testedInputs]:tested,result:access?.probe?.result},extra:actions});
      });
      cards = [...shopCards,...entranceCards];
      if (!cards.length) visuals.innerHTML = `<p class="empty-state">${esc(excludedPoints?text.noValidPoint:text.noLocations)}</p>`;
    }
    visuals.innerHTML = cards.join('') || visuals.innerHTML;
    drawMapCanvases();
  }

  function findItem(items, category, id) { return items.find(item => item.category === category && String(item.id).toUpperCase() === String(id).toUpperCase()); }
  function isSpecial(item, stage) { return (item.playerUse?.shops||[]).some(s=>Number(s.stage)===stage&&s.shop==='special_rod_shop'); }
  function itemTargetLink(category,id) {
    const item=findItem(window.__shopItems||[],category,id);
    if (!item) return '';
    return `<a href="${esc(itemHref(item))}">${esc(itemName(item))} · ID ${esc(item.id)} ↗</a>`;
  }
  function offerCard(item, options={}) {
    const offer=options.offer||{};
    const target=options.target===true;
    const special=options.special===true;
    const condition=item.category==='bait'&&item.id==='17'&&Number(options.stage)===3;
    const shopOffer=(item.playerUse?.shops||[]).find(s=>Number(s.stage)===Number(options.stage));
    const canHaveCondition=condition&&shopOffer?.condition;
    const image=imagePath(item.image);
    const name=itemName(item);
    const price=item.priceYen!=null?text.price(item.priceYen):text.noPrice;
    const extra=canHaveCondition?`<p class="condition"><strong>${esc(text.conditionTitle)}:</strong> ${esc(text.ayu)} <a href="${esc(fishHref('38'))}">${esc(text.ayuFish)}</a></p>`:'';
    return `<article class="offer-card${target?' is-target':''}" data-offer="${esc(item.category)}:${esc(item.id)}">
      ${target?`<span class="target-badge">${esc(text.targetBadge)}</span>`:''}${special?`<span class="shop-kind">${esc(text.special)}</span>`:''}
      <a class="offer-image-link" href="${esc(itemHref(item))}"><img loading="lazy" src="${esc(image)}" alt="${esc(name)}"></a>
      <p class="small-id">${esc(catName(item.category))} · ID ${esc(item.id)}</p>
      <h4><a href="${esc(itemHref(item))}">${esc(name)}</a></h4>
      <p class="price">${esc(price)}</p>${canHaveCondition?`<p class="condition-label">${esc(text.soldConditional)}</p>`:''}${extra}
    </article>`;
  }
  function bundleCard(bundle, stage, items, target) {
    const components=[['fly',bundle.body],['fly_wing',bundle.wing],['fly_tail',bundle.tail]].filter(([,id])=>id&&id!=='00').map(([category,id])=>findItem(items,category,id)).filter(Boolean);
    const selected=components.some(item=>target.category===item.category&&target.id===item.id);
    const parts=components.map(item=>`<a class="bundle-part" href="${esc(itemHref(item))}" title="${esc(itemName(item))}"><img loading="lazy" src="${esc(imagePath(item.image))}" alt="${esc(itemName(item))}"></a>`).join('<span class="bundle-plus" aria-hidden="true">+</span>');
    const labels=components.map(item=>`<span>${itemTargetLink(item.category,item.id)}</span>`).join('');
    return `<article class="offer-card${target.id&&selected?' is-target':''}" data-offer="fly-bundle:${bundle.slot}">
      ${selected?`<span class="target-badge">${esc(text.targetBadge)}</span>`:''}
      <span class="shop-kind">${esc(text.bundle)}</span><p class="small-id">${esc(text.stageWord(stage))} · ${esc(text.parts)}</p>
      <div class="bundle-parts">${parts}</div><div class="bundle-labels">${labels}</div>
      <p class="price">${esc(text.complete)} · ${esc(text.price(bundle.shopPriceYen))}</p>
    </article>`;
  }
  function filterItems(items, category, query) {
    const q=query.trim().normalize('NFKC').toLocaleLowerCase();
    const tokens=q.split(/\s+/).filter(Boolean).map(token=>token.replace(/^0x(?=[0-9a-f]{1,2}$)/i,''));
    return items.filter(item=>{
      if (category && category!=='all' && item.category!==category) return false;
      if (!tokens.length) return true;
      const haystack=[item.id,item.nameEn,item.nameJa,item.nameTh,item.playerUse?.displayName?.en,item.playerUse?.displayName?.ja,item.playerUse?.displayName?.th,item.categoryEn,item.categoryJa,item.categoryTh,item.search].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase();
      return tokens.every(token=>haystack.includes(token));
    });
  }
  function renderTarget(items, stock, stage) {
    const box=$('target-status');
    box.innerHTML='';
    if (!targetCategory || !targetId) return;
    const target=findItem(items,targetCategory,targetId);
    if (!target) { box.textContent=text.noTarget;return; }
    const isBundlePart=['fly','fly_wing','fly_tail'].includes(target.category);
    const locations=(target.playerUse?.shops||[]).filter(s=>Number(s.stage)>=1&&Number(s.stage)<=6);
    let stocked=stock.areas.find(a=>Number(a.stage)===stage)?.items.some(i=>i.category===target.category&&i.id===target.id) || false;
    let conditional=target.category==='bait'&&target.id==='17'&&stage===3;
    const partKey={fly:'body',fly_wing:'wing',fly_tail:'tail'}[target.category];
    const inBundle=b=>partKey&&String(b[partKey]||'').toUpperCase()===target.id;
    const currentArea=stock.areas.find(a=>Number(a.stage)===stage);
    const found=isBundlePart?(currentArea?.flyBundles||[]).some(inBundle):stocked;
    const recordedStages=new Set(isBundlePart?[]:stock.areas.filter(a=>a.items.some(i=>i.category===target.category&&i.id===target.id)).map(a=>Number(a.stage)));
    if(isBundlePart) for(const a of stock.areas) if((a.flyBundles||[]).some(inBundle)) recordedStages.add(Number(a.stage));
    const links=[...recordedStages].sort((a,b)=>a-b).map(n=>`<a class="stage-link" href="${esc(shopsUrl({stage:n,category:targetCategory,id:targetId}))}">${esc(text.browseArea(n))}</a>`).join(' ');
    box.innerHTML=`<strong>${esc(found?text.targetFound:text.targetNotHere)}</strong>${conditional?`<p>${esc(text.soldConditional)}</p>`:''}${!found&&links?`<p>${esc(text.soldElsewhere)} ${links}</p>`:''}`;
  }
  function shopsUrl(overrides={}) {
    const q=stateParams(overrides);
    return `${pages.shops[lang]}?${q.toString()}${location.hash}`;
  }
  function renderOffers(items, stock, stage, category, query) {
    const area=stock.areas.find(a=>Number(a.stage)===stage);
    const list=$('shop-results');
    const target={category:targetCategory,id:targetId};
    if (!area) { list.innerHTML=`<p class="empty-state">${esc(text.noCategory)}</p>`;return; }
    const stockItems=area.items.map(record=>findItem(items,record.category,record.id)).filter(Boolean);
    const bundledCategory=item=>['fly','fly_wing','fly_tail'].includes(item.category);
    const standard=stockItems.filter(item=>!isSpecial(item,stage)&&!bundledCategory(item));
    const rods=stockItems.filter(item=>isSpecial(item,stage)&&!bundledCategory(item));
    const bundles=area.flyBundles||[];
    const filtered=filterItems(standard,category,query);
    const filteredSpecial=filterItems(rods,category,query);
    const filteredBundles=bundles.filter(bundle=>{
      const components=[findItem(items,'fly',bundle.body),findItem(items,'fly_wing',bundle.wing),findItem(items,'fly_tail',bundle.tail)].filter(Boolean);
      const matchesCategory=!category||category==='all'||components.some(item=>item.category===category)||category==='fly';
      const q=query.trim().normalize('NFKC').toLocaleLowerCase();
      const matchesQuery=!q||q.split(/\s+/).every(token=>components.some(item=>[item.id,item.nameEn,item.nameJa,item.nameTh,item.playerUse?.displayName?.th,item.search].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase().includes(token)));
      return matchesCategory&&matchesQuery;
    });
    const offers=filtered.length+filteredSpecial.length+filteredBundles.length;
    $('offer-count').textContent=text.filtered(offers);
    renderTarget(items,stock,stage);
    const groups=[];
    if(filtered.length)groups.push(`<section class="seller-group" id="regular-stock"><h3>${esc(text.regular)}</h3><p class="seller-description">${esc(text.regularNote)}</p><div class="offer-grid">${filtered.map(item=>offerCard(item,{stage,target:target.category===item.category&&target.id===item.id})).join('')}</div></section>`);
    if(filteredBundles.length)groups.push(`<section class="seller-group" id="bundle-stock"><h3>${esc(text.bundle)}</h3><p class="seller-description">${esc(text.evidenceBundles)}</p><div class="offer-grid">${filteredBundles.map(bundle=>bundleCard(bundle,stage,items,target)).join('')}</div></section>`);
    if(filteredSpecial.length)groups.push(`<section class="seller-group" id="special-stock"><h3>${esc(text.special)}</h3><p class="seller-description">${esc(text.specialNote)}</p><div class="offer-grid">${filteredSpecial.map(item=>offerCard(item,{stage,special:true,target:target.category===item.category&&target.id===item.id})).join('')}</div></section>`);
    if(!offers)groups.push(`<div class="empty-state"><h3>${esc(text.none)}</h3><p>${esc(text.area(stage))}</p></div>`);
    list.innerHTML=groups.join('');
  }

  async function init() {
    const stageSelect=$('stage-select'), categorySelect=$('category-select'), search=$('item-search');
    stageSelect.value=String(startStage); categorySelect.value=startCategory||'all'; search.value=searchValue;
    document.querySelectorAll('input[name="place"]').forEach(input=>input.checked=input.value===startPlace);
    updateLanguageLinks();
    const loc=await Promise.allSettled([
      fetch('gallery-data.json').then(r=>{if(!r.ok)throw new Error('gallery');return r.json();}),
      fetch('../data/shop-stock-rom.json').then(r=>{if(!r.ok)throw new Error('stock');return r.json();}),
      fetch('maps/rom-map-manifest.json').then(r=>{if(!r.ok)throw new Error('maps');return r.json();}),
      fetch('../data/shop-locations-rom.json').then(r=>{if(!r.ok)throw new Error('locations');return r.json();})
    ]);
    const [galleryResult,stockResult,mapResult,locationResult]=loc;
    if(galleryResult.status!=='fulfilled'||stockResult.status!=='fulfilled') {
      $('page-status').textContent=text.loadFailed;
      $('shop-results').innerHTML=`<p class="empty-state">${esc(text.loadFailed)}</p>`;
      return;
    }
    const items=galleryResult.value.items||[]; window.__shopItems=items;
    const stock=stockResult.value;
    const mapManifest=mapResult.status==='fulfilled'?mapResult.value:null;
    const locations=locationResult.status==='fulfilled'?locationResult.value:null;
    $('page-status').textContent=locations?text.stockLoaded:text.stockOnly;
    const render=()=>{
      const stage=Number(stageSelect.value), place=document.querySelector('input[name="place"]:checked')?.value||'outdoor';
      const category=categorySelect.value, query=search.value;
      refreshUrl(); updateLanguageLinks();
      renderLocations(locations,mapManifest,stage,place,items);
      renderOffers(items,stock,stage,category,query);
    };
    stageSelect.addEventListener('change',()=>{focusedEntrance=null;render();});
    document.querySelectorAll('input[name="place"]').forEach(input=>input.addEventListener('change',render));
    categorySelect.addEventListener('change',()=>{if(categorySelect.value!==targetCategory){targetCategory='';targetId='';focusedEntrance=null;}setQueryValue('category',categorySelect.value);render();});
    search.addEventListener('input',()=>{setQueryValue('q',search.value);render();});
    $('clear-filters').addEventListener('click',()=>{
      categorySelect.value='all';search.value='';
      targetCategory='';targetId='';
      focusedEntrance=null;
      params.delete('category');params.delete('id');params.delete('q');
      history.replaceState(null,'',`${location.pathname}?${stateParams({category:'all',id:'',q:''}).toString()}${location.hash}`);
      render();
    });
    render();
  }
  init().catch(error=>{ console.error('Shop page data/render error:',error); $('page-status').textContent=text.loadFailed; $('shop-results').innerHTML=`<p class="empty-state">${esc(text.loadFailed)}</p>`; });
})();
