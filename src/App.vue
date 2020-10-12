<template>
  <v-app>
    <v-app-bar app color="white" dark>
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
        <button color="black" @click="handleClick_changeLanguage('ja')">
          クリック
        </button>
      </div>

      <v-spacer></v-spacer>
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
