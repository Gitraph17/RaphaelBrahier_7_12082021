import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Subscribe",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Subscribe.vue"),
    meta: { guest: true },
  },
  {
    path: "/Login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/Posts",
    name: "Posts",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Posts.vue"),
    meta: {requiresAuth: true},
  },
  {
    path: "/Profile",
    name: "Profile",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Profile.vue"),
    meta: {requiresAuth: true},
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)) {
    if (document.cookie.indexOf("isTokenValid") != -1) {
      return next()
    } else {
    next('/login')
    }
  } else {
    next()
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (document.cookie.indexOf("isTokenValid") != -1) {
      return next("/posts");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
