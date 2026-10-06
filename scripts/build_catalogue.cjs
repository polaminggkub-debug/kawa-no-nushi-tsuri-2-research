#!/usr/bin/env node
// Produce initial HTML with the same renderer used by the interactive catalogue.
// No browser or third-party packages are needed. Run after editing gallery data.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/gallery-data.json'), 'utf8'));
const waterIconsPath=path.join(root,'data/rom-water-icons.json');
if(fs.existsSync(waterIconsPath)){data.waterIcons=JSON.parse(fs.readFileSync(waterIconsPath,'utf8'));const images=JSON.parse(fs.readFileSync(path.join(root,'data/water-icon-images.json'),'utf8'));data.waterIcons.classes=Object.fromEntries(images.images.map(entry=>[entry.class,{image:entry.image}]));}
const notebookPath=path.join(root,'data/notebook-completion.json');
if(fs.existsSync(notebookPath))data.notebookCompletion=JSON.parse(fs.readFileSync(notebookPath,'utf8'));
const decisionsPath=path.join(root,'data/player-decisions.json');
if(fs.existsSync(decisionsPath))data.playerDecisions=JSON.parse(fs.readFileSync(decisionsPath,'utf8'));
const flyBackupsPath=path.join(root,'data/fly-backup-choices.json');
if(fs.existsSync(flyBackupsPath))data.flyBackupChoices=JSON.parse(fs.readFileSync(flyBackupsPath,'utf8'));
let source = fs.readFileSync(path.join(root, 'catalogue/gallery.js'), 'utf8');
const thaiCopyPath=path.join(root,'catalogue/thai-copy.json');
const thaiItemsPath=path.join(root,'catalogue/thai-items.json');
if(fs.existsSync(thaiCopyPath)&&fs.existsSync(thaiItemsPath)) {
  const thai=JSON.parse(fs.readFileSync(thaiCopyPath,'utf8'));
  const items=JSON.parse(fs.readFileSync(thaiItemsPath,'utf8'));
  for(const item of data.items)Object.assign(item,items[`${item.category}:${item.id}`]||{});
  data.researchNotes.th=thai.researchNotes;
  data.customizerFrames.forEach((frame,index)=>frame.captionTh=thai.customizerFrames[index]);
  data.sources.forEach((entry,index)=>{entry.titleTh=thai.sources[index]?.title||entry.titleEn;entry.detailTh=thai.sources[index]?.detail||entry.detailEn;});
  fs.writeFileSync(path.join(root,'catalogue/gallery-data.json'),JSON.stringify(data,null,2)+'\n');
  source=source.replace(/    \/\/ THAI_COPY_START[\s\S]*?    \/\/ THAI_COPY_END/,()=>`    // THAI_COPY_START\n    th: ${JSON.stringify(thai)},\n    // THAI_COPY_END`);
  fs.writeFileSync(path.join(root,'catalogue/gallery.js'),source);
}
require('./attach_fly_menu_positions.cjs')(root,data);
require('./attach_fly_other_families.cjs')(root,data);
require('./attach_fly_even_families.cjs')(root,data);
require('./attach_fly_maker_access.cjs')(root,data);
const flySteps=JSON.parse(fs.readFileSync(path.join(root,'data/fly-maker-player-steps.json'),'utf8'));
if(flySteps.romSha256!=='e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49')throw new Error('Fly steps use a different ROM');
data.customizerFrames=flySteps.frames;
data.flyMakerWingPalette=JSON.parse(fs.readFileSync(path.join(root,'data/fly-maker-wing-palette.json'),'utf8'));
if(data.flyMakerWingPalette.romSha256!==flySteps.romSha256)throw new Error('Wing palette uses a different ROM');
for(const item of data.items){delete item.nameTh;delete item.labelImageTh;}
for(const file of ['thai-rom-names.json','thai-other-captures.json']) {
  const namesPath=path.join(root,'data',file);
  if(!fs.existsSync(namesPath))continue;
  const names=JSON.parse(fs.readFileSync(namesPath,'utf8'));
  for(const item of data.items)Object.assign(item,names.entries?.[`${item.category}:${item.id}`]||{});
}
for(const item of data.items)if(item.labelImageTh)item.labelImageTh=item.labelImageTh.replace(/^\.\.\/catalogue\//,'');
const rodNamesPath=path.join(root,'data/thai-rod-transcriptions.json');
if(fs.existsSync(rodNamesPath)){const names=JSON.parse(fs.readFileSync(rodNamesPath,'utf8'));for(const item of data.items){const entry=names[`${item.category}:${item.id}`];if(entry){if(entry.nameTh)item.nameTh=entry.nameTh;item.labelImageTh=entry.evidenceImage.replace('../catalogue/','');}}fs.writeFileSync(path.join(root,'catalogue/gallery-data.json'),JSON.stringify(data,null,2)+'\n');}
// Transfer a verified transcription only between byte-identical rendered label PNGs.
const verifiedNamesByImage=new Map();
for(const file of ['thai-rod-transcriptions.json','thai-lure-transcriptions.json','thai-food-transcriptions.json']) {
  const filePath=path.join(root,'data',file);if(!fs.existsSync(filePath))continue;
  const entries=JSON.parse(fs.readFileSync(filePath,'utf8'));
  for(const entry of Object.values(entries)) {
    if(!entry.nameTh||!entry.evidenceImage)continue;
    const imagePath=path.resolve(root,'data',entry.evidenceImage);if(!fs.existsSync(imagePath))continue;
    verifiedNamesByImage.set(crypto.createHash('sha256').update(fs.readFileSync(imagePath)).digest('hex'),entry.nameTh);
  }
}
for(const item of data.items){if(!item.labelImageTh)continue;const imagePath=path.resolve(root,'catalogue',item.labelImageTh);if(fs.existsSync(imagePath)){const key=crypto.createHash('sha256').update(fs.readFileSync(imagePath)).digest('hex');if(verifiedNamesByImage.has(key))item.nameTh=verifiedNamesByImage.get(key);}}
// Player-facing names that differ from the raw extracted tables live in data/item-names.json.
const itemNames=JSON.parse(fs.readFileSync(path.join(root,'data/item-names.json'),'utf8')).items;
for(const item of data.items){
  const fix=itemNames[item.category+':'+item.id];if(!fix)continue;
  const old=[item.nameJa,item.nameEn];
  if(fix.nameEn)item.nameEn=fix.nameEn;
  if(fix.nameJa){item.nameJa=fix.nameJa;if(item.nameJapanese)item.nameJapanese=fix.nameJa;}
  if(fix.nameTh)item.nameTh=fix.nameTh;
  if(fix.imageNote){item.imageNoteEn=fix.imageNote.en;item.imageNoteJa=fix.imageNote.ja;item.imageNoteTh=fix.imageNote.th;}
  if(item.search&&(fix.nameEn||fix.nameJa)){
    item.search=item.search.split(old[0]).join(item.nameJa).split(old[1]).join(item.nameEn);
    if(!item.search.includes(item.nameEn))item.search=`${item.id} ${item.nameJa} ${item.nameEn} ${item.search}`;
  }
  const thai=fix.nameTh||fix.displayName?.th;
  if(thai&&item.search){
    item.search=item.search.replace(/[\u0E00-\u0E7F]+(?: [\u0E00-\u0E7F]+)*/g,'').replace(/ {2,}/g,' ').trim();
    item.search=item.search.replace(item.nameEn,item.nameEn+' '+thai);
  }
}
const fishFood=data.items.find(item=>item.category==='food'&&item.id==='08');if(fishFood&&fishFood.labelImageTh)fishFood.labelContextTh='ตัวอย่างชื่อปลาที่ถือ: เรนโบว์เทราต์ (รหัสชนิด06 ขนาดดิบ30) ชื่อนี้เปลี่ยนตามปลาที่ถือ ไม่ใช่ชื่ออาหารตายตัว';
fs.writeFileSync(path.join(root,'catalogue/gallery-data.json'),JSON.stringify(data,null,2)+'\n');
// Merge player-facing explanations and verified fish art into the delivered payload.
const usePath=path.join(root,'catalogue/item-use.json');
if(fs.existsSync(usePath)){const use=JSON.parse(fs.readFileSync(usePath,'utf8'));for(const item of data.items)item.playerUse=use.items?.[`${item.category}:${item.id}`]||{};}
// Apply the current bottle prerequisite without rebuilding unrelated item annotations.
const bottleFinding=JSON.parse(fs.readFileSync(path.join(root,'data/quest-tool-use.json'),'utf8')).items['0F'];
const bottleEntry=data.items.find(item=>item.category==='general_tool'&&item.id==='0F');
for(const field of ['summary','facts','evidenceNotes'])bottleEntry.playerUse[field]=bottleFinding[field];
const fishPath=path.join(root,'catalogue/fish-visuals.json');
if(fs.existsSync(fishPath)){const fish=JSON.parse(fs.readFileSync(fishPath,'utf8'));data.fishVisuals=fish.fish||fish.items||fish;}
// Current guide evidence comes from the supplied ROM; older guide leads stay in historical credits.
data.sources=[
 {titleEn:'Six-area shops and practical equipment findings',titleJa:'全6エリアの店と装備の実用調査',titleTh:'ร้านทั้ง 6 ด่านและคำตอบเรื่องเลือกใช้อุปกรณ์',url:'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/player-value-audit.md',detailEn:'Purchase areas, gear choices, food effects and quest actions, with links to the original-ROM traces.',detailJa:'購入場所、装備選択、食料の効果、イベント行動と原作ROMの追跡根拠。',detailTh:'ซื้อที่ไหน เลือกใช้อย่างไร ผลของอาหาร และของเควสต์ พร้อมหลักฐานจากการตามโค้ด ROM'},
 {titleEn:"Original-ROM tool and quest actions",titleJa:"原作ROMの道具・イベント処理",titleTh:"วิธีใช้อุปกรณ์และของเควสต์จาก ROM",url:"https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/general-tool-research.md",detailEn:"All 23 general-tool records: selected-use handlers, event checks, inventory changes, capacity and decoded game messages.",detailJa:"道具23件の使用分岐・イベント判定・所持品変更・容量・ゲーム内メッセージを追跡。",detailTh:"ตามโค้ดของอุปกรณ์ทั้ง 23 รายการ: จุดกดใช้ เงื่อนไขเควสต์ การเปลี่ยนของที่ถือ ความจุ และข้อความในเกม"},
 {titleEn:'Original-ROM equipment code',titleJa:'原作ROMの道具処理',titleTh:'โค้ดอุปกรณ์จาก ROM ต้นฉบับ',url:'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fish-acceptance-research.md',detailEn:'Decoded records and traced consumers establish equipment compatibility. Unknown effects remain unresolved.',detailJa:'復号したレコードと処理追跡で適合を確認。未解読の効果は不明のまま記載。',detailTh:'อ่านระเบียนและตามโค้ดที่ใช้อุปกรณ์เพื่อยืนยันเงื่อนไข ส่วนที่ยังแกะไม่ออกระบุว่ายังไม่ทราบ'},
 {titleEn:'Original-ROM fish spawns and field maps',titleJa:'原作ROMの魚出現表とフィールド地図',titleTh:'จุดเกิดปลาและฉากแผนที่จาก ROM',url:'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fish-location-research.md',detailEn:'Species/X/Y spawn tables and terrain loaded by the same ROM. Notebook overview artwork is not used for guessed pin placement.',detailJa:'魚種・X・Yの出現表と同じROMが読み込む地形。釣りノートの絵から位置は推測しない。',detailTh:'ชนิดปลาและพิกัด X/Y อ่านจากตารางเกม ส่วนพื้นฉากวาดจาก ROM เดียวกัน ไม่เดาพิกัดลงภาพแผนที่ในสมุด'},
 {titleEn:'ROM identity',titleJa:'ROM識別情報',titleTh:'ไฟล์เกมที่ใช้แกะข้อมูล',url:'',detailEn:'Owner-supplied original Japanese ROM, 1,572,864 bytes; SHA-1 c2103dd94e2a1a65a495fc02adc2e7d040f31212. English/Thai explanations are website translations.',detailJa:'提供された日本版ROM、1,572,864バイト、SHA-1 c2103dd94e2a1a65a495fc02adc2e7d040f31212。英語・タイ語説明はサイトの翻訳。',detailTh:'ROM ญี่ปุ่นต้นฉบับที่ผู้ใช้ให้มา ขนาด 1,572,864 ไบต์; SHA-1 c2103dd94e2a1a65a495fc02adc2e7d040f31212 ส่วนคำอธิบายไทยและอังกฤษเป็นคำแปลสำหรับเว็บไซต์'}
];
for(const item of data.items)for(const key of ['notesEn','notesJa','notesTh'])delete item[key];
for(const [locale,notes] of Object.entries(data.researchNotes))data.researchNotes[locale]=notes.filter(note=>!/(instruction booklet|SFC説明書|คู่มือ SFC)/.test(note));
const locationsPath=path.join(root,'catalogue/fish-locations.json');
if(fs.existsSync(locationsPath)){const locations=JSON.parse(fs.readFileSync(locationsPath,'utf8'));data.fishLocations=locations.fish||{};}
fs.writeFileSync(path.join(root,'catalogue/gallery-data.json'),JSON.stringify(data,null,2)+'\n');
const rodDecisionsPath=path.join(root,'data/rod-item-decisions.json');
if(!fs.existsSync(rodDecisionsPath))throw new Error('Missing per-rod decisions source');
{
  const rodDecisions=JSON.parse(fs.readFileSync(rodDecisionsPath,'utf8'));
  if(rodDecisions.rom?.sha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw new Error('Rod decisions use a different ROM');
  for(const item of data.items.filter(i=>i.category==='rod')){
    const decision=rodDecisions.items[item.id];if(!decision)throw new Error('Missing rod decision '+item.id);
    item.rodDecision=decision;
  }
  data.rodDecisionScope=rodDecisions.scope;
  fs.writeFileSync(path.join(root,'catalogue/gallery-data.json'),JSON.stringify(data,null,2)+'\n');
}
const gearPath=path.join(root,'data/gear-item-decisions.json');
const baitLureSource=JSON.parse(fs.readFileSync(path.join(root,'data/bait-lure-player-choices.json'),'utf8'));
if(baitLureSource.rom?.sha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw new Error('Bait/lure decisions use a different ROM');
for(const item of data.items.filter(i=>['bait','lure'].includes(i.category))){
 const choice=baitLureSource.items[item.category+':'+item.id];
 if(!choice)throw new Error('Missing bait/lure choice '+item.category+':'+item.id);
 item.baitLureDecision=Object.fromEntries(['label','recommendation','reason','alternatives','cheaperByStage','equalPriceByStage'].map(key=>[key,choice[key]]));
 item.baitLureDecision.sources=[...new Set([...(choice.sources||[]),'data/bait-lure-player-choices.json','docs/bait-lure-player-choices.md'])];
}
if(!fs.existsSync(gearPath))throw new Error('Missing per-item gear decisions');
{
  const gear=JSON.parse(fs.readFileSync(gearPath,'utf8'));
  data.gearPriceGuide={float:gear.floatCheapestRecordedStockByArea,sinker:gear.sinkerCheapestRecordedStockByArea};
  data.gearPriceGuide.hook=Object.fromEntries([1,2,3,4,5,6].map(stage=>{
    const choices=data.items.filter(item=>item.category==='hook'&&item.rawFields['+1']===0&&item.playerUse.shops?.some(shop=>Number(shop.stage)===stage&&!shop.condition)).sort((a,b)=>a.priceYen-b.priceYen||a.id.localeCompare(b.id));
    const item=choices[0];if(!item)throw Error('Missing generic hook stock in area '+stage);
    return [stage,{category:'hook',id:item.id,priceYen:item.priceYen}];
  }));
  if(gear.rom?.sha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw new Error('Gear decisions ROM mismatch');
  for(const item of data.items.filter(i=>['hook','float_weight','fly','fly_wing','fly_tail'].includes(i.category))){
    const choice=gear.items[item.category+':'+item.id];if(!choice)throw new Error('Missing gear decision '+item.category+':'+item.id);
    item.gearDecision=choice;
  }
  for(const item of data.items){const fix=itemNames[item.category+':'+item.id];if(fix?.gearDecision)item.gearDecision=fix.gearDecision;}
}
const daikon=JSON.parse(fs.readFileSync(path.join(root,'data/daikon-acquisition.json'),'utf8'));
const daikonLocation=JSON.parse(fs.readFileSync(path.join(root,'data/daikon-location.json'),'utf8'));
if(daikon.romSha1!==daikonLocation.romSha1||daikon.romSha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw Error('Daikon ROM mismatch');
const daikonItem=data.items.find(i=>i.category==='food'&&i.id==='07');
daikonItem.daikonExchange=daikon.exchange;
daikonItem.exchangeFishId=daikon.fish.idHex;
daikonItem.playerUse.useLocations=[daikonLocation.location];
const tub=JSON.parse(fs.readFileSync(path.join(root,'data/tub-acquisition.json'),'utf8'));
const tubLocation=JSON.parse(fs.readFileSync(path.join(root,'data/tub-location.json'),'utf8'));
if(tub.romSha1!==tubLocation.romSha1||tub.romSha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw Error('Tub ROM mismatch');
const tubItem=data.items.find(i=>i.category==='general_tool'&&i.id==='01');
tubItem.tubExchange=tub.exchange;tubItem.exchangeFishId=tub.fish.idHex;
tubItem.exchangeFishAction=tub.playerFishAction;
tubItem.playerUse.summary=tub.playerSummary;
tubItem.playerUse.facts=tub.playerFacts;
tubItem.playerUse.useLocations=[tubLocation.location];
const tubBoarding=JSON.parse(fs.readFileSync(path.join(root,'data/tub-boarding.json'),'utf8'));
if(tubBoarding.romSha1!==tub.romSha1)throw Error('Tub boarding ROM mismatch');
tubItem.playerUse.useLocations.push(tubBoarding.location);
tubItem.playerUse.evidence.sources.push('data/tub-boarding.json','docs/tub-boarding-research.md');
tubItem.playerUse.evidence.sources=[...new Set([...(tubItem.playerUse.evidence.sources||[]),'data/tub-acquisition.json','docs/tub-acquisition-research.md'])];
const canoeBoarding=JSON.parse(fs.readFileSync(path.join(root,'data/canoe-boarding.json'),'utf8'));
if(canoeBoarding.romSha1!==tub.romSha1)throw Error('Canoe boarding ROM mismatch');
const canoeItem=data.items.find(i=>i.category==='general_tool'&&i.id==='02');
canoeItem.playerUse.useLocations.push(canoeBoarding.location);
canoeItem.playerUse.evidence.sources.push('data/canoe-boarding.json','docs/boat-movement-research.md');
const keepnetSource=JSON.parse(fs.readFileSync(path.join(root,'data/chum-basket-use.json'),'utf8'));
if(keepnetSource.rom.sha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw Error('Keepnet ROM mismatch');
for(const [id,capacity] of Object.entries(keepnetSource.raw_evidence.basket_purchase.capacity_by_item_id)){
 const item=data.items.find(i=>i.category==='general_tool'&&i.id===id);item.keepnetCapacity=capacity;
}
const toolsSource=JSON.parse(fs.readFileSync(path.join(root,'data/general-tool-actions.json'),'utf8'));
if(toolsSource.rom?.sha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw new Error('Net gathering source ROM mismatch');
require('./attach_audio_mode_actions.cjs')(data,toolsSource);
for(const item of data.items)delete item.netGatherArea;
const netItem=data.items.find(i=>i.category==='general_tool'&&i.id==='04');
netItem.gatheredBaitByArea=toolsSource.items['04'].trace.perAreaBaitIds;
const netLocations=JSON.parse(fs.readFileSync(path.join(root,'data/gold-net-location.json'),'utf8'));
if(netLocations.rom?.sha1!==toolsSource.rom.sha1)throw Error('Net location ROM mismatch');
netItem.playerUse.useLocations=netLocations.items['general_tool:04'];
netItem.playerUse.evidence.sources=[...new Set([...netItem.playerUse.evidence.sources,'data/gold-net-location.json','docs/gold-net-location-research.md'])];
const compassLocations=JSON.parse(fs.readFileSync(path.join(root,'data/compass-locations.json'),'utf8'));
if(compassLocations.rom?.sha1!==toolsSource.rom.sha1)throw Error('Compass locations ROM mismatch');
const compassItem=data.items.find(i=>i.category==='general_tool'&&i.id==='0E');
compassItem.playerUse.useLocations=compassLocations.items['general_tool:0E'];
compassItem.playerUse.summary=compassLocations.playerSummary;
compassItem.playerUse.evidence.sources=[...new Set([...compassItem.playerUse.evidence.sources,'data/compass-locations.json','docs/compass-location-research.md'])];
for(const [stage,id] of Object.entries(netItem.gatheredBaitByArea)){const bait=data.items.find(i=>i.category==='bait'&&i.id===id);bait.netGatherArea=Number(stage);bait.playerUse.evidence.sources=[...new Set([...(bait.playerUse.evidence.sources||[]),'data/general-tool-actions.json','docs/general-tool-actions-research.md'])];}
const acquisitionPath=path.join(root,'data/town-item-acquisition.json');
if(!fs.existsSync(acquisitionPath))throw new Error('Missing town acquisition data');
{
  const acquisitions=JSON.parse(fs.readFileSync(acquisitionPath,'utf8'));
  if(acquisitions.rom?.sha1!=='c2103dd94e2a1a65a495fc02adc2e7d040f31212')throw new Error('Acquisition ROM mismatch');
  for(const [key,entries] of Object.entries(acquisitions.items||{})){
    const item=data.items.find(i=>i.category+':'+i.id===key);if(!item)throw new Error('Acquisition missing item '+key);
    item.acquisitionOptions=entries;
    item.playerUse.evidence||={type:'rom_trace',sources:[]};
    item.playerUse.evidence.sources=[...new Set([...(item.playerUse.evidence.sources||[]),'docs/town-item-acquisition-research.md','data/town-item-acquisition.json'])];
    const previous=item.playerUse.useLocations||[];
    item.playerUse.useLocations=[...entries,...previous.filter(loc=>!entries.some(entry=>entry.context===loc.context&&entry.mapId===loc.mapId&&entry.tileX===loc.tileX&&entry.tileY===loc.tileY))];
  }
}
// Player-facing advice names the items it points to instead of quoting their hex IDs.
require('./item_refs.cjs').resolveItemRefs(data);
fs.writeFileSync(path.join(root,'catalogue/gallery-data.json'),JSON.stringify(data,null,2)+'\n');
async function build(locale, filename) {
  const nodes = {};
  function node(id) {
    return nodes[id] ||= {innerHTML:'',textContent:'',value:id==='category-filter'?'all':id==='sort-filter'?'id':'',addEventListener(){},setAttribute(){},removeAttribute(){}};
  }
  const document = {
    documentElement:{dataset:{locale}},
    querySelector(selector){return selector.startsWith('#') ? node(selector.slice(1)) : null;},
    querySelectorAll(){return [];},
    getElementById:node,
    addEventListener(){},
  };
  const context={document,console,URL,URLSearchParams,fetch:async()=>({ok:true,json:async()=>data})};
  vm.runInNewContext(source.slice(0, source.lastIndexOf('})();')) + 'globalThis.playerCopy = runtimeContext.player; globalThis.catalogueCopy = runtimeContext.copy;\n' + source.slice(source.lastIndexOf('})();')), context);
  await new Promise(resolve=>setImmediate(resolve));
  const file=path.join(root,'catalogue',filename);
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('id="player-decisions"'))html=html.replace('<main>','<main>\n<section id="player-decisions" class="decision-hub"></section>');
  if(!html.includes('id="category-decisions"'))html=html.replace('<div id="rod-comparison"','<div id="category-decisions" class="category-decisions"></div><div id="rod-comparison"');
  html=html.replace(/(<([a-z0-9]+)[^>]*data-t="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g, (whole,open,tag,key,close)=>{const camel=({'th-item':'item','th-rom':'rom','th-price':'price','search-label':'search','category-label':'category','sort-label':'sort','readme-link':'readme'})[key]||key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());const value=(camel==='title'||camel==='lead'?context.playerCopy?.[camel]:undefined)??context.catalogueCopy[key]??context.catalogueCopy[camel];return typeof value==='string'?open+value+close:whole;});
  for (const [id,n] of Object.entries(nodes)) {
    const value=n.innerHTML || n.textContent;
    if(!value)continue;
    const start=`<!-- prerender:${id} -->`,end=`<!-- /prerender:${id} -->`;
    if(html.includes(start)) {
      html=html.replace(new RegExp(start+'[\\s\\S]*?'+end),()=>start+value+end);
    } else {
      const re=new RegExp('(<(div|tbody|select|p|span|h2|a|section)[^>]*id="'+id+'"[^>]*>)[\\s\\S]*?(</\\2>)');
      html=html.replace(re,(_,open,tag,close)=>open+start+value+end+close);
    }
  }
  fs.writeFileSync(file,html);
  console.log(`Rendered ${locale}: ${data.items.length} entries`);
}
(async()=>{await build('en','index.html');await build('ja','index.ja.html');if(fs.existsSync(path.join(root,'catalogue/index.th.html')))await build('th','index.th.html');})().catch(error=>{console.error(error);process.exitCode=1;});
