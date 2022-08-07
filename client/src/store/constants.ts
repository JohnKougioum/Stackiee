export default {
  POSTS: {
    mutations: {
      SET_SEARCHED_POSTS: "SET_SEARCHED_POSTS",
      SET_NEXT_SEARCH_PAGE: "SET_NEXT_SEARCH_PAGE",
      SET_SEARCH_MORE_DATA: "SET_SEARCH_MORE_DATA",
      SET_MORE_SEARCHED_POSTS: "SET_MORE_SEARCHED_POSTS",
      SET_NOFOUND_ERROR: "SET_NOFOUND_ERROR",
    },
    actions: {
      FETCH_SEARCHED_POSTS: "FETCH_SEARCHED_POSTS",
      FETCH_MORE_SEARCHED_POSTS: "FETCH_MORE_SEARCHED_POSTS",
    },
    getters: {
      GET_SEARCHED_POSTS: "GET_SEARCHED_POSTS",
      GET_NOFOUND_ERROR: "GET_NOFOUND_ERROR",
    },
  },
};
