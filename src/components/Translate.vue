<template>
  <v-app>
    <v-container>
      <v-row @drop.prevent="addDropFile" @dragover.prevent>
        <v-file-input
          v-model="file"
          @change="setImage"
          @click:clear="clearData"
          accept="image/*"
          prepend-icon="mdi-camera"
          placeholder="画像をドラッグ＆ドロップか選択してください。"
        ></v-file-input>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <v-card @drop.prevent="addDropFile" @dragover.prevent>
            <v-card-title class="title">
              {{ this.message }}
            </v-card-title>
            <img width="100%" v-if="uploadImageUrl" :src="uploadImageUrl"/>
            <img width="100%" v-if="!uploadImageUrl" src="../assets/mainPic.jpg"
          /></v-card>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <v-sheet>
            <v-card fluid>
              <v-card-actions>
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  v-show="!results"
                  @click="getCloudVisionResult(file)"
                  >文字起こしする</v-btn
                >
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  v-show="results"
                  @click="doCopyText"
                >
                  コピーする
                  <v-icon dark right>
                    mdi-checkbox-multiple-blank-outline
                  </v-icon>
                </v-btn>
              </v-card-actions>

              <v-card-text v-model="textMessage" v-show="file && results">
                {{ this.results }}</v-card-text
              >
            </v-card> </v-sheet
          ><v-sheet class="pt-2">
            <v-card>
              <v-card-actions>
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  v-show="!translateResult"
                  @click="getTranslateResult(results | file)"
                  >翻訳する</v-btn
                >
                <v-btn
                  class="white--text"
                  block
                  color="#17619F"
                  :disabled="!file"
                  v-show="translateResult"
                  @click="doCopyTranslateText"
                >
                  コピーする
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
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
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
      lang: 'ja',
      textMessage: '',
      translateTextMessage: '',
      uploadImageUrl: '',
      message: '画像をドラック＆ドロップ',
    };
  },
  methods: {
    doCopyText() {
      this.textMessage = this.results;
      this.$copyText(this.textMessage);
    },
    doCopyTranslateText() {
      this.translateTextMessage = this.translateResult;
      this.$copyText(this.translateTextMessage);
    },

    addDropFile(e) {
      if (this.file) {
        this.clearData();
        this.file = e.dataTransfer.files[0];
        this.message = '画像プレビュー';
        this.setImage(this.file);
      } else {
        this.file = e.dataTransfer.files[0];
        this.message = '画像プレビュー';
        this.setImage(this.file);
      }
    },
    setImage(file) {
      if (this.file && this.file.type.startsWith('image/')) {
        this.clearData();
        this.message = '画像プレビュー';
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
      this.message = '画像をドラック＆ドロップ';
    },
    getCloudVisionResult: async function() {
      try {
        const data = await getCloudVisionResult(this.file);
        if (data && data.responses) {
          const visionText = data.responses[0].fullTextAnnotation.text;
          this.results = visionText;
        }
      } catch (error) {
        console.log(error);
      }
    },

    getTranslateResult: async function() {
      if (this.results) {
        try {
          const translateData = await getTranslate(this.results, this.lang);
          if (translateData && translateData.data) {
            this.translateResult =
              translateData.data.translations[0].translatedText;
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const data = await getCloudVisionResult(this.file);
          if (data && data.responses) {
            const visionText = data.responses[0].fullTextAnnotation.text;
            const translateData = await getTranslate(visionText, this.lang);
            this.translateResult =
              translateData.data.translations[0].translatedText;
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};
</script>
