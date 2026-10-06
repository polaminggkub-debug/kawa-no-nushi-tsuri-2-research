import { seconds } from './format.js'

const DEEPEST = 420 // fish height range the side view maps onto the water column (0 = surface)
const METER_STEPS = 6

/** Site colours from the page's own CSS variables, read once. */
export function readColors() {
  const style = getComputedStyle(document.documentElement)
  const pick = (name, fallback) => style.getPropertyValue(name).trim() || fallback
  return {
    ink: pick('--ink', '#233b33'),
    muted: pick('--muted', '#5c6f65'),
    paper: pick('--paper', '#f4f5ef'),
    line: pick('--line', '#d5dfd4'),
    green: pick('--green', '#24664f'),
    deep: pick('--deep', '#173e31'),
    gold: pick('--gold', '#9b731e'),
    alert: '#a23b2a',
  }
}

/** Size the canvas to its CSS box at the screen's pixel density; returns the drawing size. */
export function fitCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1
  const width = Math.max(280, Math.round(canvas.clientWidth))
  const height = Math.round(width * 0.58)
  canvas.style.height = `${height}px`
  if (canvas.width !== Math.round(width * ratio)) {
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
  }
  canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
  return { width, height }
}

/** Number of lit steps on the 6-step strain meter (fight value 0,1,3,7,15,31,63 = 0..6 steps). */
export const meterSteps = (fightValue) => fightValue.toString(2).replace(/0/g, '').length

function layout({ width, height }, view) {
  const sky = Math.round(height * 0.16)
  const left = Math.round(width * 0.09)
  const right = width - Math.round(width * 0.04)
  const range = Math.max(view.boundary * 1.06, 1200)
  const x = (distance) => left + ((right - left) * Math.min(distance, range)) / range
  const bottom = height - Math.round(height * 0.13)
  // Heights are unsigned 16-bit words in the game: a fish lifted out of the view is 0xFFxx (negative).
  const signed = (depth) => (depth >= 0x8000 ? depth - 0x10000 : depth)
  const y = (depth) =>
    sky + 14 + ((bottom - sky - 24) * Math.max(0, Math.min(signed(depth), DEEPEST))) / DEEPEST
  return { sky, left, right, bottom, x, y }
}

function drawWater(g, size, geo, colors) {
  g.fillStyle = colors.paper
  g.fillRect(0, 0, size.width, geo.sky)
  const water = g.createLinearGradient(0, geo.sky, 0, size.height)
  water.addColorStop(0, '#cfe6e3')
  water.addColorStop(1, '#6f9fa0')
  g.fillStyle = water
  g.fillRect(0, geo.sky, size.width, size.height - geo.sky)
  g.strokeStyle = colors.deep
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(0, geo.sky)
  g.lineTo(size.width, geo.sky)
  g.stroke()
}

function drawBoundary(g, geo, view, text, colors, size) {
  const edge = geo.x(view.boundary)
  g.save()
  g.setLineDash([6, 5])
  g.strokeStyle = colors.alert
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(edge, geo.sky)
  g.lineTo(edge, geo.bottom)
  g.stroke()
  g.restore()
  g.fillStyle = colors.alert
  g.font = `600 ${Math.max(11, size.width / 52)}px system-ui, sans-serif`
  g.textAlign = 'right'
  g.fillText(text.play.range, edge - 6, geo.bottom - 4)
}

function drawAngler(g, geo, text, colors, size) {
  g.fillStyle = colors.deep
  g.beginPath()
  g.arc(geo.left - 14, geo.sky - 20, 7, 0, Math.PI * 2)
  g.fill()
  g.fillRect(geo.left - 19, geo.sky - 13, 10, 13)
  g.strokeStyle = colors.deep
  g.lineWidth = 3
  g.beginPath()
  g.moveTo(geo.left - 8, geo.sky - 10)
  g.lineTo(geo.left + 14, geo.sky - 34)
  g.stroke()
  g.fillStyle = colors.ink
  g.font = `600 ${Math.max(11, size.width / 52)}px system-ui, sans-serif`
  g.textAlign = 'left'
  g.fillText(text.play.you, geo.left - 24, geo.sky + 15)
}

/** One fish: body, tail and eye; it faces away from you while running, towards you otherwise. */
function drawFish(g, at, facing, fill, alpha, scale) {
  g.save()
  g.globalAlpha = alpha
  g.translate(at.x, at.y)
  g.scale(facing * scale, scale)
  g.fillStyle = fill
  g.beginPath()
  g.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2)
  g.fill()
  g.beginPath()
  g.moveTo(-13, 0)
  g.lineTo(-23, -7)
  g.lineTo(-23, 7)
  g.closePath()
  g.fill()
  g.fillStyle = '#fff'
  g.beginPath()
  g.arc(8, -2, 2, 0, Math.PI * 2)
  g.fill()
  g.restore()
}

const facingOf = (view) => (view.fishRunning ? 1 : -1)

function drawLine(g, geo, at, view, colors) {
  const strain = meterSteps(view.fightValue)
  g.strokeStyle = strain >= 5 ? colors.alert : colors.ink
  g.lineWidth = view.holding ? 2.5 : 1.2
  g.beginPath()
  g.moveTo(geo.left + 14, geo.sky - 34)
  g.lineTo(at.x, at.y)
  g.stroke()
}

function drawMeter(g, size, geo, view, text, colors) {
  const lit = meterSteps(view.fightValue)
  const cell = Math.min(34, size.width / 14)
  const top = size.height - Math.round(size.height * 0.1)
  g.font = `600 ${Math.max(11, size.width / 52)}px system-ui, sans-serif`
  g.fillStyle = colors.ink
  g.textAlign = 'left'
  g.fillText(text.play.meter, 8, top + cell * 0.6)
  const start = 8 + g.measureText(text.play.meter).width + 10
  for (let step = 0; step < METER_STEPS; step++) {
    g.fillStyle = step < lit ? (step >= 4 ? colors.alert : colors.gold) : 'rgba(255,255,255,.6)'
    g.fillRect(start + step * (cell + 3), top, cell, cell * 0.7)
  }
}

function drawBadge(g, size, status, colors, held, text) {
  g.font = `700 ${Math.max(12, size.width / 46)}px system-ui, sans-serif`
  g.textAlign = 'right'
  g.fillStyle = held ? colors.green : colors.muted
  g.fillText(held ? text.play.held : text.play.released, size.width - 8, 18)
  g.fillStyle = colors.ink
  g.fillText(status, size.width - 8, 18 + Math.max(16, size.width / 38))
}

/** Draw one frame of the side view: water, rod range, fish, ghost, line, meter and badges. */
export function drawScene(canvas, scene) {
  const size = fitCanvas(canvas)
  const g = canvas.getContext('2d')
  const { view, ghostView, text, colors } = scene
  const geo = layout(size, view)
  drawWater(g, size, geo, colors)
  drawBoundary(g, geo, view, text, colors, size)
  drawAngler(g, geo, text, colors, size)
  const at = { x: geo.x(view.fishPos), y: geo.y(view.fishHeight) }
  if (ghostView && !ghostView.outcome) {
    const ghost = { x: geo.x(ghostView.fishPos), y: geo.y(ghostView.fishHeight) }
    drawFish(g, ghost, facingOf(ghostView), colors.deep, 0.35, 0.9)
  }
  drawLine(g, geo, at, view, colors)
  drawFish(g, at, facingOf(view), colors.gold, 1, 1.1)
  drawMeter(g, size, geo, view, text, colors)
  g.fillStyle = colors.ink
  g.font = `600 ${Math.max(12, size.width / 46)}px system-ui, sans-serif`
  g.textAlign = 'left'
  g.textAlign = 'center'
  g.fillText(`${seconds(view.frame)} s`, size.width / 2, 18)
  drawBadge(g, size, scene.status, colors, scene.held, text)
}
