import Agent from '@knowlearning/agents/browser.js'
import { createApp } from 'vue'
import { validate as isUUID } from 'uuid'
import './style.css'
import App from './App.vue'
import NotFound from './components/NotFound.vue'
import EmbeddedPlayer from './components/EmbeddedPlayer.vue'

window.Agent = Agent

const initialLoad = async () => {
    const { auth: { user, provider } } = await Agent.environment()
    if (provider === 'anonymous') {
    	Agent.login()
    } else {
        const url = new URL(window.location.href)
        const { pathname } = url
        const route = pathname.slice(1)
        if (route === '') {
        	createApp(App).mount('#app')
        } else if (await routeIsUUIDOfValidType(route)) {
        	createApp(EmbeddedPlayer, { id: route }).mount('#app')
        } else {
        	createApp(NotFound).mount('#app')
        }
    }
}

async function routeIsUUIDOfValidType(route) {
	if (!isUUID(route)) return false
	
	const { active_type } = await Agent.metadata(route)
	return !!(active_type && active_type === 'application/json;type=matching')
}

initialLoad()