<template>
  <v-app>
    <v-container>
      <v-row @drop.prevent="addDropFile" @dragover.prevent>
        <v-col cols="12" sm="12">
          <v-file-input
            v-model="file"
            @change="setImage"
            @click:clear="clearData"
            accept="image/*"
            prepend-icon="mdi-camera"
            :placeholder="$t('message.welcome')"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <v-card @drop.prevent="addDropFile" @dragover.prevent>
            <v-card-title class="title" v-if="!uploadImageUrl">
              {{ $t('message.pictureUpload') }}
            </v-card-title>
            <v-card-title class="title" v-if="uploadImageUrl">
              {{ $t('message.pictureUploaded') }}
            </v-card-title>
            <img width="100%" v-if="uploadImageUrl" :src="uploadImageUrl"/>
            <img width="100%" v-if="!uploadImageUrl" src="../assets/mainPic.jpg"
          /></v-card>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <v-sheet>
            <v-card fluid>
              <v-card-actions v-show="!results">
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  @click="getCloudVisionResult(file)"
                  >{{ $t('button.transcription') }}
                  <v-icon light right>mdi-transcribe</v-icon></v-btn
                >
              </v-card-actions>
              <v-card-actions
                v-show="openMessageA"
                transition="slide-y-transition"
              >
                <v-btn block outlined color="#17619F"
                  >{{ $t('button.copyDone') }}

                  <v-icon light right>
                    mdi-checkbox-marked-circle
                  </v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-actions v-show="results && !openMessageA">
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  @click="doCopyText"
                >
                  {{ $t('button.copy') }}
                  <v-icon dark right>
                    mdi-checkbox-multiple-blank-outline
                  </v-icon>
                </v-btn>
              </v-card-actions>

              <v-card-text v-model="textMessage" v-show="file && results">
                {{ this.results }}</v-card-text
              >
              <v-card-text v-model="textMessage" v-if="notext">
                {{ $t('message.notext') }}</v-card-text
              >
            </v-card> </v-sheet
          ><v-sheet class="pt-2">
            <v-card>
              <v-card-actions v-show="!translateResult">
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  @click="getTranslateResult(results | file)"
                  >{{ $t('button.translation')
                  }}<v-icon light right>mdi-google-translate</v-icon></v-btn
                >
              </v-card-actions>
              <v-card-actions
                v-show="openMessageB"
                transition="slide-y-transition"
              >
                <v-btn block outlined color="#17619F"
                  >{{ $t('button.copyDone') }}

                  <v-icon light right>
                    mdi-checkbox-marked-circle
                  </v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-actions v-show="translateResult && !openMessageB">
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  @click="doCopyTranslateText"
                >
                  {{ $t('button.copy') }}
                  <v-icon dark right>
                    mdi-checkbox-multiple-blank-outline
                  </v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-text
                v-show="file && translateResult"
                v-model="translateTextMessage"
              >
                {{ this.translateResult }}</v-card-text
              >
              <v-card-text v-model="textMessage" v-if="noTranslateText">
                {{ $t('message.notext') }}</v-card-text
              >
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
  </v-app>
</template>
<style></style>
<script>
import getCloudVisionResult from '../libs/visionApi';
import getTranslate from '../libs/translateApi';

export default {
  data() {
    return {
      results: '',
      translateResult: '',
      file: null,
      textMessage: '',
      translateTextMessage: '',
      uploadImageUrl: '',
      openMessageA: false,
      openMessageB: false,
      overlay: false,
      notext: false,
      noTranslateText: false,
    };
  },
  methods: {
    doCopyText() {
      this.textMessage = this.results;
      this.$copyText(this.textMessage);
      this.openMessageA = true;
      window.setTimeout(() => {
        this.openMessageA = false;
      }, 1500);
    },
    doCopyTranslateText() {
      this.translateTextMessage = this.translateResult;
      this.$copyText(this.translateTextMessage);
      this.openMessageB = true;
      window.setTimeout(() => {
        this.openMessageB = false;
      }, 1500);
    },

    addDropFile(e) {
      if (this.file) {
        this.clearData();
        this.file = e.dataTransfer.files[0];
        this.setImage(this.file);
      } else {
        this.file = e.dataTransfer.files[0];
        this.setImage(this.file);
      }
    },
    setImage(file) {
      if (this.file && this.file.type.startsWith('image/')) {
        this.clearData();
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.addEventListener('load', () => {
          this.uploadImageUrl = fr.result;
        });
      } else {
        this.uploadImageUrl = '';
      }
    },
    clearData() {
      this.results = '';
      this.translateResult = '';
      this.notext = false;
      this.noTranslateText = false;
    },
    getCloudVisionResult: async function() {
      this.overlay = true;
      try {
        const data = await getCloudVisionResult(this.file);
        if (data && data.responses) {
          const visionText = data.responses[0].fullTextAnnotation.text;
          this.results = visionText;
          this.overlay = false;
        }
      } catch (error) {
        this.notext = true;
        this.overlay = false;
      }
    },

    getTranslateResult: async function() {
      this.overlay = true;
      if (this.results) {
        try {
          const translateData = await getTranslate(
            this.results,
            this.$i18n.locale
          );
          if (translateData && translateData.data) {
            this.translateResult =
              translateData.data.translations[0].translatedText;
            this.overlay = false;
          }
        } catch (error) {
          this.noTranslateText = true;
          this.overlay = false;
        }
      } else {
        try {
          const data = await getCloudVisionResult(this.file);
          if (data && data.responses) {
            const visionText = data.responses[0].fullTextAnnotation.text;
            const translateData = await getTranslate(
              visionText,
              this.$i18n.locale
            );
            this.translateResult =
              translateData.data.translations[0].translatedText;
            this.overlay = false;
          }
        } catch (error) {
          this.noTranslateText = true;
          this.overlay = false;
        }
      }
    },
  },
};
</script>
