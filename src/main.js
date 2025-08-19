import Agent from '@knowlearning/agents'
import { createApp } from 'vue'
import { validate as isUUID } from 'uuid'
import './style.css'
import store from './store/store.js'
import App from './App.vue'
import LoginPage from './components/LoginPage.vue'
import NotFound from './components/NotFound.vue'
import EmbeddedPlayer from './components/EmbeddedPlayer.vue'
import questionTypes from './helpers/questionTypes.js'

import 'vuetify/styles'
import '@fortawesome/fontawesome-free/css/all.css'
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'

//  TODO: trim down imports
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import polyfillDragAndDrop from './dragDropTouch.js'

window.Agent = Agent

if (!Agent.embedded) polyfillDragAndDrop()

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa }
  }
})

const initialLoad = async () => {
    const { auth: { user, provider } } = await Agent.environment()
    if (provider === 'anonymous') {
        createApp(LoginPage)
          .use(store)
          .use(vuetify)
          .mount('#app')
    } else {
        const url = new URL(window.location.href)
        const { pathname } = url
        const route = pathname.slice(1)
        if (route === '' || route === 'sequence-builder') {
            createApp(App, { route })
                .use(store)
                .use(vuetify)
                .mount('#app')
        } else if (await routeIsUUIDOfValidType(route)) {
            // cannot use PlayOrCustomizeByTypeSwitcher directly
            // because we need to wrap in a suspense element
            createApp(EmbeddedPlayer, { id: route })
                .use(store)
                .use(vuetify)
                .mount('#app')
        } else {
            createApp(NotFound)
                .use(vuetify)
                .mount('#app')
        }
    }
}

async function routeIsUUIDOfValidType(route) {
    return true
	if (!isUUID(route)) return false
	
	const { active_type } = await Agent.metadata(route)
	return !!(active_type && Object.keys(questionTypes).includes(active_type))
}

initialLoad()

// Use --vh variable for older browsers to support dvh like behavior
function setDynamicVH() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setDynamicVH()

window.addEventListener('resize', setDynamicVH)
window.addEventListener('orientationchange', setDynamicVH)