#!/usr/bin/env node
// Produce initial HTML with the same renderer used by the interactive catalogue.
// No browser or third-party packages are needed. Run after editing gallery data.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/gallery-data.json'), 'utf8'));
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
  html=html.replace(/(<([a-z0-9]+)[^>]*data-t="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g, (whole,open,tag,key,close)=>{const camel=({'th-item':'item','th-rom':'rom','th-price':'price','search-label':'search','category-label':'category','sort-label':'sort','readme-link':'readme'})[key]||key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());const value=(camel==='title'||camel==='lead'?context.playerCopy?.[camel]:undefined)??context.catalogueCopy[key]??context.catalogueCopy[camel];return typeof value==='string'?open+value+close:whole;});
  for (const [id,n] of Object.entries(nodes)) {
    const value=n.innerHTML || n.textContent;
    if(!value)continue;
    const start=`<!-- prerender:${id} -->`,end=`<!-- /prerender:${id} -->`;
    if(html.includes(start)) {
      html=html.replace(new RegExp(start+'[\\s\\S]*?'+end),()=>start+value+end);
    } else {
      const re=new RegExp('(<(div|tbody|select|p|span|h2|a)[^>]*id="'+id+'"[^>]*>)[\\s\\S]*?(</\\2>)');
      html=html.replace(re,(_,open,tag,close)=>open+start+value+end+close);
    }
  }
  fs.writeFileSync(file,html);
  console.log(`Rendered ${locale}: ${data.items.length} entries`);
}
(async()=>{await build('en','index.html');await build('ja','index.ja.html');if(fs.existsSync(path.join(root,'catalogue/index.th.html')))await build('th','index.th.html');})().catch(error=>{console.error(error);process.exitCode=1;});
