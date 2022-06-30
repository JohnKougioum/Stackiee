import {
  SET_SEARCHED_POSTS,
  GET_SEARCHED_POSTS,
  SET_SEARCH_MORE_DATA,
  SET_NEXT_SEARCH_PAGE,
  SET_MORE_SEARCHED_POSTS,
  SET_NOFOUND_ERROR,
  GET_NOFOUND_ERROR,
} from "../defaults-type";
import axios from "axios";

export default {
  state: {
    searchedPosts: [],
    nextSearchPage: 1,
    searchMoreData: true,
    noFoundError: "",
  },
  mutations: {
    [SET_SEARCHED_POSTS]: (state, posts) => (state.searchedPosts = posts),
    [SET_NEXT_SEARCH_PAGE]: (state, next) => (state.nextSearchPage = next),
    [SET_SEARCH_MORE_DATA]: (state, flag) => (state.searchMoreData = flag),
    [SET_MORE_SEARCHED_POSTS]: (state, posts) => {
      posts.forEach((element) => {
        state.searchedPosts.push(element);
      });
    },
    [SET_NOFOUND_ERROR]: (state, error) => (state.noFoundError = error),
  },
  actions: {
    [SET_SEARCHED_POSTS]: async ({ state, commit }, { query }) => {
      
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
      if (posts.data.posts == "") commit(SET_NOFOUND_ERROR, error);
      else {
        error = "";
        commit(SET_NOFOUND_ERROR, error);
      }

      if (posts.data.next) {
        let next = posts.data.next.page;
        commit(SET_NEXT_SEARCH_PAGE, next);
      } else {
        let flag = false;
        commit(SET_SEARCH_MORE_DATA, flag);
      }
      commit(SET_SEARCHED_POSTS, posts.data.posts);
    },
    [SET_MORE_SEARCHED_POSTS]: async ({ state, commit }, { query }) => {

      
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
        commit(SET_NEXT_SEARCH_PAGE, next);
      } else {
        let flag = false;
        commit(SET_SEARCH_MORE_DATA, flag);
      }
      commit(SET_MORE_SEARCHED_POSTS, posts.data.posts);
    },
  },
  getters: {
    [GET_SEARCHED_POSTS]: (state) => state.searchedPosts,
    [GET_NOFOUND_ERROR]: (state) => state.noFoundError,
  },
};
