export function setupPickerState(ctx) {
  ctx.fishLocations = {}
  ctx.locationStage = ''
  ctx.locationMapIndex = 0
  ctx.flyPart = 'fly'
  ctx.baitRoute = 'float'
  ctx.decisions = []
  ctx.gearPriceGuide = {}
  ctx.fishCategories = ['all', 'bait', 'lure', 'flymaker', 'float_weight', 'rod', 'hook']
  ctx.suggestionIds = []
  ctx.activeSuggestion = -1
  ctx.pickerCopy = {
    th: {
      placeholder: 'ชื่อปลา / fish name / ID',
      clear: 'ล้างปลาเป้าหมาย',
      none: 'ไม่พบปลา ลองชื่อไทย อังกฤษ ญี่ปุ่น หรือ ID',
      count: (n) => `พบ ${n} ชนิด ใช้ปุ่มลูกศรแล้วกด Enter หรือกดชื่อปลา`,
    },
    en: {
      placeholder: 'Fish name or ID',
      clear: 'Clear target fish',
      none: 'No fish found. Try a Thai, English, Japanese name or ID.',
      count: (n) => `${n} fish found. Use arrow keys and Enter, or click a fish.`,
    },
    ja: {
      placeholder: '魚名・読み方・ID',
      clear: '魚の指定を解除',
      none: '見つかりません。日本語・英語・タイ語の名前やIDで検索。',
      count: (n) => `${n}件。矢印キーとEnter、または魚名をクリック。`,
    },
  }[ctx.lang]
}
