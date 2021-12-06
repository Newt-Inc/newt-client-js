import qs from 'qs';
import { OrQuery, Query } from '../types';

const parseOrQuery = (orQuery: Query['or']) => {
  if (!orQuery) throw new Error('invalid query');
  const orConditions: string[] = [];

  orQuery.forEach((query: OrQuery) => {
    if (!query.or) {
      orConditions.push(
        qs.stringify(query, { encode: false, arrayFormat: 'comma' })
      );
      return;
    }

    let queryString = parseOrQuery(query.or as Query['or']);
    delete query.or;

    if (Object.keys(query).length > 0) {
      queryString =
        qs.stringify(query, { encode: false, arrayFormat: 'comma' }) +
        '&' +
        queryString;
    }
    orConditions.push(queryString);
  });
  const q = '[or]=(' + orConditions.join(';') + ')';
  return q;
};

export const parseQuery = (query: Query) => {
  if (!query.or)
    return qs.stringify(query, { encode: false, arrayFormat: 'comma' });

  const orQuery = parseOrQuery(query.or);
  delete query.or;

  let q = qs.stringify(query, { encode: false, arrayFormat: 'comma' });
  q = q ? q + '&' + orQuery : orQuery;
  return q;
};
