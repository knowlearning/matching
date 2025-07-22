# PILA Create

## xAPI for Sequence Spec

```
  {
    performance: [
      {
        id: item id,
        sessions: [
          { enter: Int, exit: Int, mode: String }
        ],
        correct: nullable boolean,
        active: boolean,
        attempts: Int
      }
    ]
  }
```