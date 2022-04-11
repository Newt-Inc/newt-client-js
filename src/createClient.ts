import axios from 'axios'
import axiosRetry from 'axios-retry'
import { parseQuery } from './utils/parseQuery'
import {
  CreateClientParams,
  GetContentsParams,
  GetContentParams,
  Contents,
  GetAppParams,
  AppMeta,
} from './types'
import { errorHandler } from './errorHandler'

export const createClient = ({
  spaceUid,
  token,
  apiType = 'cdn',
  retryOnError = true,
  retryLimit = 3,
}: CreateClientParams) => {
  if (!spaceUid) throw new Error('spaceUid parameter is required.')
  if (!token) throw new Error('token parameter is required.')
  if (!['cdn', 'api'].includes(apiType))
    throw new Error(
      `apiType parameter should be set to "cdn" or "api". apiType: ${apiType}`
    )
  if (retryLimit > 10)
    throw new Error('retryLimit should be a value less than or equal to 10.')

  const baseUrl = new URL(`https://${spaceUid}.${apiType}.newt.so`)

  const axiosInstance = axios.create({
    baseURL: baseUrl.toString(),
    headers: { Authorization: `Bearer ${token}` },
  })
  if (retryOnError) {
    axiosRetry(axiosInstance, {
      retries: retryLimit,
      retryCondition: (error) => {
        return error.response?.status === 429 || error.response?.status === 500
      },
      retryDelay: (retryCount) => {
        return retryCount * 1000
      },
    })
  }

  const getContents = async <T>({
    appUid,
    modelUid,
    query,
  }: GetContentsParams): Promise<Contents<T>> => {
    if (!appUid) throw new Error('app parameter is required.')
    if (!modelUid) throw new Error('model parameter is required.')

    const url = new URL(`/v1/${appUid}/${modelUid}`, baseUrl.toString())
    if (query && Object.keys(query).length) {
      const { encoded } = parseQuery(query)
      url.search = encoded
    }

    try {
      const { data } = await axiosInstance.get(url.pathname + url.search)
      return data
    } catch (err) {
      return errorHandler(err)
    }
  }

  const getContent = async <T>({
    appUid,
    modelUid,
    contentId,
    query,
  }: GetContentParams): Promise<T> => {
    if (!appUid) throw new Error('appUid parameter is required.')
    if (!modelUid) throw new Error('modelUid parameter is required.')
    if (!contentId) throw new Error('contentId parameter is required.')

    const url = new URL(
      `/v1/${appUid}/${modelUid}/${contentId}`,
      baseUrl.toString()
    )
    if (query && Object.keys(query).length) {
      const { encoded } = parseQuery(query)
      url.search = encoded
    }

    try {
      const { data } = await axiosInstance.get(url.pathname + url.search)
      return data
    } catch (err) {
      return errorHandler(err)
    }
  }

  const getApp = async ({
    appUid,
  }: GetAppParams): Promise<AppMeta | null | undefined> => {
    if (!appUid) throw new Error('appUid parameter is required.')
    const url = new URL(`/v1/space/apps/${appUid}`, baseUrl.toString())
    try {
      const { data } = await axiosInstance.get<AppMeta>(url.pathname)
      return data
    } catch (err) {
      return errorHandler(err)
    }
  }

  return {
    getContents,
    getContent,
    getApp,
  }
}
