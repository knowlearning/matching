<script setup>
import { ref, reactive } from 'vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import translateScopeId from '../../helpers/translateScopeId.js'

import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
const language = store.getters.language()
const questionDef = await translateScopeId(props.id, language)

const runstate = reactive(await Agent.state(`runstate-${props.id}`))

if (!runstate.answers || runstate.answers.length !== questionDef.blanks.length) {
  runstate.answers = Array(questionDef.blanks.length).fill("")
}

const parsedPrompt = ref( questionDef.prompt.split(/(_+)/g) )

setTimeout(() => {
    runstate.xapi = {
        actor: props.id,
        verb: 'initialized',
        object: props.id,
        extensions: { language }
    }
})

const areUnderscores = (str) => /^_+$/.test(str)
const mapSegmentIndexToAnswerIndex = (i) => {
  let ansIndex = 0
  for (let j = 0; j < i; j++) {
    if (areUnderscores(parsedPrompt.value[j])) {
      ansIndex++
    }
  }
  return ansIndex
}

async function handleSubmit() {
  const success = runstate.answers.every((ans, i) => {
    return questionDef.blanks[i]
      .split("|") // Split the pipe-delimited string into individual answers
      .map(ans => ans.trim().toLowerCase())
      .some( validAnswer => validAnswer === ans.trim().toLowerCase() )
  })

  const message = getMessage(success)

  runstate.xapi = {
    verb: 'submitted',
    object: props.id,
    result: { success },
    extensions: { message }
  }

  const notInWrapper = (await Agent.environment()).context.length === 1
  if (notInWrapper) await itemFeedbackSwal(t, success, message)

}

function getMessage(isCorrect) {
    if (isCorrect && questionDef.feedback?.correct) return questionDef.feedback.correct 
    else if (!isCorrect && questionDef.feedback?.incorrect) return questionDef.feedback.incorrect
    else return undefined
}

</script>

<template>
  <div class="player">
    <p class="paragraph">
      <span v-for="(seg, i) in parsedPrompt" :key="i">
        <span v-if="!areUnderscores(seg)">{{ seg }}</span>
        <input v-else class="blank-input"
          :placeholder="t('blank')"
          v-model="runstate.answers[mapSegmentIndexToAnswerIndex(i)]"
        />
      </span>
    </p>

    <v-btn
      color="green"
      @click="handleSubmit"
    >
      {{ t('submit') }}
    </v-btn>

  </div>
</template>

<style>
.paragraph {
  margin: 16px 0;
  font-size: 1.125rem;
  line-height: 1.75;
  white-space: pre-wrap;
}

.blank-input {
  display: inline-block;
  border: none;
  border-bottom: 2px solid gray;
  width: 4rem;
  text-align: center;
  margin: 0 0.25rem;
  outline: none;
}

.blank-input:focus {
  border-bottom-color: blue;
}
.blank-input::placeholder {
  font-size: 0.75rem; /* Adjust the size as needed */
  color: #aaa; /* Optional: change the color for the placeholder */
}

</style>