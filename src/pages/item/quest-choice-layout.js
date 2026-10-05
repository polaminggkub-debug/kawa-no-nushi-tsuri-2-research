export function questChoiceLayout(ctx, item, action, extras) {
  if (item.category !== 'general_tool' || !['10', '15'].includes(item.id)) return { action, extras }
  const label = {
    th: 'คำอธิบายไอเท็มและบทสนทนาเพิ่มเติม',
    en: 'Item description and additional dialogue',
    ja: '道具の説明と追加の会話',
  }[ctx.lang]
  const original = action.replace('id="what-to-do"', '')
  return {
    action: `<div id="what-to-do" data-quest-choice-primary>${extras}</div>`,
    extras: `<details class="detail-section" data-quest-choice-description><summary>${ctx.esc(label)}</summary>${original}</details>`,
  }
}
