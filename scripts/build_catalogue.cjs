#!/usr/bin/env node
// Produce initial HTML with the same renderer used by the interactive catalogue.
// No browser or third-party packages are needed. Run after editing gallery data.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/gallery-data.json'), 'utf8'));
const decisionsPath=path.join(root,'data/player-decisions.json');
if(fs.existsSync(decisionsPath))data.playerDecisions=JSON.parse(fs.readFileSync(decisionsPath,'utf8'));
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
const fishFood=data.items.find(item=>item.category==='food'&&item.id==='08');if(fishFood&&fishFood.labelImageTh)fishFood.labelContextTh='ตัวอย่างชื่อปลาที่ถือ: เรนโบว์เทราต์ (รหัสชนิด06 ขนาดดิบ30) ชื่อนี้เปลี่ยนตามปลาที่ถือ ไม่ใช่ชื่ออาหารตายตัว';
fs.writeFileSync(path.join(root,'catalogue/gallery-data.json'),JSON.stringify(data,null,2)+'\n');
// Merge player-facing explanations and verified fish art into the delivered payload.
const usePath=path.join(root,'catalogue/item-use.json');
if(fs.existsSync(usePath)){const use=JSON.parse(fs.readFileSync(usePath,'utf8'));for(const item of data.items)item.playerUse=use.items?.[`${item.category}:${item.id}`]||{};}
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
async function build(locale, filename) {
  const nodes = {};
  function node(id) {
    return nodes[id] ||= {innerHTML:'',textContent:'',value:id==='category-filter'?'all':id==='sort-filter'?'id':'',addEventListener(){}};
  }
  const document = {
    documentElement:{dataset:{locale}},
    querySelector(selector){return selector.startsWith('#') ? node(selector.slice(1)) : null;},
    querySelectorAll(){return [];},
    getElementById:node,
  };
  const context={document,console,fetch:async()=>({ok:true,json:async()=>data})};
  vm.runInNewContext(source.replace('  const groups=', '  globalThis.playerCopy = player;\n  const groups=').replace('  const esc =', '  globalThis.catalogueCopy = copy;\n  const esc ='), context);
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
