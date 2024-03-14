import Agent from '@knowlearning/agents/browser.js'
import { createApp } from 'vue'
import { validate as isUUID } from 'uuid'
import './style.css'
import App from './App.vue'
import NotFound from './components/NotFound.vue'
import EmbeddedPlayer from './components/EmbeddedPlayer.vue'
import questionTypes from './helpers/questionTypes.js'

window.Agent = Agent

const name = 'Matching'
const type = 'application/json;type=matching'
const data = JSON.stringify({ data: { name, type } });
const id = Agent.uuid()

await Agent.create(name, type, id, data)

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
            // cannot use PlayOrCustomizeByTypeSwitcher directly
            // because we need to wrap in a suspense element
        	createApp(EmbeddedPlayer, { id: route }).mount('#app')
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