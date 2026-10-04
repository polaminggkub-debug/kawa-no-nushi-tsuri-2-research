#!/usr/bin/env node
// Ensure ROM-backed shop restrictions become clear player actions in all locales.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');

const root=path.resolve(__dirname,'..');
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'catalogue/gallery-data.json'),'utf8'));
const stock=JSON.parse(fs.readFileSync(path.join(root,'data/shop-stock-rom.json'),'utf8'));
const research=fs.readFileSync(path.join(root,'docs/shop-stock-research.md'),'utf8');
const conditions=[];
for(const area of stock.areas||[])for(const item of area.items||[])if(item.condition)conditions.push({...item,stage:area.stage});
assert.equal(conditions.length,1,'Update this focused test when a new conditional stock offer is decoded');
assert.equal(conditions[0].category,'bait');
assert.equal(conditions[0].id,'17');
assert.equal(conditions[0].stage,3);
assert.match(conditions[0].condition,/sell at least one Ayu before buying/);
assert.match(research,/each stored fish with species ID `38` \(Ayu\) increments that counter/);
assert.match(research,/fills its stack to nine and subtracts nine from the counter, floored at zero/);

const item=catalogue.items.find(candidate=>candidate.category==='bait'&&candidate.id==='17');
assert(item,'Conditional ROM stock item is missing from the player catalogue');
assert.equal(item.playerUse.shops.length,1);
assert.equal(item.playerUse.shops[0].stage,3);
assert.equal(item.playerUse.shops[0].condition,conditions[0].condition);

async function render(lang){
  const url=new URL(`https://example.test/kawa-no-nushi-tsuri-2-research/catalogue/item${lang==='en'?'':'.'+lang}.html?category=bait&id=17`);
  const nodes={};
  const node=id=>nodes[id]||=( {innerHTML:'',textContent:'',href:'',dataset:{},setAttribute(){},removeAttribute(){},getAttribute(){return null},addEventListener(){},scrollIntoView(){this.scrolled=true}} );
  const languages=['en','th','ja'].map(code=>({...node(`language-${code}`),getAttribute:key=>key==='hreflang'?code:null}));
  const document={documentElement:{dataset:{locale:lang}},getElementById:node,querySelectorAll:()=>languages,title:''};
  const location={href:url.href,origin:url.origin,pathname:url.pathname,search:url.search,hash:url.hash};
  const context={document,location,window:{location},URL,URLSearchParams,console,fetch:async()=>({ok:true,json:async()=>catalogue})};
  vm.runInNewContext(fs.readFileSync(path.join(root,'catalogue/item-detail.js'),'utf8'),context);
  await new Promise(resolve=>setImmediate(resolve));
  const html=node('detail-root').innerHTML;
  assert(html.includes('class="detail-hero"'),`Item page did not render in ${lang}`);
  return {html,nodes,url};
}

(async()=>{
  const expected={
    en:{unlock:'How to unlock this offer:',action:'Sell at least one Ayu from your keepnet',area:'Area 3',count:'sets the stack to 9',cost:'subtracts 9 from the sold-Ayu counter',map:'Find this shop',location:'town entrance, seller location'},
    th:{unlock:'วิธีปลดล็อกรายการนี้:',action:'ขายปลาอายุจากข้องอย่างน้อย 1 ตัว',area:'ด่าน 3',count:'จำนวนในช่องจะเต็มเป็น 9 ชิ้น',cost:'ตัวนับปลาอายุที่ขายจะลดลง 9',map:'ดูร้านที่ขายของนี้',location:'ทางเข้าเมือง ตำแหน่งคนขาย'},
    ja:{unlock:'この品を買えるようにするには：',action:'びくからアユを1匹以上売る',area:'エリア3',count:'所持数が9個になり',cost:'売却アユ数のカウンターが9減ります',map:'販売店を見る',location:'町への入口、店員の位置'}
  };
  for(const lang of ['en','th','ja']){
    const {html,url}=await render(lang);
    const visible=html.split('<details class="evidence"')[0];
    for(const fragment of Object.values(expected[lang]))assert(visible.includes(fragment),`Missing player-facing shop instruction in ${lang}: ${fragment}`);
    assert(!visible.includes('7F:1E84'),'Raw counter address leaked into player guidance');
    assert(visible.includes('¥45')||visible.includes('45 เยน')||visible.includes('45円'),`Shop price missing in ${lang}`);
    const routes=[...visible.matchAll(/<a class="route-button" href="([^"]+)">/g)].map(match=>new URL(match[1].replace(/&amp;/g,'&'),url));
    const mapUrl=routes.find(route=>/\/catalogue\/shops(?:\.th|\.ja)?\.html$/.test(route.pathname));
    const fishUrl=routes.find(route=>/\/catalogue\/fish(?:\.th|\.ja)?\.html$/.test(route.pathname));
    assert(fishUrl,'Missing Ayu next-action link');assert.equal(fishUrl.searchParams.get('id'),'38');
    assert(mapUrl,`Area map link missing in ${lang}`);
    assert.match(mapUrl.pathname,/\/catalogue\/shops(?:\.th|\.ja)?\.html$/);
    assert.equal(mapUrl.searchParams.get('stage'),'3');
    assert.equal(mapUrl.searchParams.get('place'),'town');
    assert.equal(mapUrl.searchParams.get('category'),'bait');
    assert.equal(mapUrl.searchParams.get('id'),'17');
    const source=new URL(mapUrl.searchParams.get('return'),url);assert.equal(source.searchParams.get('id'),'17');
  }
  console.log('PASS: the only conditional shop offer (Decoy Ayu, area 3) gives a localized unlock action, purchase effect, price, and seller-page path in English, Thai, and Japanese.');
})().catch(error=>{console.error(error);process.exitCode=1;});
