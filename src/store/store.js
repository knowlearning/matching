import { createStore } from 'vuex'
import matchNavigatorLanguage from './matchNavigatorLanguage.js'
// import translationSlugMap from './translationSlugMap.js'

const store = createStore({
  state: {
    language: matchNavigatorLanguage(),
    translations: {
      // TODO:  Maybe minimal isolate to file. Maybe maximal grab live data.
      'are-you-sure' : {
        'en' : 'Are you sure?',
        'th' : 'คุณแน่ใจหรือไม่?'
      },
      'cancel': {
        'en' : 'Cancel',
        'th' : 'ยกเลิก'
      },
      'player': {
        'en' : 'Player',
        'th' : 'ผู้เล่น'
      },
      'customizer': {
        'en' : 'Customizer',
        'th' : 'ปรับแต่ง'
      },
      'add-new': {
        'en' : 'Add New',
        'th' : 'เพิ่มใหม่'
      },
      'copy-existing': {
        'en' : 'Copy Existing',
        'th' : 'คัดลอกที่มีอยู่'
      },
      'thai': {
        'en' : 'Thai',
        'th' : 'ไทย'
      },
      'ok' : {
        'en': 'OK',
        'th': 'โอเค'
      },
      'select-question-type' : {
        'en': 'Select Question Type',
        'th': 'เลือกประเภทคำถาม'
      },
      'matching-question' : {
        'en': 'Matching Question',
        'th': 'คำถามเรียงคู่'
      },
      'rearrange-question' : {
        'en': 'Rearrange Question',
        'th': 'คำถามเรียงลำดับ'
      },
      'select-from-pairs-question' : {
        'en': 'Select from Pairs Question',
        'th': 'เลือกคำถามจากคู่'
      },
      'sequence-builder' : {
        'en': 'Sequence Builder',
        'th': 'สร้างลำดับ'
      }
    },
  },
   getters: {
    language: state => () => state.language,
    t: state => slug => {
      const lang = state.language
      if (!state.translations[slug]) return `no slug ${slug}`
      else if (!state.translations[slug][lang]) return `no translation for ${slug} in ${lang}`
       else return state.translations[slug][lang]
    },
  },
  mutations: {
    language: (state, value) => state.language = value
  },
  actions: {
    language: ({ commit }, value) => commit('language', value)
    
  },

})

export default store