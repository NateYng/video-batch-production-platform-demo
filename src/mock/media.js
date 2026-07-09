// Mock 媒体资源：运行时生成 SVG 封面（data URI），配合 public/mock/videos 下的真实短视频
const BASE = import.meta.env.BASE_URL

const palettes = [
  { a: '#6e79f7', b: '#22d3ee', name: 'indigo-cyan' },
  { a: '#8b5cf6', b: '#f472b6', name: 'violet-pink' },
  { a: '#22d3ee', b: '#34d399', name: 'cyan-emerald' },
  { a: '#fb7185', b: '#fbbf24', name: 'rose-amber' },
  { a: '#60a5fa', b: '#a78bfa', name: 'blue-violet' },
  { a: '#2dd4bf', b: '#6e79f7', name: 'teal-indigo' },
]

function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * 生成暗色科技风 SVG 封面（data URI）
 * @param {string} title 封面主标题
 * @param {object} opts { subtitle, seed, width, height, play }
 */
export function makePoster(title, opts = {}) {
  const {
    subtitle = 'AI GENERATED',
    seed = title,
    width = 640,
    height = 360,
    play = true,
  } = opts
  const p = palettes[hashCode(String(seed)) % palettes.length]
  const w = width
  const h = height
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.a}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${p.b}" stop-opacity="0.2"/>
    </linearGradient>
    <radialGradient id="g2" cx="0.85" cy="0.1" r="0.9">
      <stop offset="0" stop-color="${p.b}" stop-opacity="0.4"/>
      <stop offset="1" stop-color="${p.b}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="#0b0c12"/>
  <rect width="${w}" height="${h}" fill="url(#g1)"/>
  <rect width="${w}" height="${h}" fill="url(#g2)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <circle cx="${w * 0.82}" cy="${h * 0.28}" r="${h * 0.42}" fill="none" stroke="${p.b}" stroke-opacity="0.25" stroke-width="1.5"/>
  <circle cx="${w * 0.82}" cy="${h * 0.28}" r="${h * 0.28}" fill="none" stroke="${p.a}" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="6 8"/>
  ${play ? `<g transform="translate(${w / 2},${h / 2 - 8})">
    <circle r="30" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
    <path d="M-8,-13 L14,0 L-8,13 Z" fill="#ffffff" fill-opacity="0.92"/>
  </g>` : ''}
  <text x="24" y="${h - 44}" font-family="Inter,PingFang SC,sans-serif" font-size="20" font-weight="700" fill="#f2f4f8">${escapeXml(title)}</text>
  <text x="24" y="${h - 20}" font-family="Inter,monospace" font-size="11" letter-spacing="3" fill="${p.b}" fill-opacity="0.85">${escapeXml(subtitle)}</text>
  <rect x="24" y="${h - 66}" width="28" height="3" rx="1.5" fill="${p.a}"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

const clips = [
  `${BASE}mock/videos/clip-1.mp4`,
  `${BASE}mock/videos/clip-2.mp4`,
  `${BASE}mock/videos/clip-3.mp4`,
]

/** 按 id 稳定映射到一个 mock 视频文件 */
export function clipFor(seed) {
  return clips[hashCode(String(seed)) % clips.length]
}

/** 视频条目的完整媒体：封面 + 视频源 */
export function videoMedia(id, title, subtitle = 'AI GENERATED · 1080P') {
  return {
    poster: makePoster(title, { seed: id, subtitle }),
    src: clipFor(id),
  }
}
