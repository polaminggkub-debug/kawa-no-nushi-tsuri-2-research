(() => {
  const lang = document.documentElement.dataset.locale === 'ja' ? 'ja' : 'en';
  const copy = {
    en: {
      title: 'What is actually inside the tackle box?', lead: 'A searchable catalogue of the game’s rods, lures, fly parts, baits, hooks, floats, food and tools—with ROM fields we could verify and clear notes where a stat is still a mystery.',
      edition: 'SFC / SNES · JAPAN VERSION', entries: n => `${n} listed entries`, sampleKicker: 'A FEW DECODED EXAMPLES', sampleTitle: 'The numbers finally have context', sampleCopy: 'The ROM stores real numeric fields, but many are internal selectors rather than familiar “power” or “bite rate” stats. These examples show exact values and what the game code does with them.',
      item: 'Item', rom: 'ROM fields we can explain', price: 'ROM price field', flyKicker: 'THE CUSTOM FLY MAKER', flyTitle: 'Body, wing, tail… and a real price quote', flyCopy: 'These are direct captures of the original Japanese game. In the first-stage shop, we followed the full Mayfly sequence and checked one order against the money counter.', flyFact: 'Observed Mayfly palette: 20 wing choices; 9 tail sprites plus a separate “None”. One first-body + first-wing + first-tail order cost ¥25 (¥5 + ¥5 + ¥15). That is one measured combination, not a universal price.',
      catalogueKicker: 'THE FULL INDEX', catalogueTitle: 'Browse all 315 listed entries', catalogueCopy: 'Search either language, an item ID, or a stat. Open any card for its raw ROM bytes and record offset.', search: 'Search', searchPlaceholder: 'Try “rod”, “トップウォータ”, or “0D”', category: 'Category', sort: 'Sort', all: 'All categories', sortId: 'Item ID', sortName: 'Name', sortPrice: 'Price field', results: n => `${n} entries shown`, empty: 'No matching entries. Try another name or ID.',
      noPrice: 'No price field', yen: '¥', imageNote: 'Authentic game capture', openFrame: 'Open full game-screen capture ↗', details: 'ROM record and field notes', offset: 'File offset', bytes: 'Raw bytes', decoded: 'Decoded fields', none: 'No table record supplied for this entry.', confidence: 'Evidence', japanese: 'Japanese game label', priceField: 'ROM price field', zeroPrice: '0 yen in the ROM table; not evidence that it is free or sold in a shop.',
      methodKicker: 'HOW TO READ THIS', methodTitle: 'Confirmed, translated, and still unknown', sourcesTitle: 'Sources and method', footer: 'Independent fan research. No ROM file is included.', readme: 'Project notes', langLink: '日本語',
      customFrames: [
        'First-stage shop: fly-family choice.', 'Mayfly body palette.', 'After choosing a body: wing palette.', 'After choosing a wing: tail sprites plus a separate “None” choice.', 'One combination quoted at ¥25.', 'After the order was accepted.'
      ],
      quick: {
        'rod:0A': 'Fight cutoff 70; reach multiplier 15 × 336 = 5,040 internal units. Under 100 HP the cutoff scales with current HP (minimum 10).',
        'rod:0D': 'Fight cutoff 120; reach multiplier 24 × 336 = 8,064 internal units. Under 100 HP the cutoff scales with current HP (minimum 10).',
        'lure:12': 'Action branch 9; conditional fish-ID comparison value 11 → Black bass. Changes a behavior path; does not prove an exclusive target or bonus.',
        'lure:21': 'Action branch 7; conditional fish-ID comparison value 38 → Namazu. Changes a behavior path; does not prove an exclusive target or bonus.',
        'lure:51': 'Action branch 5; conditional fish-ID comparison value 55 → Akame. Changes a behavior path; does not prove an exclusive target or bonus.',
        'food:01': 'Runtime-measured recovery: 5 HP.',
        'food:0A': 'Runtime-measured result: HP becomes 0.'
      },
      fieldNames: { styleCode: 'Rod style code', fightLimitInternal: 'Fight counter cutoff (internal)', rangeMultiplier: 'Reach multiplier', rangeInternalValueAtBase0x0150: 'Reach threshold (internal units)', fishIdMatchCode: 'Fish-ID comparison code', fightResponseCode: 'Fight-response branch selector', specialFishComparisonID: 'Fish-ID comparison value' },
      noteNoJs: 'Enable JavaScript to load the searchable catalogue.'
    },
    ja: {
      title: '釣り道具の中身を、ROMから調べる', lead: '竿、ルアー、毛バリ部品、餌、針、ウキ、食料、道具を検索できる一覧。ROMで確認できた数値と、まだ意味が分からない値を分けて掲載。',
      edition: 'SFC · 日本版', entries: n => `掲載 ${n} 件`, sampleKicker: '解読できた数値の例', sampleTitle: '数字の意味をゲーム処理と照合', sampleCopy: 'ROMには数値が保存されていますが、「強さ」や「ヒット率」のような単純な能力値とは限りません。実際の値と、ゲーム内コードでの使われ方を例示します。',
      item: 'アイテム', rom: '意味を確認できたROM値', price: 'ROM価格欄', flyKicker: '毛バリ作成NPC', flyTitle: 'ボディ、ウィング、テール、そして見積もり', flyCopy: '日本版ゲームを直接撮影した画面です。ステージ1の店でメイフライ作成を最後まで進め、所持金の変化で一例の価格を確認しました。', flyFact: '確認したメイフライ画面: ウィング20種、テール画像9種と別枠の「無し」。最初のボディ+最初のウィング+最初のテールは25円（5+5+15円）。これは実測した一例で、全組み合わせ共通ではありません。',
      catalogueKicker: '全アイテム一覧', catalogueTitle: '掲載315件を検索', catalogueCopy: '英語・日本語、アイテムID、数値で検索できます。各カードを開くとROM生データとファイル位置を確認できます。', search: '検索', searchPlaceholder: '例: 「rod」「トップウォータ」「0D」', category: 'カテゴリ', sort: '並び順', all: 'すべてのカテゴリ', sortId: 'アイテムID', sortName: '名前', sortPrice: '価格欄', results: n => `${n}件を表示`, empty: '一致するアイテムはありません。名前かIDを変えてください。',
      noPrice: '価格欄なし', yen: '¥', imageNote: 'ゲーム画面から取得', openFrame: 'ゲーム画面全体を開く ↗', details: 'ROMレコードとフィールド', offset: 'ファイル位置', bytes: '生バイト列', decoded: '解読済みフィールド', none: 'この項目のテーブルレコードはありません。', confidence: '根拠', japanese: 'ゲーム内の日本語表記', priceField: 'ROM価格欄', zeroPrice: 'ROMの値は0円。無料・店頭販売を意味すると確認されたわけではありません。',
      methodKicker: '読み方', methodTitle: '確認済み、翻訳、未解読を区別', sourcesTitle: '出典と調査方法', footer: 'ファンによる独立調査。ROMファイルは含みません。', readme: 'プロジェクトノート', langLink: 'English',
      customFrames: ['ステージ1の店: 毛バリの系統選択。', 'メイフライのボディ選択。', 'ボディ選択後: ウィング選択。', 'ウィング選択後: テール画像と別枠の「無し」。', 'ある組み合わせの見積もり: 25円。', '注文を確定した後。'],
      quick: {
        'rod:0A': 'ファイト用カウンター上限70。距離判定係数15 × 336 = 内部値5,040。HP100未満ではHPに応じて上限が縮小（最低10）。',
        'rod:0D': 'ファイト用カウンター上限120。距離判定係数24 × 336 = 内部値8,064。HP100未満ではHPに応じて上限が縮小（最低10）。',
        'lure:12': '動作分岐9。魚ID比較値11 → ブラックバス。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。',
        'lure:21': '動作分岐7。魚ID比較値38 → ナマズ。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。',
        'lure:51': '動作分岐5。魚ID比較値55 → アカメ。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。',
        'food:01': 'ゲーム内で測定した回復量: HP5。',
        'food:0A': 'ゲーム内で確認した結果: HPが0になる。'
      },
      fieldNames: { styleCode: '竿の釣り方コード', fightLimitInternal: 'ファイト用カウンター上限（内部値）', rangeMultiplier: '距離判定係数', rangeInternalValueAtBase0x0150: '距離判定値（内部単位）', fishIdMatchCode: '魚ID比較コード', fightResponseCode: 'ファイト応答分岐', specialFishComparisonID: '魚ID比較値' },
      noteNoJs: '検索カタログを表示するにはJavaScriptを有効にしてください。'
    }
  }[lang];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const set = (selector, text) => { const node = document.querySelector(selector); if (node) node.textContent = text; };
  document.title = lang === 'ja' ? '川のぬし釣り2 — アイテム調査' : 'Kawa no Nushi Tsuri 2 — Item Research';
  document.querySelectorAll('[data-t]').forEach(node => { const value = copy[node.dataset.t]; if (typeof value === 'string') node.textContent = value; });
  document.querySelectorAll('[data-t-placeholder]').forEach(node => { const value = copy[node.dataset.tPlaceholder]; if (value) node.placeholder = value; });
  const langLink = document.querySelector('.language-link'); if (langLink) langLink.textContent = copy.langLink;
  const itemLabel = document.querySelector('thead th'); if (itemLabel) itemLabel.textContent = copy.item;
  const headers = document.querySelectorAll('thead th'); if (headers[1]) headers[1].textContent = copy.rom; if (headers[2]) headers[2].textContent = copy.price;
  const imageText = item => lang === 'ja' ? item.imageNoteJa : item.imageNoteEn;
  const formatYen = item => item.priceYen === null || item.priceYen === undefined ? copy.noPrice : `${copy.yen}${item.priceYen}`;
  const exampleIds = ['rod:0A','rod:0D','lure:12','lure:21','lure:51','food:01','food:0A'];
  const categoryNames = {};
  let allItems = [];

  function renderSamples() {
    const tbody = document.getElementById('sample-rows');
    const selected = exampleIds.map(key => allItems.find(item => `${item.category}:${item.id}` === key)).filter(Boolean);
    tbody.innerHTML = selected.map(item => {
      const summary = copy.quick[`${item.category}:${item.id}`] || (lang === 'ja' ? item.notesJa[0] : item.notesEn[0]);
      return `<tr><td><div class="sample-item"><img src="${esc(item.image)}" alt=""><div><span class="item-id">${esc(item.id)}</span><strong>${esc(lang==='ja'?item.nameJa:item.nameEn)}</strong><small>${esc(item.nameJa)}</small></div></div></td><td>${esc(summary)}</td><td><span class="price-badge">${esc(formatYen(item))}</span></td></tr>`;
    }).join('');
  }
  function renderFrames(data) {
    const box=document.getElementById('customizer-frames');
    box.innerHTML=data.customizerFrames.map((frame,index)=>`<figure class="custom-frame"><a href="${esc(frame.src)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(frame.src)}" alt="${esc(lang==='ja'?frame.captionJa:frame.captionEn)}"></a><figcaption><span>${String(index+1).padStart(2,'0')}</span>${esc(lang==='ja'?frame.captionJa:frame.captionEn)}</figcaption></figure>`).join('');
  }
  function renderNotes(data) {
    const list=lang==='ja'?data.researchNotes.ja:data.researchNotes.en;
    document.getElementById('research-notes').innerHTML=list.map(text=>`<p>${esc(text)}</p>`).join('');
    document.getElementById('sources').innerHTML=data.sources.map(src=>`<p>${src.url?`<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(lang==='ja'?src.titleJa:src.titleEn)} ↗</a>`:`<strong>${esc(lang==='ja'?src.titleJa:src.titleEn)}</strong>`}<br><span>${esc(lang==='ja'?src.detailJa:src.detailEn)}</span></p>`).join('');
  }
  function renderFilters() {
    const cats=[...new Set(allItems.map(x=>x.category))];
    const select=document.getElementById('category-filter');
    select.innerHTML=`<option value="all">${esc(copy.all)}</option>`+cats.map(c=>`<option value="${esc(c)}">${esc(categoryNames[c])}</option>`).join('');
    document.getElementById('sort-filter').innerHTML=`<option value="id">${esc(copy.sortId)}</option><option value="name">${esc(copy.sortName)}</option><option value="price">${esc(copy.sortPrice)}</option>`;
  }
  function detailedFields(item) {
    const bytes=item.recordBytesHex?`<p><b>${esc(copy.offset)}:</b> <code>${esc(item.fileOffset||'—')}</code></p><p><b>${esc(copy.bytes)}:</b> <code>${esc(item.recordBytesHex)}</code></p>`:`<p>${esc(copy.none)}</p>`;
    const decoded=Object.entries(item.decodedFields||{}).filter(([key])=>!['nameJapanese','nameEnglish','condition'].includes(key)).map(([key,value])=>`<dt>${esc(copy.fieldNames[key]||key)}</dt><dd>${esc(typeof value==='object'?JSON.stringify(value):value)}</dd>`).join('');
    const raw=Object.entries(item.rawFields||{}).map(([key,value])=>`<dt>${esc(key)}</dt><dd>${Number(value).toString(16).toUpperCase().padStart(2,'0')} <span class="decimal">(${esc(value)})</span></dd>`).join('');
    return `<details class="record-details"><summary>${esc(copy.details)}</summary>${bytes}${decoded?`<h4>${esc(copy.decoded)}</h4><dl>${decoded}</dl>`:''}${raw?`<h4>${esc(copy.bytes)}</h4><dl>${raw}</dl>`:''}</details>`;
  }
  function renderCards() {
    const term=document.getElementById('search').value.trim().toLocaleLowerCase();
    const category=document.getElementById('category-filter').value;
    const order=document.getElementById('sort-filter').value;
    let shown=allItems.filter(item=>(category==='all'||item.category===category)&&(!term||item.search.toLocaleLowerCase().includes(term)||item.notesEn.join(' ').toLocaleLowerCase().includes(term)||item.notesJa.join(' ').toLocaleLowerCase().includes(term)));
    if(order==='name') shown.sort((a,b)=>(lang==='ja'?a.nameJa.localeCompare(b.nameJa,'ja'):a.nameEn.localeCompare(b.nameEn))||a.id.localeCompare(b.id));
    else if(order==='price') shown.sort((a,b)=>(a.priceYen??Infinity)-(b.priceYen??Infinity)||a.category.localeCompare(b.category)||a.id.localeCompare(b.id));
    else shown.sort((a,b)=>a.category.localeCompare(b.category)||a.id.localeCompare(b.id));
    set('#result-count',copy.results(shown.length));
    const box=document.getElementById('cards');
    if(!shown.length){box.innerHTML=`<p class="empty-state">${esc(copy.empty)}</p>`;return;}
    box.innerHTML=shown.map(item=>{
      const name=lang==='ja'?item.nameJa:item.nameEn;
      const notes=lang==='ja'?item.notesJa:item.notesEn;
      const confidence=lang==='ja'?item.confidenceLabelJa:item.confidenceLabelEn;
      return `<article class="item-card"><div class="card-main"><figure class="sprite"><img loading="lazy" src="${esc(item.image)}" alt="${esc(name)}"><figcaption>${esc(imageText(item))}</figcaption></figure><div class="card-text"><div class="card-topline"><span class="category-tag">${esc(lang==='ja'?item.categoryJa:item.categoryEn)}</span><span class="item-id">ID ${esc(item.id)}</span></div><h3>${esc(name)}</h3><p class="jp-name" lang="ja">${esc(item.nameJa)}</p><div class="price-row"><span class="price-badge">${esc(formatYen(item))}</span><span class="confidence">${esc(confidence)}</span></div></div></div><ul class="stat-list">${notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul><div class="card-actions"><a class="frame-link" href="${esc(item.frame)}" target="_blank" rel="noopener">${esc(copy.openFrame)}</a></div>${detailedFields(item)}</article>`;
    }).join('');
  }
  fetch('gallery-data.json').then(response=>{if(!response.ok)throw new Error('catalogue unavailable');return response.json();}).then(data=>{
    allItems=data.items;
    for (const item of allItems) categoryNames[item.category]=lang==='ja'?item.categoryJa:item.categoryEn;
    set('#entry-count',copy.entries(allItems.length));
    renderSamples();renderFrames(data);renderNotes(data);renderFilters();renderCards();
    document.getElementById('search').addEventListener('input',renderCards);
    document.getElementById('category-filter').addEventListener('change',renderCards);
    document.getElementById('sort-filter').addEventListener('change',renderCards);
  }).catch(()=>{
    document.getElementById('cards').innerHTML=`<p class="empty-state">${esc(copy.noteNoJs)}</p>`;
  });
})();
