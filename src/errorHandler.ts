import axios from 'axios'
import type { ErrorRequest, ErrorResponse, NewtError } from './types'

export const axiosErrorHandler = (errorResponse: unknown): never => {
  if (!axios.isAxiosError(errorResponse)) {
    throw errorResponse
  }

  const { config, response } = errorResponse
  if (!response?.data) {
    throw errorResponse
  }

  const { data } = response
  const errorData: ErrorResponse = {
    status: data.status,
    code: data.code,
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

const isNewtError = (value: unknown): value is NewtError => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const email = value as Record<keyof NewtError, unknown>
  if (typeof email.status !== 'number') {
    return false
  }
  if (typeof email.code !== 'string') {
    return false
  }
  if (typeof email.message !== 'string') {
    return false
  }
  return true
}

export const fetchErrorHandler = (
  errorResponse: unknown,
  errorRequest: ErrorRequest
): never => {
  if (!isNewtError(errorResponse)) {
    throw errorResponse
  }

  const { status, code, message } = errorResponse
  const errorData: ErrorResponse = {
    status,
    code,
    message,
    request: errorRequest,
  }

  const error = new Error()
  error.name = `${status} ${code}`
  try {
    error.message = JSON.stringify(errorData, null, 2)
  } catch {
    error.message = message
  }
  throw error
}
