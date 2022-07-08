import { createRouter, createWebHistory } from "vue-router";
const login_red = `https://login.iee.ihu.gr/authorization/?client_id=${process.env.VUE_APP_CLIENT_ID}&response_type=code
&scope=profile&redirect_uri=http://localhost:8080/login/auth
`;

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () =>
      import(/* webpackChunkName: "search" */ "../views/Search.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
  },
  {
    path: "/post/:id",
    name: "Post",
    component: () => import(/* webpackChunkName: "post" */ "../views/Post.vue"),
  },
  {
    path: "/login",
    name: "login",
    redirect: (to) => {
      window.location.href = login_red;
    },
  },
  {
    path: "/login/auth",
    name: "Auth",
    component: () => import(/* webpackChunkName: "auth" */ "../views/Auth.vue"),
    meta: {
      hideHeader: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
