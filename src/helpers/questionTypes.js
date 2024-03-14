import MatchingPlayer from '../components/Matching/Player.vue'
import MatchingCustomizer from '../components/Matching/Customizer.vue'
import TextEntryPlayer from '../components/TextEntry/Player.vue'
import TextEntryCustomizer from '../components/TextEntry/Customizer.vue'

export default {
	'application/json;type=matching' : {
		description: 'Simple Matching Question',
		components: {
			player: MatchingPlayer,
			customizer: MatchingCustomizer
		},
		newItemSchema: {
			name: 'Unnamed Matching Item',
			instructions: '',
			fromChoices: [],
			toChoices: [],
			answerConnections: []
		}
	},
	'application/json;type=textEntry' : {
		description: 'Simple Text Entry Question',
		components: {
			player: TextEntryPlayer,
			customizer: TextEntryCustomizer
		},
		newItemSchema: {
			name: 'Unnamed Text Entry Item',
			question: 'Your Question Here',
			answer: ''
		}
	},
	'application/json;type=fillInBlank' : {
		description: 'Simple Rearrenging Question',
		components: {
			player: TextEntryPlayer,
			customizer: TextEntryCustomizer
		},
		newItemSchema: {
			name: 'Unnamed Fill In The Blank Item',
			question: 'Your Question Here',
			answer: ''
		}
	}
}