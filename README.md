# JavaScript SDK for Newt's API

JavaScript client for Newt. Works in Node.js and modern browsers (older browsers needs a Promise polyfill).

## Getting Started

### Installation

Install the package with:

```sh
npm install newt-client-js

# or

yarn add newt-client-js
```

### Your first request

The following code snippet is the most basic one you can use to get some content from Newt with this library:

```js
const { createClient } = require('newt-client-js');
const client = createClient({
  projectUid: 'YOUR_PROJECT_UID',
  token: 'YOUR_CDN_API_TOKEN',
  apiType: 'cdn' // You can specify "cdn" or "api".
});

client
  .getContent({
    appUid: 'YOUR_APP_UID',
    modelUid: 'YOUR_MODEL_UID',
    contentId: 'YOUR_CONTENT_ID'
  })
  .then((content) => console.log(content))
  .catch((err) => console.log(err));
```

## Documentation & References

Please refer to the [REST API reference](https://developers.newt.so/) for the parameters and operators that can be used for query.

### Configuration

The `createClient` method supports several options you may set to achieve the expected behavior:

#### Options

| Name | Default | Description |
| :--- | :--- | :--- |
| `projectUid` | | **Required.** Your project uid. |
| `token` | | **Required.** Your Newt CDN API token or Newt API token. |
| `apiType` | `cdn` | You can specify "cdn" or "api". Please specify "cdn" to send a request to the Newt CDN API, or "api" to send a request to the Newt API. |

### Get contents

```js
client
  .getContents({
    appUid: 'YOUR_APP_UID',
    modelUid: 'YOUR_MODEL_UID',
    query: {
      '_sys.createdAt': { gt: '2021-09-01' },
      category: 'news'
    }
  })
  .then((contents) => console.log(contents))
  .catch((err) => console.log(err));

client
  .getContents({
    appUid: 'YOUR_APP_UID',
    modelUid: 'YOUR_MODEL_UID',
    query: {
      or: [
        { title: { match: 'update' } },
        { title: { match: encodeURIComponent('アップデート') } }
      ],
      body: { fmt: 'text' },
      limit: 10
    }
  })
  .then((contents) => console.log(contents))
  .catch((err) => console.log(err));
```

### Get a content

```js
client
  .getContent({
    appUid: 'YOUR_APP_UID',
    modelUid: 'YOUR_MODEL_UID',
    contentId: 'YOUR_CONTENT_ID'
  })
  .then((content) => console.log(content))
  .catch((err) => console.log(err));

client
  .getContent({
    appUid: 'YOUR_APP_UID',
    modelUid: 'YOUR_MODEL_UID',
    contentId: 'YOUR_CONTENT_ID',
    query: { select: ['title', 'body'] }
  })
  .then((content) => console.log(content))
  .catch((err) => console.log(err));
```

### Usage with TypeScript

#### Type definition

By using the type Content, you can easily define the type.

```ts
// Suppose you have defined a model named Post in the admin page.

// Type definition
/**
 * Content type
 *
 * {
 *   _id: string;
 *   _sys: {
 *     model: string;
 *     owner: string;
 *     createdAt: string;
 *     updatedAt: string;
 *     raw: {
 *       createdAt: string;
 *       updatedAt: string;
 *       firstPublishedAt: string;
 *       publishedAt: string;
 *     };
 *   };
 * }
 */
const { Content } = require('newt-client-js');
interface Post extends Content {
  title: string
  body: string
}
```

#### Request and Response

The type of the content you want to get can be passed as a parameter.

```ts
// Request
/**
 * getContents response type
 *
 * {
 *   skip: number;
 *   limit: number;
 *   total: number;
 *   items: Array<Post>; // an array of content defined by you
 * }
 */
client.getContents<Post>({
    appUid: 'YOUR_APP_UID',
    modelUid: 'YOUR_MODEL_UID',
  })
  .then((posts) => console.log(posts))
  .catch((err) => console.log(err));

/**
 * getContent response type
 *
 * {
 *   _id: string;
 *   _sys: {
 *     model: string;
 *     owner: string;
 *     createdAt: string;
 *     updatedAt: string;
 *     raw: {
 *       createdAt: string;
 *       updatedAt: string;
 *       firstPublishedAt: string;
 *       publishedAt: string;
 *     };
 *   };
 *   title: string; // field defined by you
 *   body: string; // field defined by you
 * }
 */
client
  .getContent<Post>({
    appUid: 'YOUR_APP_UID',
    modelUid: 'YOUR_MODEL_UID',
    contentId: 'YOUR_CONTENT_ID'
  })
  .then((post) => console.log(post))
  .catch((err) => console.log(err));
```

#### Query Fields

All fields are optional.

| operator | Type | Description |
| :--- | :--- | :--- |
| `YOUR_FIELD` | - | You can define a query for a field that you define |
| `select` | string[] | |
| `order` | string[] | |
| `limit` | number | |
| `skip` | number| |
| `depth` | number | |
| `or` | Array | Connects each element in the array as an "or" condition. |
| `and` | Array | Connects each element in the array as an "and" condition. |

#### Query Operators

| Field | Type |
| :--- | :--- |
| `ne` | string / number / boolean |
| `match` | string |
| `in` | string[] / number[] |
| `nin` | string[] / number[] |
| `all` | string[] / number[] |
| `exists` | boolean |
| `lt` | string / number |
| `lte` | string / number |
| `gt` | string / number |
| `gte` | string / number |
| `fmt` | 'text' |

## License

This repository is published under the [MIT License](https://github.com/Newt-Inc/newt-client-js/blob/main/LICENSE).
