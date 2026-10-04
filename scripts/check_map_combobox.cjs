#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'catalogue/maps.js'), 'utf8');
const locations = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/fish-locations.json'), 'utf8'));
const gallery = JSON.parse(fs.readFileSync(path.join(root, 'catalogue/gallery-data.json'), 'utf8'));
const profiles = Object.entries(locations.fish || {});
const ids = profiles.map(([id]) => id.toUpperCase().padStart(2, '0'));

assert(ids.length > 0, 'ROM-derived map contains no fish profiles');
assert.equal(new Set(ids).size, ids.length, 'Fish suggestions must be unique by profile ID');
for (const [id, profile] of profiles) {
  assert((profile.locations || []).some(location => (location.points || []).length), `No confirmed map point for suggestion ${id}`);
  assert(gallery.fishVisuals[id.toUpperCase()], `Suggestion has no ROM fish profile ${id}`);
}

for (const locale of ['en', 'th', 'ja']) {
  const suffix = locale === 'en' ? '' : `.${locale}`;
  const html = fs.readFileSync(path.join(root, `catalogue/maps${suffix}.html`), 'utf8');
  assert.match(html, /id="fish-search"[^>]*role="combobox"/, `${locale}: search is not an accessible combobox`);
  assert.match(html, /aria-autocomplete="list"/, `${locale}: list autocomplete is missing`);
  assert.match(html, /aria-controls="fish-suggestions"/, `${locale}: suggestions are not associated with input`);
  assert.match(html, /aria-expanded="false"/, `${locale}: expanded state does not start closed`);
  assert.match(html, /id="fish-suggestions"[^>]*role="listbox"/, `${locale}: listbox is missing`);
  assert.match(html, /id="fish-search-help"/, `${locale}: user instructions are missing`);
  assert.match(html, /maps\.js\?v=player-usefulness-20261004-9/);
  assert.match(html, /maps\.css\?v=player-usefulness-20261004-7/);
}

for (const required of [
  'function matchingSuggestions(term)',
  'species[id].stages.length && normalizedSearch(searchable(id)).includes(query)',
  'aria-posinset=',
  'suggestion-area-badge',
  "event.key==='ArrowDown'",
  "event.key==='ArrowUp'",
  "event.key==='Enter'",
  "event.key==='Escape'",
  'function chooseSuggestion(id)',
  'setFish(id,{toggle:false})',
  'const targetInCurrentSection=',
  "suggestionList.addEventListener('pointerdown'",
  "suggestionList.addEventListener('click'",
  "$('clear-search').addEventListener('click',()=>{searchInput.value='';searchTerm='';selectedFish='';closeSuggestions(true);render();searchInput.focus();})",
  'searchInput.removeAttribute(\'aria-activedescendant\')',
  "searchInput.addEventListener('input',()=>{searchTerm=searchInput.value;suggestionsDismissed=false;renderFishList();})"
]) assert(script.includes(required), `Missing combobox behavior: ${required}`);

assert(script.includes("if (selectedFish && !fishInStage(selectedFish,activeStage)) activeStage=species[selectedFish].stages[0] || activeStage"), 'Selecting a fish outside the current area must choose a confirmed area');
assert(script.includes('if(returnPath)params.set(\'return\',returnPath)'), 'Fish selection must retain the return route');
assert(script.includes('const scale = Math.max'), 'Existing zoom state and map sizing must remain available');

// Run the real catalogue functions and registered input/keyboard handlers with a tiny DOM.
// The harness skips only browser rendering after the existing input listeners are attached.
class Element {
  constructor(id = '') {
    this.id = id;
    this.listeners = {};
    this.attributes = {};
    this.innerHTML = '';
    this.value = '';
    this.dataset = {};
    this.hidden = false;
    this.style = {};
    this.children = [];
  }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, event = {}) {
    const dispatched = {target:this, key:'', prevented:false, preventDefault(){this.prevented=true;}, ...event};
    for (const listener of this.listeners[type] || []) listener(dispatched);
    return dispatched;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { document.activeElement = this; this.dispatch('focus'); }
  querySelectorAll(selector) {
    if (selector !== '[role="option"]') return [];
    return [...this.innerHTML.matchAll(/<div id="fish-suggestion-([^"]+)"[^>]*role="option"/g)].map(match => {
      const option = document.getElementById(`fish-suggestion-${match[1]}`);
      return option;
    });
  }
}

const elements = new Map();
const languageLinks=['en','th','ja'].map(locale=>{const link=new Element();link.setAttribute('hreflang',locale);link.setAttribute('href','maps'+(locale==='en'?'':'.'+locale)+'.html');return link;});
const document = {
  activeElement:null,
  documentElement:{dataset:{locale:'en'}},
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id);
  },
  querySelectorAll(selector){return selector==='.language-links a'?languageLinks:[];},
  querySelector(){return {prepend(){}};},
  createElement(){return new Element();}
};
const location = {pathname:'/catalogue/maps.html', search:'?stage=6&return=index.th.html%3Fcategory%3Dlure%26fish%3D06%23catalogue', href:'http://localhost:8765/catalogue/maps.html'};
const history = {lastUrl:'', replaceState(_state,_title,url){this.lastUrl=url;const parsed=new URL(url,'http://localhost:8765');location.search=parsed.search;}};
let api;
const window = {
  addEventListener(){},
  __mapTestMode:true,
  __mapTestHook(value){api=value;}
};
const hook = `
  if (window.__mapTestMode) {
    window.__mapTestHook({
      buildData, initFromUrl, renderFishList, matchingSuggestions, updateUrl, localizeReturn,
      setRender(fn){render=fn;}, setZoom(value){zoom=value;},
      getState(){return {selectedFish,activeStage,activeSection,searchTerm,zoom,suggestionIds:[...suggestionIds],suggestionsHidden:suggestionList.hidden,expanded:searchInput.getAttribute('aria-expanded'),activeDescendant:searchInput.getAttribute('aria-activedescendant')||'',searchValue:searchInput.value,returnPath};},
      searchInput,suggestionList
    });
    return;
  }
`;
const instrumented = script.replace('  Promise.all([fetch(', `${hook}  Promise.all([fetch(`);
assert.notEqual(instrumented, script, 'Functional harness could not locate map startup boundary');
vm.runInNewContext(instrumented, {document,window,location,history,URL,URLSearchParams,console});
assert(api, 'Map combobox did not expose its functional harness');
for(const link of languageLinks){const locale=link.getAttribute('hreflang'),suffix=locale==='en'?'':'.'+locale;const next=new URL(link.href,location.href);assert.equal(next.searchParams.get('stage'),'6','Map language switch loses area while data is loading');assert.equal(next.searchParams.get('return'),'index'+suffix+'.html?category=lure&fish=06#catalogue','Map language switch loses localized return before data initialization');}

api.buildData(locations,gallery);
api.initFromUrl();
api.setRender(()=>{api.updateUrl();api.renderFishList();});
api.setZoom(1.7);
assert.equal(api.getState().activeStage,6,'Harness must begin on Area 6');
assert.equal(api.getState().selectedFish,'','Typing should begin without an active target');
assert.equal(api.getState().returnPath,'index.th.html?category=lure&fish=06#catalogue','Return route must parse exactly');
for(const locale of ['en','th','ja']){
 const suffix=locale==='en'?'':'.'+locale;
 const nested='item.th.html?category=bait&id=01&stage=3&fish=06&route=sinker&return='+encodeURIComponent('shops.th.html?stage=3&return='+encodeURIComponent('../research/index.th.html'));
 let route=api.localizeReturn(nested,locale);
 for(const basename of ['item','shops','index']){const url=new URL(route,location.href);assert(url.pathname.endsWith('/'+basename+suffix+'.html'),'Map nested return language/'+basename+'/'+locale);route=url.searchParams.get('return');}
 const bad=api.localizeReturn('item.th.html?return='+encodeURIComponent('https://evil.example/catalogue/maps.html'),locale);
 assert(!new URL(bad,location.href).searchParams.has('return'),'External nested return must be discarded');
}
api.updateUrl();
for(const link of languageLinks){const locale=link.getAttribute('hreflang'),suffix=locale==='en'?'':'.'+locale;const route=new URL(link.href,location.href).searchParams.get('return');assert.equal(route,'index'+suffix+'.html?category=lure&fish=06#catalogue','Map switch must localize return and retain filters');}

const covered = new Set();
for (const id of ids) {
  const suggestions = api.matchingSuggestions(id);
  assert(suggestions.includes(id), `Fish ID ${id} is not discoverable through its own ID`);
  covered.add(id);
}
assert.equal(covered.size,72,'Search must cover every unique ROM-mapped fish profile');

const searchInput = api.searchInput;
searchInput.focus();
searchInput.value='rainbow';
searchInput.dispatch('input');
let state = api.getState();
assert.equal(JSON.stringify(state.suggestionIds),JSON.stringify(['06']),'Rainbow query should point to its single mapped profile');
assert.equal(state.activeStage,6,'Typing must not navigate the map');
assert.equal(state.selectedFish,'','Typing must not select the map target');
assert.equal(state.expanded,'true','Matching input should open the listbox');
assert.equal(elements.get('fish-list').hidden,true,'Active suggestions should suppress duplicate result cards');
assert.match(elements.get('fish-list').innerHTML,/Nijimasu|Rainbow trout/i,'Matching result list should identify the fish');

const escape = searchInput.dispatch('keydown',{key:'Escape'});
assert(escape.prevented,'Escape should be consumed while suggestions are open');
state=api.getState();
assert.equal(state.suggestionsHidden,true,'Escape should close suggestions');
assert.equal(elements.get('fish-list').hidden,false,'Escape should restore the separate result list');
assert.equal(state.searchValue,'rainbow','Escape should leave the typed query available');
assert.equal(state.activeStage,6,'Escape should leave map area unchanged');

searchInput.focus();
searchInput.dispatch('input');
const down=searchInput.dispatch('keydown',{key:'ArrowDown'});
assert(down.prevented,'ArrowDown should move within suggestions');
assert.equal(api.getState().activeDescendant,'fish-suggestion-06','ArrowDown should set active descendant');
searchInput.dispatch('keydown',{key:'Enter'});
state=api.getState();
assert.equal(state.selectedFish,'06','Enter should select the active fish');
assert.equal(state.activeStage,1,'Selecting Rainbow trout from Area 6 should jump to its first confirmed area');
assert.equal(state.searchValue,'Nijimasu','Accepted selection should replace the query with its displayed English catalogue name');
assert.equal(state.zoom,1.7,'Selecting a fish should preserve current zoom');
assert.match(history.lastUrl,/return=index\.th\.html%3Fcategory%3Dlure%26fish%3D06%23catalogue/,'Fish selection should preserve its exact return route');
assert.equal(new URLSearchParams(history.lastUrl.split('?')[1]).get('fish'),'06','Fish selection should persist target in URL');
assert.equal(new URLSearchParams(history.lastUrl.split('?')[1]).get('stage'),'1','Fish selection should persist the selected confirmed area');

searchInput.value='no-such-fish';
searchInput.dispatch('input');
state=api.getState();
assert.equal(state.suggestionIds.length,0,'Unknown query should return no suggestions');
assert.equal(state.suggestionsHidden,true,'Unknown query should not leave an empty listbox open');
assert.match(elements.get('fish-list').innerHTML,/No fish match this search/,'Unknown query should show an explicit no-results message');

elements.get('clear-search').dispatch('click');
state=api.getState();
assert.equal(state.searchValue,'','Clear should empty the query');
assert.equal(state.selectedFish,'','Clear should remove the active target as well');
assert.equal(state.suggestionsHidden,true,'Clear should leave suggestions closed');
assert.equal(state.activeStage,1,'Clear should preserve the current area instead of navigating elsewhere');
assert.equal(new URLSearchParams(history.lastUrl.split('?')[1]).has('fish'),false,'Clear should remove the fish target from the map URL');

console.log(`PASS: accessible localized fish combobox; ${ids.length} unique ROM-mapped profiles; functional typing, no-navigation, escape, arrow/enter, cross-area targeting, clear and return-route behavior.`);
