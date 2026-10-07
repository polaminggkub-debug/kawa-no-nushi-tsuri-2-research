import { eelEndingEntrance } from '../../entities/fish/index.js'

const copy = {
  th: {
    label: 'ทางเข้าหมู่บ้าน',
    help: 'ประตูหมู่บ้านสำหรับฉากจบ เมื่อทำขั้นก่อนหน้าครบแล้ว เดินเข้าตรงจุดลูกศร ฉากจบจะเริ่มโดยอัตโนมัติ ไม่ต้องเก็บปลาไหลไว้ กดลูกศรเพื่อกลับไปอ่านคำขอ',
  },
  en: {
    label: 'Starting-village entrance',
    help: 'This is the village door for the ending. Once the earlier steps are done, walk in at the arrow and the ending scene plays automatically. You do not need to keep the eel. Select the arrow to return to the request guidance.',
  },
  ja: {
    label: '最初の村への入口',
    help: 'エンディング用の村の入口です。先の手順が済んでいれば、矢印の地点から入るとエンディングが自動で流れます。ウナギを残す必要はありません。矢印を選ぶと依頼の説明に戻ります。',
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
