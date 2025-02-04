import Agent from '@knowlearning/agents'
import { v4 as uuid } from 'uuid'
import defaultMarkdown from './defaultMarkdown.js'

// set inner markdown to default / initial 'how to' text
const newMarkdownId = uuid()
const x = await Agent.state(newMarkdownId)
x.md = defaultMarkdown

export default ({ source_language = 'en' }) => ({
	name: "New Markdown",
	md: newMarkdownId,
	items: [
		{ id : '01fd0ef0-fb93-11ee-a57d-19b2f6cf4b58' }, // Butterfly Reordering
		{ id : '0c014c40-fb93-11ee-a57d-19b2f6cf4b58' }, // Kobe_MJ Match
		{ id : '13d0f650-fb93-11ee-a57d-19b2f6cf4b58' }, // Monument Pairs
	],
	translations: {
		source_language,
		paths : [
			[ 'name' ],
			[ 'md' ]
		]
	}
})