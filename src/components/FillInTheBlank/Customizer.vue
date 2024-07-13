<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            class="name-instructions"
        />
        <div class="textarea-wrapper">
            <div 
                contenteditable="true" 
                class="editable-div" 
                @input="handleInput"
                ref="editableDiv"
            ></div>
        </div>
        <div class="question-preview" v-html="previewText"></div>
        <div class="selected-word-info">
            <v-btn @click="addBlank" color="primary" class="btn-add-blank">
                Add Blank
            </v-btn>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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
    const blankRegex = new RegExp(
    `<span style="font-weight: bold; text-decoration: underline;">${blank.word}</span>`,
    'g'
    )
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
    background: linear-gradient(135deg, #f0f4f8, #d0d8e0);
    border-radius: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    max-width: 100%;
    margin: auto;
    font-family: 'Roboto', sans-serif;
    color: #333;
}

.name-instructions {
    width: 560px;
    margin-top: 50px;
}

.textarea-wrapper {
    width: 100%;
    max-width: 600px;
    position: relative;
    border: 2px solid #aaa;
    border-radius: 10px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    transition: background 0.3s ease;
}

.textarea-wrapper:hover {
    background: rgba(255, 255, 255, 1);
}

.editable-div {
    width: 100%;
    min-height: 150px;
    outline: none;
    font-size: 18px;
    line-height: 1.6;
    color: #333;
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
    width: 100%;
    max-width: 600px;
    margin-top: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 18px;
    line-height: 1.6;
    color: #333;
}

.blank {
    display: inline-block;
    width: 100px;
    border-bottom: 2px solid #000;
    margin: 0 5px;
    text-align: center;
}

.highlighted {
    font-weight: bold;
    text-decoration: underline;
    color: #d9534f;
}
</style>
  