import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueClipboard from 'vue-clipboard2';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
Vue.config.productionTip = false;
Vue.use(VueClipboard);

const browserLanguage = function() {
  var ua = window.navigator.userAgent.toLowerCase();
  try {
    // chrome
    if (ua.indexOf('chrome') != -1) {
      return (
        navigator.languages[0] ||
        navigator.browserLanguage ||
        navigator.language ||
        navigator.userLanguage
      ).substr(0, 2);
    }
    // それ以外
    else {
      return (
        navigator.browserLanguage ||
        navigator.language ||
        navigator.userLanguage
      ).substr(0, 2);
    }
  } catch (e) {
    return undefined;
  }
};

let defaultLang;
if (browserLanguage() == 'ja') {
  defaultLang = 'ja';
} else {
  defaultLang = 'en';
}

const i18n = new VueI18n({
  locale: defaultLang,
  messages: require('./assets/i18nKeys.json'),
});

new Vue({
  vuetify,
  render: (h) => h(App),
  i18n,
}).$mount('#app');
