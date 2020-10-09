<template>
  <v-app>
    <v-container v-cloak @drop.prevent="addDropFile" @dragover.prevent>
      <v-file-input
        v-model="file"
        @change="setImage"
        @click:clear="clearCanvas"
        accept="image/*"
        prepend-icon="mdi-camera"
        placeholder="画像をドラッグ＆ドロップか選択してください。"
      ></v-file-input>
      <v-btn
        class="my-2"
        color="primary"
        :disabled="!file"
        v-show="file"
        block
        @click="getCloudVisionResult(file)"
        >文字起こしする</v-btn
      >
      <v-btn
        class="my-2"
        color="primary"
        :disabled="!file"
        block
        v-show="results"
        @click="getTranslateResult(results)"
        >翻訳する</v-btn
      >
      <v-btn
        class="my-2"
        color="primary"
        :disabled="!file"
        block
        v-show="!results && file"
        @click="getTranslateResultNoDocs(file)"
        >翻訳する</v-btn
      >
      <v-row justify="center" align="center">
        <canvas width="500" height="500" ref="preview"></canvas>
      </v-row>
      {{ this.results }}
      {{ this.translateResult }}
    </v-container>
  </v-app>
</template>
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
    };
  },
  methods: {
    addDropFile(e) {
      if (this.file) {
        this.clearCanvas();
        this.file = e.dataTransfer.files[0];
        this.setImage();
      } else {
        this.file = e.dataTransfer.files[0];
        this.setImage();
      }
    },
    setImage() {
      console.log();
      if (this.file && this.file.type.startsWith('image/')) {
        this.clearCanvas();
        const url = window.URL.createObjectURL(this.file);
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          const canvas = this.$refs.preview;
          const context = canvas.getContext('2d');
          if (img.width > canvas.width) {
            const scale = canvas.width / img.width;
            const sw = img.width;
            const sh = img.height;
            const dw = img.width * scale;
            const dh = img.height * scale;
            canvas.width = dw;
            canvas.height = dh;
            context.drawImage(img, 0, 0, sw, sh, 0, 0, dw, dh);
          } else {
            context.drawImage(img, 0, 0);
          }
        };
      }
    },
    clearCanvas() {
      const canvas = this.$refs.preview;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.results = '';
      this.translateResult = '';
    },
    getCloudVisionResult: async function() {
      try {
        const data = await getCloudVisionResult(this.file);
        //console.log(data.responses.fullTextAnnotation);
        if (data && data.responses) {
          const visionText = data.responses[0].fullTextAnnotation.text;
          this.results = visionText;
        }
      } catch (error) {
        console.log(error);
      }
    },
    getTranslateResult: async function() {
      try {
        const translateData = await getTranslate(this.results, this.lang);
        //console.log(translateData.data.translations[0].translatedText);
        if (translateData && translateData.data) {
          this.translateResult =
            translateData.data.translations[0].translatedText;
        }
      } catch (error) {
        console.log(error);
      }
    },
    getTranslateResultNoDocs: async function() {
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
    },
  },
};
</script>
