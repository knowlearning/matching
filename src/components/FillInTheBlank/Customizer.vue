<template>
  <div class="customizer">

    <AbsolutePreviewAndItemId :id="props.id" />

    <NameAndInstructions 
      hideInstructions
      :content="state"
      style="width: 420px; margin: 8px auto;"
    />

    <div class="input-wrapper-width">
      <v-textarea
        id="prompt-input"
        v-model="inputText"
        @input="processInput"
        :placeholder="t('fill-in-the-blank-prompt-placeholder')"
        class="prompt-input"
      ></v-textarea>
    </div>

    <div class="input-wrapper-width" v-if="state.blanks.length">
      <h3>{{ t('blanks') }}:</h3>
      <div
        v-for="(_, i) in answers"
        :key="i"
        class="answer-item"
      >
        <v-text-field :id="`answer-${i}`"
          v-model="answers[i]"
          :label="`${t('blank')} ${i + 1}`"
          placeholder="color | colour"
          class="answer-input"
        />
      </div>
    </div>

    <CustomizeFeedback
      :feedback="state.feedback"
      style="width: 420px; margin: 8px auto;"
    />

    <div class="preview" v-if="state.prompt">
      <h3>{{ t('preview-titlecase') }}:</h3>
      <div>{{ inputText }}</div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import CustomizeFeedback from '../SharedCustomizerComponents/CustomizeFeedback.vue'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }


const props = defineProps(['id'])
const state = reactive( await Agent.state(props.id) )

const inputText = ref(state.prompt)

if (!state.blanks) state.blanks = []
const answers = reactive(state.blanks)

watch(inputText, processInput)
watch(() => state.blanks.length, updateTranslationPaths)

function processInput() {
  const underscoreSegments = [ ...inputText.value.matchAll(/_{1,}/g) ]

  // Ensure answers array length matches the number of underscore segments
  const numBlanks = underscoreSegments.length
  while (answers.length > numBlanks) { answers.pop() } // elim old answers, if any
  while (answers.length < numBlanks) { answers.push("") } // blanks for new answers, if any    
  state.prompt = inputText.value.trim()
}

function updateTranslationPaths() {
    let paths = [
        [ 'name' ],
        [ 'prompt' ],
        [ 'feedback', 'correct' ],
        [ 'feedback', 'incorrect' ]
    ]
    state.blanks.forEach((_,i) => paths.push([ 'blanks', i ]))
    state.translations.paths = paths
}

</script>

<style scoped>
.customizer {
  position: relative;
  height: 100%;
  margin: 0 auto;
  padding-top: 56px;
  flex-direction: column;
  align-items: center;
}
.input-wrapper-width {
  width: 420px;
  margin: 8px auto;
}

.preview {
  white-space: pre-wrap;
}
</style>