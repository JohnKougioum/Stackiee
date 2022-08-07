import { createRouter, createWebHistory } from "vue-router";
const login_red = `https://login.iee.ihu.gr/authorization/?client_id=${
  import.meta.env.VITE_CLIENT_ID
}&response_type=code
&scope=profile&redirect_uri=http://localhost:8080/login/auth
`;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/search",
      name: "Search",
      component: () => import("@/views/Search.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/Profile.vue"),
    },
    {
      path: "/post/:id",
      name: "Post",
      component: () => import("@/views/Post.vue"),
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
      component: () => import("@/views/Auth.vue"),
      meta: {
        hideHeader: true,
      },
    },
  ],
});

export default router;
