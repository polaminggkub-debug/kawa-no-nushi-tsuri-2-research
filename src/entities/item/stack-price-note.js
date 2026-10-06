// Bait and hooks are sold by the stack of 9: any purchase costs the listed price and fills the stack.
const STACK_CATEGORIES = new Set(['bait', 'hook'])

const NOTE = {
  th: 'ราคานี้ต่อ 1 ชุด (9 ชิ้น) ถ้าเหลืออยู่ 8 ก็ยังจ่ายเต็มราคา แล้วเกมเติมให้ครบ 9',
  en: 'This price is per stack of 9. With 8 left you still pay it in full and are topped up to 9.',
  ja: '価格は9個1組分。8個残っていても全額かかり、9個まで補充されます。',
}

const UNIT = { th: 'ต่อ 9 ชิ้น', en: 'per stack of 9', ja: '9個分' }

export function sellsByStack(item) {
  return STACK_CATEGORIES.has(item?.category)
}

export function stackPriceNote(lang, item) {
  return sellsByStack(item) ? NOTE[lang] || NOTE.en : ''
}

export function stackPriceUnit(lang, item) {
  return sellsByStack(item) ? UNIT[lang] || UNIT.en : ''
}
