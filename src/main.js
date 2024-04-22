import Agent from '@knowlearning/agents/browser.js'
import { createApp } from 'vue'
import { validate as isUUID } from 'uuid'
import './style.css'
import store from './store/store.js'
import App from './App.vue'
import LoginPage from './components/LoginPage.vue'
import NotFound from './components/NotFound.vue'
import EmbeddedPlayer from './components/EmbeddedPlayer.vue'
import questionTypes from './helpers/questionTypes.js'

window.Agent = Agent

const initialLoad = async () => {
    const { auth: { user, provider } } = await Agent.environment()
    if (provider === 'anonymous') {
        createApp(LoginPage).mount('#app')
    } else {
        const url = new URL(window.location.href)
        const { pathname } = url
        const route = pathname.slice(1)
        if (route === '') {
        	createApp(App)
                .use(store)
                .mount('#app')
        } else if (await routeIsUUIDOfValidType(route)) {
            // cannot use PlayOrCustomizeByTypeSwitcher directly
            // because we need to wrap in a suspense element
        	createApp(EmbeddedPlayer, { id: route })
                .use(store)
                .mount('#app')
        } else {
        	createApp(NotFound).mount('#app')
        }
    }
}

async function routeIsUUIDOfValidType(route) {
	if (!isUUID(route)) return false
	
	const { active_type } = await Agent.metadata(route)
	return !!(active_type && Object.keys(questionTypes).includes(active_type))
}

initialLoad()