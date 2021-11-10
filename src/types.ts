export interface CreateClientParams {
  projectUid: string;
  token: string;
  apiType?: 'cdn' | 'content';
}

export interface GetContentsParams {
  appUid: string;
  modelUid: string;
  query?: GetContentsQuery;
}

export interface GetContentParams {
  appUid: string;
  modelUid: string;
  contentId: string;
  query?: GetContentQuery;
}

type OperatorValue = {
  ne?: string | number | boolean;
  match?: string;
  in?: string[] | number[];
  nin?: string[] | number[];
  all?: string[] | number[];
  exists?: boolean;
  lt?: string | number;
  lte?: string | number;
  gt?: string | number;
  gte?: string | number;
  fmt?: 'plain';
};

type QueryValue = string | number | boolean | OperatorValue;

type AtomicQuery = {
  [key: string]: QueryValue;
};

export type OrQuery = {
  or: Array<AtomicQuery | OrQuery>;
};

export type Query = {
  select?: string[];
  order?: string[];
  limit?: number;
  skip?: number;
  depth?: number;
  or?: Array<AtomicQuery | OrQuery>;
  [key: string]:
    | QueryValue
    | string[]
    | Array<AtomicQuery | OrQuery>
    | undefined;
};

export type GetContentsQuery = Query;

type ExceptFormat = {
  select?: string[];
  depth?: number;
};

type Format = {
  [key: string]: {
    fmt: 'plain';
  };
};

export type GetContentQuery = ExceptFormat | Format;

export interface Contents<T> {
  skip: number;
  limit: number;
  total: number;
  items: Array<T>;
}

export interface Content {
  _id: string;
  _sys: {
    model: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
    raw: {
      createdAt: string;
      updatedAt: string;
      firstPublishedAt: string;
      publishedAt: string;
    };
  };
}
