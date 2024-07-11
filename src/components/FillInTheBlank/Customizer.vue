<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            style="width: 560px; margin-top: 50px;"
        />
        <div class="textarea-wrapper">
            <div 
                contenteditable="true" 
                class="editable-div" 
                @input="handleInput"
                ref="editableDiv"
            ></div>
        </div>
        <div class="selected-word-info">
            <v-btn @click="addBlank" color="primary">Add Blank</v-btn>
        </div>
        <div class="question-preview" v-html="previewText"></div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
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

const editableDiv = ref(null)
const blanks = ref([...data.content.blanks || []])

onMounted(() => {
    editableDiv.value.innerHTML = data.content.question || ''
})

function handleInput() {
    data.content.question = editableDiv.value.innerHTML
}

function addBlank() {
    const selection = window.getSelection()
    const selectedText = selection.toString()
    if (selectedText) {
        const range = selection.getRangeAt(0)
        const startOffset = range.startOffset
        const endOffset = range.endOffset
        const textNode = range.startContainer

        const beforeText = textNode.textContent.slice(0, startOffset)
        const afterText = textNode.textContent.slice(endOffset)
        const selectedNode = textNode.textContent.slice(startOffset, endOffset)

        const newNode = document.createElement('span')
        newNode.style.fontWeight = 'bold'
        newNode.style.textDecoration = 'underline'
        newNode.textContent = selectedNode

        textNode.textContent = beforeText
        textNode.parentNode.insertBefore(newNode, textNode.nextSibling)
        textNode.parentNode.insertBefore(document.createTextNode(afterText), newNode.nextSibling)

        selection.removeAllRanges()
        selection.addRange(range)

        blanks.value.push({ word: selectedNode })
        data.content.blanks = [...blanks.value]
        data.content.question = editableDiv.value.innerHTML
    }
}

const previewText = computed(() => {
    let text = data.content.question || ''
    blanks.value.forEach((blank) => {
        const blankRegex = new RegExp(`<span style="font-weight: bold; text-decoration: underline;">${blank.word}</span>`, 'g')
        text = text.replace(blankRegex, '<span class="blank">_____</span>')
    })
    return text
})
</script>

<style scoped>
.customizer {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.textarea-wrapper {
    width: 100%;
    max-width: 600px;
    position: relative;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #fafafa;
}
.editable-div {
    width: 100%;
    min-height: 100px;
    outline: none;
}
.selected-word-info {
    margin-top: 10px;
    margin-bottom: 20px;
}
.question-preview {
    margin-top: 20px;
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
    line-height: 1.5;
    width: 100%;
    max-width: 600px;
    word-wrap: break-word;
}
.blank {
    display: inline-block;
    width: 100px;
    border-bottom: 2px solid #000;
    margin: 0 5px;
    text-align: center;
}
</style>