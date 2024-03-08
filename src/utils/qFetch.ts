/**
 * Quick fetch, with timeout and error handling
 */
const qFetch = async (url: string, options?: RequestInit, timeout = 3000): Promise<Response> => {
  console.log('qFetch', url, options, timeout)
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(url, { ...options, signal: controller.signal })
  clearTimeout(id)
  return response
}

export default qFetch
