<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="id" />
        <NameAndInstructions
            :content="data.content"
            class="name-instructions"
        />
        <v-textarea
            class="user-input"
            v-model="editableQuestion"
            :label="t('fill-in-the-blank-question')"
            hide-details
            rows="4"
        />
        <div class="selected-word-info">
            <v-btn @click="addBlank" color="primary" class="btn-add-blank">Add Blank</v-btn>
        </div>
        <div class="question-preview">
            <h5>{{ t('preview') }}</h5>
            <div class="preview-text">{{ previewText }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])
const data = reactive({
    content: null,
})

const state = await Agent.state(props.id)
data.content = state

const editableQuestion = ref(data.content.question || '')

watch(
    () => editableQuestion.value,
    () => {
        updateBlanks()
    },
    { immediate: true }
)

function updateBlanks() {
    const blanks = []
    const regex = /\*\*(.*?)\*\*/g
    let match
    while ((match = regex.exec(editableQuestion.value)) !== null) {
        blanks.push(match[1])
    }
    data.content.blanks = blanks
    data.content.question = editableQuestion.value
}

function addBlank() {
    const selection = window.getSelection()
    const selectedText = selection.toString().trim()
    if (selectedText) {
        const startIndex = editableQuestion.value.indexOf(selectedText)
        const endIndex = startIndex + selectedText.length
        const updatedText = `${editableQuestion.value.substring(0, startIndex)}**${selectedText}**${editableQuestion.value.substring(endIndex)}`
        editableQuestion.value = updatedText
        updateBlanks()
    }
}

const previewText = computed(() => {
    return editableQuestion.value.replace(/\*\*(.*?)\*\*/g, '_____')
})
</script>

<style scoped>
.customizer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    height: 100%;
    max-width: 100%;
    position: relative;
}

.name-instructions {
    width: 560px;
    margin-top: 50px;
}

.user-input {
    width: 560px;
}

.selected-word-info {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
}

.btn-add-blank {
    background-color: #1e88e5;
    color: #fff;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.btn-add-blank:hover {
    background-color: #1669a2;
}

.question-preview {
    width: 70vh;
    height: 10vh;
    margin-top: 20px;
    overflow-y: auto;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    line-height: 1.6;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.preview-text {
    word-wrap: break-word;
    white-space: pre-wrap;
}
</style>
