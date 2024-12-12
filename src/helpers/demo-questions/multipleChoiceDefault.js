export default {
    "name": "New Multiple Choice",
    "instructions": "Your Instructions Here...",
    "selectMultiple" : false,
    "audioId": null,
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    "choices": [
        {
            "value": "Choice 1",
            "isCorrect" : true
        },
        {
            "value": "Choice 2",
            "isCorrect" : false
        },
        {
            "value": "Choice 3",
            "isCorrect" : false
        }
    ],
    "translations": {
        "source_language": "en-us",
        "paths": [
            [ "name" ],
            [ "instructions" ],
            [ "feedback", "correct" ],
            [ "feedback", "incorrect" ],
            [ "choices", 0, "value" ],
            [ "choices", 1, "value" ],
            [ "choices", 2, "value" ]
        ]
    }
}