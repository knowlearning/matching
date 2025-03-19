export default ({ source_language }) => ({
    "name": "New Item",
    "instructions": "",
    "audioId" : null,
    "feedback" : {
        "correct" : null,
        "incorrect" : null
    },
    "rows": [],
    translations: [
        [ "name" ],
        [ "instructions" ],
        [ "feedback", "correct" ],
        [ "feedback", "incorrect" ],
        //     [ "rows", 0, "audioId" ],   AUTO ADDED AS ROWS Created or DestroyedRUD
        //     [ "rows", 0, "choices", 0, "content" ],
        //     [ "rows", 0, "choices", 1, "content" ],
        //     [ "rows", 1, "audioId" ],
        //     [ "rows", 1, "choices", 0, "content" ],
        //     [ "rows", 1, "choices", 1, "content" ],
        //     [ "rows", 2, "audioId" ],
        //     [ "rows", 2, "choices", 0, "content" ],
        //     [ "rows", 2, "choices", 1, "content" ]
    ]
})
