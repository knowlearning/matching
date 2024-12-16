export default ({ source_language = 'en' }) => ({
    name: 'New True/False Question',
    instructions: "The Earth is the third planet from the Sun.",
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
