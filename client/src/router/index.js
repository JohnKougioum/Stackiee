import { createRouter, createWebHistory } from "vue-router";
// const login_red = `https://login.iee.ihu.gr/authorization/?client_id=${process.env.VUE_APP_CLIENT_ID}&response_type=code
// &scope=profile&redirect_uri=http://localhost:8080/login/auth
// `;

const routes = [
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
