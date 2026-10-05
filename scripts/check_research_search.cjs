const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../research/search.js'), 'utf8');
const fixture = {
  fish: {
    '01': { nameLatin: 'Iwana', nameTh: 'อิวานะ', nameJa: 'イワナ' },
    '06': {
      nameLatinVariants: ['Nijimasu', 'Nijimasu (rainbow trout)'],
      nameThVariants: ['นิจิมาสุ', 'ปลาเรนโบว์เทราต์'],
      nameJa: 'ニジマス'
    },
    '42': { nameLatin: 'Sakuramasu', nameTh: 'ซากุระมาสึ', nameJa: 'サクラマス' }
  }
};

const copy = {
  en: {
    all: 'Showing 3 of 3 fish profiles.',
    none: 'Showing 0 of 3 fish profiles.',
    warning: 'Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead.'
  },
  ja: {
    all: '魚プロフィール 3 / 3 件を表示。',
    none: '魚プロフィール 0 / 3 件を表示。',
    warning: '検索用のローマ字・タイ語名を読み込めませんでした。ROMの日本語名またはプロフィールIDで検索できます。'
  },
  th: {
    all: 'แสดง 3 จาก 3 โปรไฟล์ปลา',
    none: 'แสดง 0 จาก 3 โปรไฟล์ปลา',
    warning: 'โหลดคำช่วยค้นหาไม่สำเร็จ ยังค้นด้วยชื่อญี่ปุ่นจาก ROM หรือ ID โปรไฟล์ได้'
  }
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createHarness(lang, fetchMode = 'success') {
  const rows = [
    ['01', '01 イワナ'],
    ['06', '06 ニジマス'],
    ['42', '42 サクラマス']
  ].map(([id, textContent]) => ({
    hidden: false,
    textContent,
    querySelector: () => ({ href: `https://example.test/fish.html?id=${id}&return=research` })
  }));
  const filter = {
    value: '',
    listeners: {},
    addEventListener(event, callback) { this.listeners[event] = callback; }
  };
  const filterCount = { textContent: '' };
  const aliasWarning = { hidden: true, textContent: '' };
  const elements = { filter, 'filter-count': filterCount, 'alias-warning': aliasWarning };
  const document = {
    documentElement: { lang },
    getElementById: id => elements[id],
    querySelector: () => null,
    querySelectorAll: selector => selector === '#fish-matrix tbody tr' ? rows : []
  };
  const fetch = fetchMode === 'success'
    ? () => Promise.resolve({ ok: true, json: () => Promise.resolve(fixture) })
    : () => Promise.reject(new Error('offline'));

  vm.runInNewContext(source, { document, fetch });
  return { rows, filter, filterCount, aliasWarning };
}

function visibleIds(rows) {
  return rows.filter(row => !row.hidden).map(row => row.querySelector('a[href*="id="]').href.match(/[?&]id=([^&]+)/)[1]);
}

async function tick() {
  await new Promise(resolve => setImmediate(resolve));
}

async function checkAliasesForLocale(lang) {
  const { rows, filter, filterCount, aliasWarning } = createHarness(lang);
  await tick();
  assert(filterCount.textContent === copy[lang].all, `${lang}: initial localized count`);
  assert(aliasWarning.hidden, `${lang}: warning hidden after successful fetch`);

  for (const [query, expected] of [
    ['ニジマス', 'Japanese ROM name'],
    ['rainbow trout', 'English lookup alias'],
    ['Nijimasu', 'romanized lookup alias'],
    ['ปลาเรนโบว์เทราต์', 'Thai lookup alias'],
    ['06', 'hex profile ID'],
    ['０６', 'NFKC-normalized fullwidth ID']
  ]) {
    filter.value = query;
    filter.listeners.input();
    assert(JSON.stringify(visibleIds(rows)) === JSON.stringify(['06']), `${lang}: ${expected} query ${query}`);
  }

  filter.value = 'no matching fish';
  filter.listeners.input();
  assert(visibleIds(rows).length === 0, `${lang}: zero-result filtering`);
  assert(filterCount.textContent === copy[lang].none, `${lang}: localized zero-result feedback`);
}

async function checkFetchFailureForLocale(lang) {
  const { rows, filter, filterCount, aliasWarning } = createHarness(lang, 'failure');
  await tick();
  assert(aliasWarning.hidden === false, `${lang}: alias failure warning shown`);
  assert(aliasWarning.textContent === copy[lang].warning, `${lang}: localized alias failure warning`);

  filter.value = 'ニジマス';
  filter.listeners.input();
  assert(JSON.stringify(visibleIds(rows)) === JSON.stringify(['06']), `${lang}: Japanese name works after alias failure`);
  filter.value = '06';
  filter.listeners.input();
  assert(JSON.stringify(visibleIds(rows)) === JSON.stringify(['06']), `${lang}: ID works after alias failure`);
  assert(filterCount.textContent !== copy[lang].none, `${lang}: fallback still reports matches`);
}

(async () => {
  for (const lang of ['en', 'ja', 'th']) {
    await checkAliasesForLocale(lang);
    await checkFetchFailureForLocale(lang);
  }
  console.log('PASS: EN/JA/TH research filters support ROM Japanese, romanized/Thai lookup aliases, hex and NFKC IDs, localized zero-result counts, and visible alias-load failures with working ROM-name/ID fallback.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
