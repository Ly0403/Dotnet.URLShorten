const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5071'

export async function apiRequest(method: string, body?: FormData | null, id?: string | number): Promise<any> {
  let url = `${API_BASE_URL}/shorten`
  if (id && (method === 'DELETE' || method === 'PUT' || method === 'PATCH')) {
    url = `${url}/${id}`
  }

  const response = await fetch(url, {
    method: method,
    body: body || undefined,
  })

  if (!response.ok) {
    throw new Error(`Failed to ${method} request`)
  }

  // Handle 204 No Content response (common for DELETE requests)
  if (response.status === 204) {
    return null
  }

  // Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return null
  }

  return await response.json()
}
