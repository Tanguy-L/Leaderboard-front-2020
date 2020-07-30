import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Connexion from '../views/Connexion.vue';
import BackOffice from '../views/BackOffice.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/connexion',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/back',
    name: 'BackOffice',
    component: BackOffice
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
