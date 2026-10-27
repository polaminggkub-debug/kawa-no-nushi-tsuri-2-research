const labels = {
  th: { rom: 'ยืนยันจาก ROM', tested: 'ยืนยันจากการทดสอบ', unconfirmed: 'ยังไม่ยืนยัน' },
  en: { rom: 'Confirmed from the ROM', tested: 'Confirmed by test', unconfirmed: 'Not confirmed' },
  ja: { rom: 'ROMで確認済み', tested: 'テストで確認済み', unconfirmed: '未確認' },
}

/** How far a recommendation can be trusted: read from the ROM, shown by a test, or still a guess. */
export function trustBadge(locale, level) {
  const text = (labels[locale] || labels.en)[level]
  return `<span class="trust trust-${level}">${text}</span>`
}
