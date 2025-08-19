import { createStore } from 'vuex'
import matchNavigatorLanguage from './matchNavigatorLanguage.js'
import supportedLanguages from './supportedLanguages.js'
import translations from './translations.js'

const store = createStore({
  state: {
    translations,
    language: matchNavigatorLanguage(supportedLanguages),
    languages: supportedLanguages, // may be superceded by env LANGUAGES, see main.js
    previewContent: null, // null or id to preview, used for modal
    idToShowTagInterfaceFor: null, // null or id to tag, used for modal
  },
   getters: {
    language: state => () => state.language,
    languages: state => () => state.languages,
    previewContent: state => () => state.previewContent,
    idToShowTagInterfaceFor: state => () => state.idToShowTagInterfaceFor,
    t: state => slug => {
      const lang = state.language
      if (!state.translations[slug]) {
        const res = `no slug ${slug}`
        console.warn(res)
        return res
      } else if (!state.translations[slug][lang]) {
        const res = `no translation for ${slug} in ${lang}`
        console.warn(res)
        return res
      } else {
        return state.translations[slug][lang]
      }
    },
  },
  mutations: {
    language: (state, value) => state.language = value,
    languages: (state, value) => state.languages = value,
    previewContent: (state, value) => state.previewContent = value,
    idToShowTagInterfaceFor: (state, value) => state.idToShowTagInterfaceFor = value
  },
  actions: {
    language: async ({ commit, getters }, value) => {
      const languages = pullToFront(getters.languages(), value)
      commit('language', value)
      commit('languages', languages)
      await Agent.environment().then(env => {
        env.variables.LANGUAGES = languages
      })
    },
    languages: async ({ commit }, languagesArray) => {
      commit('languages', languagesArray)
      commit('language', matchNavigatorLanguage(languagesArray))
      await Agent.environment().then(env => {
        env.variables.LANGUAGES = languagesArray
      })
    },
    previewContent: ({ commit }, value) => commit('previewContent', value),
    idToShowTagInterfaceFor: ({ commit }, value) => commit('idToShowTagInterfaceFor', value),
  },

})

export default store

function pullToFront(arr, str) {
  const a = [...arr]
  const i = a.indexOf(str)
  if (i > -1) a.splice(i, 1)
  a.unshift(str)
  return a
}
