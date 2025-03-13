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
import MarkdownWithQuestionsCustomizer from '../components/MarkdownWithQuestions/Customizer.vue'
import MarkdownWithQuestionsPlayer from '../components/MarkdownWithQuestions/Player.vue'
import TrueFalseCustomizer from '../components/TrueFalse/Customizer.vue'
import TrueFalsePlayer from '../components/TrueFalse/Player.vue'
import FillInTheBlankCustomizer from '../components/FillInTheBlank/Customizer.vue'
import FillInTheBlankPlayer from '../components/FillInTheBlank/Player.vue'
import LikertCustomizer from '../components/Likert/Customizer.vue'
import LikertPlayer from '../components/Likert/Player.vue'


import mjAndKobeMatching from './demo-questions/mjAndKobeMatching.js'
import multipleChoiceDefault from './demo-questions/multipleChoiceDefault.js'
import butterflyOrdering from './demo-questions/butterflyOrdering.js'
import monumentPairs from './demo-questions/monumentPairs.js'
import defaultMarkdownWithQuestions from './demo-questions/defaultMarkdownWithQuestions.js'
import defaultSequence from './demo-questions/defaultSequence.js'
import defaultTrueFalse from './demo-questions/defaultTrueFalse.js'
import defaultFillInTheBlank from './demo-questions/defaultFillInTheBlank.js'
import defaultLikert from './demo-questions/defaultLikert.js'



const copy = x => JSON.parse(JSON.stringify(x))

const questionTypes = {
	'application/json;type=matching' : {
		description: 'matching-question',
		components: {
			player: MatchingPlayer,
			customizer: MatchingCustomizer
		},
		newItemGenerator: mjAndKobeMatching,
		sample: '0c014c40-fb93-11ee-a57d-19b2f6cf4b58'
	},
	'application/json;type=multiple-choice' : {
		description: 'multiple-choice-question',
		components: {
			player: MultipleChoicePlayer,
			customizer: MultipleChoiceCustomizer
		},
		newItemGenerator: multipleChoiceDefault,
		sample: '1a1c2410-3d4e-11ef-8319-adf6059912ac'
	},
	'application/json;type=rearrange-items' : {
		description: 'rearrange-question',
		components: {
			player: RearrangePlayer,
			customizer: RearrangeCustomizer
		},
		newItemGenerator: butterflyOrdering,
		sample: '01fd0ef0-fb93-11ee-a57d-19b2f6cf4b58'
	},
	'application/json;type=select-from-pairs' : {
		description: 'select-from-pairs-question',
		components: {
			player: SelectFromPairsPlayer,
			customizer: SelectFromPairsCustomizer
		},
		newItemGenerator: monumentPairs,
		sample: '13d0f650-fb93-11ee-a57d-19b2f6cf4b58'
	},
	'application/json;type=markdown-with-questions' : {
		description: 'markdown-with-questions-lower',
		components: {
			player: MarkdownWithQuestionsPlayer,
			customizer: MarkdownWithQuestionsCustomizer
		},
		newItemGenerator: defaultMarkdownWithQuestions,
		sample: '694de7f0-bc9f-11ef-af19-8b6bb634a52d'
	},
	'application/json;type=true-false' : {
		description: 'true-false-question',
		components: {
			player: TrueFalsePlayer,
			customizer: TrueFalseCustomizer
		},
		newItemGenerator: defaultTrueFalse,
		sample: 'def97450-3ece-11ef-812b-ebc8865fd329'
	},
	'application/json;type=sequence' : {
		description: 'sequence-builder',
		components: {
			player: SequencePlayer,
			customizer: SequenceCustomizer
		},
		newItemGenerator: defaultSequence,
		sample: '92719c10-026b-11ef-8b1d-b914e5d38307'
	},
	'application/json;type=fill-in-the-blank' : {
		description: 'fill-in-the-blank-question',
		components: {
			player: FillInTheBlankPlayer,
			customizer: FillInTheBlankCustomizer
		},
		newItemGenerator: defaultFillInTheBlank,
		sample: 'def97450-3ece-11ef-812b-ebc8865fd329'
	},
	'application/json;type=likert' : {
		description: 'likert-question',
		components: {
			player: LikertPlayer,
			customizer: LikertCustomizer
		},
		newItemGenerator: defaultLikert,
		// sample: 'def97450-3ece-11ef-812b-ebc8865fd329'
	},
}

let sequenceImportableTypes = Object.keys(questionTypes)
	.filter(item => !item.includes('sequence'))
sequenceImportableTypes.push('application/json;type=karel-task&version=1.0.1')
// note not including karel maps

export { sequenceImportableTypes }
export default questionTypes
