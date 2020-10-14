import Vue from 'vue'
import Router from 'vue-router'
import Translate from './components/Translate'
import PrivacyJp from './components/PrivacyJp'
import PrivacyEn from './components/PrivacyEn'
import TermsOfServiceJp from './components/TermsOfServiceJp'
import TermsOfServiceEn from './components/TermsOfServiceEn'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'translate',
      component: Translate
    },
    {
      path: '/privacy-jp',
      name: 'privacy-jp',
      component: PrivacyJp
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyEn
    },
    {
      path: '/terms-jp',
      name: 'terms-jp',
      component: TermsOfServiceJp
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsOfServiceEn
    }
  ]
})