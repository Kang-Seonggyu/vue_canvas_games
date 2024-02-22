import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/HomeVue.vue'),
  },
  {
    path: '/DinoGame',
    name: 'DinoGame',
    component: () => import('../components/DinoGame.vue'),
  },
  {
    path: '/MarioGame',
    name: 'MarioGame',
    component: () => import('../components/MarioGame.vue'),
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
