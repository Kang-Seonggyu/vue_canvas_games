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
    path: '/BreakOutGame',
    name: 'BreakOutGame',
    component: () => import('../components/BreakOutGame.vue'),
  },
  {
    path: '/MarioGame',
    name: 'MarioGame',
    component: () => import('../components/MarioGame.vue'),
  },
  {
    path: '/Gun3D',
    name: 'Gun3D',
    component: () => import('../components/Gun3Dimension.vue'),
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
