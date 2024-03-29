import MatchingPlayer from '../components/Matching/Player.vue'
import MatchingCustomizer from '../components/Matching/Customizer.vue'
import TextEntryPlayer from '../components/TextEntry/Player.vue'
import TextEntryCustomizer from '../components/TextEntry/Customizer.vue'
import RearrangeCustomizer from '../components/Rearrange/Customizer.vue'
import RearrangePlayer from '../components/Rearrange/Player.vue'
import SequenceCustomizer from '../components/Sequence/Customizer.vue'
import SequencePlayer from '../components/Sequence/Player.vue'

const questionTypes = {
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
				{ id : 'b2e42280-dda2-11ee-9e52-b180ab5b4386' },
				{ id : 'a634f160-e561-11ee-8799-e158f951f256' }
			]
		}
	},
	'application/json;type=rearrange-items' : {
		description: 'Rearrange Items',
		components: {
			player: RearrangePlayer,
			customizer: RearrangeCustomizer
		},
		newItemSchema: {
			name: 'New Rearrange Item',
			question: '?? Question Text ??',
			answer : ''
		}
	}
}

let sequenceImportableTypes = Object.keys(questionTypes)
	.filter(item => !item.includes('sequence'))
sequenceImportableTypes.push('application/json;type=karel-task&version=1.0.1')
// note not including karel maps

export { sequenceImportableTypes }
export default questionTypes
