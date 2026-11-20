export function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export function isSameOrigin(
  request: Request,
  origin = request.headers.get('origin'),
) {
  if (!origin || origin === 'null') return false

  const target = process.env.VCRAFT_ORIGIN?.trim() || request.url
  try {
    return origin === new URL(target).origin
  } catch {
    return false
  }
}

export async function readJson(request: Request): Promise<unknown> {
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
      'application/json' ||
    !request.body
  ) {
    return null
  }
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let size = 0
  let text = ''
  try {
    let chunk = await reader.read()
    while (!chunk.done) {
      const { value } = chunk
      size += value.byteLength
      if (size > 16_384) {
        await reader.cancel()
        return null
      }
      text += decoder.decode(value, { stream: true })
      chunk = await reader.read()
    }
    return JSON.parse(text + decoder.decode()) as unknown
  } catch {
    return null
  } finally {
    reader.releaseLock()
  }
}

export function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function cleanText(value: unknown, min: number, max: number) {
  if (typeof value !== 'string' || /\0|\p{Surrogate}/u.test(value)) return null
  const text = value.trim()
  return text.length >= min && text.length <= max ? text : null
}
