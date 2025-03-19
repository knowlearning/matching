export default ({ source_language = 'en' }) => ({
    name: 'New Item',
    instructions: '',
    category: 'abstract',
    translations: {
        source_language,
        paths: [
            [ 'name' ],
            [ 'instructions' ]
            // category / values NOT translated here, part of question
        ]
    }
})
