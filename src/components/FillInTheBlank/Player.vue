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
                />
            </div>
        </div>
    
        <v-btn @click="handleSubmit" color="green">{{ t('submit') }}</v-btn>
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
    let question = item.question
    blanks.value.forEach((blank, index) => {
        const blankRegex = new RegExp(`<span style="font-weight: bold; text-decoration: underline;">${blank.word}</span>`, 'g')
        question = question.replace(blankRegex, '_____')
    })
    return question
})

function isCorrect() {
    return blanks.value.every((blank, index) => {
        return userAnswers.value[index].trim().toLowerCase() === blank.word.trim().toLowerCase()
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
    padding: 20px;
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
    font-size: 1.2em;
    color: #444;
    line-height: 1.5;
}
.blank {
    display: inline-block;
    width: 100px;
    border-bottom: 2px solid #000;
    margin: 0 5px;
    text-align: center;
}
.answer-inputs {
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
}
.input-group {
    margin-bottom: 15px;
}
.input-group label {
    font-weight: bold;
    margin-right: 10px;
}
</style>