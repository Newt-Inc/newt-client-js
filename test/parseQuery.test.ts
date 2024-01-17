import { parseQuery } from '../src/utils/parseQuery';
import { GetContentsQuery } from '../src/types';
import { parse } from 'qs';

describe('parseQuery', (): void => {
  test('should connect multiple conditions', (): void => {
    const query: GetContentsQuery = {
      '_sys.createdAt': { gt: '2021-12-01' },
      category: 'news',
    };
    const { encoded } = parseQuery(query);

    const parsed = parse(encoded);
    expect(parsed['_sys.createdAt']).toEqual({ gt: '2021-12-01' });
    expect(parsed.category).toBe('news');
  });

  test('should connect multiple conditions for a single key', (): void => {
    const query: GetContentsQuery = {
      '_sys.createdAt': {
        gt: '2021-11-01',
        lt: '2021-12-01',
      },
    };
    const { encoded } = parseQuery(query);

    const parsed = parse(encoded);
    expect(parsed['_sys.createdAt']).toEqual({
      gt: '2021-11-01',
      lt: '2021-12-01',
    });
  });

  test('should connect conditions including "or"', (): void => {
    const query: GetContentsQuery = {
      body: { fmt: 'text' },
      limit: 10,
      or: [
        { title: { match: 'update' } },
        { title: { match: 'アップデート' } },
      ],
    };
    const { encoded } = parseQuery(query);
    const { body, limit, or } = parse(encoded);
    expect(body).toEqual({ fmt: 'text' });
    expect(limit).toBe('10');
    expect(or).toBe('(title[match]=update;title[match]=アップデート)');
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
    const { encoded } = parseQuery(query);

    const { body, limit, or } = parse(encoded);
    expect(body).toEqual({ fmt: 'text' });
    expect(limit).toBe('10');
    expect(or).toBe(
      '(title[match]=update;_sys.createdAt[gt]=2021-11-01&_sys.updatedAt[gt]=2021-12-01;[or]=(title[match]=release;category=release);_sys.createdAt[gt]=2021-12-01&[or]=(title[match]=news;category=news))'
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
    const { encoded } = parseQuery(query);
    const { body, limit, or } = parse(encoded);
    expect(body).toEqual({ fmt: 'text', exists: 'true' });
    expect(limit).toBe('10');
    expect(or).toEqual([
      '(title[match]=update;_sys.createdAt[gt]=2021-11-01&[or]=(title[match]=news;category=news);_sys.createdAt[gt]=2021-12-01&category=important&[or]=(title[match]=support;category=support)&[or]=(title[match]=help;category=help))',
      '(body[match]=cool;body[match]=great)',
      '(description[exists]=true;detail[exists]=true)',
    ]);
  });
});
