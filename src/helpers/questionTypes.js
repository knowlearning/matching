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

import mjAndKobeMatching from './mjAndKobeMatching.js'
import monumentPairs from './monumentPairs.js'
import defaultSequence from './defaultSequence.js'
const copy = x => JSON.parse(JSON.stringify(x))


const questionTypes = {
	'application/json;type=matching' : {
		description: 'matching-question',
		components: {
			player: MatchingPlayer,
			customizer: MatchingCustomizer
		},
		newItemSchemas: {
			default: copy(mjAndKobeMatching),
			th: copy(mjAndKobeMatching)
		}
	},
	// 'application/json;type=textEntry' : {
	// 	    description: 'Text Entry Question',
	// 	    components: {
	// 		    player: TextEntryPlayer,
	// 		    customizer: TextEntryCustomizer
	// 	    },
	// 	    newItemSchemas: {
	//          default: {
	// 	            name: 'Unnamed Text Entry Item',
	// 	            question: 'Your Question Here',
	//          },
	//          th: {
	// 	            name: 'Unnamed Text Entry Item',
	// 	            question: 'THAI Your Question Here',
	//          }
	// 	     }
	// },
	'application/json;type=rearrange-items' : {
		description: 'rearrange-question',
		components: {
			player: RearrangePlayer,
			customizer: RearrangeCustomizer
		},
		newItemSchemas: {
			default: {
				name: 'New Rearrange Item',
				instructions: 'rearrange instructions here...',
				images: [],
				audioId: null
				},
			th: {
				name: 'THAI Rearrange Item',
				instructions: 'rearrange instructions here...',
				images : [],
				audioId: null
			}

		}
	},
	'application/json;type=select-from-pairs' : {
		description: 'select-from-pairs-question',
		components: {
			player: SelectFromPairsPlayer,
			customizer: SelectFromPairsCustomizer
		},
		newItemSchemas: {
			default: copy(monumentPairs),
			th: copy(monumentPairs)
		}
	},
	'application/json;type=sequence' : {
		description: 'sequence-builder',
		components: {
			player: SequencePlayer,
			customizer: SequenceCustomizer
		},
		newItemSchemas: {
			default: copy(defaultSequence),
			th: copy(defaultSequence)
		}
	},
}

let sequenceImportableTypes = Object.keys(questionTypes)
	.filter(item => !item.includes('sequence'))
sequenceImportableTypes.push('application/json;type=karel-task&version=1.0.1')
// note not including karel maps

export { sequenceImportableTypes }
export default questionTypes
