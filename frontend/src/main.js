import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import VueProgressBar from 'vue-progressbar'

import VueSignature from 'vue-signature-pad'

import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css',
    './styles/contract.css'
  ]
}

Vue.use(VueHtmlToPaper, options)

Vue.use(VueSignature)

Vue.use(VueProgressBar, {
  color: '#a64452',
  failedColor: 'red'
})

import(/* webpackChunkName: "mainStyle" */ './styles/main.scss')

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
