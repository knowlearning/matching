<script setup>
import { ref } from 'vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])
const questionDef = await Agent.state(props.id)

const userAnswers = ref(Array(questionDef.blanks.length).fill(""))
const parsedPrompt = ref( questionDef.prompt.split(/(_+)/g) )

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
  const correct = userAnswers.value.every((ans, i) => {
    return questionDef.blanks[i]
      .split("|") // Split the pipe-delimited string into individual answers
      .map(ans => ans.trim().toLowerCase())
      .some( validAnswer => validAnswer === ans.trim().toLowerCase() )
  })

  if (Agent.embedded) Agent.close({
      success: correct,
      message: getMessage(correct)
  })
  else await itemFeedbackSwal(t, correct, getMessage(correct))
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
          :placeholder="`Blank`"
          v-model="userAnswers[mapSegmentIndexToAnswerIndex(i)]"
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