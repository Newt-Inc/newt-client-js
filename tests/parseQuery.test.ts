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

  test('should connect conditions including "or"', (): void => {
    const query: GetContentsQuery = {
      body: { fmt: 'text' },
      limit: 10,
      or: [
        { title: { match: 'update' } },
        { title: { match: encodeURIComponent('アップデート') } },
      ],
    };
    expect(parseQuery(query)).toBe(
      'body[fmt]=text&limit=10&[or]=(title[match]=update;title[match]=%E3%82%A2%E3%83%83%E3%83%97%E3%83%87%E3%83%BC%E3%83%88)'
    );
  });

  test('should connect nested "or"', (): void => {
    const query: GetContentsQuery = {
      body: { fmt: 'text' },
      limit: 10,
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
    };
    expect(parseQuery(query)).toBe(
      'body[fmt]=text&limit=10&[or]=(title[match]=update;_sys.createdAt[gt]=2021-11-01&_sys.updatedAt[gt]=2021-12-01;[or]=(title[match]=release;category=release);_sys.createdAt[gt]=2021-12-01&[or]=(title[match]=news;category=news))'
    );
  });

  test('should connect each elements in the and parameter', (): void => {
    const query: GetContentsQuery = {
      body: { fmt: 'text' },
      limit: 10,
      or: [
        { title: { match: 'update' } },
        {
          '_sys.createdAt': { gt: '2021-11-01' },
          or: [{ title: { match: 'news' } }, { category: 'news' }],
        },
        {
          '_sys.createdAt': { gt: '2021-12-01' },
          and: [
            { category: 'important' },
            { or: [{ title: { match: 'support' } }, { category: 'support' }] },
            { or: [{ title: { match: 'help' } }, { category: 'help' }] },
          ],
        },
      ],
      and: [
        { body: { exists: true } },
        {
          or: [{ body: { match: 'cool' } }, { body: { match: 'great' } }],
        },
        {
          or: [{ description: { exists: true } }, { detail: { exists: true } }],
        },
      ],
    };
    expect(parseQuery(query)).toBe(
      'body[fmt]=text&limit=10&[or]=(title[match]=update;_sys.createdAt[gt]=2021-11-01&[or]=(title[match]=news;category=news);_sys.createdAt[gt]=2021-12-01&category=important&[or]=(title[match]=support;category=support)&[or]=(title[match]=help;category=help))&body[exists]=true&[or]=(body[match]=cool;body[match]=great)&[or]=(description[exists]=true;detail[exists]=true)'
    );
  });
});
