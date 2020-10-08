# crudl
Abstracts and handles common JSON RESTful APIs requests and responses

[![npm version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/crudl.svg
[npm-url]: https://npmjs.org/package/crudl

## What is it?

crudl's goal is to abstract the most common RESTful requests and basic data handling of every frontend developer's everyday coding.

It currently has adapters for [Vuex](https://github.com/vuejs/vuex) (@crudl/vuex-adapter) and [Redux](https://github.com/reduxjs/redux) (@crudl/redux-dapter) - more as a way of portraying its portability and provide sample code than "officially" supporting them, as crudl exposes its main getters for easily integrating with other JavaScript frameworks or vanillaing your way out of them.

## What does it do?

crudl provides an extendable and highly customizable set of operation handlers for `create`, `read`, `update`, `delete` and `list` requests.

It handles things like initial state schema, requests (actions in both Vuex and Redux), modifiers (mutations in Vuex, reducers in Redux), key pluralization and snake_casing on request responses, error normalization, among other useful things so you can have entire working RESTful modules with just a few lines of JavaScript:

```js
import CRUDL from 'crudl';
import adapter from '@crudl/vuex-adapter';
// import adapter from '@crudl/redux-adapter';

export default adapter(new CRUDL('blogPost'));
```

And that's it! You're good to go.

crudl is not only lightweight (`~3kb` core, `<1kb` adapters, gziped), but it also helps you save tons of lines of code in modules or slices.

## Installation

```bash
npm install crudl
npm install @crudl/vuex-adapter
# or npm install @crudl/redux-adapter
```

## Data handling

Data follows this format:

- `create`, `read`, `update` and `delete` all have the same format:

```js
{
  item: { id: 123, foo: 'x' },
  loading: false, // boolean
  failure: null, // HTTP client `Error` or request JSON response
  config: {} // crudl's internal request config
}
```

- `list`, on the other hand, has its exclusive format:

```js
{
  items: {
    123: { id: 123, foo: 'x' },
    456: { id: 456, foo: 'y' }
  },
  loading: false,
  failure: null,
  config: {}
}
```

Data (state) can be accessed using the crudl module's default key:

```
state
  -> module_key
    -> [create|read|update|delete|list]
      -> [item|items|loading|failure|config]
```

To illustrate that using frameworks methods:

- **Redux** -> store.getState().`blogPost`.`list`.`loading`
- **Vuex** -> store.state.`blogPost`.`list`.`loading`

It is important to note that crudl as it is does not store data at all, but only offers you a initial state and handling and processing of JSON responses, leaving the data storage and versioning to the frameworks working around it (like Vuex and Redux).

## Customization

By default, crudl expects target APIs to follow some RESTful patterns, like:

### For endpoints:

- **Create** -> *POST* -> `/blog_posts`
- **Read** -> *GET* -> `/blog_posts/:id`
- **Update** -> *PUT* -> `/blog_posts/:id`
- **Delete** -> *DELETE* -> `/blog_posts/:id`
- **List** -> *GET* -> `/blog_posts`

But custom ones can be provided:

```js
new CRUDL('blogPost', {
  methods: {
    delete: 'get',
    update: 'patch'
  },
  endpoints: {
    read: '/blogs/:category_id/posts/:id/reviewed'
  }
});
```

Responses are also expected to follow RESTful patterns:

- Single items: `{ blog_post: { id: 1, foo: 'x' } }`
- Multiple items: `{ blog_posts: [{ id: 1, foo: 'x' }, { id: 2, foo: 'y' }] }`

The snake_casing and pluralization on endpoints and JSON keys on responses are handled by crudl behind the scenes. No need to worry about that.

It can also be customized to handle responses like this one:

- Read: `{ custom_key: { id: 123, foo: 'bar' } }`
- Update: `{ id: 123, foo: 'bar' }` (keyless)

Simply by doing this:

```js
new CRUDL('blogPost', {
  keys: {
    read: 'custom_key',
    update: '' // keyless response
  }
});
```

You can find more custom settings on the "basic, advanced and expert customizations" ahead.

## HTTP client

crudl requires an HTTP client by default. [axios](https://github.com/axios/axios) was used for its development, so it is the one recomended. Any client should work, though, as long as it follows these two rules:

### 1. Fires requests using the following format:
```js
client('/url/here', {
  method: 'get, post, ...',
  data: {} // params: {} on GET requests
});
```

### 2. Responds using the following formats:
- `{ data: API_SUCCESS_JSON_OBJECT }` on **success**
- `Error { response: { data: API_ERROR_JSON_OBJECT } }` on **failure**

You can set the default HTTP client on a global basis:

```js
CRUDL.client = axiosClient;
```

Or by module:

```js
new CRUDL('blogPost', {
  client: axiosClient
});
```

## URL parsing (endpoints)
Request payload options

- **Redux** -> `dispatch(blogPost.actions.read(payload))`
- **Vuex** -> `dispatch('blogPost/read', payload)`

An endpoint like this `/blogs/:category_id/posts/:id/reviewed` requires that `category_id` and `id` are present on the payload. To illustrate that, a dispatch like this:

```js
dispatch('blogPost/read', {
  category_id: 1,
  id: 2
});
```

Would result in a request fired to `/blogs/1/posts/2/reviewed`.

Additional parameters are allowed, of course, and crudl takes case of excluding endpoint parameters from the final query (for GET requests) or request body, so you don't end up with repeating parameters like `/blogs/1/posts/2/reviewed?category_id=1&post=2`. To illustrate that, a dispatch like this:

```js
dispatch('blogPost/read', {
  category_id: 1,
  id: 2,
  read: false,
  reactions: true
});
```

Would result in a request fired to `/blogs/1/posts/2/reviewed?read=false&reactions=true`.

## Internal crudl request options
Request payload options

- **Redux** -> `dispatch(blogPost.actions.read(payload))`
- **Vuex** -> `dispatch('blogPost/read', payload)`

crudl has some internal payload configs that are ommited from the final requests but can act as request settings:

### preserve

It can be very useful for things like infinity scrolling.

To illustrate that:

```js
dispatch('user/list', { page: 1 });
// ...
dispatch('user/list', { page: 2 });
```

Would wipe page 1 of users from your data (state), but:

```js
dispatch('user/list', { page: 1 });
// ...
dispatch('user/list', { page: 2, crudl: { preserve: true } });
```

Would keep both pages on your data (state).

And could also be useful for things like refreshing the user profile without flashing an empty profile page during the request.

To illustrate that:

```js
dispatch('user/read', { id: 1 });
// loading...
// success!
// user.name -> 'John Doe'
dispatch('user/read', { id: 1 });
// loading...
// user.name -> undefined
// success!
// user.name -> 'Johnny Doe'
```

Would wipe user data (state) before start the new request, but:

```js
dispatch('user/read', { id: 1 });
// loading...
// success!
// user.name -> 'John Doe'
dispatch('user/read', { id: 1, crudl: { preserve: true } });
// loading...
// user.name -> 'John Doe'
// success!
// user.name -> 'Johnny Doe'
```

Would keep old user data (state) while fetching the updated one.

### populate
@TODO

### refresh
@TODO

## Reseting data (state)

Each operation has their own respective cleaners, which can be called using:

- **Redux** -> `dispatch(blogPost.actions['read/clean']())`
- **Vuex** -> `dispatch('blogPost/read/clean')`

## Basic customization

### key
Module name

**IMPORTANT**: Module name **should always be in the singular and in camelCase**, for simplification and performance (kb-weight-wise) purposes.

```js
new CRUDL('user');     // camelCased, singular
new CRUDL('blogPost'); // camelCased, singular
```

### identifier
Module's primary key

By default, `:id` (as in `blogPost.id`) will be used as unique item identifiers. You can change that behavior by providing the module's primary key to crudl:

```js
{
  identifier: 'uuid'
}
```

So `blogPost.uuid` will be used instead. Note that this will also affect routes, so `/blog_posts/:id` will become `/blog_posts/:uuid`, so remember to adapt the request payload accordingly.

### client
crudl's HTTP client ([axios](https://github.com/axios/axios) is highly recommended)

Setting a per-module HTTP client:

```js
{
  client: httpClient
}
```

You can also set a global client so you don't have to provide the client in each module initialiation:

```js
CRUDL.client = httpClient;
```

### include | exclude
Include or exclude module operations

```js
{
  include: ['create', 'unknown']
} // -> [create]
```

```js
{
  exclude: ['create', 'read']
} // -> [update, delete, list]
```

```js
{
  include: ['create', 'read'],
  exclude: ['create']
} // -> [create]
```

## Advanced customization

(All samples bellow will use `blogPost` as default module name for easier understanding). For RESTful APIs you should not need to touch these at all.

### endpoints
API endpoint (path) to which the request will be fired

```js
{
  endpoint: {
    create: '/blog_posts',
    read: '/blog_posts/:id',
    update: '/blog_posts/:id',
    delete: '/blog_posts/:id',
    list: '/blog_posts'
  }
}
```

### keys
Key in which the expected JSON responses should be wrapped

```js
{
  key: {
    create: 'blog_post',
    read: 'blog_post',
    update: 'blog_post',
    delete: 'blog_post',
    list: 'blog_posts'
  }
}
```

### methods
HTTP method (verb) for each crudl action

```js
{
  methods: {
    create: 'post',
    read: 'get',
    update: 'put',
    delete: 'delete',
    list: 'get'
  }
}
```

## Expert customization

### executors
Functions responsible for handing data (state) changes on request results

It is worth noting that for this configuration, specifically, you're required to provide all four executors (`clean`, `start`, `success` and `failure`) to crudl. You can learn more about crudl's executors by reading the default ones' source code on `./packages/core/src/executors`. A few helper functions are available to assist you achieve that goal.

```js
{
  executors: {
    clean: Function,
    start: Function,
    success: Function,
    failure: Function
  }
}
```

### spread
Update the original data (state) object or make and update a copy of the data

Controls if the original data object or a copy of it should be changed by the crudl executors. `true` means "do a copy of the data object, update and return it" and `false` means "update the original data object and return it".

```js
{
  spread: false
}
```

## Available getters:

All examples bellow are based on a `blogPost` module:

```js
const blogPost = new CRUDL('blogPost', {
  foo: 'bar'
});

// so...
// blogPost.key
// blogPost.config
// blogPost.constants
// ...etc
```

### key
Module key

```
blogPost
```

### config
Custom config provided by the user at the module initialization

```js
{ foo: 'bar' }
```

### constants
Used as `mutation types` on Vuex and `action types` on Redux

```js
{
  create: {
    clean: 'CRUDL/BLOG_POST/CREATE/CLEAN',
    failure: 'CRUDL/BLOG_POST/CREATE/FAILURE',
    start: 'CRUDL/BLOG_POST/CREATE/START',
    success: 'CRUDL/BLOG_POST/CREATE/SUCCESS'
  },
  read: {
    clean: 'CRUDL/BLOG_POST/READ/CLEAN',
    failure: 'CRUDL/BLOG_POST/READ/FAILURE',
    start: 'CRUDL/BLOG_POST/READ/START',
    success: 'CRUDL/BLOG_POST/READ/SUCCESS'
  },
  update: {
    clean: 'CRUDL/BLOG_POST/UPDATE/CLEAN',
    failure: 'CRUDL/BLOG_POST/UPDATE/FAILURE',
    start: 'CRUDL/BLOG_POST/UPDATE/START',
    success: 'CRUDL/BLOG_POST/UPDATE/SUCCESS'
  },
  delete: {
    clean: 'CRUDL/BLOG_POST/DELETE/CLEAN',
    failure: 'CRUDL/BLOG_POST/DELETE/FAILURE',
    start: 'CRUDL/BLOG_POST/DELETE/START',
    success: 'CRUDL/BLOG_POST/DELETE/SUCCESS'
  },
  list: {
    clean: 'CRUDL/BLOG_POST/LIST/CLEAN',
    failure: 'CRUDL/BLOG_POST/LIST/FAILURE',
    start: 'CRUDL/BLOG_POST/LIST/START',
    success: 'CRUDL/BLOG_POST/LIST/SUCCESS'
  }
}
```

### endpoints
Used internally to fire requests to the right paths and compile URL parameters

```js
{
  create: '/blog_posts',
  delete: '/blog_posts/:id',
  list: '/blog_posts',
  read: '/blog_posts/:id',
  update: '/blog_posts/:id'
}
```

### keys
Used internally to unwrap JSON responses

```js
{
  create: 'blogPost',
  read: 'blogPost',
  update: 'blogPost',
  delete: 'blogPost',
  list: 'blogPosts'
}
```

### methods
Used internally to fire requests using the right HTTP methods

```js
{
  create: 'post',
  delete: 'delete',
  list: 'get',
  read: 'get',
  update: 'put'
}
```

### modifiers
Used as `mutations` on Vuex and `reducers` on Redux

```js
{
  'CRUDL/BLOG_POST/CREATE/CLEAN': Function,
  'CRUDL/BLOG_POST/CREATE/FAILURE': Function,
  'CRUDL/BLOG_POST/CREATE/START': Function,
  'CRUDL/BLOG_POST/CREATE/SUCCESS': Function,
  'CRUDL/BLOG_POST/READ/CLEAN': Function,
  'CRUDL/BLOG_POST/READ/FAILURE': Function,
  'CRUDL/BLOG_POST/READ/START': Function,
  'CRUDL/BLOG_POST/READ/SUCCESS': Function,
  'CRUDL/BLOG_POST/UPDATE/CLEAN': Function,
  'CRUDL/BLOG_POST/UPDATE/FAILURE': Function,
  'CRUDL/BLOG_POST/UPDATE/START': Function,
  'CRUDL/BLOG_POST/UPDATE/SUCCESS': Function,
  'CRUDL/BLOG_POST/DELETE/CLEAN': Function,
  'CRUDL/BLOG_POST/DELETE/FAILURE': Function,
  'CRUDL/BLOG_POST/DELETE/START': Function,
  'CRUDL/BLOG_POST/DELETE/SUCCESS': Function,
  'CRUDL/BLOG_POST/LIST/CLEAN': Function,
  'CRUDL/BLOG_POST/LIST/FAILURE': Function,
  'CRUDL/BLOG_POST/LIST/START': Function,
  'CRUDL/BLOG_POST/LIST/SUCCESS': Function
}
```

### operations
Used internally to mount endpoints, handle JSON responses correctly, etc

```js
{
  create: {
    name: 'create',
    identified: false,
    multiple: false
  },
  read: {
    name: 'read',
    identified: true,
    multiple: false
  },
  update: {
    name: 'update',
    identified: true,
    multiple: false
  },
  delete: {
    name: 'delete',
    identified: true,
    multiple: false
  },
  list: {
    name: 'list',
    identified: false,
    multiple: true
  }
}
```

### requests
Used as `actions` on both Vuex and Redux

```js
{
  create: Function,
  read: Function,
  update: Function,
  delete: Function,
  list: Function,
}
```

### cleaners
Used as `actions` on both Vuex and Redux, but mapped to `${action}/clean`

```js
{
  create: Function,
  read: Function,
  update: Function,
  delete: Function,
  list: Function,
}
```

### schema
Used as `initialState` on both Vuex and Redux

```js
{
  create: {
    loading: false,
    failure: null,
    config: {},
    item: {}
  },
  read: {
    loading: false,
    failure: null,
    config: {},
    item: {}
  },
  update: {
    loading: false,
    failure: null,
    config: {},
    item: {}
  },
  delete: {
    loading: false,
    failure: null,
    config: {},
    item: {}
  },
  list: {
    loading: false,
    failure: null,
    config: {},
    items: {}
  },
}
```

## Adapters implementations examples
Snippets using real framework stores

### @crudl/vuex-adapter

```js
import CRUDL from 'crudl';
import adapter from '@crudl/vuex-adapter';

import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

CRUDL.client = axios.create({ baseURL: 'https://api.url' });

const store = new Vuex.Store({
  modules: {
    blogPost: adapter(new CRUDL('blogPost')),
    user: adapter(new CRUDL('user')),
  },
});

store.dispatch('blogPost/read', { id: 1 });
// store.state.blogPost.read.item
//   -> { id: 1, title: 'hello, world!' }

store.dispatch('user/create', { name: 'John Doe', age: 21 });
// store.state.user.create.item
//   -> { id: 1, name: 'John Doe', age: 21 }

store.dispatch('user/create', { name: 'Johnny Foo', age: 16 });
// store.state.user.create.failure
//   -> { age: 'you must be 18 years old' }
```

### @crudl/redux-adapter

```js
import CRUDL from 'crudl';
import adapter from '@crudl/redux-adapter';

import { createSlice, configureStore } from '@reduxjs/toolkit';

CRUDL.client = axios.create({ baseURL: 'https://api.url' });

const blogPost = adapter(new CRUDL('blogPost'));
const user = adapter(new CRUDL('user'));

const store = configureStore({
  reducer: {
    blogPost: createSlice(blogPost.slice).reducer,
    user: createSlice(user.slice).reducer,
  },
});

store.dispatch(blogPost.actions.read({ id: 1 }));
// store.getState().blogPost.read.item
//   -> { id: 1, title: 'hello, world!' }

store.dispatch(user.actions.create({ name: 'John Doe', age: 21 }));
// store.getState().user.create.item
//   -> { id: 1, name: 'John Doe', age: 21 }

store.dispatch(user.actions.create({ name: 'Johnny Foo', age: 16 }));
// store.getState().user.create.failure
//   -> { age: 'you must be 18 years old' }
```

## @TODO

### An option to update data between requests (actions)

To illustrate that:

Update the `read.item` data if it has the same primary key (by default, `:id`) than the newly fired `update.item` action. The same goes to updating data between `create` -> `list`, `create` -> `read`, `read` -> `list` etc.

That would probably be controlled by new options on the request payload:

```js
dispatch('user/update', {
  name: 'John Junior',
  age: 19,
  crudl: {
    // forces read.item to be update.item
    // forces list.items to append update.item
    populate: ['read', 'list'],

    // read.item becomes update.item if they have the same :id
    // list.items[item.id] gets updated if it already exists
    refresh: ['read', 'list'],
  }
});
```

## License

This project is licensed under the MIT License.
