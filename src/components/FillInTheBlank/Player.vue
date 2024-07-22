<template>
    <div class="player">
        <div v-if="item?.instructions" class="instructions">
            <span class="instructions-prefix">{{ t('instructions') }}:</span>{{ item.instructions }}
        </div>

        <div class="question-wrapper">
            <p v-html="formattedQuestion"></p>
        </div>

        <div class="answer-inputs">
            <div v-for="(blank, index) in blanks" :key="index" class="input-group">
                <label :for="'answer-' + index">Blank {{ index + 1 }}:</label>
                <v-text-field
                    v-model="userAnswers[index]"
                    :id="'answer-' + index"
                    hide-details
                    class="answer-input"
                />
            </div>
        </div>

        <v-btn @click="handleSubmit" color="green" class="submit-btn">
            {{ t('submit') }}
        </v-btn>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
const item = await Agent.state(props.id)

const blanks = ref([...item.blanks || []])
const userAnswers = ref(Array(blanks.value.length).fill(''))

const formattedQuestion = computed(() => {
    return item.question.replace(/\*\*(.*?)\*\*/g, '_____')
})

function isCorrect() {
    return blanks.value.every((blank, index) => {
        return userAnswers.value[index].trim().toLowerCase() === blank.trim().toLowerCase()
    })
}

async function handleSubmit() {
    if (Agent.embedded) Agent.close({ success: isCorrect() })
    else await itemFeedbackSwal(t, isCorrect())
}
</script>

<style scoped>
.player {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #f0f4f8, #d0d8e0);
    border-radius: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100%;
}

.instructions {
    font-size: 1.2em;
    margin-bottom: 10px;
    color: #333;
}

.instructions-prefix {
    font-weight: bold;
}

.question-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
    color: #444;
    line-height: 1.5;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    word-wrap: break-word;
    white-space: pre-wrap;
}

.answer-inputs {
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
}

.input-group {
    margin-bottom: 15px;
}
.submit-btn {
    margin-bottom: 20px;
}
</style>
