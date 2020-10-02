import { createSlice, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import crudlReduxAdapter from '@/index';
import crudl from '@crudl/core';

describe('@crudl/vuex-adapter', () => {
  it('should map crudl -> vuex properties correctly', () => {
    const crudlPost = crudl('post');
    const post = crudlReduxAdapter(crudlPost);

    expect(post).toEqual({
      slice: {
        name: 'post',
        initialState: crudlPost.data,
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
        delete: expect.any(Function),
        list: expect.any(Function),
        read: expect.any(Function),
        update: expect.any(Function),
      },
    });
  });

  it('should map crudl requests and modifiers callbacks to redux actions and reducers correctly', async () => {
    const crudlPost = crudl('post', {
      client: () => Promise.resolve({ data: { posts: [{ id: 1 }, { id: 123 }] } }),
    });

    const post = crudlReduxAdapter(crudlPost);

    const postAction = jest.spyOn(post.actions, 'list');

    // const postStart = jest.spyOn(post.slice.reducers, crudlPost.constants.list.start);
    // const postSuccess = jest.spyOn(post.slice.reducers, crudlPost.constants.list.success);
    // const postError = jest.spyOn(post.slice.reducers, crudlPost.constants.list.failure);

    const postSlice = createSlice(post.slice);

    const store = configureStore({
      reducer: {
        post: postSlice.reducer,
      },
      middleware: [thunk],
    });

    await store.dispatch(post.actions.list({ page: 10 }));

    expect(postAction).toHaveBeenCalledTimes(1);
    expect(postAction).toHaveBeenCalledWith({ page: 10 });

    // expect(postStart).toHaveBeenCalledTimes(1);
    // expect(postStart).toHaveBeenCalledWith({ page: 10 });

    // expect(postSuccess).toHaveBeenCalledTimes(1);
    // expect(postSuccess).toHaveBeenCalledWith({ data: { posts: [{ id: 1 }, { id: 123 }] } });

    // expect(postError).toHaveBeenCalledTimes(0);

    expect(store.getState().post.list.items).toEqual({
      1: { id: 1 },
      123: { id: 123 },
    });
  });
});
