<template>
    <div class="player">
    <h3 v-if="itemState.configuration">{{ itemState.configuration.instructions }}</h3>
    <div>
        <div class="volume-icon" @click="toggleAudioPlayback">
            <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'"/>
        </div>
        <div class="image-row">
            <div class="column-left">
                <kl-image
                    v-for="image in leftImages"
                    :key="image.id"
                    :id="image.id"
                    :class="{ selected: playState.persistentKlState.selected[image.id] }"
                    @click="toggleImageSelection(image.id)"
                    class="images"
                />
            </div>
            <div class="column-right">
                <kl-image
                    v-for="image in rightImages"
                    :key="image.id"
                    :id="image.id"
                    :class="{ selected: playState.persistentKlState.selected[image.id] }"
                    @click="toggleImageSelection(image.id)"
                    class="images"   
                />
            </div>
        </div>
    </div>
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

<style scoped>
.player {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.image-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  object-fit: contain;
}
.column-left, .column-right {
  display: flex;
  flex-direction: column;
  align-items: center;
} 
.images {
    background: antiquewhite;
    object-fit: contain;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 15px;
    object-fit: contain;
}
.volume-icon {
  cursor: pointer;
  font-size: 2em;
  margin-bottom: 10px;
}
</style>

