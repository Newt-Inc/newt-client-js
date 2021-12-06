import { parseQuery } from '../src/utils/parseQuery';
import { GetContentsQuery } from '../src/types';

describe('parseQuery', (): void => {
  test('should connect multiple conditions', (): void => {
    const query: GetContentsQuery = {
      '_sys.createdAt': { gt: '2021-12-01' },
      category: 'news',
    };
    expect(parseQuery(query)).toBe(
      '_sys.createdAt[gt]=2021-12-01&category=news'
    );
  });

  test('should connect multiple conditions for a single key', (): void => {
    const query: GetContentsQuery = {
      '_sys.createdAt': {
        gt: '2021-11-01',
        lt: '2021-12-01',
      },
    };
    expect(parseQuery(query)).toBe(
      '_sys.createdAt[gt]=2021-11-01&_sys.createdAt[lt]=2021-12-01'
    );
  });

  test('should connect Or conditions and And conditions', (): void => {
    const query: GetContentsQuery = {
      or: [
        { title: { match: 'update' } },
        { title: { match: encodeURIComponent('アップデート') } },
      ],
      body: { fmt: 'text' },
      limit: 10,
    };
    expect(parseQuery(query)).toBe(
      'body[fmt]=text&limit=10&[or]=(title[match]=update;title[match]=%E3%82%A2%E3%83%83%E3%83%97%E3%83%87%E3%83%BC%E3%83%88)'
    );
  });

  test('should connect nested Or conditions', (): void => {
    const query: GetContentsQuery = {
      or: [
        { title: { match: 'update' } },
        {
          '_sys.createdAt': { gt: '2021-11-01' },
          '_sys.updatedAt': { gt: '2021-12-01' },
        },
        {
          or: [{ title: { match: 'release' } }, { category: 'release' }],
        },
        {
          '_sys.createdAt': { gt: '2021-12-01' },
          or: [{ title: { match: 'news' } }, { category: 'news' }],
        },
      ],
      body: { fmt: 'text' },
      limit: 10,
    };
    expect(parseQuery(query)).toBe(
      'body[fmt]=text&limit=10&[or]=(title[match]=update;_sys.createdAt[gt]=2021-11-01&_sys.updatedAt[gt]=2021-12-01;[or]=(title[match]=release;category=release);_sys.createdAt[gt]=2021-12-01&[or]=(title[match]=news;category=news))'
    );
  });
});
