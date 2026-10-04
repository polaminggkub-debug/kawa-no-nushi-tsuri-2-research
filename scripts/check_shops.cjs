#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'catalogue/shops.js'), 'utf8');
const gallery = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/gallery-data.json'), 'utf8'));
const stock = JSON.parse(fs.readFileSync(path.join(root, 'data/shop-stock-rom.json'), 'utf8'));
const locations = JSON.parse(fs.readFileSync(path.join(root, 'data/shop-locations-rom.json'), 'utf8'));
const mapManifest = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/maps/rom-map-manifest.json'), 'utf8'));

class Element {
  constructor(value = '') {
    this.value = value;
    this.checked = false;
    this.textContent = '';
    this.innerHTML = '';
    this.href = '';
    this.attributes = {};
    this.listeners = {};
  }
  addEventListener(event, callback) { this.listeners[event] = callback; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
}

async function renderPage({locale='en', query='', category='all', search='', stage=1, place='town', locationData=locations, loading=false} = {}) {
  const ids = [
    'stage-select','category-select','item-search','clear-filters','page-status','shop-results',
    'target-status','offer-count','location-section','location-area','location-map-id','location-heading',
    'location-summary','location-visuals','back-link','language-en','language-th','language-ja'
  ];
  const elements = Object.fromEntries(ids.map(id => [id, new Element()]));
  elements['stage-select'].value = String(stage);
  elements['category-select'].value = category;
  elements['item-search'].value = search;
  const radios = ['outdoor','town'].map(value => {
    const element = new Element(value);
    element.checked = value === place;
    return element;
  });
  const document = {
    documentElement: {dataset:{locale}},
    getElementById: id => elements[id] || null,
    querySelector: selector => selector === 'input[name="place"]:checked' ? radios.find(item => item.checked) : null,
    querySelectorAll: selector => selector === 'input[name="place"]' ? radios : []
  };
  const location = {
    origin:'https://site.test',
    pathname:`/kawa-no-nushi-tsuri-2-research/catalogue/shops${locale==='en'?'':'.'+locale}.html`,
    search:query ? `?${query}` : '',
    hash:'',
    get href() { return `${this.origin}${this.pathname}${this.search}${this.hash}`; }
  };
  const history = {replaceState(_state,_title,url) { const parsed = new URL(url, location.href); location.pathname=parsed.pathname; location.search=parsed.search; location.hash=parsed.hash; }};
  const responses = {
    'gallery-data.json':gallery,
    '../data/shop-stock-rom.json':stock,
    'maps/rom-map-manifest.json':mapManifest,
    '../data/shop-locations-rom.json':locationData
  };
  const context = {
    document, location, history, window:{}, URL, URLSearchParams,
    fetch:loading?()=>new Promise(()=>{}):async url => ({ok:Object.hasOwn(responses,url),json:async()=>responses[url]}),
    Image:class {}, console
  };
  vm.runInNewContext(js, context, {filename:'shops.js'});
  await new Promise(resolve => setImmediate(resolve));
  return {elements,radios,location};
}

function itemInStock(stage, category, id) {
  return stock.areas.find(area=>area.stage===stage)?.items.some(item=>item.category===category&&item.id===id) || false;
}

async function main() {
  assert.equal(stock.areas.length, 6, 'six area stock sets are present');
  for(const locale of ['en','th','ja']){
    const suffix=locale==='en'?'':'.'+locale;
    const result=await renderPage({locale,loading:true,query:new URLSearchParams({stage:'6',place:'town',category:'bait',id:'01',fish:'06',route:'sinker',return:'item'+suffix+'.html?category=bait&id=01&stage=6&fish=06&route=sinker'}).toString()});
    assert.equal(result.elements['shop-results'].innerHTML,'','Shop data is held pending');
    for(const targetLang of ['en','th','ja']){
      const targetSuffix=targetLang==='en'?'':'.'+targetLang,next=new URL(result.elements['language-'+targetLang].href,result.location.href);
      assert.equal(next.searchParams.get('stage'),'6');assert.equal(next.searchParams.get('fish'),'06');assert.equal(next.searchParams.get('route'),'sinker');assert.equal(next.searchParams.get('id'),'01');
      assert(new URL(next.searchParams.get('return'),result.location.href).pathname.endsWith('/item'+targetSuffix+'.html'),'Shop loading language loses return');
    }
    assert(result.elements['back-link'].href.includes('item'+suffix+'.html'),'Loading shop must keep back route');
  }

  assert.equal(locations.areas.length, 6, 'six area location maps are present');
  for (const area of locations.areas) {
    assert.ok(area.entrances.every(entry => entry.fieldTile && entry.townArrival), `area ${area.outdoorArea} has paired endpoints`);
    assert.ok(area.interactions.every(entry => entry.townTile && entry.interactionSlotHex), `area ${area.outdoorArea} has shop positions`);
  }

  for (let stage=1;stage<=6;stage++) {
    const town=await renderPage({locale:'en',query:`stage=${stage}&place=town`,stage,place:'town'});
    const townHtml=town.elements['location-visuals'].innerHTML;
    assert.match(townHtml,new RegExp(`rom-town-${String(stage+6).padStart(2,'0')}\\.png`),`area ${stage} town terrain image is selected`);
    assert.doesNotMatch(townHtml,/data-x="255"|data-y="255"/,`area ${stage} excludes out-of-bounds map markers`);
    assert.doesNotMatch(townHtml,/unclassified-interaction/,`area ${stage} does not label an unexplained interaction as a shop`);
    assert.ok(town.elements['shop-results'].innerHTML.includes('data-offer='),`area ${stage} renders ROM stock offers`);
    const field=await renderPage({locale:'en',query:`stage=${stage}&place=area`,stage,place:'outdoor'});
    assert.match(field.elements['location-visuals'].innerHTML,new RegExp(`rom-field-${String(stage).padStart(2,'0')}\\.png`),`area ${stage} field terrain image is selected`);
  }

  const special = await renderPage({locale:'en',query:'stage=4&place=town&category=rod&id=0D&fish=38&route=float&return=%2Fkawa-no-nushi-tsuri-2-research%2Fcatalogue%2Fitem.html%3Fcategory%3Drod%26id%3D0D',category:'rod',stage:4,place:'town'});
  const townHtml=special.elements['location-visuals'].innerHTML;
  const stockHtml=special.elements['shop-results'].innerHTML;
  assert.match(townHtml,/Special rod seller/, 'special rod target points to the special seller');
  assert.match(townHtml,/entrance 5/i, 'verified special seller access names the fifth entrance');
  assert.match(townHtml,/arrival at 7, 77/, 'paired arrival at town tile X 7, Y 77 is shown');
  assert.match(townHtml,/data-y="74"/, 'seller at town tile Y 74 is shown');
  assert.match(townHtml,/place=area.*entrance=4/, 'seller card opens the paired outdoor entrance on the field map');
  assert.match(townHtml,/href="[^"]*#special-stock"/, 'seller card links to its matching stock group');
  assert.doesNotMatch(townHtml,/Regular equipment shop/, 'special rod target does not point to the regular shop');
  assert.match(stockHtml,/data-offer="rod:0D"/, 'selected special rod appears as a clickable offer');
  const itemLinkMatch=stockHtml.match(/href="(item(?:\.th|\.ja)?\.html\?[^"]+)"/);
  assert.ok(itemLinkMatch, 'offer card links to its item detail');
  const itemUrl=new URL(itemLinkMatch[1].replaceAll('&amp;','&'),special.location.href);
  assert.match(itemUrl.searchParams.get('return')||'',/\/catalogue\/shops\.html\?stage=4&place=town&category=rod&id=0D/, 'item detail keeps the shop view as its return path');
  assert.equal(itemUrl.searchParams.get('stage'),'4','Item detail loses the current shop area');
  assert.equal(itemUrl.searchParams.get('fish'),'38','Equipment detail loses selected fish');
  assert.equal(itemUrl.searchParams.get('route'),'float','Equipment detail loses selected bait rig');
  assert.match(special.elements['language-th'].href,/stage=4.*place=town.*category=rod.*id=0D/, 'language switch keeps area, seller view, and target item');
  assert.match(special.elements['language-th'].href,/item\.th\.html/, 'language switch localizes the saved item return route');
  assert.match(special.elements['language-th'].href,/fish=38.*route=float/, 'language switch preserves the selected fish and rig');
  for(const locale of ['en','th','ja'])for(const stage of [1,2,3,4,5,6]){
    const result=await renderPage({locale,stage,query:`stage=${stage}&place=town&fish=06&route=sinker`,place:'town'});
    const itemLinks=[...result.elements['shop-results'].innerHTML.matchAll(/href="(item(?:\.th|\.ja)?\.html\?[^"]+)"/g)];
    assert(itemLinks.length,'Missing stock-detail actions');
    for(const match of itemLinks){
      const next=new URL(match[1].replaceAll('&amp;','&'),result.location.href),category=next.searchParams.get('category'),id=next.searchParams.get('id');
      const fishRelevant=['rod','bait','lure','hook','float_weight','fly','fly_wing','fly_tail'].includes(category)||category==='general_tool'&&['03','04','08','09','0A','0E'].includes(id);
      assert.equal(next.searchParams.get('stage'),String(stage),'Shop offer loses area/'+locale+'/'+category+':'+id);
      assert.equal(next.searchParams.get('fish'),fishRelevant?'06':null,'Selected fish relevance mismatch/'+category+':'+id);
      assert.equal(next.searchParams.get('route'),fishRelevant?'sinker':null,'Selected rig relevance mismatch/'+category+':'+id);
      const back=new URL(next.searchParams.get('return'),result.location.href);
      assert.equal(back.searchParams.get('stage'),String(stage));assert.equal(back.searchParams.get('fish'),'06');assert.equal(back.searchParams.get('route'),'sinker');
    }
  }
  const mapOrigin='maps.th.html?stage=3&fish=06&return='+encodeURIComponent('../research/index.th.html');
  const itemOrigin='item.th.html?category=bait&id=01&stage=3&fish=06&return='+encodeURIComponent(mapOrigin);
  const nested=await renderPage({locale:'th',stage:3,query:new URLSearchParams({stage:'3',fish:'06',route:'sinker',return:itemOrigin}).toString()});
  for(const locale of ['en','th','ja']){
    const suffix=locale==='en'?'':'.'+locale;
    let route=new URL(nested.elements['language-'+locale].href,nested.location.href).searchParams.get('return');
    for(const basename of ['item','maps','index']){
      const next=new URL(route,nested.location.href);
      assert(next.pathname.endsWith('/'+basename+suffix+'.html'),'Nested shop return loses language/'+basename+'/'+locale);
      route=next.searchParams.get('return');
    }
  }
  const badNested=await renderPage({locale:'en',query:new URLSearchParams({return:'item.html?category=bait&id=01&return='+encodeURIComponent('https://evil.example/catalogue/maps.html')}).toString()});
  const safeNested=new URL(new URL(badNested.elements['language-th'].href,badNested.location.href).searchParams.get('return'),badNested.location.href);
  assert(!safeNested.searchParams.has('return'),'Nested external return must be removed');

  const regular=await renderPage({locale:'en',query:'stage=1&place=town&category=rod&id=03',category:'rod',stage:1,place:'town'});
  assert.match(regular.elements['location-visuals'].innerHTML,/Regular equipment shop/, 'ordinary rod target points to the regular equipment shop');
  assert.match(regular.elements['location-visuals'].innerHTML,/entrance 2/i, 'regular shop identifies its tested paired entrance');
  assert.match(regular.elements['location-visuals'].innerHTML,/href="[^"]*#regular-stock"/, 'regular shop card links to its matching stock group');
  assert.doesNotMatch(regular.elements['location-visuals'].innerHTML,/Special rod seller/, 'ordinary rod target does not point to the special rod seller');

  const sentinelFixture=structuredClone(locations);
  sentinelFixture.areas.find(area=>area.outdoorArea===2).entrances.push({ordinal:4,fieldTile:{x:255,y:255},townArrival:{mapId:8,x:7,y:77},source:{}});
  const area2=await renderPage({locale:'en',query:'stage=2&place=area',stage:2,place:'outdoor',locationData:sentinelFixture});
  assert.match(area2.elements['location-visuals'].innerHTML,/Field entrance/, 'field view identifies town entrances');
  assert.doesNotMatch(area2.elements['location-visuals'].innerHTML,/data-x="255"|data-y="255"/, 'out-of-bounds sentinel coordinates are never rendered');
  assert.match(area2.elements['location-summary'].textContent,/outside the valid map bounds/, 'excluded coordinates are disclosed');
  assert.match(area2.location.search,/place=area/, 'outdoor field links use the agreed place=area parameter');
  assert.match(area2.elements['location-map-id'].textContent,/map set 2/, 'map-set IDs stay in the evidence disclosure');

  for (const locale of ['en','th','ja']) {
    for (const q of ['Decoy ayu','おとりアユ','ปลาอายุเหยื่อล่อ','0x17','０ｘ１７']) {
      const query=new URLSearchParams({stage:'3',place:'town',category:'bait',q}).toString();
      const result=await renderPage({locale,query,category:'bait',search:q,stage:3,place:'town'});
      assert.match(result.elements['shop-results'].innerHTML,/data-offer="bait:17"/, `${locale} search finds decoy-Ayu using ${q}`);
      assert.match(result.elements['shop-results'].innerHTML,/Sell at least one Ayu|ขายปลาอายุ|アユを1匹以上/, `${locale} shows the actionable Ayu unlock condition`);
    }
    const empty=await renderPage({locale,query:'stage=3&category=bait&q=definitely-no-item',category:'bait',search:'definitely-no-item',stage:3});
    assert.match(empty.elements['shop-results'].innerHTML,/No offers match|ไม่พบรายการที่ตรง|条件に一致する販売品/, `${locale} explains a zero-result search`);
  }

  const bundle=await renderPage({locale:'en',query:'stage=1&place=town&category=fly_wing',category:'fly_wing',stage:1,place:'town'});
  assert.match(bundle.elements['shop-results'].innerHTML,/Ready-made fly bundle/, 'fly component searches lead to ready-made bundles');
  assert.doesNotMatch(bundle.elements['shop-results'].innerHTML,/data-offer="fly_wing:/, 'fly wings are not listed as separately priced offers');
  assert.match(bundle.elements['shop-results'].innerHTML,/Complete bundle price/, 'bundle price is shown as one combined price');

  const area4Special=gallery.items.find(item=>item.category==='rod'&&item.id==='0D');
  assert.ok(area4Special.playerUse.shops.some(shop=>shop.stage===4&&shop.shop==='special_rod_shop'));
  assert.equal(itemInStock(4,'rod','0D'),true,'special rod appears in decoded area stock references');
  console.log('Shop browser checks passed: six ROM areas, verified town/shop pairing, localized search, safe returns, fly bundles, and sentinel-coordinate exclusion.');
}

main().catch(error=>{ console.error(error); process.exitCode=1; });
