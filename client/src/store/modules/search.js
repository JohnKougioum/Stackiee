import types from '../constants'
import axios from "axios";

export default {
  state: {
    searchedPosts: [],
    nextSearchPage: 1,
    searchMoreData: true,
    noFoundError: "",
  },
  mutations: {
    [types.POSTS.mutations.SET_SEARCHED_POSTS]: (state, posts) => (state.searchedPosts = posts),
    [types.POSTS.mutations.SET_NEXT_SEARCH_PAGE]: (state, next) => (state.nextSearchPage = next),
    [types.POSTS.mutations.SET_SEARCH_MORE_DATA]: (state, flag) => (state.searchMoreData = flag),
    [types.POSTS.mutations.SET_MORE_SEARCHED_POSTS]: (state, posts) => {
      posts.forEach((element) => {
        state.searchedPosts.push(element);
      });
    },
    [types.POSTS.mutations.SET_NOFOUND_ERROR]: (state, error) => (state.noFoundError = error),
  },
  actions: {
    [types.POSTS.actions.FETCH_SEARCHED_POSTS]: async ({ state, commit }, { query="" }) => {
      
      // TO_THINK => merge fetch functions, merge search fetch function with fetch all posts(query default type etc....)
      
      
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

      let error = "No posts found for";
      if (posts.data.posts == "") commit(types.POSTS.mutations.SET_NOFOUND_ERROR, error);
      else {
        error = "";
        commit(types.POSTS.mutations.SET_NOFOUND_ERROR, error);
      }

      if (posts.data.next) {
        let next = posts.data.next.page;
        commit(types.POSTS.mutations.SET_NEXT_SEARCH_PAGE, next);
      } else {
        let flag = false;
        commit(types.POSTS.mutations.SET_SEARCH_MORE_DATA, flag);
      }
      commit(types.POSTS.mutations.SET_SEARCHED_POSTS, posts.data.posts);
    },
    [types.POSTS.actions.FETCH_MORE_SEARCHED_POSTS]: async ({ state, commit }, { query="" }) => {
      
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
        commit(types.POSTS.mutations.SET_NEXT_SEARCH_PAGE, next);
      } else {
        let flag = false;
        commit(types.POSTS.mutations.SET_SEARCH_MORE_DATA, flag);
      }
      commit(types.POSTS.mutations.SET_MORE_SEARCHED_POSTS, posts.data.posts);
    },
  },
  getters: {
    [types.POSTS.getters.GET_SEARCHED_POSTS]: (state) => state.searchedPosts,
    [types.POSTS.getters.GET_NOFOUND_ERROR]: (state) => state.noFoundError,
  },
};
