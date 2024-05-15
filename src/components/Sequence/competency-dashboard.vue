<template>
<div style="display: inline-block; max-width: 500px;">
  <div class="cool-card">
    <div class="top">
      <div>
        <v-img
          :src="contentImageURL"
          :height="100"
        />
      </div>
    </div>
    <div class="main-area">
      <div class="star-row">
        <div v-for="show in showStars">
          <svg v-if="show" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>
        </div>
      </div>
      <div class="result-container" style="color: #444444;">
        <div
          v-for="([numerator, denominator], key) in scoresICareAbout"
          :key="key"
          class="result-row"
        >
          <div>{{ translate(key.split(':').pop()) }}</div>
          <div style="white-space: nowrap">{{ numerator }} / {{ denominator }}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import translate from './translations/translate.js'

const DEFAULT_SCORE = {
  "general:attempts": [
    3,
    17
  ],
  "compute:addition +": [
    4,
    4
  ],
  "compute:subtraction -": [
    5,
    5
  ]
}
  
export default {
  name: 'cool-card',
  props: {
    content: String,
    competencies: {
      type: Object,
      required: true,
      default: DEFAULT_SCORE
    }
  },
  data() {
    return {
      contentImageURL: null
    }
  },
  created() {
    Agent
      .state(this.content)
      .then(async ({ picture }) => {
        if (picture) this.contentImageURL = await Agent.download(picture).url()
      })
  },
  computed: {
    scoresICareAbout() {
      const scores = JSON.parse(JSON.stringify(this.competencies))
      delete scores["general:attempts"]
      return scores
    },
    completion() {
      const numerator = Object.values(this.scoresICareAbout)
        .reduce((acc,cur) => acc + cur[0], 0)
      const denominator = Object.values(this.scoresICareAbout)
        .reduce((acc,cur) => acc + cur[1], 0)
      return denominator ? numerator / denominator : 0
    },
    showStars() {
      return [
        this.completion >= 0.5,
        this.completion >= 0.7,
        this.completion >= 0.85
      ]
    }
  },
  methods: {
    translate(str) {
      return translate(str)
    }
  }
}  
</script>

<style scoped>
  .cool-card {
    max-width: 500px;
    min-width: 350px;
    padding-bottom: 80px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .top {
    padding-top: 20px;
    height: 100px;
    width: 200px;
    position: relative;
    border-top: 2px solid black;
    border-left: 2px solid black;
    border-right: 2px solid black;
    border-bottom: none;
    margin-bottom: -2px;
    border-radius: 100px 100px 0 0px;
    z-index: 1000;
    background: white;
    
    text-align: center;
  }
  .main-area {
    border: 2px solid black;
    width: 100%;
    flex-grow: 1;
    background: white;
    padding: 26px 10px 20px 10px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .star-row {
    display: flex;
    height: 70px;
    width: 100%;
    justify-content: center;
    fill: yellow;
    fill: yellow;
  }
  .star-row svg {
    margin: 10px;
    height: 50px;
    fill: rgb(243,204,69);
  }
  .result-container {
    width: calc(100% - 32px);
    padding: 16px 32px;
    font-size: 1.5em;
    text-transform: capitalize;
  }
  .result-row {
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
  }
</style>
