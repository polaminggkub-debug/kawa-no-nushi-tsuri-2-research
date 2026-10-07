#!/usr/bin/env node
// Derive the ready-made fly choices for every fly fish from the ROM-extracted stock, masks and fight data.
// A fly bites when its body passes the fish's mask and neither its body id nor its wing id leaves the
// same remainder (id % 4) as the save's hidden pair (docs/gear-effects.md, ROM audit 2026-10-07).
// A fresh save holds the pair (body 1, wing 2); resting at an inn can re-roll it.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const stock=JSON.parse(fs.readFileSync(path.join(root,'data/shop-stock-rom.json'),'utf8'));
const acceptance=JSON.parse(fs.readFileSync(path.join(root,'data/fish-acceptance.json'),'utf8'));
const effects=JSON.parse(fs.readFileSync(path.join(root,'data/gear-effects.json'),'utf8'));
assert.equal(stock.romSha1,acceptance.rom.sha1,'Input ROM identities differ');
const FRESH={body:1,wing:2};
const bodies=new Map(acceptance.fly_bodies.map(body=>[body.id_hex,body]));
const offers=stock.areas.flatMap(area=>{
 assert.equal(area.flyBundles.length,8);assert(area.flyBundles.every(bundle=>bundle.body!=='00'),'Menu order must account for skipped empty entries');
 return area.flyBundles.map(bundle=>({stage:area.stage,slot:bundle.slot,body:bundle.body,wing:bundle.wing,tail:bundle.tail,priceYen:bundle.shopPriceYen,bodyGroup:parseInt(bundle.body,16)&3,wingGroup:parseInt(bundle.wing,16)&3}));
});
const strip=({bodyGroup,wingGroup,...offer})=>offer;
const worksOnFreshSave=offer=>offer.bodyGroup!==FRESH.body&&offer.wingGroup!==FRESH.wing;
const byPrice=(a,b)=>a.priceYen-b.priceYen||a.stage-b.stage||a.slot-b.slot;
// Best fight start per fish: the body selector (0 other families, 1 Caddis and hoppers) from the measured gear table.
function fightFamily(fish){
 const entry=effects.fish[String(parseInt(fish,16))]?.methods?.fly;
 if(!entry)return null;
 const best=entry.slots.fly[0][1];
 const selectors=new Set(best.map(id=>effects.items.fly[String(id)].sel));
 return selectors.size===1&&selectors.has(0)?'other':'caddis';
}
const profiles=[...new Set(acceptance.fly_bodies.flatMap(body=>body.fish_ids_passing_mask_gate))].sort();
const choices={};
for(const fish of profiles){
 const eligible=offers.filter(offer=>bodies.get(offer.body)?.fish_ids_passing_mask_gate.includes(fish));
 const starters=eligible.filter(worksOnFreshSave).sort(byPrice);
 const starterByStage={};
 for(const offer of starters)if(!starterByStage[offer.stage])starterByStage[offer.stage]=strip(offer);
 const candidates=[];
 for(let a=0;a<eligible.length;a++)for(let b=a+1;b<eligible.length;b++)for(let c=b+1;c<eligible.length;c++){
  const triple=[eligible[a],eligible[b],eligible[c]];
  if(new Set(triple.map(offer=>offer.bodyGroup)).size!==3||new Set(triple.map(offer=>offer.wingGroup)).size!==3)continue;
  for(let body=0;body<4;body++)for(let wing=0;wing<4;wing++)assert(triple.some(offer=>offer.bodyGroup!==body&&offer.wingGroup!==wing),'Hidden gate not covered');
  candidates.push({totalYen:triple.reduce((sum,offer)=>sum+offer.priceYen,0),bundles:triple.sort((x,y)=>Number(worksOnFreshSave(y))-Number(worksOnFreshSave(x))||byPrice(x,y)).map(strip)});
 }
 candidates.sort((a,b)=>a.totalYen-b.totalYen||JSON.stringify(a.bundles).localeCompare(JSON.stringify(b.bundles)));
 if(candidates.length)choices[fish]={...candidates[0],starter:strip(starters[0]),starterByStage,fightFamily:fightFamily(fish)};
}
const result={schemaVersion:2,romSha1:stock.romSha1,freshSaveLock:FRESH,scope:'Ready-made fly choices across all six recorded area stocks for each fish a fly body can pass. starter: the cheapest bundle that passes the fish\'s body mask and is not blocked on a fresh save (hidden pair body 1, wing 2); starterByStage repeats that per area. bundles: the cheapest three bundles that pass the mask and differ in body group and wing group, so at least one works for every hidden pair; the ones a fresh save can use come first. fightFamily: the body selector that starts the fight best (caddis: Caddis and hopper bodies; other: the remaining families).',sources:['data/shop-stock-rom.json','data/fish-acceptance.json','data/gear-effects.json','docs/fly-selection-practical-research.md'],profiles:choices};
for(const [fish,choice] of Object.entries(choices))assert(choice.starter,`No fresh-save fly for fish ${fish}`);
fs.writeFileSync(path.join(root,'data/fly-backup-choices.json'),JSON.stringify(result,null,2)+'\n');
const starterTotals=[...new Set(Object.values(choices).map(choice=>choice.starter.priceYen))].sort((a,b)=>a-b);
console.log(`Derived ${Object.keys(choices).length} target-specific fly choices; starter prices ${starterTotals.join(', ')} yen; insurance totals: ${[...new Set(Object.values(choices).map(choice=>choice.totalYen))].sort((a,b)=>a-b).join(', ')} yen.`);
