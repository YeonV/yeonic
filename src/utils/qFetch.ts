const qFetch = async (url: string, options?: RequestInit, timeout = 3000): Promise<Response> => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(id)
    return response
  } catch (error: any) {
    clearTimeout(id)
    if (error.name === 'AbortError') {
      // console.log('Fetch request was aborted');
      return null as unknown as Response
    } else {
      throw error
    }
  }
}

export default qFetch
