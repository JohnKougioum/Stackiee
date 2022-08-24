import { createStore } from "vuex";
import axios from "axios";
import search from "./modules/search";

export const store = createStore({
  state: {
    posts: [],
    // searchedPosts: [],
    profilePosts: [],
    nextPage: 1,
    // nextSearchPage: 1,
    moreData: true,
    // searchMoreData: true,
    profile: null
  },
  mutations: {
    SET_POSTS(state, posts) {
      posts.forEach((element) => {
        state.posts.push(element);
      });
    },
    SET_PROFILE_POSTS(state, posts) {
      posts.forEach((element) => {
        state.profilePosts.push(element);
      });
    },
    SET_NEXT_PAGE(state, next) {
      state.nextPage = next;
    },
    SET_MORE_DATA(state, flag) {
      state.moreData = flag;
    },
    CLEAR_POSTS(state){
      state.posts = [];
    },
    CLEAR_PROFILE_POSTS(state){
      state.profilePosts = [];
    },
    SET_PROFILE(state, profile){
      state.profile = profile;
    }
  },
  actions: {
    async FETCH_POSTS({ state, commit }) {
      if (!state.moreData) return;

      const posts = await axios.get(
        "http://localhost:5000/api/posts?page=" + state.nextPage
      );

      if (posts.data.next) {
        const next = posts.data.next.page;
        commit("SET_NEXT_PAGE", next);
      } else {
        const flag = false;
        commit("SET_MORE_DATA", flag);
      }
      commit("SET_POSTS", posts.data.posts);
    },
    FILTERING_POSTS: async function({ commit }, obj){
      commit("CLEAR_POSTS");
      var s="";
      for(var c in obj.prop2){
        if(c==0){
          s+=`?course=${obj.prop2[c].id}&`
        }else{
          s+=`course=${obj.prop2[c].id}&`
        }
      }
      for(var c1 in obj.prop1){
        if(s==""){
          s+=`?semester=${obj.prop1[c1].id}&`
        }else{
          s+=`semester=${obj.prop1[c1].id}&`
        }
      }
      
      const posts = await axios.get(
        "http://localhost:5000/api/posts/filter/results"+s
      );
      
      if (posts.data.next) {
        let next = posts.data.next.page;
        commit("SET_NEXT_PAGE", next);
      } else {
        let flag = false;
        commit("SET_MORE_DATA", flag);
      }
      // console.log(posts.data)
      commit("SET_POSTS", posts.data);
    },
    CREATE_POST: async function({ commit }, obj){
      axios.post("http://localhost:5000/api/posts", {
        obj,
      });
    },
    FETCH_PROFILE_POSTS: async function({ state, commit }, user){

      commit("CLEAR_PROFILE_POSTS");

      const posts = await axios.get(
        "http://localhost:5000/api/posts/user/posts?user=" + user);

      commit("SET_PROFILE_POSTS", posts.data);
    }
  },
  modules: {
    search,
  },
  getters: {
    getPosts: (state) => state.posts,
    // getSearchedPosts: (state) => state.searchedPosts,
    getProfilePosts: (state) => state.profilePosts
  },
});
