<template>
<div class="player">
    <div
        v-if="item.instructions"
        class="instructions"
    >
        <span class="instructions-prefix">{{ t('instructions') }}:</span>
        {{ item.instructions }}
    </div>

    <div
        class="audio-play-area"
        v-if="item.audioId"
    >
        <i 
            :class="runstate.audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" 
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
                v-for="(item, i) in runstate.userOrderedItems"
                :key="`source-spot-${i}-${item?.id}`"
                
                @drop="dropImage(i, runstate.userOrderedItems)"
                @dragover.prevent
            >
                <UUIDImage v-if="item?.id"
                    :class="{
                        image: true,
                        hidden: runstate.draggingId === item.id
                    }"
                    :id="item.id"
                    :draggable="item?.id"
                    @dragstart="runstate.draggingId = item.id"
                    @dragend="runstate.draggingId = null"
                />
                <div
                    v-if="!item?.id || runstate.draggingId === item.id"
                    class="image-placeholder"
                >{{ i+1 }}.</div>
            </div>
        </div>
        <div class="source-items">
            <div
                v-for="(item, i) in runstate.sourceItems"
                :key="`source-spot-${i}-${item?.id}`"
                class="image-spot"
                :style="{ backgroundImage: item?.id ? `url(${item.id})` : '' }"
                @drop="dropImage(i, runstate.sourceItems)"
                @dragover.prevent
            >
                <UUIDImage v-if="item?.id"
                    :class="{
                        image: true,
                        hidden: runstate.draggingId === item.id
                    }"
                    :id="item.id"
                    :draggable="item?.id"
                    @dragstart="runstate.draggingId = item.id"
                    @dragend="runstate.draggingId = null"
                />
                <div
                  v-if="!item?.id || runstate.draggingId === item.id"
                  class="image-placeholder"
                >?</div>

            </div>
        </div>

    </div>

    <v-btn color="green" @click="handleSubmit">
        {{ t('submit') }}
    </v-btn>
</div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import { UUIDImage } from '@knowlearning/agents/vue.js'
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
const runstate = reactive(await Agent.state(`runstate-${props.id}`))

if (runstate.sourceItems === undefined) {
    runstate.sourceItems = shuffle(item.images)
}
if (runstate.userOrderedItems === undefined) {
    runstate.userOrderedItems = new Array(item.images.length).fill(null)
}
if (runstate.draggingId === undefined) {
    runstate.draggingId = null
}
if (runstate.audioPlaying === undefined) {
    runstate.audioPlaying = false
}
if (runstate.currentAudioTime === undefined) {
    runstate.currentAudioTime = 0
}
if (runstate.lastSubmissionCorrect === undefined) {
    runstate.lastSubmissionCorrect = null
}
if (runstate.currentlyCorrect === undefined) {
    runstate.currentlyCorrect = null
}

watch(  // set currently correct, if changed, on each run-state edit
    runstate,
    () => {
        const correctOrder = item.images.map(image => image.id)
        const submittedOrder = runstate.userOrderedItems.map(image => image?.id)
        const isCorrect =  arraysDeepEqual(correctOrder, submittedOrder)
        if (runstate.currentlyCorrect !== isCorrect) runstate.currentlyCorrect = isCorrect
    },
    { deep: true }
)

let audio = null

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
    const audioId = item.audioId
    if (!audioId) return
    const audioUrl = await Agent.download(audioId).url()
    if (!audio) {
        audio = new Audio(audioUrl);
        audio.addEventListener('ended', () => {
            runstate.audioPlaying = false;
        });
        audio.addEventListener('timeupdate', () => {
            runstate.currentAudioTime = audio.currentTime;
        });
    }
    if (audio.paused) {
        audio.play();
        runstate.audioPlaying = true;
    } else {
        audio.pause();
        runstate.audioPlaying = false;
    }
}

function seekAudio() {
    if (audio) {
        audio.currentTime = runstate.currentAudioTime;
    }
}

function dropImage(index, targetArray) {
    event.preventDefault()
    if (!targetArray[index] && runstate.draggingId) {
        runstate.sourceItems.forEach((item,i) => {
            if (item?.id === runstate.draggingId) runstate.sourceItems[i] = null
        })
        runstate.userOrderedItems.forEach((item,i) => {
            if (item?.id === runstate.draggingId) runstate.userOrderedItems[i] = null
        })
        targetArray.splice(index, 1, { id: runstate.draggingId })
        runstate.draggingId = null
    }
}

async function handleSubmit() {
    const correct = runstate.currentlyCorrect
    runstate.lastSubmissionCorrect = correct

    if (Agent.embedded) {
        Agent.close({
            success: correct,
            message: getMessage(correct)
        })
    } else {
        await itemFeedbackSwal(t, correct, getMessage(correct))
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

function getMessage(isCorrect) {
    if (isCorrect && item.feedback?.correct) return item.feedback.correct 
    else if (!isCorrect && item.feedback?.incorrect) return item.feedback.incorrect
    else return undefined
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
.image {
    cursor: grab;
}
.image.hidden {
  opacity: 0;
  position: absolute;
}
.image-placeholder {
    background: #eee;
    color: #aaa;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
}
@media only screen and (max-width: 600px) {
    .drag-areas-wrapper {
        flex-direction: row;
        justify-content: center;
    }
    .target-items,
    .source-items {
        flex-direction: column;
    }
}

</style>
