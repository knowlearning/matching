<script setup>
import { ref, computed } from "vue";
import defaultQuestion from '../../helpers/demo-questions/defaultFillInTheBlank.js'

const props = defineProps({
  question: {
    type: Object,
    default: () => defaultQuestion(),
  },
})

const userAnswers = ref(Array(props.question.answers.length).fill(""))

// Computed property to parse the prompt
const parsedPrompt = computed(() => props.question.prompt.split(/(_+)/g))

// Helper functions
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

const checkAnswers = () => {
  const allCorrect = userAnswers.value.every((ans, i) => {
    const validAnswers = props.question.answers[i]
      .split("|") // Split the pipe-delimited string into individual answers
      .map((answer) => answer.trim().toLowerCase())

    return validAnswers.some(
      (validAnswer) => validAnswer === ans.trim().toLowerCase()
    )
  })

  alert(allCorrect ? "Woo!" : "Boo!")
};
</script>

<template>
  <div class="container">
    <p class="paragraph">
      <span v-for="(seg, i) in parsedPrompt" :key="i">
        <span v-if="!areUnderscores(seg)">{{ seg }}</span>
        <input
          v-else
          type="text"
          v-model="userAnswers[mapSegmentIndexToAnswerIndex(i)]"
          class="blank-input"
        />
      </span>
    </p>
    <button class="submit-button" @click="checkAnswers">Submit</button>
  </div>
</template>

<style>
.container {
  padding: 1rem;
}

.paragraph {
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

.submit-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: darkblue;
}
</style>