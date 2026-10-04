(() => {
  const filter = document.getElementById('filter');
  const resultCount = document.getElementById('filter-count');
  const rows = Array.from(document.querySelectorAll('#fish-matrix tbody tr'));
  const copy = {
    en: {
      count: (shown, total) => `Showing ${shown} of ${total} fish profiles.`,
      aliasFailure: 'Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead.'
    },
    ja: {
      count: (shown, total) => `魚プロフィール ${shown} / ${total} 件を表示。`,
      aliasFailure: '検索用のローマ字・タイ語名を読み込めませんでした。ROMの日本語名またはプロフィールIDで検索できます。'
    },
    th: {
      count: (shown, total) => `แสดง ${shown} จาก ${total} โปรไฟล์ปลา`,
      aliasFailure: 'โหลดคำช่วยค้นหาไม่สำเร็จ ยังค้นด้วยชื่อญี่ปุ่นจาก ROM หรือ ID โปรไฟล์ได้'
    }
  }[document.documentElement.lang] || {
    count: (shown, total) => `${shown} / ${total}`,
    aliasFailure: 'Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead.'
  };
  const aliasWarning = document.getElementById('alias-warning');
  const normalize = value => value.normalize('NFKC').trim().toLocaleLowerCase();
  const aliases = new Map();

  const applyFilter = () => {
    const query = normalize(filter.value);
    let shown = 0;
    for (const row of rows) {
      const id = row.querySelector('a[href*="id="]')?.href.match(/[?&]id=([^&]+)/)?.[1] || '';
      const searchable = normalize(`${row.textContent} ${aliases.get(id) || ''}`);
      const matches = !query || searchable.includes(query);
      row.hidden = !matches;
      if (matches) shown++;
    }
    resultCount.textContent = copy.count(shown, rows.length);
  };

  filter.addEventListener('input', applyFilter);
  applyFilter();

  fetch('../catalogue/fish-visuals.json')
    .then(response => {
      if (!response.ok) throw new Error('Fish names unavailable');
      return response.json();
    })
    .then(data => {
      for (const [id, fish] of Object.entries(data.fish || {})) {
        aliases.set(id, [
          fish.nameEn,
          fish.nameLatin,
          ...(fish.nameLatinVariants || []),
          fish.nameTh,
          ...(fish.nameThVariants || []),
          fish.nameJa
        ].filter(Boolean).join(' '));
      }
      applyFilter();
    })
    .catch(() => {
      aliasWarning.hidden = false;
      aliasWarning.textContent = copy.aliasFailure;
    });
})();
