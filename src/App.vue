<template>
  <v-app>
    <v-app-bar app color="white" dark class="header-class">
      <div class="d-flex align-center" @click="returnTop">
        <v-img
          alt="Logo"
          class="shrink logo-class"
          contain
          src="../src/assets/newlogo.png"
          transition="scale-transition"
        />

        <v-img
          alt="Name"
          class="shrink title-class"
          contain
          min-width="150"
          src="../src/assets/title.png"
        />
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
                {{ $t("button.language") }}
              </v-btn>
            </template>
            <span class="hidden-sm-and-down">{{
              $t("button.changeLang")
            }}</span>
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
      <router-view />
    </v-main>
    <v-footer color="white" light>
      <v-row justify="center" no-gutters>
        <v-btn small text rounded @click="Contact">
          {{ $t("footer.contact") }}
        </v-btn>
        <v-btn small text rounded @click="TermsOfService">
          {{ $t("footer.termsOfService") }}
        </v-btn>
        <v-btn small text rounded @click="PrivacyPolicy">
          {{ $t("footer.privacyPolicy") }}
        </v-btn>
        <v-col cols="12" class="text-center" small>
          {{ new Date().getFullYear() }} — <strong>© Pic Translator</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<style>
@media screen and (min-width: 600px) {
  .header-class {
    padding: 0 10px;
  }
  .logo-class {
    width: 50px;
  }
  .title-class {
    width: 230px;
    margin-left: 20px;
  }
}

@media screen and (max-width: 599px) {
  .logo-class {
    width: 30px;
  }
  .title-class {
    width: 150px;
    margin-left: 10px;
  }
}
</style>

<script>
export default {
  name: "App",

  data: () => ({
    lang: "ja",
  }),
  methods: {
    handleClick_changeLanguage(lang) {
      this.$i18n.locale = lang;
    },
    Contact() {
      if (this.$i18n.locale == "ja") {
        window.open(
          "https://docs.google.com/forms/d/e/1FAIpQLSfpyaiuRVfQTgOfEZvMN9mIkitSxld6nd1Y5Abr9-KDUhKPYQ/viewform?usp=sf_link",
          "_blank"
        );
      } else {
        window.open(
          "https://docs.google.com/forms/d/e/1FAIpQLSer6Jeh0RQvAFlonjg3uOmkwDLRcIk0Lbcf1lTBZVzsytq6rA/viewform?usp=sf_link",
          "_blank"
        );
      }
    },
    PrivacyPolicy() {
      if (this.$i18n.locale == "ja") {
        this.$router.push("/privacy-jp");
      } else {
        this.$router.push("/privacy");
      }
    },
    TermsOfService() {
      if (this.$i18n.locale == "ja") {
        this.$router.push("/terms-jp");
      } else {
        this.$router.push("/terms");
      }
    },
    returnTop() {
      this.$router.push("/");
    }
  },
};
</script>
