import Vue from 'vue'
import Router from 'vue-router'
import store from './store/'
import api from './api'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,

  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'homepage',
      meta: { loginNotRequired: false, blockIfLoggedIn: false },
      component: () => import(/* webpackChunkName: "homepage" */ './views/Homepage.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { loginNotRequired: true, blockIfLoggedIn: true },
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { loginNotRequired: false, blockIfLoggedIn: false },
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
      path: '/insertCar',
      name: 'insertCar',
      meta: { loginNotRequired: false, blockIfLoggedIn: false },
      component: () => import(/* webpackChunkName: "login" */ './views/InsertCar.vue')
    },
    {
      path: '/towingErrand',
      name: 'towingErrand',
      meta: { loginNotRequired: false, blockIfLoggedIn: false },
      component: () => import(/* webpackChunkName: "towingErrand" */ './views/TowingErrand.vue')
    },
    {
      path: '/insertTowingErrand',
      name: 'insertTowingErrand',
      meta: { loginNotRequired: false, blockIfLoggedIn: false },
      component: () => import(/* webpackChunkName: "insertTowingErrand" */ './views/InsertTowingErrand.vue')
    },
    {
      path: '/insertTowingErrand/:towingErrandId',
      name: 'insertTowingErrandWithId',
      meta: { loginNotRequired: false, blockIfLoggedIn: false },
      component: () => import(/* webpackChunkName: "insertTowingErrandWithId" */ './views/InsertTowingErrand.vue')
    },
    {
      path: '/errand/:towingErrandId',
      name: 'errand',
      meta: { loginNotRequired: false, blockIfLoggedIn: false },
      component: () => import(/* webpackChunkName: "errand" */ './views/Errand.vue')
    },
    {
      path: '/adminPanel',
      name: 'adminPanel',
      meta: { loginNotRequired: false, blockIfLoggedIn: false, adminAccountRequired: true },
      component: () => import(/* webpackChunkName: "adminPanel" */ './views/AdminPanel.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.userLoaded && to.name !== 'login') {
    await api.getUser().then(response => {
      if (response.status === 401) {
        console.log(response.status)
        return next('/login')
      }
      store.dispatch('login', response.data)
      console.log('zalogowany')
      return next()
    }).catch(error => {
      console.log(error)
      return next('/login')
    })
  }
  if (!store.getters.isAdmin) {
    if (to.matched.some(record => record.meta.adminAccountRequired)) {
      return next('/')
    }
  } else if (!store.getters.loggedIn) {
    if (to.matched.some(record => record.meta.loginNotRequired)) {
      return next()
    }

    return next('/login')
  } else if (to.matched.some(record => record.meta.blockIfLoggedIn)) {
    return next('/')
  }

  next()
})

export default router
