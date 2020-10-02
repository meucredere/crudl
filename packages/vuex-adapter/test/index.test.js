import Vue from 'vue';
import Vuex from 'vuex';

import crudlVuexAdapter from '@/index';
import crudl from '@crudl/core';

Vue.use(Vuex);

describe('@crudl/vuex-adapter', () => {
  it('should map crudl -> vuex properties correctly', () => {
    const crudlPost = crudl('post');
    const post = crudlVuexAdapter(crudlPost);

    expect(post).toEqual({
      namespaced: true,
      state: expect.any(Function),
      mutations: {
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
      actions: {
        create: expect.any(Function),
        delete: expect.any(Function),
        list: expect.any(Function),
        read: expect.any(Function),
        update: expect.any(Function),
      },
    });

    expect(post.state()).toEqual({
      create: {
        loading: false,
        failure: null,
        config: {},
        item: {},
      },
      read: {
        loading: false,
        failure: null,
        config: {},
        item: {},
      },
      update: {
        loading: false,
        failure: null,
        config: {},
        item: {},
      },
      delete: {
        loading: false,
        failure: null,
        config: {},
        item: {},
      },
      list: {
        loading: false,
        failure: null,
        config: {},
        items: {},
      },
    });
  });

  it('should map crudl requests and modifiers callbacks to vuex actions and commits correctly', async () => {
    const crudlPost = crudl('post', {
      client: () => Promise.resolve({ data: { posts: [{ id: 1 }, { id: 123 }] } }),
    });

    const post = crudlVuexAdapter(crudlPost);

    const postAction = jest.spyOn(post.actions, 'list');

    const postStart = jest.spyOn(post.mutations, crudlPost.constants.list.start);
    const postSuccess = jest.spyOn(post.mutations, crudlPost.constants.list.success);
    const postError = jest.spyOn(post.mutations, crudlPost.constants.list.failure);

    const store = new Vuex.Store({
      modules: {
        post,
      },
    });

    await store.dispatch('post/list', { page: 1 });

    expect(postAction).toHaveBeenCalledTimes(1);
    expect(postAction).toHaveBeenCalledWith(expect.any(Object), { page: 1 });

    expect(postStart).toHaveBeenCalledTimes(1);
    expect(postStart).toHaveBeenCalledWith(expect.any(Object), { page: 1 });

    expect(postSuccess).toHaveBeenCalledTimes(1);
    expect(postSuccess).toHaveBeenCalledWith(expect.any(Object), { data: { posts: [{ id: 1 }, { id: 123 }] } });

    expect(postError).toHaveBeenCalledTimes(0);

    expect(store.state.post.list.items).toEqual({
      1: { id: 1 },
      123: { id: 123 },
    });

    const crudlBook = crudl('book', {
      client: () => Promise.reject(new Error('foo, bar!')),
    });

    const book = crudlVuexAdapter(crudlBook);

    const bookAction = jest.spyOn(book.actions, 'list');

    const bookStart = jest.spyOn(book.mutations, crudlBook.constants.list.start);
    const bookSuccess = jest.spyOn(book.mutations, crudlBook.constants.list.success);
    const bookError = jest.spyOn(book.mutations, crudlBook.constants.list.failure);

    const storeB = new Vuex.Store({
      modules: {
        book,
      },
    });

    await storeB.dispatch('book/list', { page: 1 });

    expect(bookAction).toHaveBeenCalledTimes(1);
    expect(bookAction).toHaveBeenCalledWith(expect.any(Object), { page: 1 });

    expect(bookStart).toHaveBeenCalledTimes(1);
    expect(bookStart).toHaveBeenCalledWith(expect.any(Object), { page: 1 });

    expect(bookSuccess).toHaveBeenCalledTimes(0);

    expect(bookError).toHaveBeenCalledTimes(1);
    expect(bookError).toHaveBeenCalledWith(expect.any(Object), new Error('foo, bar!'));

    expect(storeB.state.book.list.items).toEqual({});
  });
});
