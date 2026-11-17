// Resized copy of a Drive file, e.g. options "w800-h800" or "w100-h100-c" (crop)
export const driveImage = (id, options) => `https://lh3.googleusercontent.com/u/0/d/${id}=${options}`

const MAX_IMAGE_RETRIES = 4

/**
 * `error` handler for <img> tags with Drive images. Drive answers 429 (Too Many Requests)
 * when many images load at once, so the image is requested again with an increasing delay.
 */
export const retryDriveImage = (event) => {
  const img = event.target
  const src = img.getAttribute('src')
  if (!src) {
    return
  }

  // The same <img> can be reused for another photo, so count retries per src
  const attempt = img.dataset.retrySrc === src ? Number(img.dataset.retryCount) : 0
  if (attempt >= MAX_IMAGE_RETRIES) {
    return
  }
  img.dataset.retrySrc = src
  img.dataset.retryCount = attempt + 1

  // 1s, 2s, 4s, 8s, plus jitter so failed images don't retry all at the same moment
  const delay = 1000 * 2 ** attempt + Math.random() * 500
  setTimeout(() => {
    if (img.isConnected && img.getAttribute('src') === src) {
      img.removeAttribute('src')
      img.setAttribute('src', src)
    }
  }, delay)
}

const ICON_PREFIXES = {
  'fa-brands': 'fab',
  'fab': 'fab',
  'fa-solid': 'fas',
  'fas': 'fas',
}

// "fa-brands fa-instagram" -> ['fab', 'instagram'], "fa-camera" -> ['fas', 'camera']
const parseIcon = (icon) => {
  if (typeof icon !== 'string') {
    return null
  }
  const tokens = icon.trim().split(/\s+/)
  const prefix = tokens.map(token => ICON_PREFIXES[token]).find(Boolean) ?? 'fas'
  const name = tokens.find(token => !ICON_PREFIXES[token])?.replace(/^fa-/, '')
  return name ? [prefix, name] : null
}

const parseLink = (link) => {
  if (typeof link?.url !== 'string') {
    return null
  }
  const url = link.url.trim()
  if (!/^https?:\/\//i.test(url)) {
    return null
  }
  return {
    url,
    label: typeof link.label === 'string' && link.label.trim() ? link.label.trim() : url,
    icon: parseIcon(link.icon),
  }
}

const parseExif = (exif) => {
  if (!exif || typeof exif !== 'object') {
    return {}
  }
  const { dateTimeOriginal, cameraMake, cameraModel, aperture, exposureTime, iso } = exif
  return { dateTimeOriginal, cameraMake, cameraModel, aperture, exposureTime, iso }
}

const parsePhoto = (item) => {
  const id = typeof item?.id === 'string' ? item.id.trim() : ''
  if (!id) {
    return null
  }
  return {
    id,
    filename: typeof item.filename === 'string' ? item.filename : '',
    exif: parseExif(item.exif),
    links: Array.isArray(item.links) ? item.links.map(parseLink).filter(Boolean) : [],
  }
}

/**
 * Parses the `photo_ids` field of a photography_gdrive_entry, a JSON list of:
 *   {
 *     "id": "<drive file id>",
 *     "filename": "IMG_0001.jpg",
 *     "exif": { "dateTimeOriginal": "2026:10:04 19:00:45", "cameraMake": "Canon", "cameraModel": "Canon EOS REBEL SL1",
 *               "aperture": "f/4.5", "exposureTime": "1/60 s", "iso": 800 },
 *     "links": [{ "url": "https://...", "label": "Text", "icon": "fa-brands fa-instagram" }]
 *   }
 * Everything but `id` is optional.
 */
export const parseGdrivePhotos = (text) => {
  if (!text?.trim()) {
    return []
  }

  try {
    const items = JSON.parse(text)
    return Array.isArray(items) ? items.map(parsePhoto).filter(Boolean) : []
  }
  catch (error) {
    console.error('Invalid JSON in photo_ids', error)
    return []
  }
}
