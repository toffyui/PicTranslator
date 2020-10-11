<template>
  <v-app>
    <v-container v-cloak @drop.prevent="addDropFile" @dragover.prevent>
      <v-file-input
        v-model="file"
        @change="setImage"
        @click:clear="clearData"
        accept="image/*"
        prepend-icon="mdi-camera"
        placeholder="画像をドラッグ＆ドロップか選択してください。"
      ></v-file-input>
      <v-row>
        <v-col>
          <img width="100%" v-if="uploadImageUrl" :src="uploadImageUrl" />
        </v-col>
        <v-col>
          <v-btn
            block
            color="primary"
            :disabled="!file"
            v-show="file && !results"
            @click="getCloudVisionResult(file)"
            >文字起こしする</v-btn
          ><v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="doCopyText" v-show="file && results">
                mdi-checkbox-multiple-blank-outline
              </v-icon>
            </template>
            コピーする
          </v-tooltip>
          <v-input type="text" v-show="file" v-model="textMessage" readonly>
            {{ this.results }}</v-input
          >
          <v-btn
            block
            color="primary"
            :disabled="!file"
            v-show="file && !translateResult"
            @click="getTranslateResult(results | file)"
            >翻訳する</v-btn
          >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                @click="doCopyTranslateText"
                v-show="file && translateResult"
              >
                mdi-checkbox-multiple-blank-outline
              </v-icon>
            </template>
            コピーする
          </v-tooltip>
          <v-input
            v-show="file"
            type="text"
            v-model="translateTextMessage"
            readonly
          >
            {{ this.translateResult }}</v-input
          >
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
