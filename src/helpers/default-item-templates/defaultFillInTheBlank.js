export default ({ source_language = 'en' }) => ({
    name: 'New Item',
    prompt: '',
    blanks: [ ],
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    translations: {
        source_language,
        paths: [
            [ 'name' ],
            [ 'prompt' ],
            [ 'feedback', 'correct' ],
            [ 'feedback', 'incorrect' ]
        ]
    }
})
