import MatchingPlayer from '../components/Matching/Player.vue'
import MatchingCustomizer from '../components/Matching/Customizer.vue'
import TextEntryPlayer from '../components/TextEntry/Player.vue'
import TextEntryCustomizer from '../components/TextEntry/Customizer.vue'
import RearrangeCustomizer from '../components/Rearrange/Customizer.vue'
import RearrangePlayer from '../components/Rearrange/Player.vue'
import SequenceCustomizer from '../components/Sequence/Customizer.vue'
import SequencePlayer from '../components/Sequence/Player.vue'
import SelectFromPairsCustomizer from '../components/SelectFromPairs/Customizer.vue'
import SelectFromPairsPlayer from '../components/SelectFromPairs/Player.vue'

const questionTypes = {
	'application/json;type=matching' : {
		description: 'Matching Question',
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
	// 'application/json;type=textEntry' : {
	// 	description: 'Text Entry Question',
	// 	components: {
	// 		player: TextEntryPlayer,
	// 		customizer: TextEntryCustomizer
	// 	},
	// 	newItemSchema: {
	// 		name: 'Unnamed Text Entry Item',
	// 		question: 'Your Question Here',
	// 	}
	// },
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
	},
	'application/json;type=select-from-pairs' : {
		description: 'Pair-wise Selection',
		components: {
			player: SelectFromPairsPlayer,
			customizer: SelectFromPairsCustomizer
		},
		newItemSchema: {
			name: 'New Select from Pairs Item',
			instructions: '...some instructions...',
			rows: [
				{
					audioId: "ddd7e540-f2ff-11ee-8e0e-93d441d1b4a7",
					choices: [
						{	
							content: 'พ', // display string or uuid
							correct: false
						},
						{	
							content: 'ะ', // display string or uuid 
							correct: true
						}
					]
				} // end placeholder row
			]
		}
	},
	'application/json;type=sequence' : {
		description: 'Sequence Builder',
		components: {
			player: SequencePlayer,
			customizer: SequenceCustomizer
		},
		newItemSchema: {
			name: 'Your New Sequence',
			items: [
				{ id : '3c514c80-f2fe-11ee-a9c0-33ba592e4060' },
				{ id : '54734700-f2fe-11ee-a9c0-33ba592e4060' }
			]
		}
	},
}

let sequenceImportableTypes = Object.keys(questionTypes)
	.filter(item => !item.includes('sequence'))
sequenceImportableTypes.push('application/json;type=karel-task&version=1.0.1')
// note not including karel maps

export { sequenceImportableTypes }
export default questionTypes
