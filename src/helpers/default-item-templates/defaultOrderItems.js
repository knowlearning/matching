export default ({ source_language }) => ({
    "name": "New Item",
    "instructions": "",
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    "images": [],
    "audioId": null,
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
