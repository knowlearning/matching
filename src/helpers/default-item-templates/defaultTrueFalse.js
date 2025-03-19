export default ({ source_language = 'en' }) => ({
    name: 'New Item',
    instructions: "",
    answer: true,
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    translations: {
        source_language,
        paths: [
            [ 'name' ],
            [ 'instructions' ],
            [ 'feedback', 'correct' ],
            [ 'feedback', 'incorrect' ]
        ]
    }
})
