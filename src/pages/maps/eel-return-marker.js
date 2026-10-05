import { eelEndingEntrance } from '../../entities/fish/index.js'

const copy = {
  th: {
    label: 'ทางเข้าหมู่บ้าน',
    help: 'เก็บปลาไหลไว้แล้วกลับหมู่บ้านทางจุดลูกศร เมื่อเงื่อนไขเนื้อเรื่องครบ เกมจะเริ่มฉากช่วยหมอและฉากจบอัตโนมัติ กดลูกศรเพื่อกลับไปอ่านคำขอ',
  },
  en: {
    label: 'Starting-village entrance',
    help: 'Keep the eel and enter the village at the arrow. When the story conditions are complete, the doctor-recovery and ending scene starts automatically. Select the arrow to return to the request guidance.',
  },
  ja: {
    label: '最初の村への入口',
    help: 'ウナギを残して矢印の地点から村へ戻ります。物語の条件がそろうと、医者の回復とエンディングの自動シーンが始まります。矢印を選ぶと依頼の説明に戻ります。',
  },
}

export function renderEelReturnMarker(ctx, geometry) {
  const route = eelEndingEntrance
  if (!ctx.eelReturnRequested || Number(ctx.activeStage) !== route.stage) return ''
  const { x, y } = route
  const section = `s1-c${Math.floor(x / 24) + 1}-r${Math.floor(y / 24) + 1}`
  if (ctx.activeSection !== section) return ''
  const text = copy[ctx.lang] || copy.en
  const px = (x * 16 + 8 - geometry.originX) * geometry.scale + geometry.gutterLeft
  const py = (y * 16 + 8 - geometry.originY) * geometry.scale + geometry.gutterTop
  const fallback = ctx.lang === 'en' ? 'item.html' : `item.${ctx.lang}.html`
  const href = ctx.returnPath || `${fallback}?category=general_tool&id=06&stage=6`
  ctx.$('pin-help').textContent = text.help
  return `<a class="eel-return-marker" data-eel-return-marker data-x="${x}" data-y="${y}" href="${ctx.esc(href)}" style="left:${px}px;top:${py}px" aria-label="${ctx.esc(`${text.label} · X ${x}, Y ${y}`)}"><span aria-hidden="true">↓</span><strong>${ctx.esc(text.label)}</strong></a>`
}
