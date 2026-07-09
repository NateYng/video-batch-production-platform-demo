// Mock 媒体资源：public/mock/covers 下的真实照片封面 + public/mock/videos 下的真实短视频
const BASE = import.meta.env.BASE_URL

function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

const clips = [
  `${BASE}mock/videos/clip-1.mp4`,
  `${BASE}mock/videos/clip-2.mp4`,
  `${BASE}mock/videos/clip-3.mp4`,
]

const COVER_COUNT = 18

/** 按 id 稳定映射到一张真实照片封面 */
export function coverFor(seed, offset = 0) {
  const idx = (hashCode(String(seed)) + offset) % COVER_COUNT
  return `${BASE}mock/covers/cover-${idx + 1}.jpg`
}

/** 按 id 稳定映射到一个 mock 视频文件 */
export function clipFor(seed) {
  return clips[hashCode(String(seed)) % clips.length]
}

/** 视频条目的完整媒体：照片封面 + 视频源 */
export function videoMedia(id) {
  return {
    poster: coverFor(id),
    src: clipFor(id),
  }
}
