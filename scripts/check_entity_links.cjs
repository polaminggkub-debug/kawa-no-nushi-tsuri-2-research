#!/usr/bin/env node
// Exhaustive source-render checks; browser checks are recorded separately.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
for(const [script,pages] of [['gallery.js',['index.html','index.ja.html','index.th.html']],['item-detail.js',['item.html','item.ja.html','item.th.html']],['fish-detail.js',['fish.html','fish.ja.html','fish.th.html']]]){
 const source=fs.readFileSync(path.join(root,'catalogue',script),'utf8');
 const version=source.match(/fetch\('gallery-data\.json\?v=([^']+)'\)/)?.[1];
 assert(version,'Catalogue data must have a cache revision: '+script);
 for(const page of pages)assert(fs.readFileSync(path.join(root,'catalogue',page),'utf8').includes(script+'?v='+version),'Script/data cache revision mismatch: '+page);
}
const data=JSON.parse(fs.readFileSync(path.join(root,'catalogue/gallery-data.json'),'utf8'));
const locations=JSON.parse(fs.readFileSync(path.join(root,'catalogue/fish-locations.json'),'utf8'));
const itemKeys=new Set(data.items.map(i=>`${i.category}:${i.id}`));
const fishIds=new Set(Object.keys(data.fishVisuals));
assert.equal(data.items.filter(i=>i.category==='rod'&&i.rodDecision).length,21,'All 21 rods require decisions');
assert.equal(data.items.filter(i=>i.gearDecision).length,157,'All hook/float/fly parts require individual action advice');
assert.equal(data.items.filter(i=>i.baitLureDecision).length,104,'All 23 bait and 81 lure entries require buy/use choices');
const baitLureSource=JSON.parse(fs.readFileSync(path.join(root,'data/bait-lure-player-choices.json'),'utf8'));
const baitLureGates=item=>item.category==='bait'?item.playerUse.fishIdsByRoute:{all:item.playerUse.fishIds};
const coversBaitLure=(candidate,item)=>Object.entries(baitLureGates(item)).every(([route,ids])=>ids.every(id=>(baitLureGates(candidate)[route]||[]).includes(id)));
for(const item of data.items.filter(i=>i.baitLureDecision)){
 const advice=baitLureSource.items[item.category+':'+item.id];
 assert(advice,'Missing full bait/lure evidence');
 for(const key of ['label','recommendation','reason','alternatives','cheaperByStage'])assert.deepEqual(item.baitLureDecision[key],advice[key],'Published bait/lure choice differs from its source');
 if(item.playerUse.shops.length)for(const stage of ['1','2','3','4','5','6']){
  const eligible=data.items.some(i=>i.category===item.category&&i.priceYen<item.priceYen&&i.playerUse.shops.some(s=>String(s.stage)===stage&&!s.condition)&&coversBaitLure(i,item));
  assert.equal(Boolean(advice.cheaperByStage[stage]?.length),eligible,'Missing area choice '+item.category+':'+item.id+'/'+stage);
 }
 for(const ref of advice.exactGatePeers){const peer=data.items.find(i=>i.category===ref.category&&i.id===ref.id);assert(peer&&coversBaitLure(peer,item)&&coversBaitLure(item,peer),'Invalid exact gate peer '+item.category+':'+item.id);}
 for(const [stage,refs] of Object.entries(advice.cheaperByStage)){
  const offers=data.items.filter(i=>i.category===item.category&&i.priceYen<item.priceYen&&i.playerUse.shops.some(s=>String(s.stage)===stage&&!s.condition)&&coversBaitLure(i,item));
  const lowest=Math.min(...offers.map(i=>i.priceYen));
  const expected=offers.filter(i=>i.priceYen===lowest).map(i=>i.id).sort();
  assert.deepEqual(refs.map(ref=>ref.id).sort(),expected,'Missing cheapest full-list alternative '+item.category+':'+item.id+'/'+stage);
  for(const ref of refs)assert.equal(ref.priceYen,lowest,'Alternative quote mismatch');
 }
}
for(const item of data.items.filter(i=>i.category==='hook'))assert.deepEqual((item.gearDecision.targetFish||[]).slice().sort(),[item.playerUse.targetMatches||[]].flat().map(t=>t.fishId).sort(),'Hook next action must use ROM named-fish field');
for(const item of data.items.filter(i=>i.category==='fly_wing')){
 assert(item.gearDecision.reason.en.includes('recasting the same setup does not reroll'),'Wing action lost the persistent hidden check');
 assert(item.gearDecision.reason.en.includes('at least one'),'Wing backup must describe the collective three-set result');
 assert(item.gearDecision.reason.en.includes('do not guarantee a bite'),'Wing fallback became a catch claim');
}
const acquisitions=JSON.parse(fs.readFileSync(path.join(root,'data/town-item-acquisition.json'),'utf8'));
assert.equal(Object.keys(acquisitions.items).length,6,'All six known town rewards require acquisition instructions');
for(const [key,entries] of Object.entries(acquisitions.items)){const item=data.items.find(i=>i.category+':'+i.id===key);assert(item);for(const entry of entries)assert(item.playerUse.useLocations.some(loc=>loc.context==='town'&&loc.mapId===entry.mapId&&loc.action?.en===entry.action.en),'Missing actionable acquisition '+key);}
for(const kind of ['float','sinker'])for(const [stage,row] of Object.entries(data.gearPriceGuide[kind])){
 const candidates=data.items.filter(i=>i.category==='float_weight'&&(kind==='float'?parseInt(i.id,16)<8:['09','0A'].includes(i.id))&&i.playerUse.shops.some(shop=>String(shop.stage)===stage));
 assert.equal(row.priceYen,Math.min(...candidates.map(i=>i.priceYen)),'Not minimum stocked '+kind+'/'+stage);
 assert(candidates.some(i=>i.id===row.id&&i.priceYen===row.priceYen));
}
const netSource=JSON.parse(fs.readFileSync(path.join(root,'data/general-tool-actions.json'),'utf8'));
assert.deepEqual(data.items.find(i=>i.category==='general_tool'&&i.id==='04').gatheredBaitByArea,netSource.items['04'].trace.perAreaBaitIds);
assert.equal(data.items.filter(i=>i.netGatherArea).length,6);
for(const [stage,id] of Object.entries(netSource.items['04'].trace.perAreaBaitIds))assert.equal(data.items.find(i=>i.category==='bait'&&i.id===id).netGatherArea,Number(stage));
const keepnetSource=JSON.parse(fs.readFileSync(path.join(root,'data/chum-basket-use.json'),'utf8'));
for(const [id,capacity] of Object.entries(keepnetSource.raw_evidence.basket_purchase.capacity_by_item_id))assert.equal(data.items.find(i=>i.category==='general_tool'&&i.id===id).keepnetCapacity,capacity);
const daikonSource=JSON.parse(fs.readFileSync(path.join(root,'data/daikon-acquisition.json'),'utf8'));
const daikon=data.items.find(i=>i.category==='food'&&i.id==='07');
assert.equal(daikon.exchangeFishId,daikonSource.fish.idHex);
assert.equal(daikon.daikonExchange.mealSlotsWritten,16);
assert.equal(daikon.daikonExchange.fishConsumed,true);
assert.equal(daikon.daikonExchange.repeatable,false);
const tubSource=JSON.parse(fs.readFileSync(path.join(root,'data/tub-acquisition.json'),'utf8'));
const tub=data.items.find(i=>i.category==='general_tool'&&i.id==='01');
assert.equal(tub.exchangeFishId,tubSource.fish.idHex);
assert.equal(tub.tubExchange.fishConsumed,true);
assert.equal(tub.tubExchange.repeatable,false);
assert(tub.playerUse.useLocations.some(l=>l.stage===2&&l.tileX===87&&l.tileY===27&&l.image));
for(const lang of ['en','ja','th'])assert.equal(tub.playerUse.summary[lang],tubSource.playerSummary[lang]);
assert(daikon.playerUse.useLocations.some(l=>l.stage===3&&l.tileX===21&&l.tileY===82&&l.image));
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
 if(kind==='fish')assert.equal(html.includes('data-fish-exchange'),['18','22'].includes(url.searchParams.get('id')),'Quest action attached to wrong fish');
 if(kind==='item'&&url.searchParams.get('category')==='food'&&url.searchParams.get('id')==='07'){assert(html.includes('data-daikon-choice'));assert(!html.includes('buying-decision'),'Daikon must not repeat unrelated key overview');assert(html.includes('id=18'));}
 assert(html&&!html.includes('กำลังโหลด'),`No render ${kind} ${query}`);
 validate(html,url);
 for(const n of Object.values(nodes))if(n.href)validate(`<a href="${n.href}"></a>`,url,true);
 for(const n of languages)if(n.href)validate(`<a href="${n.href}"></a>`,url,true);
 renderCount++;
 return {html,nodes,languages,url};
}
(async()=>{
 const quest=JSON.parse(fs.readFileSync(path.join(root,'data/quest-tool-use.json'),'utf8'));
 for(const itemId of ['0F','17','12']){const item=data.items.find(i=>i.category==='general_tool'&&i.id===itemId),towns=(item.playerUse.useLocations||[]).filter(loc=>loc.context==='town');const expected=itemId==='17'?quest.items['17'].rawTrace.chests:itemId==='0F'?[quest.items['0F'].rawTrace.acquisition]:quest.items['17'].rawTrace.chests.filter(chest=>chest.mapId===12);assert.equal(towns.length,expected.length,'Missing town acquisition/use points');for(const chest of expected){const loc=towns.find(point=>point.mapId===chest.mapId);assert(loc);assert.deepEqual([loc.tileX,loc.tileY],chest.xy);assert(loc.approach,'Town chest has no entrance image');assert(loc.approach.fullImage.includes('rom-field-'+String(chest.visibleArea).padStart(2,'0')));}}
 for(const lang of ['en','th','ja']){
  const suffix=lang==='en'?'':'.'+lang;
  for(const bait of data.items.filter(i=>i.category==='bait')){
   const routes=bait.playerUse.fishIdsByRoute||{};
   const fish=(routes.float||[]).find(id=>!(routes.sinker||[]).includes(id));
   if(!fish)continue;
   for(const route of ['float','sinker']){
    const result=await render('item',lang,new URLSearchParams({category:'bait',id:bait.id,fish,route}));
    const status=unescape(result.html.match(/class="play-target"[^>]*>[\s\S]*?<br>([\s\S]*?)<\/p>/)?.[1]||'');
    assert(status,'Missing route-specific bait status');
    assert(result.html.includes('data-bait-target-action="'+((routes[route]||[]).includes(fish)?'accepted':'rejected')+'"'),'Bait rig choice must be actionable before shops');
    if(!(routes[route]||[]).includes(fish))assert(result.html.includes('data-switch-bait-route'),'Rejected bait rig must link the accepted rig');
    const actualAccepted=(routes[route]||[]).includes(fish);
    const yes={en:'This fish is in the item’s recorded compatible list.',th:'ปลานี้อยู่ในรายชื่อที่ไอเท็มชิ้นนี้ผ่านเงื่อนไข',ja:'この魚は道具の適合リストに含まれています。'}[lang];
    assert.equal(status.includes(yes),actualAccepted,'Target compatibility must respect bait rig: '+bait.id+'/'+route);
    assert(status.startsWith({en:{float:'Float rig:',sinker:'Sinker rig:'},th:{float:'ชุดทุ่น:',sinker:'ชุดตะกั่ว:'},ja:{float:'ウキ仕掛け:',sinker:'オモリ仕掛け:'}}[lang][route]),'Selected rig is absent from status');
    const compare=result.html.match(/class="detail-grid rod-alternatives">([\s\S]*?)<\/div>/)?.[1]||'';
    for(const match of compare.matchAll(/href="([^"]+)"/g)){
     const next=new URL(unescape(match[1]),result.url);
     if(next.searchParams.get('category')==='bait')assert.equal(next.searchParams.get('route'),route,'Bait comparison lost the selected rig');
    }
   }
  }
  for(const item of data.items){
   const result=await render('item',lang,new URLSearchParams({category:item.category,id:item.id,return:`index${suffix}.html?category=${item.category}#catalogue`}));
   assert(result.html.includes('class="detail-hero"')&&!result.html.includes('class="empty-state"'),`Item render failed ${item.category}:${item.id}`);
   assert(result.html.includes('class="evidence"'),`No collapsed evidence ${item.category}:${item.id}`);
   const visible=result.html.split('<details class="evidence"')[0];
   if(item.baitLureDecision){
    const advice=item.baitLureDecision;
    assert(visible.includes('data-bait-lure-decision'),'Bait/lure advice must be visible');
    for(const key of ['label','recommendation','reason'])assert(advice[key]?.[lang]&&unescape(visible).includes(advice[key][lang]),'Missing localized bait/lure '+key+': '+item.category+':'+item.id);
    for(const ref of advice.alternatives||[])assert(visible.includes('category='+ref.category+'&amp;id='+ref.id)||visible.includes('category='+ref.category+'&id='+ref.id),'Missing comparison link '+item.category+':'+item.id);
   }
   const breadcrumb=unescape(visible.match(/<nav class="detail-breadcrumb"><a href="([^"]+)"/)?.[1]||'');
   const browse=new URL(breadcrumb,result.url),flyPart=['fly','fly_wing','fly_tail'].includes(item.category);
   assert.equal(browse.searchParams.get('category'),flyPart?'flymaker':item.category,'Item category breadcrumb mismatch');
   if(flyPart)assert.equal(browse.searchParams.get('part'),item.category,'Fly part breadcrumb lost');

   const shopRoutes=[...visible.matchAll(/href="([^"]*shops(?:\.th|\.ja)?\.html[^"]*)"/g)].map(match=>new URL(unescape(match[1]),result.url));
   const expectedShopStages=new Set((flyPart?data.items.filter(body=>body.category==='fly').flatMap(body=>(body.playerUse?.shops||[]).filter(shop=>shop.bundle?.[item.category==='fly'?'body':item.category==='fly_wing'?'wing':'tail']===item.id)):item.playerUse?.shops||[]).map(shop=>String(shop.stage)));
   assert.deepEqual([...new Set(shopRoutes.map(route=>route.searchParams.get('stage')))].sort(),[...expectedShopStages].sort(),'Missing seller navigation for '+item.category+':'+item.id);
   for(const route of shopRoutes){assert.equal(route.searchParams.get('place'),'town');assert.equal(route.searchParams.get('category'),item.category);assert.equal(route.searchParams.get('id'),item.id);const back=new URL(route.searchParams.get('return'),result.url);assert.equal(back.searchParams.get('id'),item.id);}

   if(item.category==='general_tool'&&item.id==='01'){assert(visible.includes('data-tub-choice'),'Tub needs a Hariyo route');assert(!visible.includes('data-daikon-choice'),'Tub must not use Daikon action');}
   if(item.category==='food'&&['09','0A'].includes(item.id))assert(visible.includes('data-mushroom-alternative'),'Missing practical mushroom alternative');
   if(['hook','float_weight'].includes(item.category)&&!item.gearDecision)for(const fact of item.playerUse?.facts?.[lang]||[])assert(unescape(visible).includes(fact),`Confirmed practical fact hidden: ${item.category}:${item.id}`);
   if(item.gearDecision){
    for(const field of ['label','recommendation','reason'])assert(unescape(visible).includes(item.gearDecision[field][lang]),'Gear advice hidden '+item.category+':'+item.id+'/'+field+'/'+lang);
    for(const id of item.gearDecision.targetFish||[])assert(visible.includes('id='+id),'Named hook fish has no next action');
    if(item.category.startsWith('fly')&&item.category!=='fly')assert(visible.includes('data-fly-next'),'Fly part advice has no next action');
    for(const fact of item.playerUse.facts?.[lang]||[])assert(unescape(result.html).includes(fact),'Original gear evidence lost');
   }
   if(item.netGatherArea){assert(visible.includes('data-bait-gather-choice')&&unescape(visible).includes('category=general_tool&id=04'),'Missing net gathering alternative');}
   if(item.acquisitionOptions?.length){assert(visible.includes('data-acquisition-choice'),'Missing front acquisition action');assert(visible.indexOf('data-acquisition-choice')<visible.indexOf('id="use-locations"'),'Acquisition must precede full map details');}
   for(const loc of item.playerUse.useLocations||[])if(loc.action)assert(unescape(visible).includes(loc.action[lang]),'Acquisition preparations hidden '+item.category+':'+item.id);
   if(item.category.startsWith('fly'))assert(visible.includes('data-fly-maker')&&visible.includes('#fly-instructions'),'Fly detail has no custom maker action');
   if(item.category==='rod')assert(visible.includes('buying-decision'),`Rod purchase decision missing ${item.id}`);
   if(item.category==='rod'){assert(item.rodDecision,'Missing rod decision '+item.id);for(const field of ['label','recommendation','reason'])assert(unescape(visible).includes(item.rodDecision[field][lang]),'Rod advice hidden '+item.id+'/'+field+'/'+lang);assert(visible.includes('data-rod-decision="'+item.id+'"'),'Per-rod decision missing');assert(!visible.includes('fightResponseCode'),'Branch code leaked above technical evidence');}
   if(item.category==='general_tool'&&['08','09','0A'].includes(item.id))assert(visible.includes(lang==='en'?'movement can be steered':lang==='th'?'ชี้ทิศ':'進行方向'),`Chum steering list mislabeled ${item.id}`);
   if(item.keepnetCapacity)assert(visible.includes('data-keepnet-choice'),'Keepnet comparison missing '+item.id);
   for(const loc of item.playerUse?.useLocations||[])if(loc.image)assert(visible.includes(`src="${loc.image}"`),`Use map hidden ${item.id}/${loc.stage}`);
   for(const loc of item.playerUse?.useLocations||[])if(loc.context==='town'){assert.equal(loc.mapId,loc.stage+6);assert.equal(loc.fullImage,`maps/rom-town-${String(loc.mapId).padStart(2,'0')}.png`);assert(Number.isInteger(loc.townEntranceOrdinal),'Missing paired town room');assert(visible.includes(lang==='th'?'ในเมือง':lang==='ja'?'町内':'In town'),'Town location context hidden');if(loc.rewardItem&&!(loc.rewardItem.category===item.category&&loc.rewardItem.id===item.id))assert(visible.includes(`category=${loc.rewardItem.category}&amp;id=${loc.rewardItem.id}`),'Chest reward link missing');}

   assert(result.nodes['detail-back'].href.includes(`#catalogue`),'Lost item return context');
  }
  for(const id of fishIds){
   const result=await render('fish',lang,new URLSearchParams({id,stage:'3',return:`maps${suffix}.html?stage=3&fish=${id}`}));
   assert(result.html.includes('class="detail-hero"'),`Fish render failed ${id}`);
   assert(result.nodes['fish-back'].href.includes(`fish=${id}`),'Lost fish return context');
   for(const targetLang of ['en','th','ja']){
    const target=result.nodes['language-'+targetLang];
    const targetSuffix=targetLang==='en'?'':'.'+targetLang;
    const switched=new URL(target.href,result.url),back=switched.searchParams.get('return');
    assert(back&&new URL(back,result.url).pathname.endsWith('maps'+targetSuffix+'.html'),'Fish language switch loses return language');
   }

   if(id==='43')assert(!/class="route-button"[^>]*maps[^>]*>/.test(result.html),'Unconfirmed profile 43 spawn route');
  }
  const nestedReturn=`item${suffix}.html?category=food&id=07&return=${encodeURIComponent('maps'+suffix+'.html?stage=3&fish=18')}`;
  const nestedResult=await render('fish',lang,new URLSearchParams({id:'18',stage:'3',return:nestedReturn}));
  for(const targetLang of ['en','th','ja']){
   const targetSuffix=targetLang==='en'?'':'.'+targetLang;
   const switched=new URL(nestedResult.nodes['language-'+targetLang].href,nestedResult.url);
   const firstBack=new URL(switched.searchParams.get('return'),nestedResult.url);
   const secondBack=new URL(firstBack.searchParams.get('return'),nestedResult.url);
   assert(firstBack.pathname.endsWith('item'+targetSuffix+'.html'));
   assert(secondBack.pathname.endsWith('maps'+targetSuffix+'.html'));
   assert.equal(firstBack.searchParams.get('category'),'food');assert.equal(firstBack.searchParams.get('id'),'07');
   assert.equal(secondBack.searchParams.get('fish'),'18');assert.equal(secondBack.searchParams.get('stage'),'3');
  }
  for(const kind of ['fish','item'])for(const bad of ['','id=GG','id=FF&category=lure']){
   const result=await render(kind,lang,bad);
   assert(result.html.includes('empty-state'),`Invalid entity lacks recovery ${kind} ${bad}`);
  }
  for(const [fishId,record] of Object.entries(locations.fish))for(const area of record.locations||[]){
   const stage=String(area.stage), result=await render('fish',lang,new URLSearchParams({id:fishId,stage}));
   const kit=result.html.match(/class="detail-section reusable-kit" data-kit="([^"]+)" data-coverage="(\d+)" data-total="(\d+)" data-local="(true|false)"/);
   const lures=data.items.filter(item=>item.category==='lure'), lureProfiles=new Set(lures.flatMap(item=>item.playerUse?.fishIds||[]));
   assert.equal(Boolean(kit),lureProfiles.has(fishId),'Reusable kit must be limited to lure-compatible fish');
   if(kit){
    const pair=kit[1].split('+').map(id=>lures.find(item=>item.id===id));assert(pair.every(Boolean),'Kit unknown item');
    const covered=new Set(pair.flatMap(item=>item.playerUse.fishIds));assert.deepEqual([...covered].sort(),[...lureProfiles].sort(),'Kit lacks complete lure compatibility coverage');
    assert.equal(Number(kit[2]),covered.size);assert.equal(Number(kit[3]),pair.reduce((sum,item)=>sum+item.priceYen,0),'Kit total wrong');
    const stockHere=item=>item.playerUse.shops.some(shop=>String(shop.stage)===stage&&!shop.condition);
    assert.equal(kit[4],String(pair.every(stockHere)),'Kit stocking claim wrong');
    const referencePairs=[['17','23'],['2E','23']].map(ids=>ids.map(id=>lures.find(item=>item.id===id)));
    const localPairs=referencePairs.filter(candidate=>candidate.every(stockHere));
    assert.equal(kit[4],String(Boolean(localPairs.length)),'Locally complete kit ignored');
    assert.equal(Number(kit[3]),Math.min(...(localPairs.length?localPairs:referencePairs).map(candidate=>candidate.reduce((sum,item)=>sum+item.priceYen,0))),'Kit not cheapest among confirmed coverage pairs');
   }
   const backups=data.flyBackupChoices?.profiles?.[fishId]?.bundles||[];
   const expectedBackup=data.items.some(item=>item.category==='fly'&&item.playerUse.fishIds.includes(fishId));
   assert.equal(backups.length,expectedBackup?3:0,'Missing/extra fallback profile');
   const fallback=result.html.match(/class="detail-section fly-fallback" data-total="(\d+)"/);
   assert.equal(Boolean(fallback),expectedBackup,'Fly backup recommendations outside common body profile set');
   if(fallback){
    let total=0;
    for(const def of backups){const body=data.items.find(item=>item.category==='fly'&&item.id===def.body), offer=body.playerUse.shops.find(shop=>shop.stage===def.stage&&shop.bundle?.body===def.body&&shop.bundle?.wing===def.wing&&shop.bundle?.tail===def.tail);assert(offer,'Backup bundle not sold as claimed');total+=offer.bundle.shopPriceYen;assert(result.html.includes('data-bundle="'+def.body+'/'+def.wing+'/'+def.tail+'" data-price="'+offer.bundle.shopPriceYen+'"'),'Wrong backup parts/price');}
    assert.equal(Number(fallback[1]),total);
    const dryAccepted=data.items.find(item=>item.category==='fly'&&item.id==='3E').playerUse.fishIds.includes(fishId);
    assert.equal(total,dryAccepted?17:30,'Unexpected minimum-cost backup choice');
    for(let hiddenBody=0;hiddenBody<4;hiddenBody++)for(let hiddenWing=0;hiddenWing<4;hiddenWing++)assert(backups.some(def=>(parseInt(def.body,16)&3)!==hiddenBody&&(parseInt(def.wing,16)&3)!==hiddenWing),'Three-fly set fails a stored hidden pair');
   }
   const visibleFish=result.html.split('<details class="evidence"')[0];
   assert(!visibleFish.includes('spawn slots in the ROM table')&&!visibleFish.includes('ช่องเกิดปลาในตาราง ROM')&&!visibleFish.includes('ROMテーブルの出現枠'),'Raw spawn-slot count leaked into player area cards');
   const offered=[...result.html.matchAll(/class="detail-section starter-offer" id="starter-[^"]+" data-method="([^"]+)" data-item="([^"]+)" data-price="(\d+)"/g)];
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
    const rodCard=[...result.html.matchAll(/data-method-rod="([^"]+)" data-rod="([^"]+)" data-rod-local="(true|false)"/g)].find(row=>row[1]===method);
    assert.equal(Boolean(rodCard),Boolean(card),'Missing method-matched rod');
    if(rodCard){
     const style={float:1,sinker:2,lure:4,fly:8}[method];
     const available=data.items.filter(item=>item.category==='rod'&&item.decodedFields.styleCode===style&&item.playerUse.shops.length);
     const local=available.filter(item=>item.playerUse.shops.some(shop=>String(shop.stage)===stage&&!shop.condition));
     const chosen=available.find(item=>item.id===rodCard[2]);assert(chosen,'Wrong rod style');
     assert.equal(rodCard[3],String(Boolean(local.length)));
     assert.equal(chosen.priceYen,Math.min(...(local.length?local:available).map(item=>item.priceYen)));
    }
    if(card){
     const minimum=Math.min(...candidates.map(x=>x.price));assert.equal(Number(card[3]),minimum,'Starter price is not lowest eligible offer');assert(candidates.some(x=>x.key===card[2]&&x.price===minimum),'Starter item is incompatible or not stocked');
     const nextOffer=offered.find(row=>row.index>card.index);
     const offerHtml=result.html.slice(card.index,nextOffer?.index||result.html.length);
     if(['float','sinker'].includes(method)){
      assert(offerHtml.includes('data-method-rig="'+method+'"'),'Missing bait rig preparation');
      assert(offerHtml.includes('docs/hook-practical-research.md'),'Rig selection lacks evidence link');
      let localSum=Number(card[3]),allLocal=rodCard[3]==='true';
      localSum+=data.items.find(item=>item.category==='rod'&&item.id===rodCard[2]).priceYen;
      for(const role of ['hook',method]){
       const match=[...offerHtml.matchAll(/data-rig-role="([^"]+)" data-rig-item="([^"]+)" data-rig-local="(true|false)"/g)].find(row=>row[1]===role);
       assert(match,'Missing equipment role '+role);
       const possible=data.items.filter(item=>Number.isFinite(item.priceYen)&&item.playerUse?.shops?.length&&(role==='hook'?item.category==='hook'&&item.rawFields['+1']===0:item.category==='float_weight'&&(method==='float'?parseInt(item.id,16)<=8:parseInt(item.id,16)>=9)));
       const local=possible.filter(item=>item.playerUse.shops.some(shop=>String(shop.stage)===stage&&!shop.condition));
       const chosen=possible.find(item=>item.id===match[2]);assert(chosen,'Wrong equipment role');
       assert.equal(match[3],String(Boolean(local.length)),'Wrong local rig availability');
       assert.equal(chosen.priceYen,Math.min(...(local.length?local:possible).map(item=>item.priceYen)),'Rig equipment price not minimum');
       localSum+=chosen.priceYen;allLocal=allLocal&&match[3]==='true';
       const p=new URLSearchParams({category:chosen.category,id:chosen.id,fish:fishId,stage,route:method});
       const hrefs=[...offerHtml.matchAll(/href="([^"]+)"/g)].map(row=>new URL(unescape(row[1]),'https://local.test/catalogue/fish.html'));
       assert(hrefs.some(url=>[...p].every(([key,value])=>url.searchParams.get(key)===value)&&url.searchParams.get('return')?.endsWith('#starter-'+method)),'Rig item link lost method, fish, area or return section');
      }
      const total=offerHtml.match(/data-rig-total="(\d+)"/);
      assert.equal(Boolean(total),allLocal,'New purchase total implies missing local stock');
      if(total)assert.equal(Number(total[1]),localSum,'Four-item new purchase total wrong');
      if(method==='sinker'){
       const localSinker=data.items.some(item=>item.category==='float_weight'&&parseInt(item.id,16)>=9&&item.playerUse.shops.some(shop=>String(shop.stage)===stage&&!shop.condition));
       const floatAvailable=offered.some(row=>row[1]==='float');
       assert.equal(offerHtml.includes('data-rig-fallback="float"'),!localSinker&&floatAvailable,'Missing/incorrect local float alternative');
      }
     }else assert(offerHtml.includes('method-equipment-note'),'Missing lure/fly equipment purchase exclusion');
    }
   }
  }
  const invalidTarget=await render('item',lang,new URLSearchParams({category:'lure',id:'2E',fish:'FF',stage:'999'}));
  assert(invalidTarget.html.includes('class="detail-hero"')&&!invalidTarget.html.includes('play-target'),'Invalid fish target breaks a valid item');
  for(const route of ['float','sinker']){
   const result=await render('item',lang,new URLSearchParams({category:'bait',id:'01',fish:'06',route}));
   assert(result.html.includes(`id="rig-${route}"`),`Missing rig route ${route}`);
  }
  for(const folder of ['catalogue','research']){
   const file=path.join(root,folder,`index${suffix}.html`),html=fs.readFileSync(file,'utf8');
   validate(html,new URL(`https://example.test/${folder}/index${suffix}.html`));
   if(folder==='catalogue'){
    const nodes={};const node=id=>nodes[id]||=({innerHTML:'',textContent:'',value:id==='category-filter'?'all':id==='sort-filter'?'id':'',addEventListener(){},setAttribute(){},removeAttribute(){}});
    const document={documentElement:{dataset:{locale:lang}},querySelector:selector=>selector.startsWith('#')?node(selector.slice(1)):null,querySelectorAll:()=>[],getElementById:node,addEventListener(){}};
    const source=fs.readFileSync(path.join(root,'catalogue/gallery.js'),'utf8').replace("let chosen='rod'","let chosen='all'");
    vm.runInNewContext(source,{document,console,URL,URLSearchParams,fetch:async()=>({ok:true,json:async()=>data})});
    await new Promise(r=>setImmediate(r));
    const rodNodes={};const rodNode=id=>rodNodes[id]||=({innerHTML:'',textContent:'',value:id==='category-filter'?'rod':id==='sort-filter'?'id':'',addEventListener(){},setAttribute(){},removeAttribute(){}});
    const rodDocument={documentElement:{dataset:{locale:lang}},querySelector:selector=>selector.startsWith('#')?rodNode(selector.slice(1)):null,querySelectorAll:()=>[],getElementById:rodNode,addEventListener(){}};
    vm.runInNewContext(fs.readFileSync(path.join(root,'catalogue/gallery.js'),'utf8'),{document:rodDocument,console,URL,URLSearchParams,fetch:async()=>({ok:true,json:async()=>data})});
    await new Promise(r=>setImmediate(r));
    const rodTable=rodNode('rod-comparison').innerHTML;
    assert.equal((rodTable.match(/class="rod-table-advice"/g)||[]).length,21,'All rods have comparison advice '+lang);
    for(const rod of data.items.filter(i=>i.category==='rod'))assert(unescape(rodTable).includes(rod.rodDecision.label[lang]),'Missing table decision '+rod.id+'/'+lang);
    assert.equal((rodTable.match(new RegExp('<td>'+(lang==='th'?'ไม่พบในร้าน':lang==='ja'?'店頭在庫なし':'No recorded shop stock')+'</td>','g'))||[]).length,4,'Do not present raw prices as shop offers');
    const cards=node('cards').innerHTML;
    assert.equal((cards.match(/class="item-card/g)||[]).length,315,'Catalogue all-items renderer');
    validate(cards,new URL(`https://example.test/catalogue/index${suffix}.html`));
    for(const item of data.items){
     const card=cards.match(new RegExp(`<article class="item-card[^]*?id="item-${item.category}-${item.id}"([^]*?)</article>`))?.[1];
     assert(card&&card.includes(`category=${item.category}&amp;id=${item.id}`),`Missing catalogue item detail ${item.category}:${item.id}`);
     if(item.netGatherArea){assert(card.includes('data-bait-gather-choice')&&unescape(card).includes('category=general_tool&id=04'),'Missing net gathering alternative');}
   if(item.acquisitionOptions?.length)assert(card.includes('data-acquisition-choice')&&card.includes('#use-locations'),'Acquisition card lacks next action');
     if(item.category.startsWith('fly'))assert(card.includes('data-fly-maker')&&card.includes('#fly-instructions'),'Fly card has no custom maker action');
     assert(/<figure class="sprite"><a /.test(card),`Unlinked portrait ${item.category}:${item.id}`);
     assert(/<h3><a class="entity-title"/.test(card),`Unlinked name ${item.category}:${item.id}`);
     if(item.category==='rod'){assert(item.rodDecision,'Missing rod decision '+item.id);const front=card.split('<details class="record-details"')[0];for(const field of ['label','recommendation','reason'])assert(unescape(front).includes(item.rodDecision[field][lang]),'Catalogue rod decision hidden '+item.id+'/'+field+'/'+lang);assert(!front.includes('compatible-fish'),'Rod response fish disguised as gameplay suitability');assert(!front.includes('fightResponseCode'),'Branch selector in rod card');}
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
  const fromShop=await render(kind,'th',new URLSearchParams({...baseQuery,return:'shops.th.html?stage=3&place=town&category=bait&id=17'}),prefix);
  assert(fromShop.nodes[kind==='fish'?'fish-back':'detail-back'].href.includes('shops.th.html?stage=3'),'Shop return lost');
 }
 console.log(`PASS: ${renderCount} localized detail renders; ${linkCount} local links/assets and entity IDs checked. All 315 item and 73 fish profiles covered. Browser click checks are separate.`);
})().catch(error=>{console.error(error);process.exitCode=1});
