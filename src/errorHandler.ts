import axios, { AxiosRequestHeaders } from 'axios'

export const errorHandler = (errorResponse: unknown): never => {
  if (!axios.isAxiosError(errorResponse)) {
    throw errorResponse
  }

  const { config, response } = errorResponse
  if (!response?.data) {
    throw errorResponse
  }

  const { data } = response
  const errorData: {
    status: number
    statusText: string
    message: string
    request?: {
      method?: string
      headers?: AxiosRequestHeaders
      url?: string
    }
  } = {
    status: data.status,
    statusText: data.code,
    message: data.message,
  }

  if (config) {
    errorData.request = {
      method: config.method,
      headers: config.headers,
    }

    if (config.url) {
      const url = new URL(config.url, config.baseURL)
      errorData.request.url = url.toString()
    }
  }

  const error = new Error()
  error.name = `${data.status} ${data.code}`
  try {
    error.message = JSON.stringify(errorData, null, 2)
  } catch {
    error.message = data.message
  }
  throw error
}
