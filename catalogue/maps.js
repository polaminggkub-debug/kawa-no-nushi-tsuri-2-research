(() => {
  const lang = ['th', 'ja'].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : 'en';
  const c = {
    en: {area:n=>`Area ${n}`,areas:'areas',areasPrefix:'Areas',fish:'fish',fishIn:'Fish in this area',searchResults:'Search results across all areas',showAll:'Show all fish',clearSearch:'Clear search',noFish:'No fish match this search.',noArea:'This fish has no configured point in this area. Choose one of its available areas.',noTarget:'No fish target selected. Map shows all species in this section.',selectedTarget:'Map shows only',section:'Section',spots:'configured points',species:'species',shared:'fish share this tile',targetAvailable:'target here',targetAbsent:'target absent',allArea:n=>`${n} fish`,fullMap:'Area terrain from the ROM',tackle:'See this fish’s compatible tackle ↗',noPoint:'No configured points in this section.',mapSection:(col,row)=>`Column ${col}, row ${row}`,fishName:id=>`Fish ${id}`,point:n=>`${n} unique point${n===1?'':'s'}`,notFound:'Not found in this area',romName:'ROM fish',back:'Equipment catalogue'},
    th: {area:n=>`ด่าน ${n}`,areas:'ด่าน',areasPrefix:'ด่าน',fish:'ชนิด',fishIn:'ปลาในด่านนี้',searchResults:'ผลค้นหาปลาจากทุกด่าน',showAll:'แสดงปลาทั้งหมด',clearSearch:'ล้างคำค้น',noFish:'ไม่พบปลาที่ตรงกับคำค้น',noArea:'ปลาเป้าหมายไม่มีจุดที่ตั้งไว้ในด่านนี้ เลือกด่านที่มีปลาได้',noTarget:'ยังไม่ได้เลือกปลา แผนที่แสดงปลาทุกชนิดในส่วนนี้',selectedTarget:'แผนที่แสดงเฉพาะ',section:'ส่วนแผนที่',spots:'จุดที่ตั้งไว้',species:'ชนิด',shared:'ปลาหลายชนิดใช้ช่องนี้ร่วมกัน',targetAvailable:'มีปลาเป้าหมาย',targetAbsent:'ไม่มีปลาเป้าหมาย',allArea:n=>`ปลา ${n} ชนิด`,fullMap:'ภาพฉากจาก ROM',tackle:'ดูอุปกรณ์ที่ใช้กับปลานี้ ↗',noPoint:'ไม่มีจุดในส่วนแผนที่นี้',mapSection:(col,row)=>`คอลัมน์ ${col} แถว ${row}`,fishName:id=>`ปลา ${id}`,point:n=>`${n} จุด`,notFound:'ไม่มีจุดในด่านนี้',romName:'ชื่อปลาใน ROM',back:'คู่มืออุปกรณ์'},
    ja: {area:n=>`エリア${n}`,areas:'エリア',areasPrefix:'エリア',fish:'種',fishIn:'このエリアの魚',searchResults:'全エリアの検索結果',showAll:'魚をすべて表示',clearSearch:'検索をクリア',noFish:'一致する魚が見つかりません。',noArea:'この魚は選択中エリアに出現設定がありません。出現するエリアを選んでください。',noTarget:'魚を選択していません。この範囲の全魚種を表示します。',selectedTarget:'表示中:',section:'マップ範囲',spots:'設定地点',species:'魚種',shared:'魚が同じタイルを共有',targetAvailable:'対象あり',targetAbsent:'対象なし',allArea:n=>`${n}種`,fullMap:'ROMから復元した地形',tackle:'この魚に使える道具を見る ↗',noPoint:'この範囲に設定地点はありません。',mapSection:(col,row)=>`列${col}・行${row}`,fishName:id=>`魚 ${id}`,point:n=>`${n}地点`,notFound:'このエリアに地点なし',romName:'ROMの魚名',back:'道具カタログ'}
  }[lang];
  const areaList = document.getElementById('area-list');
  const fishList = document.getElementById('fish-list');
  const stageSelect = document.getElementById('section-select');
  const searchInput = document.getElementById('fish-search');
  const suggestionList = document.getElementById('fish-suggestions');
  const $ = id => document.getElementById(id);
  let fishData = {}, visuals = {}, species = {}, stages = {}, selectedFish = '', activeStage = 1, activeSection = '', searchTerm = '', listScope='area', zoom=1;
  let suggestionIds = [], activeSuggestion = -1, suggestionsDismissed = false;
  const suggestionLimit = 10;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const local = obj => obj?.[lang] || obj?.en || obj?.ja || obj?.th || '';
  const idNorm = id => String(id).toUpperCase().replace(/^0X/,'').padStart(2,'0');
  const fishName = id => species[id]?.name || c.fishName(id);
  const detailLabel=lang==='th'?'รายละเอียด':lang==='ja'?'詳細':'Details';
  function safeReturn(raw) {
    if(!raw||raw.startsWith('//')||raw.includes('\\')||/^[a-z][a-z0-9+.-]*:/i.test(raw))return '';
    try {
      const base=new URL('.',location.href),target=new URL(raw,base);
      const allowed=['index','maps','fish','item','shops'].flatMap(name=>['','.th','.ja'].map(suffix=>{const route=`${name}${suffix}.html`;return {route,pathname:new URL(route,base).pathname};}));
      allowed.push(...['index.html','index.th.html','index.ja.html'].map(file=>{const route=`../research/${file}`;return {route,pathname:new URL(route,base).pathname};}));
      const match=allowed.find(entry=>entry.pathname===target.pathname);
      return target.origin===base.origin&&match?match.route+target.search+target.hash:'';
    }catch{return '';}
  }
  function localizeReturn(raw,toLang,depth=0) {
    const safe=safeReturn(raw);if(!safe)return '';
    const base=new URL('.',location.href),url=new URL(safe,base);
    url.pathname=url.pathname.replace(/(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/,`$1${toLang==='en'?'':'.'+toLang}.html`);
    if(url.searchParams.has('return')){
      const nested=depth<4?localizeReturn(url.searchParams.get('return'),toLang,depth+1):'';
      if(nested)url.searchParams.set('return',nested);else url.searchParams.delete('return');
    }
    return safeReturn(url.pathname+url.search+url.hash);
  }
  let returnPath=safeReturn(new URLSearchParams(location.search).get('return')||'');
  if(returnPath){
    const back=document.createElement('a');back.className='back-link';back.href=returnPath;
    back.textContent=lang==='th'?'← กลับหน้าที่เปิดแผนที่':lang==='ja'?'← 前のページに戻る':'← Back to the page that opened this map';
    document.querySelector('.hero-meta').prepend(back);
  }
  const sourceReturn=()=>location.pathname.split('/').pop()+location.search;
  const fishHref=id=>`fish${lang==='en'?'':'.'+lang}.html?id=${id}&stage=${activeStage}&return=${encodeURIComponent(sourceReturn())}`;
  function buildData(raw, gallery) {
    fishData = raw.fish || {};
    visuals = gallery.fishVisuals || {};
    species = {};
    for (const [rawId, record] of Object.entries(fishData)) {
      const id = idNorm(rawId), visual = visuals[id] || {};
      const variants = [...(visual.nameThVariants || []), ...(visual.nameLatinVariants || []), ...(visual.nameJapaneseVariants || [])];
      let name = lang === 'ja' ? (visual.nameJa || record.nameJa) : lang === 'th' ? (visual.nameTh || visual.nameThVariants?.join(' / ') || `${record.nameJa} · ID ${id}`) : (visual.nameLatin || visual.nameLatinVariants?.slice().sort((a,b)=>b.length-a.length)[0] || visual.nameEn || `${record.nameJa} · ID ${id}`);
      const aliases = [id, record.nameJa, visual.nameJa, visual.nameEn, visual.nameLatin, visual.nameTh, ...variants].filter(Boolean);
      species[id] = {id, record, visual, name, aliases:[...new Set(aliases.map(v=>String(v).toLocaleLowerCase()))], stages:[]};
      for (const location of record.locations || []) {
        const stage = Number(location.stage);
        species[id].stages.push(stage);
        let data = stages[stage];
        if (!data) {
          const overview = location.overview || {};
          const width = Number(overview.rotated ? overview.height : overview.width);
          const height = Number(overview.rotated ? overview.width : overview.height);
          data = stages[stage] = {stage, name:local(location.stageName), fullImage:location.maps?.[0]?.fullImage || `maps/rom-field-${String(stage).padStart(2,'0')}.png`, width, height, overview, species:new Set(), pins:new Map(), sections:new Map()};
        }
        data.species.add(id);
        for (const point of location.points || []) {
          const x = Number(point.x), y = Number(point.y), key = `${x},${y}`;
          let pin = data.pins.get(key);
          if (!pin) data.pins.set(key, pin = {x,y,fishIds:[]});
          if (!pin.fishIds.includes(id)) pin.fishIds.push(id);
        }
      }
      species[id].stages = [...new Set(species[id].stages)].sort((a,b)=>a-b);
    }
    for (const data of Object.values(stages)) {
      for (const pin of data.pins.values()) {
        const px = pin.x * 16 + 8, py = pin.y * 16 + 8;
        const col = Math.floor(px / 384), row = Math.floor(py / 384), key = `s${data.stage}-c${col+1}-r${row+1}`;
        let section = data.sections.get(key);
        if (!section) data.sections.set(key, section = {key,col,row,pins:[]});
        section.pins.push(pin);
      }
    }
  }
  function updateUrl() {
    const params = new URLSearchParams();
    params.set('stage', String(activeStage));
    if(returnPath)params.set('return',returnPath);
    if (activeSection) params.set('section', activeSection);
    if (selectedFish) params.set('fish', selectedFish);
    if(listScope==='section')params.set('scope','section');
    history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
    document.querySelectorAll('.language-links a').forEach(link => {
      const paramsCopy = new URLSearchParams(params);
      const route = (link.dataset.route || link.getAttribute('href') || '').split('?')[0];
      link.dataset.route = route;
      const toLang=link.getAttribute('hreflang');
      if(returnPath&&['en','th','ja'].includes(toLang))paramsCopy.set('return',localizeReturn(returnPath,toLang));
      link.href = `${route}?${paramsCopy.toString()}`;
    });
  }
  function fishInStage(id, stage) { return (species[id]?.stages || []).includes(Number(stage)); }
  function areaCount(stage) { return stages[stage]?.species.size || 0; }
  function chooseSection(stage, preferredKey='') {
    const data = stages[stage], sections = [...(data?.sections.values() || [])];
    if (!sections.length) return '';
    if (preferredKey && data.sections.has(preferredKey)) return preferredKey;
    if (selectedFish) {
      const forFish = sections.map(s=>({...s,count:s.pins.filter(p=>p.fishIds.includes(selectedFish)).length})).filter(s=>s.count>0).sort((a,b)=>b.count-a.count||a.row-b.row||a.col-b.col);
      if (forFish.length) return forFish[0].key;
    }
    return sections.sort((a,b)=>b.pins.length-a.pins.length||a.row-b.row||a.col-b.col)[0].key;
  }
  function renderAreas() {
    areaList.innerHTML = Object.values(stages).sort((a,b)=>a.stage-b.stage).map(data => {
      const targetHere = !selectedFish || data.species.has(selectedFish);
      const pressed = data.stage === activeStage;
      const small = selectedFish ? (targetHere ? c.targetAvailable : c.targetAbsent) : c.allArea(data.species.size);
      return `<button class="area-button" type="button" data-stage="${data.stage}" aria-pressed="${pressed}" ${selectedFish&&!targetHere?'disabled':''}><strong>${esc(c.area(data.stage))}</strong><small>${esc(data.name)} · ${esc(small)}</small></button>`;
    }).join('');
  }
  function searchable(id) { return species[id].aliases.join(' · '); }
  function normalizedSearch(value) { return String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase(); }
  function matchingSuggestions(term) {
    const query = normalizedSearch(term);
    if (!query) return [];
    return Object.keys(species).filter(id => species[id].stages.length && normalizedSearch(searchable(id)).includes(query)).sort((a,b) => {
      const rank = id => {
        const record = species[id];
        if (normalizedSearch(id) === query || record.aliases.some(alias => normalizedSearch(alias) === query)) return 0;
        if (record.aliases.some(alias => normalizedSearch(alias).startsWith(query))) return 1;
        return 2;
      };
      return rank(a) - rank(b) || fishName(a).localeCompare(fishName(b),lang) || a.localeCompare(b);
    });
  }
  function setSuggestionsExpanded(expanded) {
    searchInput.setAttribute('aria-expanded', String(Boolean(expanded)));
    if (!expanded) searchInput.removeAttribute('aria-activedescendant');
  }
  function closeSuggestions(dismiss=true) {
    if (dismiss) suggestionsDismissed = true;
    activeSuggestion = -1;
    suggestionList.hidden = true;
    fishList.hidden = false;
    setSuggestionsExpanded(false);
  }
  function renderSuggestions() {
    const matches = matchingSuggestions(searchInput.value);
    suggestionIds = matches.slice(0,suggestionLimit);
    activeSuggestion = -1;
    const open = Boolean(searchInput.value.trim()) && !suggestionsDismissed && document.activeElement === searchInput && suggestionIds.length > 0;
    const areaLabel = lang==='th'?'พื้นที่':lang==='ja'?'エリア':'Areas';
    suggestionList.innerHTML = suggestionIds.map((id,index) => {
      const item=species[id], image=item.visual.image||'';
      const areaBadges=item.stages.map(stage=>`<span class="suggestion-area-badge">${esc(c.area(stage))}</span>`).join('');
      const secondary=lang==='ja'?(item.visual.nameLatin||item.visual.nameTh||''):(item.visual.nameJa||'');
      const targetClass=selectedFish===id?' is-map-target':'';
      return `<div id="fish-suggestion-${id}" class="fish-suggestion${targetClass}" role="option" aria-selected="false" aria-posinset="${index+1}" aria-setsize="${matches.length}" data-suggestion="${id}">${image?`<img src="${esc(image)}" alt="">`:'<span class="suggestion-no-image" aria-hidden="true"></span>'}<span class="suggestion-copy"><strong>${esc(item.name)}</strong>${secondary&&secondary!==item.name?`<small class="suggestion-alias">${esc(secondary)}</small>`:''}<span class="suggestion-meta"><code>ID ${esc(id)}</code><span class="suggestion-area-label">${areaLabel}</span><span class="suggestion-areas">${areaBadges}</span></span></span></div>`;
    }).join('');
    suggestionList.hidden = !open;
    fishList.hidden = open;
    setSuggestionsExpanded(open);
  }
  function setActiveSuggestion(index) {
    if (!suggestionIds.length) return;
    activeSuggestion = (index + suggestionIds.length) % suggestionIds.length;
    const options = suggestionList.querySelectorAll('[role="option"]');
    options.forEach((option,optionIndex) => option.setAttribute('aria-selected',String(optionIndex===activeSuggestion)));
    const id=suggestionIds[activeSuggestion], option=document.getElementById(`fish-suggestion-${id}`);
    if (option) {
      searchInput.setAttribute('aria-activedescendant',option.id);
      option.scrollIntoView?.({block:'nearest'});
    }
  }
  function chooseSuggestion(id) {
    if (!species[id]?.stages?.length) return;
    const visual=species[id].visual;
    const localeAliases=lang==='th'?[visual.nameTh,...(visual.nameThVariants||[]),visual.nameLatin,...(visual.nameLatinVariants||[]),visual.nameJa,id]
      :lang==='ja'?[visual.nameJa,visual.nameLatin,...(visual.nameLatinVariants||[]),visual.nameTh,...(visual.nameThVariants||[]),id]
      :[visual.nameEn,visual.nameLatin,...(visual.nameLatinVariants||[]),visual.nameJa,visual.nameTh,...(visual.nameThVariants||[]),id];
    searchInput.value=localeAliases.find(alias=>alias&&species[id].aliases.some(value=>normalizedSearch(value)===normalizedSearch(alias)))||id;
    searchTerm=searchInput.value;
    closeSuggestions(true);
    setFish(id,{toggle:false});
  }
  function renderFishList() {
    const term = normalizedSearch(searchTerm);
    const sectionIds=new Set(stages[activeStage]?.sections.get(activeSection)?.pins.flatMap(pin=>pin.fishIds)||[]);
    const ids = Object.keys(species).filter(id => term ? normalizedSearch(searchable(id)).includes(term) : listScope==='section'?sectionIds.has(id):fishInStage(id, activeStage)).sort((a,b)=>fishName(a).localeCompare(fishName(b),lang));
    const header = $('fish-title');
    header.textContent = term ? c.searchResults : listScope==='section'?(lang==='th'?'ปลาในส่วนแผนที่นี้':lang==='ja'?'この地図範囲の魚':'Fish in this map section'):c.fishIn;
    $('fish-scope').innerHTML=[['area',lang==='th'?'ทั้งด่าน':lang==='ja'?'エリア全体':'Whole area'],['section',lang==='th'?'ส่วนที่กำลังดู':lang==='ja'?'表示範囲':'Current section']].map(([value,label])=>`<button type="button" data-scope="${value}" aria-pressed="${listScope===value}">${label}</button>`).join('');
    $('area-summary').textContent = term ? `${ids.length} ${c.fish} · ${c.areas} ${lang==='ja'?'で出現':lang==='th'?'ที่พบ':'with configured points'}` : `${c.area(activeStage)} · ${ids.length} ${c.fish}`;
    $('search-count').textContent = `${ids.length} ${c.fish}`;
    $('show-all').textContent = c.showAll;
    fishList.hidden = false;
    renderSuggestions();
    if (!ids.length) { fishList.innerHTML = `<div class="empty-list">${esc(c.noFish)}</div>`; return; }
    fishList.innerHTML = ids.map(id => {
      const item = species[id], img = item.visual.image || '';
      const availability = item.stages.join(', ');
      const pointCount=[...(stages[activeStage]?.pins.values()||[])].filter(pin=>pin.fishIds.includes(id)&&(listScope!=='section'||sectionIds.has(id)&&stages[activeStage].sections.get(activeSection)?.pins.includes(pin))).length;
      const sub = term ? `${c.areasPrefix} ${availability}` : `${c.point(pointCount)}${item.visual.nameJa && lang!=='ja' ? ` · ${item.visual.nameJa}` : ''}`;
      return `<div class="fish-choice-row ${selectedFish===id?'selected':''}"><a class="fish-portrait-link" href="${esc(fishHref(id))}" aria-label="${esc(item.name)} — ${detailLabel}">${img?`<img loading="lazy" src="${esc(img)}" alt="${esc(item.name)}">`:''}</a><button class="fish-choice" type="button" data-fish="${id}" aria-pressed="${selectedFish===id}"><span>${esc(item.name)}<small>${esc(sub)}</small><small class="filter-action">${lang==='th'?'เน้นบนแผนที่':lang==='ja'?'地図で絞り込む':'Focus on map'}</small></span></button><a class="fish-details-link" href="${esc(fishHref(id))}">${detailLabel} ↗</a></div>`;
    }).join('');
  }
  function renderSectionSelect() {
    const data = stages[activeStage];
    let sections = [...(data?.sections.values() || [])];
    if (selectedFish) sections = sections.filter(section => section.pins.some(pin=>pin.fishIds.includes(selectedFish)));
    sections.sort((a,b)=>a.row-b.row||a.col-b.col);
    if (!sections.some(s=>s.key===activeSection)) activeSection = chooseSection(activeStage);
    stageSelect.innerHTML = sections.map(section => {
      const visible = section.pins.filter(pin=>!selectedFish||pin.fishIds.includes(selectedFish));
      const speciesCount = new Set(visible.flatMap(pin=>selectedFish?[selectedFish]:pin.fishIds)).size;
      const label = `${c.mapSection(section.col+1,section.row+1)} · ${c.point(visible.length)} · ${speciesCount} ${c.species}`;
      return `<option value="${section.key}" ${section.key===activeSection?'selected':''}>${esc(label)}</option>`;
    }).join('');
    stageSelect.disabled = !sections.length;
    renderTargetSectionLinks(data, sections);
  }
  function renderTargetSectionLinks(data, targetSections) {
    const summary=$('target-section-summary'), shortcuts=$('other-sections');
    if (!selectedFish || !data) {
      summary.hidden=true; summary.textContent=''; shortcuts.hidden=true; shortcuts.innerHTML=''; return;
    }
    const total=[...data.pins.values()].filter(pin=>pin.fishIds.includes(selectedFish)).length;
    const sections=targetSections.map(section=>({section,count:section.pins.filter(pin=>pin.fishIds.includes(selectedFish)).length})).filter(entry=>entry.count>0);
    const current=sections.find(entry=>entry.section.key===activeSection)?.count||0;
    const elsewhere=Math.max(0,total-current);
    summary.hidden=false;
    summary.textContent=lang==='th'?`ส่วนนี้ ${current} จาก ${total} จุด · อีก ${elsewhere} จุดอยู่ในส่วนอื่น`:lang==='ja'?`この範囲 ${current}/${total} 地点 · 他の範囲に ${elsewhere} 地点`:`This section: ${current} of ${total} points · ${elsewhere} elsewhere`;
    const other=sections.filter(entry=>entry.section.key!==activeSection);
    shortcuts.hidden=!other.length;
    shortcuts.innerHTML=other.map(({section,count})=>`<button type="button" data-other-section="${section.key}">${esc(c.mapSection(section.col+1,section.row+1))} · ${esc(c.point(count))}</button>`).join('');
  }
  function setFish(id,{toggle=true}={}) {
    if(!species[id]?.stages?.length)return;
    const next = toggle && selectedFish === id ? '' : id;
    const previousSection=activeSection;
    selectedFish = next;
    if (selectedFish && !fishInStage(selectedFish,activeStage)) activeStage = species[selectedFish].stages[0] || activeStage;
    const targetInCurrentSection=selectedFish&&stages[activeStage]?.sections.get(previousSection)?.pins.some(pin=>pin.fishIds.includes(selectedFish));
    activeSection = chooseSection(activeStage, selectedFish ? (targetInCurrentSection?previousSection:'') : previousSection);
    render();
  }
  function showPinDetails(ids, x, y) {
    const box = $('pin-details');
    const unique = [...new Set(ids)];
    box.hidden = false;
    box.innerHTML = `<span class="pin-details-label">X ${x}, Y ${y} · ${unique.length} ${c.species}</span>` + unique.map(id=>{
      const f=species[id], img=f.visual.image||'';
      return `<div class="pin-fish-row"><a class="pin-fish-details" href="${esc(fishHref(id))}">${img?`<img src="${esc(img)}" alt="">`:''}<span>${esc(f.name)} — ${detailLabel} ↗</span></a><button class="pin-fish-choice" type="button" data-fish="${id}">${lang==='th'?'เน้นบนแผนที่':lang==='ja'?'地図で絞り込む':'Focus on map'}</button></div>`;
    }).join('');
  }
  function renderMap() {
    const data = stages[activeStage], section = data?.sections.get(activeSection);
    const stageTitle = data ? `${c.area(data.stage)} · ${data.name}` : c.area(activeStage);
    $('map-title').textContent = stageTitle;
    if (!data || !section) {
      $('map-summary').textContent = '';
      $('pin-help').textContent = selectedFish ? c.noArea : c.noPoint;
      $('map-view').innerHTML = '';
      return;
    }
    const filtered = section.pins.map(pin=>({...pin,fishIds:selectedFish?pin.fishIds.filter(id=>id===selectedFish):pin.fishIds})).filter(pin=>pin.fishIds.length);
    const sourceW = data.width, sourceH = data.height, originX = section.col*384, originY = section.row*384;
    const cellW = Math.max(1,Math.min(384,sourceW-originX)), cellH = Math.max(1,Math.min(384,sourceH-originY));
    const panelWidth = $('map-view').parentElement.clientWidth || window.innerWidth;
    const scale = Math.max(.6,Math.min(2.2,(panelWidth-4)/cellW,620/cellH))*zoom;
    const viewW = Math.round(cellW*scale), viewH = Math.round(cellH*scale);
    const counts = new Set(filtered.flatMap(pin=>pin.fishIds)).size;
    $('map-summary').textContent = `${c.mapSection(section.col+1,section.row+1)} · ${c.point(filtered.length)} · ${counts} ${c.species}`;
    $('pin-help').textContent = selectedFish ? `${c.selectedTarget} ${fishName(selectedFish)}. ${c.point(filtered.reduce((n,p)=>n+1,0))}.` : `${c.noTarget} ${lang==='th'?'กดรูปปลาเพื่อดูรายละเอียด หรือกดจุดซ้อนเพื่อเลือกชนิด':lang==='ja'?'魚画像は詳細へ。重なった地点は魚種を選択。':'Fish portraits open details; shared points let you choose a species'}.`;
    const pins = filtered.map(pin=>{
      const px=(pin.x*16+8-originX)*scale, py=(pin.y*16+8-originY)*scale;
      const names=pin.fishIds.map(id=>fishName(id)).join(', '), imgs=pin.fishIds.map(id=>species[id].visual.image).filter(Boolean);
      const tag=pin.fishIds.length===1?'a':'button';
      const action=tag==='a'?`href="${esc(fishHref(pin.fishIds[0]))}"`:`type="button" data-pin="${pin.fishIds.join(',')}"`;
      return `<${tag} ${action} class="fish-pin ${selectedFish?'focused':''}" style="left:${px}px;top:${py}px" data-x="${pin.x}" data-y="${pin.y}" title="${esc(names)} · X ${pin.x}, Y ${pin.y}" aria-label="${esc(names)} · X ${pin.x}, Y ${pin.y}">${imgs.slice(0,2).map(src=>`<img loading="lazy" src="${esc(src)}" alt="">`).join('')}${pin.fishIds.length>1?`<span class="cluster-count">${pin.fishIds.length}</span>`:''}</${tag}>`;
    }).join('');
    $('map-view').style.width = `${viewW}px`;
    $('map-view').style.height = `${viewH}px`;
    $('map-view').innerHTML = `<img class="map-ground" src="${esc(data.fullImage)}" alt="${esc(`${stageTitle} · ${c.fullMap}`)}" style="width:${Math.round(sourceW*scale)}px;height:${Math.round(sourceH*scale)}px;left:${Math.round(-originX*scale)}px;top:${Math.round(-originY*scale)}px">${pins}`;
    $('pin-details').hidden = true;
    renderOverview(data,section);
    $('zoom-fit').textContent=lang==='th'?'พอดีจอ':lang==='ja'?'全体表示':'Fit view';
    $('zoom-out').setAttribute('aria-label',lang==='th'?'ย่อแผนที่':lang==='ja'?'縮小':'Zoom out');
    $('zoom-in').setAttribute('aria-label',lang==='th'?'ขยายแผนที่':lang==='ja'?'拡大':'Zoom in');
    const shopNav=$('shop-browser-link');
    if(shopNav){const q=new URLSearchParams({stage:String(activeStage),place:'area',return:sourceReturn()});if(selectedFish)q.set('fish',selectedFish);shopNav.href=`shops${lang==='en'?'':'.'+lang}.html?${q}`;}
    const catalogue = $('catalogue-fish-link');
    catalogue.textContent = selectedFish ? c.tackle : (lang==='th'?'กลับไปเลือกอุปกรณ์ตกปลา ↗':lang==='ja'?'道具カタログへ ↗':'Browse the equipment catalogue ↗');
    catalogue.href = `${lang==='th'?'index.th.html':lang==='ja'?'index.ja.html':'index.html'}${selectedFish?`?category=all&fish=${selectedFish}&stage=${activeStage}#fish-location-panel`:''}`;
  }
  function renderOverview(data,section){
    const overview=data.overview,box=$('area-overview');
    if(!overview?.image){box.innerHTML='';return;}
    const selectedSections=[...data.sections.values()].filter(s=>!selectedFish||s.pins.some(p=>p.fishIds.includes(selectedFish)));
    function rect(s){const x=s.col*384,y=s.row*384,w=Math.min(384,data.width-x),h=Math.min(384,data.height-y);return overview.rotated?{x:y/data.height,y:(data.width-x-w)/data.width,w:h/data.height,h:w/data.width}:{x:x/data.width,y:y/data.height,w:w/data.width,h:h/data.height};}
    box.innerHTML=`<p>${lang==='th'?'ภาพรวมด่าน · กดกรอบเพื่อเปลี่ยนส่วนซูม':lang==='ja'?'エリア全体 · 枠をクリックして拡大範囲を変更':'Area overview · click a frame to change section'}${overview.rotated?(lang==='th'?' · ด้านบนของฉากอยู่ทางซ้าย':lang==='ja'?' · 元の上方向は左':' · original top is on the left'):''}</p><div class="overview-canvas" style="aspect-ratio:${overview.width}/${overview.height};width:min(100%,${170*overview.width/overview.height}px)"><img src="${esc(overview.image)}" alt="${esc(data.name)}">${selectedSections.map(s=>{const b=rect(s);return `<button type="button" data-section="${s.key}" aria-label="${esc(c.mapSection(s.col+1,s.row+1))}" aria-pressed="${s.key===section.key}" style="left:${b.x*100}%;top:${b.y*100}%;width:${b.w*100}%;height:${b.h*100}%"></button>`;}).join('')}</div>`;
  }
  function render() {
    if (!stages[activeStage]) activeStage = Math.min(...Object.keys(stages).map(Number));
    if (selectedFish && !fishInStage(selectedFish,activeStage)) activeStage = species[selectedFish]?.stages[0] || activeStage;
    if (!stages[activeStage]?.sections.has(activeSection)) activeSection = chooseSection(activeStage);
    updateUrl(); renderAreas(); renderSectionSelect(); renderFishList(); renderMap();
  }
  function enableControls() {
    $('fish-search').disabled = false;
    $('clear-search').disabled = false;
    $('show-all').disabled = false;
  }
  function initFromUrl() {
    const p = new URLSearchParams(location.search);
    if(p.get('scope')==='section')listScope='section';
    const stage = Number(p.get('stage'));
    if (stages[stage]) activeStage=stage;
    const target = idNorm(p.get('fish') || '');
    if (species[target]) selectedFish=target;
    if (selectedFish && !fishInStage(selectedFish,activeStage)) activeStage=species[selectedFish].stages[0] || activeStage;
    const section=p.get('section');
    activeSection=chooseSection(activeStage,section||'');
    if (selectedFish && !section) activeSection=chooseSection(activeStage,'');
  }
  areaList.addEventListener('click', event => {
    const button=event.target.closest('[data-stage]'); if(!button||button.disabled)return;
    activeStage=Number(button.dataset.stage); activeSection=chooseSection(activeStage); render();
  });
  fishList.addEventListener('click',event=>{const button=event.target.closest('[data-fish]');if(button)setFish(button.dataset.fish);});
  $('pin-details').addEventListener('click',event=>{const button=event.target.closest('[data-fish]');if(button&&button.dataset.fish!==selectedFish)setFish(button.dataset.fish);});
  $('map-view').addEventListener('click',event=>{const pin=event.target.closest('[data-pin]');if(!pin)return;const ids=pin.dataset.pin.split(',');if(ids.length===1&&ids[0]!==selectedFish)setFish(ids[0]);else showPinDetails(ids,pin.dataset.x,pin.dataset.y);});
  stageSelect.addEventListener('change',()=>{activeSection=stageSelect.value;render();});
  $('other-sections').addEventListener('click',event=>{const button=event.target.closest('[data-other-section]');if(button){activeSection=button.dataset.otherSection;render();}});
  $('fish-scope').addEventListener('click',event=>{const button=event.target.closest('[data-scope]');if(!button)return;listScope=button.dataset.scope;searchTerm='';searchInput.value='';render();});
  $('area-overview').addEventListener('click',event=>{const button=event.target.closest('[data-section]');if(button){activeSection=button.dataset.section;render();}});
  $('zoom-out').addEventListener('click',()=>{zoom=Math.max(.6,zoom/1.3);renderMap();});
  $('zoom-in').addEventListener('click',()=>{zoom=Math.min(3,zoom*1.3);renderMap();});
  $('zoom-fit').addEventListener('click',()=>{zoom=1;renderMap();});
  searchInput.addEventListener('input',()=>{searchTerm=searchInput.value;suggestionsDismissed=false;renderFishList();});
  searchInput.addEventListener('focus',()=>{suggestionsDismissed=false;renderSuggestions();});
  searchInput.addEventListener('blur',()=>closeSuggestions(false));
  searchInput.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'&&suggestionIds.length){event.preventDefault();if(suggestionList.hidden){suggestionsDismissed=false;renderSuggestions();}setActiveSuggestion(activeSuggestion<0?0:activeSuggestion+1);}
    else if(event.key==='ArrowUp'&&suggestionIds.length){event.preventDefault();if(suggestionList.hidden){suggestionsDismissed=false;renderSuggestions();}setActiveSuggestion(activeSuggestion<0?suggestionIds.length-1:activeSuggestion-1);}
    else if(event.key==='Enter'&&!suggestionList.hidden&&suggestionIds.length){event.preventDefault();chooseSuggestion(suggestionIds[activeSuggestion<0?0:activeSuggestion]);}
    else if(event.key==='Escape'&&!suggestionList.hidden){event.preventDefault();closeSuggestions(true);}
  });
  suggestionList.addEventListener('pointerdown',event=>{if(event.target.closest('[data-suggestion]'))event.preventDefault();});
  suggestionList.addEventListener('click',event=>{const option=event.target.closest('[data-suggestion]');if(option)chooseSuggestion(option.dataset.suggestion);});
  $('clear-search').addEventListener('click',()=>{searchInput.value='';searchTerm='';selectedFish='';closeSuggestions(true);render();searchInput.focus();});
  $('show-all').addEventListener('click',()=>{selectedFish='';searchInput.value='';searchTerm='';closeSuggestions(true);activeSection=chooseSection(activeStage);render();});
  window.addEventListener('resize',()=>renderMap());
  Promise.all([fetch('fish-locations.json').then(r=>{if(!r.ok)throw Error('fish locations');return r.json();}),fetch('gallery-data.json').then(r=>{if(!r.ok)throw Error('fish sprites');return r.json();})]).then(([locations,gallery])=>{buildData(locations,gallery);initFromUrl();enableControls();render();}).catch(error=>{console.error(error);$('pin-help').textContent=lang==='th'?'โหลดข้อมูลปลาไม่สำเร็จ กรุณาโหลดหน้าใหม่':lang==='ja'?'魚データを読み込めません。ページを再読み込みしてください。':'Could not load fish map data. Please reload the page.';});
})();
