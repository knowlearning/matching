export default {
	'application/json;type=matching' : {
		description: 'Simple Matching Question',
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
		newItemSchema: {
			name: 'Unnamed Text Entry Item',
			question: 'Your Question Here',
			answer: ''
		}
	}
}