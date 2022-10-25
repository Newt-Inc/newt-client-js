import { AxiosAdapter } from 'axios'

export interface CreateClientParams {
  spaceUid: string
  token: string
  apiType?: 'cdn' | 'api'
  adapter?: AxiosAdapter
  retryOnError?: boolean
  retryLimit?: number
}

export interface Client {
  getContents: <T>(params: GetContentsParams) => Promise<Contents<T>>
  getContent: <T>(params: GetContentParams) => Promise<T>
  getFirstContent: <T>(params: GetFirstContentParams) => Promise<T>
  getApp: (params: GetAppParams) => Promise<AppMeta>
}

export interface GetContentsParams {
  appUid: string
  modelUid: string
  query?: GetContentsQuery
}

export interface GetContentParams {
  appUid: string
  modelUid: string
  contentId: string
  query?: GetContentQuery
}

export interface GetFirstContentParams {
  appUid: string
  modelUid: string
  query?: GetFirstContentQuery
}

type OperatorValue = {
  ne?: string | number | boolean
  match?: string
  in?: string[] | number[]
  nin?: string[] | number[]
  all?: string[] | number[]
  exists?: boolean
  lt?: string | number
  lte?: string | number
  gt?: string | number
  gte?: string | number
  fmt?: 'text'
}

type QueryValue = string | number | boolean | OperatorValue

export type FilterQuery = {
  or?: Array<FilterQuery>
  and?: Array<FilterQuery>
  [key: string]: QueryValue | Array<FilterQuery> | undefined
}

export type Query = {
  select?: string[]
  order?: string[]
  limit?: number
  skip?: number
  depth?: number
  or?: Array<FilterQuery>
  and?: Array<FilterQuery>
  [key: string]: QueryValue | string[] | Array<FilterQuery> | undefined
}

export type GetContentsQuery = Query

type ExceptFormat = {
  select?: string[]
  depth?: number
}

type Format = {
  [key: string]: {
    fmt: 'text'
  }
}

export type GetContentQuery = ExceptFormat | Format

export type GetFirstContentQuery = Omit<Query, 'limit'>

export interface Contents<T> {
  skip: number
  limit: number
  total: number
  items: Array<T>
}

export interface Content {
  _id: string
  _sys: {
    createdAt: string
    updatedAt: string
    raw: {
      createdAt: string
      updatedAt: string
      firstPublishedAt: string
      publishedAt: string
    }
  }
}

export type AppIcon = {
  type: string
  value: string
}

export type AppCover = {
  type: string
  value: string
}

export interface AppMeta {
  name: string
  uid: string
  icon?: AppIcon
  cover?: AppCover
}

export interface GetAppParams {
  appUid: string
}
