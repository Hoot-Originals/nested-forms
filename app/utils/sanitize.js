import DOMPurify from 'dompurify'

export function sanitizeString(value) {
  if (!value) return value

  // Convert to string if not already
  const str = String(value)

  // Use DOMPurify to remove any HTML/script tags
  const cleaned = DOMPurify.sanitize(str, {
    ALLOWED_TAGS: [], // Don't allow any HTML tags
    ALLOWED_ATTR: [] // Don't allow any HTML attributes
  })

  // Trim whitespace
  return cleaned.trim()
}

export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj

  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'object' ? sanitizeObject(item) : sanitizeString(item)
      )
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = sanitizeString(value)
    }
  }
  return sanitized
}