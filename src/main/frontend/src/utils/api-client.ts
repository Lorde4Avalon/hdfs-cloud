const BASE_URL = process.env.REACT_APP_API_URL;

export type ClientConfig = {
  data: RequestInit['body'];
  headers: RequestInit['headers'];
  customConfig: RequestInit;
}

export async function client(endpoint: string, { data, headers: customHeaders, ...customConfig }: Partial<ClientConfig> = {}) {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      ...customHeaders,
    },
    ...customConfig
  }

  return window.fetch(`${BASE_URL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}
