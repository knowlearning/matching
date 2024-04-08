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
    		'th' : 'IN THAI are you sure?'
    	},
    	'cancel': {
    		'en' : 'Cancel',
    		'th' : 'IN THAI cancel'
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
  mutations: { },
  actions: { },

})

export default store