export default {
    name: 'McDonald\'s',
    instructions: "Match the McDonald's Items",
    fromChoices: [
      {
        type: 'image',
        imageId: 'a3855dc0-b99b-11ee-94ca-d301122f8933',
        nodeId: 'd00b2c30-b99b-11ee-94ca-d301122f8000'
      },
      {
        type: 'image',
        imageId: 'afdb2c30-b99b-11ee-94ca-d301122f8933',
        nodeId: 'd00b2c30-b99b-11ee-94ca-d301122f8001'
      },
      {
        type: 'image',
        imageId: 'a63a1d80-b99b-11ee-94ca-d301122f8933',
        nodeId: 'd00b2c30-b99b-11ee-94ca-d301122f8002'
      }
    ],
    toChoices: [
      {
        type: 'text',
        textContent: 'Shamrock Shake, Choice One but I don\'t know what happens when the text choice gets really long.',
        nodeId: 'd00b2c30-b99b-11ee-94ca-d301122f8003'
      },
      {
        type: 'text',
        textContent: 'Big Mac',
        nodeId: 'd00b2c30-b99b-11ee-94ca-d301122f8004'
      },
      {
        type: 'text',
        textContent: 'McNuggets',
        nodeId: 'd00b2c30-b99b-11ee-94ca-d301122f8005'
      }
    ],
    answerConnections: [
      [ 'd00b2c30-b99b-11ee-94ca-d301122f8000', 'd00b2c30-b99b-11ee-94ca-d301122f8003' ],
      [ 'd00b2c30-b99b-11ee-94ca-d301122f8005', 'd00b2c30-b99b-11ee-94ca-d301122f8001' ],
      ['d00b2c30-b99b-11ee-94ca-d301122f8002', 'd00b2c30-b99b-11ee-94ca-d301122f8004' ]
    ]
  }