export default ({ source_language = 'en' }) => ({
    name: 'New Likert Queestion',
    instructions: 'Enter your Likert Prompt',
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
