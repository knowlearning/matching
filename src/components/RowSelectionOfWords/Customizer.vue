<template>
  <div class="row-customizer" v-if="data.content">
    <div
      v-for="choice,i in data.content.choices"
      :key="`choice-${i}`"
      :class="{ choice: true, correct: choice.correct }"
      @click="toggleCorrect"
    >
      <div class="choice-inner">
        <KlImage v-if="isUUID(choice.content)"
          :id="choice.content"
          :size="{ width: '100px', height: '100px' }"
        />
        <div v-else>{{ choice.content }}</div>
      </div>

      <div>
        <button
          class="edit-button"
          @click.stop="changeChoice(i)"
        ><i class="fas fa-edit"></i></button>
        <button
          class="edit-button"
          @click.stop="uploadImage(i)"
        ><i class="fas fa-upload"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { validate as isUUID } from 'uuid'
import { inputSwal, unsupportedTypeSwal } from '../../helpers/swallows.js'
import KlImage from '../kl-image.vue'

const props = defineProps(['id'])
const data = reactive({ content: null })

Agent
  .state(props.id)
  .then(state => data.content = state )

async function changeChoice(i) {
  const { isConfirmed, value } = await inputSwal(data.content.choices[i].content)
  if (!isConfirmed) return
  if (!isUUID(value)) {
    data.content.choices[i].content = value
  } else { // check if image type
    const { active_type } = await Agent.metadata(value)
    if (!active_type || !active_type.startsWith('image')) {
      await unsupportedTypeSwal(value, active_type)
    } else {
      data.content.choices[i].content = value
    }
  }
}
function toggleCorrect() {
  // toggle both
  data.content.choices[0].correct = !data.content.choices[0].correct
  data.content.choices[1].correct = !data.content.choices[1].correct
}
async function uploadImage(i) {
  try {
    const id = await Agent.upload({ browser: true, accept: 'image/*' })
    data.content.choices[i].content = id
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('Error uploading image.')
  }
}
</script>

<style scoped>
.row-customizer {
  width: 400px;
  height: 200px;
  border: 2px solid lightgrey;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.row-customizer .choice {
  width: 170px;
  height: 180px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.correct {
  background: lightseagreen;
}
.choice-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}
button.edit-button {
  width: fit-content;
}
button.edit-button:hover {
  background: #eeeeee;
}
</style>
