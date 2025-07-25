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

import defaultFillInTheBlank from './default-item-templates/defaultFillInTheBlank.js'
import defaultLikert from './default-item-templates/defaultLikert.js'
import defaultMarkdownWithQuestions from './default-item-templates/defaultMarkdownWithQuestions.js'
import defaultMatching from './default-item-templates/defaultMatching.js'
import defaultMultipleChoice from './default-item-templates/defaultMultipleChoice.js'
import defaultOrderItems from './default-item-templates/defaultOrderItems.js'
import defaultSelectFromPairs from './default-item-templates/defaultSelectFromPairs.js'
import defaultSequence from './default-item-templates/defaultSequence.js'
import defaultTrueFalse from './default-item-templates/defaultTrueFalse.js'

// import mjAndKobeMatching from './demo-questions/mjAndKobeMatching.js'
// import multipleChoiceDefault from './demo-questions/multipleChoiceDefault.js'
// import butterflyOrdering from './demo-questions/butterflyOrdering.js'
// import monumentPairs from './demo-questions/monumentPairs.js'
// import defaultMarkdownWithQuestions from './demo-questions/defaultMarkdownWithQuestions.js'
// import defaultSequence from './demo-questions/defaultSequence.js'
// import defaultTrueFalse from './demo-questions/defaultTrueFalse.js'
// import defaultFillInTheBlank from './demo-questions/defaultFillInTheBlank.js'
// import defaultLikert from './demo-questions/defaultLikert.js'



const copy = x => JSON.parse(JSON.stringify(x))

const questionTypes = {
	'application/json;type=matching' : {
		description: 'matching-question',
		components: {
			player: MatchingPlayer,
			customizer: MatchingCustomizer
		},
		newItemGenerator: defaultMatching,
		sample: '0c014c40-fb93-11ee-a57d-19b2f6cf4b58'
	},
	'application/json;type=multiple-choice' : {
		description: 'multiple-choice-question',
		components: {
			player: MultipleChoicePlayer,
			customizer: MultipleChoiceCustomizer
		},
		newItemGenerator: defaultMultipleChoice,
		sample: '04b0b150-6989-11f0-bbf4-7771fd844dfc'
	},
	'application/json;type=rearrange-items' : {
		description: 'rearrange-question',
		components: {
			player: RearrangePlayer,
			customizer: RearrangeCustomizer
		},
		newItemGenerator: defaultOrderItems,
		sample: '01fd0ef0-fb93-11ee-a57d-19b2f6cf4b58'
	},
	'application/json;type=select-from-pairs' : {
		description: 'select-from-pairs-question',
		components: {
			player: SelectFromPairsPlayer,
			customizer: SelectFromPairsCustomizer
		},
		newItemGenerator: defaultSelectFromPairs,
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
		sample: '612472a0-6989-11f0-bbf4-7771fd844dfc'
	},
	'application/json;type=sequence' : {
		description: 'sequence-builder',
		components: {
			player: SequencePlayer,
			customizer: SequenceCustomizer
		},
		newItemGenerator: defaultSequence,
		sample: 'd352cd50-0354-11ef-93e9-2d92a5e8a142'
	},
	'application/json;type=fill-in-the-blank' : {
		description: 'fill-in-the-blank-question',
		components: {
			player: FillInTheBlankPlayer,
			customizer: FillInTheBlankCustomizer
		},
		newItemGenerator: defaultFillInTheBlank,
		sample: '7506ab20-698a-11f0-bbf4-7771fd844dfc'
	},
	'application/json;type=likert' : {
		description: 'likert-question',
		components: {
			player: LikertPlayer,
			customizer: LikertCustomizer
		},
		newItemGenerator: defaultLikert,
		sample: '8eeaef10-698a-11f0-bbf4-7771fd844dfc'
	},
}

let sequenceImportableTypes = Object.keys(questionTypes)
	.filter(item => !item.includes('sequence'))
sequenceImportableTypes.push('application/json;type=karel-task&version=1.0.1')
// note not including karel maps

export { sequenceImportableTypes }
export default questionTypes
