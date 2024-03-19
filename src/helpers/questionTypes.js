import MatchingPlayer from '../components/Matching/Player.vue'
import MatchingCustomizer from '../components/Matching/Customizer.vue'
import TextEntryPlayer from '../components/TextEntry/Player.vue'
import TextEntryCustomizer from '../components/TextEntry/Customizer.vue'
import RearrangeCustomizer from '../components/Rearrange/Customizer.vue'
import SequenceCustomizer from '../components/Sequence/Customizer.vue'
import SequencePlayer from '../components/Sequence/Player.vue'

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
	'application/json;type=rearrange-items' : {
		description: 'Rearrange Items',
		components: {
			player: RearrangeCustomizer,
			customizer: RearrangeCustomizer
		},
		newItemSchema: {
			name: 'New Rearrange Item',
			question: '?? Question Text ??',
			items: [
				'24f35050-e53f-11ee-8de6-f3934262868d',
				'27e39270-e53f-11ee-8de6-f3934262868d',
				'2aaaefd0-e53f-11ee-8de6-f3934262868d',
				'2ded97b0-e53f-11ee-8de6-f3934262868d'
			]
		}
	},
	'application/json;type=sequence' : {
		description: 'Sequence Item',
		components: {
			player: SequencePlayer,
			customizer: SequenceCustomizer
		},
		newItemSchema: {
			name: 'Your New Sequence',
			items: [
				'b2e42280-dda2-11ee-9e52-b180ab5b4386',
				'a634f160-e561-11ee-8799-e158f951f256'
			] // start with array of items to play
		}
	},
}