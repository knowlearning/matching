export default ({ source_language = 'en' }) => ({
	name: 'New Item',
	items: [ ],
	quizMode: false,
	translations: {
		source_language,
		paths: [
			[ 'name' ]
		]
	}
})
