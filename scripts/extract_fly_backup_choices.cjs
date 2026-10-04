#!/usr/bin/env node
// Derive minimum-cost three-bundle backups from existing ROM-extracted stock/masks.
// This checks one hidden gate; it does not simulate a bite or catch.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const stock=JSON.parse(fs.readFileSync(path.join(root,'data/shop-stock-rom.json'),'utf8'));
const acceptance=JSON.parse(fs.readFileSync(path.join(root,'data/fish-acceptance.json'),'utf8'));
assert.equal(stock.romSha1,acceptance.rom.sha1,'Input ROM identities differ');
const bodies=new Map(acceptance.fly_bodies.map(body=>[body.id_hex,body]));
const offers=stock.areas.flatMap(area=>{
 assert.equal(area.flyBundles.length,8);assert(area.flyBundles.every(bundle=>bundle.body!=='00'),'Menu order must account for skipped empty entries');
 return area.flyBundles.map(bundle=>({stage:area.stage,slot:bundle.slot,body:bundle.body,wing:bundle.wing,tail:bundle.tail,priceYen:bundle.shopPriceYen,bodyGroup:parseInt(bundle.body,16)&3,wingGroup:parseInt(bundle.wing,16)&3}));
});
const profiles=[...new Set(acceptance.fly_bodies.flatMap(body=>body.fish_ids_passing_mask_gate))].sort();
const choices={};
for(const fish of profiles){
 const eligible=offers.filter(offer=>bodies.get(offer.body)?.fish_ids_passing_mask_gate.includes(fish));
 const candidates=[];
 for(let a=0;a<eligible.length;a++)for(let b=a+1;b<eligible.length;b++)for(let c=b+1;c<eligible.length;c++){
  const triple=[eligible[a],eligible[b],eligible[c]];
  if(new Set(triple.map(offer=>offer.bodyGroup)).size!==3||new Set(triple.map(offer=>offer.wingGroup)).size!==3)continue;
  for(let body=0;body<4;body++)for(let wing=0;wing<4;wing++)assert(triple.some(offer=>offer.bodyGroup!==body&&offer.wingGroup!==wing),'Hidden gate not covered');
  candidates.push({totalYen:triple.reduce((sum,offer)=>sum+offer.priceYen,0),bundles:triple});
 }
 candidates.sort((a,b)=>a.totalYen-b.totalYen||JSON.stringify(a.bundles).localeCompare(JSON.stringify(b.bundles)));
 if(candidates.length)choices[fish]=candidates[0];
}
const result={schemaVersion:1,romSha1:stock.romSha1,scope:'Cheapest three ready-made bundles across all six recorded area stocks that each pass the target body profile mask and collectively avoid the body/wing equality block for any unchanged hidden pair. Not bite/landing odds. Two bundles cannot cover all hidden pairs: a hidden body group matching the first and wing group matching the second blocks both.',sources:['data/shop-stock-rom.json','data/fish-acceptance.json','docs/fly-selection-practical-research.md'],profiles:choices};
fs.writeFileSync(path.join(root,'data/fly-backup-choices.json'),JSON.stringify(result,null,2)+'\n');
console.log(`Derived ${Object.keys(choices).length} target-specific fly backups; minimum totals: ${[...new Set(Object.values(choices).map(choice=>choice.totalYen))].sort((a,b)=>a-b).join(', ')} yen.`);
