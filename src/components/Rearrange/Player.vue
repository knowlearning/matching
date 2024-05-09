<template>
<div class="player">
    <div
        v-if="item?.instructions"
        class="instructions"
    >
        <span class="instructions-prefix">{{ t('instructions') }}:</span>
        {{ item.instructions }}
    </div>

    <div
        class="audio-play-area"
        v-if="data.content?.audioId"
    >
        <i 
            :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" 
            style="cursor: pointer;"
            @click="toggleAudioPlayback"
        />
        <br>
        <input
            type="range"
            min="0"
            :max="audio ? audio.duration : 100"
            v-model="currentAudioTime"
            @input="seekAudio"
        >
    </div>

    <div class="drag-areas-wrapper">
        <div class="target-items">
            <div
                v-for="(item, i) in userOrderedItems"
                :key="`source-spot-${i}-${item?.id}`"
                
                @drop="dropImage(i, userOrderedItems)"
                @dragover.prevent
            >
                <KlImage v-if="item?.id"
                    class="image"
                    :id="item.id"
                    :draggable="item?.id"
                    @dragstart="draggingId = item.id"
                />
                <div
                    v-else
                    class="image-placeholder"
                >{{ i+1 }}.</div>
            </div>
        </div>
        <div class="source-items">
            <div
                v-for="(item, i) in sourceItems"
                :key="`source-spot-${i}-${item?.id}`"
                class="image-spot"
                :style="{ backgroundImage: item?.id ? `url(${item.id})` : '' }"
                @drop="dropImage(i, sourceItems)"
                @dragover.prevent
            >
                <KlImage v-if="item?.id"
                    class="image"
                    :id="item.id"
                    :draggable="item?.id"
                    @dragstart="draggingId = item.id"
                />
                <div v-else class="image-placeholder">?</div>

            </div>
        </div>

    </div>

    <v-btn color="green" @click="handleSubmit">
        {{ t('submit') }}
    </v-btn>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import KlImage from '../kl-image.vue'
import { useStore } from 'vuex'
const store = useStore()
const copy = x => JSON.parse(JSON.stringify(x))
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const item = await Agent.state(props.id)

const sourceItems = reactive(shuffle(item.images))
const userOrderedItems = reactive(new Array(item.images.length).fill(null))

const draggingId = ref(null)

const audioPlaying = ref(false)
let audio = null
const currentAudioTime = ref(0)

const data = ref({ content: null })
Agent
    .state(props.id)
    .then(state => {
        if (!state.name) state.name = ''
        if (!state.instructions) state.instructions = ''
        if (!state.images) state.images = []
        data.value.content = state
  })

function shuffle(arr) {
    const arrCopy = copy(arr)
    for (let i = arrCopy.length - 1; i > 0; i--) {
        const randIndex0toI = Math.floor(Math.random() * (i + 1))
        const temp = arrCopy[i]
        arrCopy[i] = arrCopy[randIndex0toI]
        arrCopy[randIndex0toI] = temp
    }
    return arrCopy
}

async function toggleAudioPlayback() {
    const audioId = data.value.content.audioId;
    if (!audioId) return;
    const audioUrl = await Agent.download(audioId).url();
    if (!audio) {
        audio = new Audio(audioUrl);
        audio.addEventListener('ended', () => {
            audioPlaying.value = false;
        });
        audio.addEventListener('timeupdate', () => {
            currentAudioTime.value = audio.currentTime;
        });
    }
    if (audio.paused) {
        audio.play();
        audioPlaying.value = true;
    } else {
        audio.pause();
        audioPlaying.value = false;
    }
}

function seekAudio() {
    if (audio) {
        audio.currentTime = currentAudioTime.value;
    }
}

function dropImage(index, targetArray) {
    event.preventDefault()
    if (!targetArray[index] && draggingId.value) {
        sourceItems.forEach((item,i) => {
            if (item?.id === draggingId.value) sourceItems[i] = null
        })
        userOrderedItems.forEach((item,i) => {
            if (item?.id === draggingId.value) userOrderedItems[i] = null
        })
        targetArray.splice(index, 1, { id: draggingId.value })
        draggingId.value = null
    }
}

async function handleSubmit() {
    const correctOrder = item.images.map(image => image.id)
    const submittedOrder = userOrderedItems.map(image => image?.id)
    const isCorrect = arraysDeepEqual(correctOrder, submittedOrder)
    if (Agent.embedded) {
        Agent.close({ success: isCorrect })
    } else {
        await itemFeedbackSwal(t, isCorrect)
    }
}

function arraysDeepEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false

    for (let i = 0; i < arr1.length; i++) {
        const item1 = arr1[i]
        const item2 = arr2[i]
        if (Array.isArray(item1) && Array.isArray(item2)) {
            if (!arraysDeepEqual(item1, item2)) return false
        } else {
            if (item1 !== item2) return false
        }
    }
    return true
}

</script>

<style scoped>
.drag-areas-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
}
.target-items,
.source-items {
    display: flex;
    align-items: center;
    margin: 10px;
}
.image,
.image-placeholder {
    display: block;
    width: 88px;
    height: 88px;
    border-radius: 6px;
    margin: 12px;
}
.image-placeholder {
    background: #eee;
    color: #aaa;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
}
</style>
