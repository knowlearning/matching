<template>
    <div class="player">
        <div>
            <h1>Item Configuration</h1>
            {{ itemState }}
        </div>
        <div v-if="itemState.configuration">
            <h1>Player state</h1>
            {{ playState }}
            <h1>Left</h1>
            <div
              v-for="{ id } in leftImages"
              :key="id"
              @click="playState.persistentKlState.selected[id] = !playState.persistentKlState.selected[id]"
            >
                {{ id }}
                <span v-if="playState.persistentKlState.selected[id]">Woo!</span>
            </div>
            <h1>RIGHT!</h1>
            <div
              v-for="{ id } in rightImages"
              :key="id"
              @click="playState.persistentKlState.selected[id] = !playState.persistentKlState.selected[id]"
            >
                {{ id }}
                <span v-if="playState.persistentKlState.selected[id]">Woo!</span>
            </div>
        </div>
        <div v-else>Loading...</div>
        <!--
        <h3 v-if="data.content.instructions">{{ data.content.instructions }}</h3>
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
        -->
    </div>
</template>

<script setup>
import { defineProps, ref, reactive, computed } from 'vue'
import klImage from './kl-image.vue'

const props = defineProps(['id'])
const data = reactive({ content: null })
const audioPlaying = ref(false)

const itemState = reactive({ configuration: null })
const playState = reactive({ persistentKlState: null })

const leftImages = computed(() => {
    if (itemState.configuration) {
        return itemState.configuration.images.filter(({ type }) => type === 'left')
    }
    else return []
})

const rightImages = computed(() => {
    if (itemState.configuration) {
        return itemState.configuration.images.filter(({ type }) => type === 'right')
    }
    else return []
})

Agent
  .state(`word-select-player-state-${props.id}`)
  .then(state => {
    if (!state.selected) state.selected = {}

    playState.persistentKlState = state
  })

Agent
  .state(props.id)
  .then(state => itemState.configuration = state)

</script>

