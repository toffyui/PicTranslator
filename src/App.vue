<template>
  <v-app>
    <v-app-bar app color="white" dark class="pr-10 pl-10">
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-4"
          contain
          src="../src/assets/newlogo.png"
          transition="scale-transition"
          width="50"
        />

        <v-img
          alt="Name"
          class="shrink mt-1"
          contain
          min-width="150"
          src="../src/assets/title.png"
          width="230"
        />
        <!-- <button color="black" @click="handleClick_changeLanguage('ja')">
          クリック
        </button> -->
      </div>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                color="#17619F"
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
                {{ $t('button.language') }}
              </v-btn>
            </template>
            <span>{{ $t('button.changeLang') }}</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-if="$t('button.language') !== 'English'"
            @click="handleClick_changeLanguage('en')"
          >
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="$t('button.language') !== 'Deutsche'"
            @click="handleClick_changeLanguage('de')"
          >
            <v-list-item-title>Deutsche</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="$t('button.language') !== 'Français'"
            @click="handleClick_changeLanguage('fr')"
          >
            <v-list-item-title>Français</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="$t('button.language') !== '日本語'"
            @click="handleClick_changeLanguage('ja')"
          >
            <v-list-item-title>日本語</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="$t('button.language') !== '中文'"
            @click="handleClick_changeLanguage('zh')"
          >
            <v-list-item-title>中文</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <Translate />
    </v-main>
  </v-app>
</template>

<script>
import Translate from './components/Translate';

export default {
  name: 'App',

  components: {
    Translate,
  },

  data: () => ({
    lang: 'ja',
  }),
  methods: {
    handleClick_changeLanguage(lang) {
      this.$i18n.locale = lang;
    },
  },
};
</script>
