import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueClipboard from 'vue-clipboard2';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
Vue.config.productionTip = false;
Vue.use(VueClipboard);

const i18n = new VueI18n({
  locale: 'ja',
  messages: require('./assets/i18nKeys.json'),
});

new Vue({
  vuetify,
  render: (h) => h(App),
  i18n,
}).$mount('#app');
