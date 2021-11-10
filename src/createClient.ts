import axios from 'axios';
import qs from 'qs';
import {
  CreateClientParams,
  GetContentsParams,
  GetContentParams,
  Contents,
  OrQuery,
  Query,
} from './types';

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

const parseQuery = (query: Query) => {
  if (!query.or)
    return qs.stringify(query, { encode: false, arrayFormat: 'comma' });

  const orQuery = parseOrQuery(query.or);
  delete query.or;

  let q = qs.stringify(query, { encode: false, arrayFormat: 'comma' });
  q = q ? q + '&' + orQuery : orQuery;
  return q;
};

export const createClient = ({
  projectUid,
  token,
  apiType = 'cdn',
}: CreateClientParams) => {
  if (!projectUid) throw new Error('projectUid parameter is required.');
  if (!token) throw new Error('token parameter is required.');
  if (!['cdn', 'content'].includes(apiType))
    throw new Error(
      `apiType parameter should be set to "cdn" or "content". apiType: ${apiType}`
    );

  const axiosInstance = axios.create({
    baseURL: `https://${projectUid}.${apiType}.newt.so/v1`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const getContents = async <T>({
    appUid,
    modelUid,
    query,
  }: GetContentsParams): Promise<Contents<T>> => {
    if (!appUid) throw new Error('app parameter is required.');
    if (!modelUid) throw new Error('model parameter is required.');

    let url = `/${appUid}/${modelUid}`;
    if (query && Object.keys(query).length) {
      url = url + '?' + parseQuery(query);
    }
    const { data } = await axiosInstance.get(url);
    return data;
  };

  const getContent = async <T>({
    appUid,
    modelUid,
    contentId,
    query,
  }: GetContentParams): Promise<T> => {
    if (!appUid) throw new Error('appUid parameter is required.');
    if (!modelUid) throw new Error('modelUid parameter is required.');
    if (!contentId) throw new Error('contentId parameter is required.');

    let url = `/${appUid}/${modelUid}/${contentId}`;
    if (query && Object.keys(query).length) {
      url = url + '?' + parseQuery(query);
    }
    const { data } = await axiosInstance.get(url);
    return data;
  };

  return {
    getContents,
    getContent,
  };
};
