import MatchingPlayer from '../components/Matching/Player.vue'
import MatchingCustomizer from '../components/Matching/Customizer.vue'
import MultipleChoicePlayer from '../components/MultipleChoice/Player.vue'
import MultipleChoiceCustomizer from '../components/MultipleChoice/Customizer.vue'
import TextEntryPlayer from '../components/TextEntry/Player.vue'
import TextEntryCustomizer from '../components/TextEntry/Customizer.vue'
import RearrangeCustomizer from '../components/Rearrange/Customizer.vue'
import RearrangePlayer from '../components/Rearrange/Player.vue'
import SequenceCustomizer from '../components/Sequence/Customizer.vue'
import SequencePlayer from '../components/Sequence/Player.vue'
import SelectFromPairsCustomizer from '../components/SelectFromPairs/Customizer.vue'
import SelectFromPairsPlayer from '../components/SelectFromPairs/Player.vue'
import MarkdownCustomizer from '../components/Markdown/Customizer.vue'
import MarkdownPlayer from '../components/Markdown/Player.vue'
import TrueOrFalseCustomizer from '../components/TrueOrFalse/Customizer.vue'
import TrueOrFalsePlayer from '../components/TrueOrFalse/Player.vue'

import mjAndKobeMatching from './demo-questions/mjAndKobeMatching.js'
import multipleChoiceDefault from './demo-questions/multipleChoiceDefault.js'
import butterflyOrdering from './demo-questions/butterflyOrdering.js'
import monumentPairs from './demo-questions/monumentPairs.js'
import defaultMarkdown from './demo-questions/defaultMarkdown.js'
import defaultSequence from './demo-questions/defaultSequence.js'
import TrueOrFalse from './demo-questions/defaultTrueFalse.js'




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
		},
		sample: '0c014c40-fb93-11ee-a57d-19b2f6cf4b58'
	},
	'application/json;type=multiple-choice' : {
		description: 'multiple-choice-question',
		components: {
			player: MultipleChoicePlayer,
			customizer: MultipleChoiceCustomizer
		},
		newItemSchemas: {
			default: copy(multipleChoiceDefault),
			th: copy(multipleChoiceDefault)
		},
		sample: '1a1c2410-3d4e-11ef-8319-adf6059912ac'
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
			default: copy(butterflyOrdering),
			th: copy(butterflyOrdering)
		},
		sample: '01fd0ef0-fb93-11ee-a57d-19b2f6cf4b58'
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
		},
		sample: '13d0f650-fb93-11ee-a57d-19b2f6cf4b58'
	},
	'application/json;type=markdown' : {
		description: 'markdown-item',
		components: {
			player: MarkdownPlayer,
			customizer: MarkdownCustomizer
		},
		newItemSchemas: {
			default: copy(defaultMarkdown),
			th: copy(defaultMarkdown)
		},
		sample: '009e59c0-38d2-11ef-b713-21184efafe0d'
	},
	'application/json;type=true-false' : {
		description: 'true-false-question',
		components: {
			player: TrueOrFalsePlayer,
			customizer: TrueOrFalseCustomizer
		},
		newItemSchemas: {
			default: copy(TrueOrFalse),
			th: copy(TrueOrFalse)
		},
		sample: 'def97450-3ece-11ef-812b-ebc8865fd329'
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
		},
		sample: '92719c10-026b-11ef-8b1d-b914e5d38307'
	},
}

let sequenceImportableTypes = Object.keys(questionTypes)
	.filter(item => !item.includes('sequence'))
sequenceImportableTypes.push('application/json;type=karel-task&version=1.0.1')
// note not including karel maps

export { sequenceImportableTypes }
export default questionTypes
