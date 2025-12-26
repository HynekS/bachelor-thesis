export type BaseResponse = Record<PropertyKey, unknown> | Record<PropertyKey, unknown>[]

export class ApiClient {
  constructor(baseURL?: RequestInfo | URL, baseOptions?: RequestInit) {
    this.baseUrl = baseURL ?? ''
    this.options = {
      ...this.baseOptions,
      ...baseOptions
    }
  }

  private options

  private baseUrl

  private baseOptions: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  private serializeQueryParams(params: Record<string, unknown>): string {
    const queryString = Object.entries(params)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
            .join('&')
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`
      })
      .join('&')
    return queryString
  }

  private parseResponseContent = async (response, contentType) => {
    switch (contentType) {
      case 'blob':
        return await response.blob()

      case 'text':
        return await response.text()

      case 'json':
        return await response.json()

      default:
        return response
    }
  }

  private async request<
    TResponse extends BaseResponse,
    TQueryParams extends Record<PropertyKey, unknown>,
    TBody extends Record<PropertyKey, unknown> | FormData
  >(
    method: RequestInit['method'],
    url: RequestInfo | URL,
    body?: TBody,
    queryParams?: TQueryParams,
    options?: RequestInit & { responseType?: 'blob' | 'text' | 'json' }
  ): Promise<TResponse> {
    const requestURL = `${this.baseUrl}${url}${
      queryParams ? `?${this.serializeQueryParams(queryParams)}` : ''
    }`

    const requestInit = {
      ...this.options,
      ...options,
      method,
      ...(body &&
        method !== 'GET' && {
          body: body instanceof FormData ? body : JSON.stringify(body)
        })
    } satisfies RequestInit

    try {
      const response = await fetch(requestURL, requestInit)
      const contentType = options?.responseType ?? 'json'

      const data = await this.parseResponseContent(response, contentType)

      if (!response.ok || data.isError) {
        return Promise.reject(data)
      }

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  get<
    TResponse extends BaseResponse,
    TQueryParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>
  >(
    url: RequestInfo | URL,
    queryParams?: TQueryParams,
    options?: RequestInit & { responseType?: 'blob' | 'text' | 'json' }
  ): Promise<TResponse> {
    return this.request('GET', url, undefined, queryParams, options)
  }

  post<
    TResponse extends BaseResponse,
    TQueryParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
    TBody extends Record<PropertyKey, unknown> | FormData = Record<PropertyKey, unknown> | FormData
  >(
    url: RequestInfo | URL,
    queryParams?: TQueryParams,
    body?: TBody,
    options?: RequestInit & { responseType?: 'blob' | 'text' | 'json' }
  ): Promise<TResponse> {
    return this.request('POST', url, body, queryParams, options)
  }

  put<
    TResponse extends BaseResponse,
    TQueryParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
    TBody extends Record<PropertyKey, unknown> | FormData = Record<PropertyKey, unknown> | FormData
  >(
    url: RequestInfo | URL,
    queryParams?: TQueryParams,
    body?: TBody,
    options?: RequestInit & { responseType?: 'blob' | 'text' | 'json' }
  ): Promise<TResponse> {
    return this.request('PUT', url, body, queryParams, options)
  }

  patch<
    TResponse extends BaseResponse,
    TQueryParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
    TBody extends Record<PropertyKey, unknown> | FormData = Record<PropertyKey, unknown> | FormData
  >(
    url: RequestInfo | URL,
    queryParams?: TQueryParams,
    body?: TBody,
    options?: RequestInit & { responseType?: 'blob' | 'text' | 'json' }
  ): Promise<TResponse> {
    return this.request('PATCH', url, body, queryParams, options)
  }

  delete<
    TResponse extends BaseResponse,
    TQueryParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
    TBody extends Record<PropertyKey, unknown> | FormData = Record<PropertyKey, unknown> | FormData
  >(
    url: RequestInfo | URL,
    queryParams?: TQueryParams,
    body?: TBody,
    options?: RequestInit & { responseType?: 'blob' | 'text' | 'json' }
  ): Promise<TResponse> {
    return this.request('DELETE', url, body, queryParams, {
      ...options,
      ...(body == null && { headers: { 'Content-Type': 'text/plain' } })
    })
  }

  upload<
    TResponse extends BaseResponse,
    TQueryParams extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
    TBody extends FormData = FormData
  >(
    url: RequestInfo | URL,
    queryParams?: TQueryParams,
    body?: TBody,
    options?: RequestInit & { responseType?: 'blob' | 'text' | 'json' }
  ): Promise<TResponse> {
    return this.request('POST', url, body, queryParams, {
      ...options,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

const api = new ApiClient(import.meta.env.VITE_API_URL_PREFIXED)

export default api
