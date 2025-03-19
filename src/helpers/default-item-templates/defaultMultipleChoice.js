export default ({ source_language = 'en' }) => ({
    "name": "New Item",
    "instructions": "",
    "selectMultiple" : false,
    "audioId": null,
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    "choices": [
        {
            "value": "A",
            "isCorrect" : true
        },
        {
            "value": "B",
            "isCorrect" : false
        },
        {
            "value": "C",
            "isCorrect" : false
        }
    ],
    translations: {
        source_language,
        paths: [
            [ "name" ],
            [ "instructions" ],
            [ "feedback", "correct" ],
            [ "feedback", "incorrect" ],
            [ "choices", 0, "value" ],
            [ "choices", 1, "value" ],
            [ "choices", 2, "value" ]
        ]
    }
})
