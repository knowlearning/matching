export default ({ source_language }) => ({
    "name": "New Item",
    "instructions": "",
    "textIsPlayable" : true,
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    "fromChoices": [],
    "toChoices": [],
    "answerConnections": [],
    translations: {
        source_language,
        paths: [
            [ "name" ],
            [ "instructions" ],
            [ "feedback", "correct" ],
            [ "feedback", "incorrect" ]
        ]
    }
})
