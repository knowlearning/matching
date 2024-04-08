import { createStore } from 'vuex'
import matchNavigatorLanguage from './matchNavigatorLanguage.js'
import translations from './translations.js'

const store = createStore({
  state: {
    translations,
    language: matchNavigatorLanguage()
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