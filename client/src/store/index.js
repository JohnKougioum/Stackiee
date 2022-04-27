import { createStore } from "vuex";
import axios from "axios";
import search from "./modules/search";

export const store = createStore({
  state: {
    posts: [],
    // searchedPosts: [],
    nextPage: 1,
    // nextSearchPage: 1,
    moreData: true,
    // searchMoreData: true,
  },
  mutations: {
    SET_POSTS(state, posts) {
      posts.forEach((element) => {
        state.posts.push(element);
      });
    },
    SET_NEXT_PAGE(state, next) {
      state.nextPage = next;
    },
    SET_MORE_DATA(state, flag) {
      state.moreData = flag;
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
  },
  modules: {
    search,
  },
  getters: {
    getPosts: (state) => state.posts,
    // getSearchedPosts: (state) => state.searchedPosts,
  },
});
