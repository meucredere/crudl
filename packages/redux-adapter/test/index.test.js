import { createSlice, configureStore } from '@reduxjs/toolkit';

import CRUDL from '@crudl/core';
import CRUDLReduxAdapter from '@/index';

describe('@crudl/redux-adapter', () => {
  it('should map crudl -> redux properties correctly', () => {
    const crudlPost = new CRUDL('post');
    const post = CRUDLReduxAdapter(crudlPost);

    expect(post).toEqual({
      slice: {
        name: 'post',
        initialState: crudlPost.schema,
        reducers: {
          [crudlPost.constants.create.clean]: expect.any(Function),
          [crudlPost.constants.create.failure]: expect.any(Function),
          [crudlPost.constants.create.start]: expect.any(Function),
          [crudlPost.constants.create.success]: expect.any(Function),
          [crudlPost.constants.read.clean]: expect.any(Function),
          [crudlPost.constants.read.failure]: expect.any(Function),
          [crudlPost.constants.read.start]: expect.any(Function),
          [crudlPost.constants.read.success]: expect.any(Function),
          [crudlPost.constants.update.clean]: expect.any(Function),
          [crudlPost.constants.update.failure]: expect.any(Function),
          [crudlPost.constants.update.start]: expect.any(Function),
          [crudlPost.constants.update.success]: expect.any(Function),
          [crudlPost.constants.delete.clean]: expect.any(Function),
          [crudlPost.constants.delete.failure]: expect.any(Function),
          [crudlPost.constants.delete.start]: expect.any(Function),
          [crudlPost.constants.delete.success]: expect.any(Function),
          [crudlPost.constants.list.clean]: expect.any(Function),
          [crudlPost.constants.list.failure]: expect.any(Function),
          [crudlPost.constants.list.start]: expect.any(Function),
          [crudlPost.constants.list.success]: expect.any(Function),
        },
      },
      actions: {
        create: expect.any(Function),
        'create/clean': expect.any(Function),
        delete: expect.any(Function),
        'delete/clean': expect.any(Function),
        list: expect.any(Function),
        'list/clean': expect.any(Function),
        read: expect.any(Function),
        'read/clean': expect.any(Function),
        update: expect.any(Function),
        'update/clean': expect.any(Function),
      },
    });
  });

  it('should map crudl requests and modifiers callbacks to redux actions and reducers correctly', async () => {
    const crudlPost = new CRUDL('post', {
      client: () => Promise.resolve({ data: { posts: [{ id: 1 }, { id: 123 }] } }),
    });

    const post = CRUDLReduxAdapter(crudlPost);

    const postAction = jest.spyOn(post.actions, 'list');

    const postSlice = createSlice(post.slice);

    const postStore = configureStore({
      reducer: {
        post: postSlice.reducer,
      },
    });

    await postStore.dispatch(post.actions.list({ page: 10 }));

    expect(postAction).toHaveBeenCalledTimes(1);
    expect(postAction).toHaveBeenCalledWith({ page: 10 });

    expect(postStore.getState().post.list.items).toEqual({
      1: { id: 1 },
      123: { id: 123 },
    });

    await postStore.dispatch(post.actions['list/clean']());

    expect(postStore.getState().post.list.items).toEqual({});

    //

    const crudlBook = new CRUDL('book', {
      client: () => Promise.reject('foo, bar!'),
    });

    const book = CRUDLReduxAdapter(crudlBook);

    const bookAction = jest.spyOn(book.actions, 'list');

    const bookSlice = createSlice(book.slice);

    const bookStore = configureStore({
      reducer: {
        book: bookSlice.reducer,
      },
    });

    await bookStore.dispatch(book.actions.list({ page: 10 }));

    expect(bookAction).toHaveBeenCalledTimes(1);
    expect(bookAction).toHaveBeenCalledWith({ page: 10 });

    expect(bookStore.getState().book.list.failure).toEqual('foo, bar!');
    expect(bookStore.getState().book.list.items).toEqual({});

    await bookStore.dispatch(book.actions['list/clean']());

    expect(bookStore.getState().book.list.failure).toEqual(null);
    expect(bookStore.getState().book.list.items).toEqual({});
  });
});
