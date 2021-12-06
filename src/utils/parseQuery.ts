import qs from 'qs';
import { OrQuery, Query } from '../types';

const parseOrQuery = (orQuery: OrQuery['or']) => {
  const orConditions: string[] = [];
  orQuery.forEach((query) => {
    if (query.or) {
      orConditions.push(parseOrQuery(query.or as OrQuery['or']));
    } else {
      orConditions.push(
        qs.stringify(query, { encode: false, arrayFormat: 'comma' })
      );
    }
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
