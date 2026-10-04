#!/usr/bin/env node
// Exhaustive source-render checks; browser checks are recorded separately.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'catalogue/gallery-data.json'),'utf8'));
const locations=JSON.parse(fs.readFileSync(path.join(root,'catalogue/fish-locations.json'),'utf8'));
const itemKeys=new Set(data.items.map(i=>`${i.category}:${i.id}`));
const fishIds=new Set(Object.keys(data.fishVisuals));
let linkCount=0,renderCount=0;
const unescape=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
function validate(html,base, allowInvalidIdentity=false){
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=new URL(unescape(match[1]),base);
  if(url.origin!==base.origin){
   const projectBlob='/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/';
   if(url.hostname==='github.com'&&url.pathname.startsWith(projectBlob))assert(fs.existsSync(path.join(root,decodeURIComponent(url.pathname.slice(projectBlob.length)))),`Missing evidence file ${url}`);
   continue;
  }
  const pathname=url.pathname.replace(/^\/kawa-no-nushi-tsuri-2-research\//,'/');
  assert(fs.existsSync(path.join(root,pathname.replace(/^\//,''))),`Missing local route/asset ${url}`);
  if(!allowInvalidIdentity&&/\/item(?:\.th|\.ja)?\.html$/.test(pathname)&&url.searchParams.has('id'))assert(itemKeys.has(`${url.searchParams.get('category')}:${url.searchParams.get('id')}`),`Unknown item ${url}`);
  if(!allowInvalidIdentity&&/\/fish(?:\.th|\.ja)?\.html$/.test(pathname)&&url.searchParams.has('id'))assert(fishIds.has(url.searchParams.get('id')),`Unknown fish ${url}`);
  linkCount++;
 }
}
async function render(kind,lang,query,prefix='/kawa-no-nushi-tsuri-2-research'){
 const suffix=lang==='en'?'':'.'+lang;
 const url=new URL(`https://example.test${prefix}/catalogue/${kind}${suffix}.html?${query}`);
 const nodes={};const node=id=>nodes[id]||=( {innerHTML:'',textContent:'',href:'',dataset:{},setAttribute(){},removeAttribute(){},getAttribute(){return null},addEventListener(){},scrollIntoView(){this.scrolled=true}} );
 const languages=['en','th','ja'].map(code=>({...node(`language-${code}`),getAttribute:key=>key==='hreflang'?code:null}));
 const document={documentElement:{dataset:{locale:lang}},getElementById:node,querySelectorAll:()=>languages};
 const location={href:url.href,origin:url.origin,pathname:url.pathname,search:url.search,hash:url.hash};
 const context={document,location,window:{location},URL,URLSearchParams,console,fetch:async file=>({ok:true,json:async()=>file==='fish-locations.json'?locations:data})};
 const source=fs.readFileSync(path.join(root,`catalogue/${kind}-detail.js`),'utf8');
 vm.runInNewContext(source,context);
 await new Promise(r=>setImmediate(r));
 const html=node(kind==='fish'?'fish-detail':'detail-root').innerHTML;
 assert(html&&!html.includes('กำลังโหลด'),`No render ${kind} ${query}`);
 validate(html,url);
 for(const n of Object.values(nodes))if(n.href)validate(`<a href="${n.href}"></a>`,url,true);
 for(const n of languages)if(n.href)validate(`<a href="${n.href}"></a>`,url,true);
 renderCount++;
 return {html,nodes,languages,url};
}
(async()=>{
 for(const lang of ['en','th','ja']){
  const suffix=lang==='en'?'':'.'+lang;
  for(const item of data.items){
   const result=await render('item',lang,new URLSearchParams({category:item.category,id:item.id,return:`index${suffix}.html?category=${item.category}#catalogue`}));
   assert(!result.html.includes('Item not found')&&!result.html.includes('ไม่พบไอเท็ม')&&!result.html.includes('道具が見つかりません'),`Item render failed ${item.category}:${item.id}`);
   assert(result.html.includes('class="evidence"'),`No collapsed evidence ${item.category}:${item.id}`);
   const visible=result.html.split('<details class="evidence"')[0];
   const breadcrumb=unescape(visible.match(/<nav class="detail-breadcrumb"><a href="([^"]+)"/)?.[1]||'');
   const browse=new URL(breadcrumb,result.url),flyPart=['fly','fly_wing','fly_tail'].includes(item.category);
   assert.equal(browse.searchParams.get('category'),flyPart?'flymaker':item.category,'Item category breadcrumb mismatch');
   if(flyPart)assert.equal(browse.searchParams.get('part'),item.category,'Fly part breadcrumb lost');

   if(['hook','float_weight'].includes(item.category))for(const fact of item.playerUse?.facts?.[lang]||[])assert(unescape(visible).includes(fact),`Confirmed practical fact hidden: ${item.category}:${item.id}`);
   if(item.category==='rod')assert(visible.includes('buying-decision'),`Rod purchase decision missing ${item.id}`);
   if(item.category==='general_tool'&&['08','09','0A'].includes(item.id))assert(visible.includes(lang==='en'?'movement can be steered':lang==='th'?'ชี้ทิศ':'進行方向'),`Chum steering list mislabeled ${item.id}`);
   for(const loc of item.playerUse?.useLocations||[])if(loc.image)assert(visible.includes(`src="${loc.image}"`),`Use map hidden ${item.id}/${loc.stage}`);

   assert(result.nodes['detail-back'].href.includes(`#catalogue`),'Lost item return context');
  }
  for(const id of fishIds){
   const result=await render('fish',lang,new URLSearchParams({id,stage:'3',return:`maps${suffix}.html?stage=3&fish=${id}`}));
   assert(result.html.includes('class="detail-hero"'),`Fish render failed ${id}`);
   assert(result.nodes['fish-back'].href.includes(`fish=${id}`),'Lost fish return context');
   if(id==='43')assert(!/class="route-button"[^>]*maps[^>]*>/.test(result.html),'Unconfirmed profile 43 spawn route');
  }
  for(const kind of ['fish','item'])for(const bad of ['','id=GG','id=FF&category=lure']){
   const result=await render(kind,lang,bad);
   assert(result.html.includes('empty-state'),`Invalid entity lacks recovery ${kind} ${bad}`);
  }
  for(const [fishId,record] of Object.entries(locations.fish))for(const area of record.locations||[]){
   const stage=String(area.stage), result=await render('fish',lang,new URLSearchParams({id:fishId,stage}));
   const offered=[...result.html.matchAll(/class="detail-section starter-offer" data-method="([^"]+)" data-item="([^"]+)" data-price="(\d+)"/g)];
   for(const method of ['float','sinker','lure','fly']){
    const candidates=[];
    for(const item of data.items){
     const accepted=method==='float'||method==='sinker'?item.category==='bait'&&(item.playerUse?.fishIdsByRoute?.[method]||[]).includes(fishId):item.category===method&&(item.playerUse?.fishIds||[]).includes(fishId);
     if(!accepted)continue;
     for(const shop of item.playerUse?.shops||[]){
      if(String(shop.stage)!==stage||shop.condition)continue;
      const price=method==='fly'?shop.bundle?.shopPriceYen:item.priceYen;
      if(Number.isFinite(price)&&price>=0)candidates.push({key:`${item.category}:${item.id}`,price});
     }
    }
    const card=offered.find(x=>x[1]===method);
    assert.equal(Boolean(card),Boolean(candidates.length),`Missing/extra starter method ${fishId}/${stage}/${method}`);
    if(card){const minimum=Math.min(...candidates.map(x=>x.price));assert.equal(Number(card[3]),minimum,'Starter price is not lowest eligible offer');assert(candidates.some(x=>x.key===card[2]&&x.price===minimum),'Starter item is incompatible or not stocked');}
   }
  }
  const invalidTarget=await render('item',lang,new URLSearchParams({category:'lure',id:'2E',fish:'FF',stage:'999'}));
  assert(invalidTarget.html.includes('class="detail-hero"')&&!invalidTarget.html.includes('play-target'),'Invalid fish target breaks a valid item');
  for(const route of ['float','sinker']){
   const result=await render('item',lang,new URLSearchParams({category:'bait',id:'01',fish:'06',route}));
   assert(result.html.includes(`id="rig-${route}"`)&&result.nodes[`rig-${route}`].scrolled,`Rig route did not focus ${route}`);
  }
  for(const folder of ['catalogue','research']){
   const file=path.join(root,folder,`index${suffix}.html`),html=fs.readFileSync(file,'utf8');
   validate(html,new URL(`https://example.test/${folder}/index${suffix}.html`));
   if(folder==='catalogue'){
    const nodes={};const node=id=>nodes[id]||=({innerHTML:'',textContent:'',value:id==='category-filter'?'all':id==='sort-filter'?'id':'',addEventListener(){},setAttribute(){},removeAttribute(){}});
    const document={documentElement:{dataset:{locale:lang}},querySelector:selector=>selector.startsWith('#')?node(selector.slice(1)):null,querySelectorAll:()=>[],getElementById:node,addEventListener(){}};
    const source=fs.readFileSync(path.join(root,'catalogue/gallery.js'),'utf8').replace("let chosen='rod'","let chosen='all'");
    vm.runInNewContext(source,{document,console,fetch:async()=>({ok:true,json:async()=>data})});
    await new Promise(r=>setImmediate(r));
    const cards=node('cards').innerHTML;
    assert.equal((cards.match(/class="item-card/g)||[]).length,315,'Catalogue all-items renderer');
    validate(cards,new URL(`https://example.test/catalogue/index${suffix}.html`));
    for(const item of data.items){
     const card=cards.match(new RegExp(`<article class="item-card[^]*?id="item-${item.category}-${item.id}"([^]*?)</article>`))?.[1];
     assert(card&&card.includes(`category=${item.category}&amp;id=${item.id}`),`Missing catalogue item detail ${item.category}:${item.id}`);
     assert(/<figure class="sprite"><a /.test(card),`Unlinked portrait ${item.category}:${item.id}`);
     assert(/<h3><a class="entity-title"/.test(card),`Unlinked name ${item.category}:${item.id}`);
    }
   }
  }
 }
 for(const kind of ['fish','item'])for(const prefix of ['','/kawa-no-nushi-tsuri-2-research']){
  const baseQuery=kind==='fish'?{id:'06'}:{category:'lure',id:'2E'};
  for(const badReturn of ['https://evil.example/catalogue/index.html','//evil.example/catalogue/index.html','javascript:alert(1)','../../other.html']){
   const result=await render(kind,'en',new URLSearchParams({...baseQuery,return:badReturn}),prefix);
   const back=result.nodes[kind==='fish'?'fish-back':'detail-back'].href;
   assert(!back.includes('evil')&&!back.includes('javascript')&&!back.includes('other.html'),'Unsafe return accepted');
  }
  const result=await render(kind,'en',new URLSearchParams({...baseQuery,return:'../research/index.html'}),prefix);
  assert(result.nodes[kind==='fish'?'fish-back':'detail-back'].href.includes('research/index.html'),'Research return lost');
 }
 console.log(`PASS: ${renderCount} localized detail renders; ${linkCount} local links/assets and entity IDs checked. All 315 item and 73 fish profiles covered. Browser click checks are separate.`);
})().catch(error=>{console.error(error);process.exitCode=1});
