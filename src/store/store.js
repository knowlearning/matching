import { createStore } from 'vuex'
import matchNavigatorLanguage from './matchNavigatorLanguage.js'
import translations from './translations.js'

const store = createStore({
  state: {
    translations,
    language: matchNavigatorLanguage(),
    languages: [matchNavigatorLanguage()],
    previewContent: null, // null or id to preview, used for modal
    tagContent: null, // null or id to tag, used for modal
  },
   getters: {
    language: state => () => state.language,
    languages: state => () => state.languages,
    previewContent: state => () => state.previewContent,
    tagContent: state => () => state.tagContent,
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
    tagContent: (state, value) => state.tagContent = value
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
    languages: async ({ commit }, value) => {
      commit('languages', value)
      commit('language', value[0])
      await Agent.environment().then(env => {
        env.variables.LANGUAGES = value
      })
    },
    previewContent: ({ commit }, value) => commit('previewContent', value),
    tagContent: ({ commit }, value) => commit('tagContent', value),
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
