import { createStore } from "vuex";
import axios from "axios";
import { createObjectExpression } from "vue/node_modules/@vue/compiler-dom";

export const store = createStore({
  state: {
    posts: [],
    searchedPosts: [],
    nextPage: 1,
    nextSearchPage: 1,
    moreData: true,
    searchMoreData: true,
  },
  mutations: {
    SET_POSTS(state, posts) {
      posts.forEach((element) => {
        state.posts.push(element);
      });
    },
    SET_SEARCHED_POSTS(state, posts) {
      state.searchedPosts = posts;
    },
    SET_MORE_SEARCHED_POSTS(state, posts) {
      posts.forEach((element) => {
        state.searchedPosts.push(element);
      });
    },
    SET_NEXT_PAGE(state, next) {
      state.nextPage = next;
    },
    SET_NEXT_SEARCH_PAGE(state, next) {
      state.nextSearchPage = next;
    },
    SET_MORE_DATA(state, flag) {
      state.moreData = flag;
    },
    SET_SEARCH_MORE_DATA(state, flag) {
      state.searchMoreDataData = flag;
    },
  },
  actions: {
    async FETCH_POSTS({ state, commit }) {
      if (state.moreData == false) return;

      const posts = await axios.get(
        "http://localhost:5000/api/posts?page=" + state.nextPage
      );

      if (posts.data.next) {
        let next = posts.data.next.page;
        commit("SET_NEXT_PAGE", next);
      } else {
        let flag = false;
        commit("SET_MORE_DATA", flag);
      }
      commit("SET_POSTS", posts.data.posts);
    },
    async FETCH_SEARCHED_POSTS({ state, commit }, { query }) {
      // if (state.searchMoreDataData == false) return;

      let params = new URLSearchParams();
      params.append("search", query);
      params.append("page", state.nextSearchPage);
      let request = {
        params: params,
      };

      const posts = await axios.get(
        "http://localhost:5000/api/posts/search/results/",
        request
      );
      if (posts.data.next) {
        let next = posts.data.next.page;
        commit("SET_NEXT_SEARCH_PAGE", next);
      } else {
        let flag = false;
        commit("SET_SEARCH_MORE_DATA", flag);
      }
      commit("SET_SEARCHED_POSTS", posts.data.posts);
    },
    async FETCH_MORE_SEARCHED_POSTS({ state, commit }, { query }) {
      if (state.searchMoreDataData == false) return;

      let params = new URLSearchParams();
      params.append("search", query);
      params.append("page", state.nextSearchPage);
      let request = {
        params: params,
      };

      const posts = await axios.get(
        "http://localhost:5000/api/posts/search/results/",
        request
      );
      if (posts.data.next) {
        let next = posts.data.next.page;
        commit("SET_NEXT_SEARCH_PAGE", next);
      } else {
        let flag = false;
        commit("SET_SEARCH_MORE_DATA", flag);
      }
      commit("SET_MORE_SEARCHED_POSTS", posts.data.posts);
    },
  },
  modules: {},
  getters: {
    getPosts: (state) => state.posts,
    getSearchedPosts: (state) => state.searchedPosts,
  },
});
