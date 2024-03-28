<template>
    <div class="player">
        <!-- <h3 v-if="data.content.instructions">{{ data.content.instructions }}</h3> -->
        <div>
            <div class="volume-icon" @click="toggleAudioPlayback">
                <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'"/>
            </div>
            <div class="image-row">
                <div class="column-left">
                    <div v-for="(option, index) in imageData[0]" :key="index" class="image-and-buttons-left">
                        <p style="color: black;">{{ index + 1 }}) <kl-image :id="option.id" /></p>
                        <div class="option-circle" @click="isSelected(index, 0)">
                            <i :class="{ 'fas fa-check-circle': isSelected(index, 0), 'far fa-circle': !isSelected(index, 0) }" style="font-size: 1.5em; color: black;"></i>
                        </div>
                    </div>
                </div>
                <div class="column-right">
                    <div v-for="(option, index) in imageData[1]" :key="index" class="image-and-buttons-right">
                        <p style="color: black;">{{ index + 1 }}) <kl-image :id="option.id" /></p>
                        <div class="option-circle" @click="isSelected(index, 1)">
                            <i :class="{ 'fas fa-check-circle': isSelected(index, 1), 'far fa-circle': !isSelected(index, 1) }" style="font-size: 1.5em; color: black;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, reactive } from 'vue'
import klImage from './kl-image.vue'

const props = defineProps(['id'])
const data = reactive({ content: null })
const imageData = reactive([[], []])
const audioPlaying = ref(false)

Agent
  .state(`word-select-player-state-${props.id}`)
  .then(state => {
    if (!state.imageData) state.imageData = [[], []]
    if (!state.selected) state.selected = [[], []]
    data.content = state
    imageData[0] = state.imageData[0]
    imageData[1] = state.imageData[1]
  })
</script>

