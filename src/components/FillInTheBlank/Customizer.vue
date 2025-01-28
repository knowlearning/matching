<template>
  <div class="customizer">

    <AbsolutePreviewAndItemId :id="props.id" />

    <NameAndInstructions 
      hideInstructions
      :content="state"
      style="width: 420px; margin: 8px auto;"
    />

    <div class="input-section">
      <h2>Fill in the Blank Customizer</h2>
      <textarea
        id="prompt-input"
        v-model="inputText"
        @input="processInput"
        placeholder="Example question: The closest planet to the sun is ____, and the furthest is ____."
        class="prompt-input"
      ></textarea>
      <h3 v-if="inputText">Preview:</h3>
      <div class="preview" v-if="inputText">{{ inputText }}</div>
    </div>

    <div class="answers-section">
      <h3>Define answers:</h3>
      <div
        v-for="(_, i) in answers"
        :key="i"
        class="answer-item"
      >
        <label :for="`answer-${i}`">Blank {{ i + 1 }}:</label>
        <input
          :id="'answer-' + i"
          v-model="answers[i]"
          placeholder="color | colour"
          class="answer-input"
        />
      </div>
    </div>

    <button @click="outputResult" class="output-button">Generate Question</button>

    <CustomizeFeedback
      :feedback="state.feedback"
      style="width: 420px; margin: 8px auto;"
    />

  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";

import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import CustomizeFeedback from '../SharedCustomizerComponents/CustomizeFeedback.vue'



const props = defineProps(['id'])
const state = reactive( await Agent.state(props.id) )

const inputText = ref(state.prompt)

if (!state.blanks) state.blanks = []
const answers = reactive(state.blanks)

watch(inputText, processInput)

function processInput() {
  const underscoreSegments = [ ...inputText.value.matchAll(/_{1,}/g) ]

  // Ensure answers array length matches the number of underscore segments
  const numBlanks = underscoreSegments.length
  while (answers.length > numBlanks) { answers.pop() } // elim old answers, if any
  while (answers.length < numBlanks) { answers.push("") } // blanks for new answers, if any
    
  state.prompt = inputText.value.trim()
  // TODO include update to translation of blanks array.
}

</script>

<style scoped>
.customizer {
  font-family: Arial, sans-serif;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.input-section {
  margin-bottom: 1rem;
}

.prompt-input {
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  font-size: 1rem;
}

.prompt-input::placeholder {
  color: #d3d3d3;
}

.answers-section {
  margin-bottom: 1rem;
}

.answer-item {
  margin-bottom: 0.5rem;
}

.answer-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}

.answer-input::placeholder {
  color: #d3d3d3;
}

.output-button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.output-button:hover {
  background-color: #45a049;
}

.preview {
  white-space: pre-wrap;
}
</style>