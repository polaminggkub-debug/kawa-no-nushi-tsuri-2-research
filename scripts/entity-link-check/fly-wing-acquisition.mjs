import assert from 'node:assert/strict'
import { data, render, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const ids = ['25', '26', '66', '67']
const scope = {
  en: 'it is in no shop and not in the fly maker',
  ja: '店にも毛バリ職人にもない',
  th: 'ไม่มีทั้งในร้านและในร้านทำฟลาย',
}

function actionUrls(html, base) {
  return [...html.matchAll(/data-fly-wing-route="([^"]+)"[^>]+href="([^"]+)"/g)].map(
    ([, kind, href]) => ({ kind, url: new URL(unescapeHtml(href), base) }),
  )
}

function checkWing(runtime, base, lang, id) {
  const item = data.items.find((entry) => entry.category === 'fly_wing' && entry.id === id)
  assert(item && !item.flyMakerMenuChoice, `Unverified wing gained a fabricated menu: ${id}`)
  const html = runtime.renderItemCard(item)
  const visible = unescapeHtml(html.split('<details class="card-decision-disclosure"')[0])
  assert(visible.includes(`data-fly-wing-decision="${id}"`))
  assert(!visible.includes('data-fly-menu-choice'))
  const actions = actionUrls(visible, base)
  assert(actions.length, `No usable next action for wing ${id}/${lang}`)
  if (id === '26') checkBundle(item, visible, actions)
  else checkUnrecorded(item, visible, actions, lang)
  validate(html, base)
}

function checkBundle(item, visible, actions) {
  const offers = item.playerUse.shops.filter((shop) => shop.bundle?.wing === '26')
  assert.equal(offers.length, 1)
  assert.equal(Number(offers[0].stage), 6)
  assert.deepEqual(
    [offers[0].bundle.body, offers[0].bundle.tail, offers[0].bundle.shopPriceYen],
    ['1E', '2A', 50],
  )
  for (const token of ['1E', '26', '2A', '¥50']) assert(visible.includes(token))
  const shop = actions.find((action) => action.kind === 'shop')?.url
  assert(shop, 'Complete-set acquisition must be actionable')
  for (const [key, value] of Object.entries({ stage: '6', category: 'fly_wing', id: '26' }))
    assert.equal(shop.searchParams.get(key), value)
  assert(
    actions.some((action) => action.kind === 'body' && action.url.searchParams.get('id') === '1E'),
  )
}

function checkUnrecorded(item, visible, actions, lang) {
  assert.equal(item.playerUse.shops.length, 0)
  assert(visible.includes(scope[lang]), `Missing bounded acquisition statement: ${item.id}/${lang}`)
  assert(!actions.some((action) => action.kind === 'shop'))
  const alternative = actions.find((action) => action.kind === 'alternative')?.url
  assert(alternative, 'Missing verified alternative')
  assert.equal(alternative.hash, '#fly-menu-position')
  const next = data.items.find(
    (entry) =>
      entry.category === alternative.searchParams.get('category') &&
      entry.id === alternative.searchParams.get('id'),
  )
  assert(next?.flyMakerMenuChoice, 'Alternative is not a verified menu choice')
}

for (const lang of ['en', 'ja', 'th']) {
  const { runtime, url } = await renderCatalogue(lang, '?category=fly_wing&stage=1')
  for (const id of ids) checkWing(runtime, url, lang, id)
  await checkDetailRoutes(lang)
}
console.log(
  'PASS: four unverified wing routes say they are not sold anywhere and give actionable verified alternatives; Area 6 set is ¥50 total (EN/JA/TH).',
)

async function checkDetailRoutes(lang) {
  for (const id of ids) {
    const result = await render('item', lang, `category=fly_wing&id=${id}`)
    const item = data.items.find((entry) => entry.category === 'fly_wing' && entry.id === id)
    const visible = unescapeHtml(result.html.split('<details class="evidence"')[0])
    assert(visible.includes(`data-fly-wing-verdict="${id}"`))
    const actions = actionUrls(visible, result.url)
    if (id === '26') checkBundle(item, visible, actions)
    else checkUnrecorded(item, visible, actions, lang)
  }
  const body = data.items.find((entry) => entry.category === 'fly' && entry.id === '1E')
  const accepted = body.playerUse.fishIds[0]
  const rejected = Object.keys(data.fishVisuals).find((id) => !body.playerUse.fishIds.includes(id))
  for (const [fish, supported] of [
    [accepted, true],
    [rejected, false],
  ]) {
    const result = await render('item', lang, `category=fly_wing&id=26&fish=${fish}`)
    const actions = actionUrls(result.html, result.url)
    assert.equal(
      actions.some((action) => action.kind === 'shop'),
      supported,
    )
    assert(
      actions.some(
        (action) => action.kind === 'fish' && action.url.searchParams.get('id') === fish,
      ),
    )
  }
}
