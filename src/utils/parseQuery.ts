import { stringify } from 'qs'
import { FilterQuery, Query } from '../types'

const parseAndQuery = (andQuery: FilterQuery[]) => {
  if (!andQuery) throw new Error('invalid query')
  const rawAndConditions: string[] = []
  const encodedAndConditions: string[] = []

  andQuery.forEach((query: FilterQuery) => {
    const { raw, encoded } = parseQuery(query)
    rawAndConditions.push(raw)
    encodedAndConditions.push(encoded)
  })
  const rawQ = rawAndConditions.join('&')
  const encodedQ = encodedAndConditions.join('&')
  return { raw: rawQ, encoded: encodedQ }
}

const parseOrQuery = (orQuery: FilterQuery[]) => {
  if (!orQuery) throw new Error('invalid query')
  const rawOrConditions: string[] = []

  orQuery.forEach((query: FilterQuery) => {
    const { raw } = parseQuery(query)
    rawOrConditions.push(raw)
  })
  const params = new URLSearchParams()
  params.set('[or]', `(${rawOrConditions.join(';')})`)
  const rawQ = `[or]=(${rawOrConditions.join(';')})`
  return { raw: rawQ, encoded: params.toString() }
}

export const parseQuery = (query: Query) => {
  let andQuery = { raw: '', encoded: '' }
  if (query.and) {
    andQuery = parseAndQuery(query.and)
    delete query.and
  }

  let orQuery = { raw: '', encoded: '' }
  if (query.or) {
    orQuery = parseOrQuery(query.or)
    delete query.or
  }

  const rawQuery = stringify(query, { encode: false, arrayFormat: 'comma' })
  const encodedQuery = stringify(query, { arrayFormat: 'comma' })
  const raw = [rawQuery, orQuery.raw, andQuery.raw]
    .filter((queryString) => queryString)
    .join('&')
  const encoded = [encodedQuery, orQuery.encoded, andQuery.encoded]
    .filter((queryString) => queryString)
    .join('&')
  return { raw, encoded }
}
