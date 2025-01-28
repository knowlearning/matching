export default ({ source_language = 'en' }) => ({
    name: 'New Fill in the Blank Question',
    prompt: 'Tony _____ was the leader of the British _____ Party from 1994 to 2007.',
    blanks: [
        'Blair',
        'Labor | Labour'
    ],
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    translations: {
        source_language,
        paths: [
            [ 'prompt' ],
            [ 'blanks', 0 ],
            [ 'blanks', 1 ],
            [ 'feedback', 'correct' ],
            [ 'feedback', 'incorrect' ]
        ]
    }
})
