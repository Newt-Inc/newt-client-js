import qs from 'qs';
import { FilterQuery, Query } from '../types';

const parseAndQuery = (andQuery: FilterQuery[]) => {
  if (!andQuery) throw new Error('invalid query');
  const andConditions: string[] = [];

  andQuery.forEach((query: FilterQuery) => {
    andConditions.push(parseQuery(query));
  });
  const q = andConditions.join('&');
  return q;
};

const parseOrQuery = (orQuery: FilterQuery[]) => {
  if (!orQuery) throw new Error('invalid query');
  const orConditions: string[] = [];

  orQuery.forEach((query: FilterQuery) => {
    orConditions.push(parseQuery(query));
  });
  const q = '[or]=(' + orConditions.join(';') + ')';
  return q;
};

export const parseQuery = (query: Query) => {
  let andQuery = '';
  if (query.and) {
    andQuery = parseAndQuery(query.and);
    delete query.and;
  }

  let orQuery = '';
  if (query.or) {
    orQuery = parseOrQuery(query.or);
    delete query.or;
  }

  let q = qs.stringify(query, { encode: false, arrayFormat: 'comma' });
  q = [q, orQuery, andQuery].filter((queryString) => queryString).join('&');
  return q;
};
