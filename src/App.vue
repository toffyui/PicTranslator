<template>
  <v-app>
    <v-app-bar app color="white" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="../src/assets/newlogo.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
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
    //
  }),
};
</script>
