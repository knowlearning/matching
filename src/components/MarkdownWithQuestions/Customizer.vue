<template>
    <div class="customizer" v-if="data?.content">
        <AbsolutePreviewAndItemId :id="props.id" />
        <div>
            <v-btn
                :color="data.tab === 'markdown' ? 'teal' : ''"
                class="ma-2"
                @click="data.tab = 'markdown'"
            >Markdown</v-btn>
            <v-btn
                :color="data.tab === 'questions' ? 'teal' : ''"
                class="ma-2"
                @click="data.tab = 'questions'"
            >{{ t('questions') }}</v-btn>
        </div>

        <div
            v-if="data.tab === 'markdown'"
            class="markdown-edit"
        >
            <div class="left-col">
                <v-text-field
                    v-model="data.content.name"
                    :label="t('item-name')"
                    class="vuetify-text-input"
                />
                <MarkdownInput v-model="data.markdownContent.md" />
                <div class="uuid-grab">
                    <span>UUID:</span>
                    <span @click="copyText(props.id)">{{ props.id }}</span>
                </div>
                <div class="uuid-grab">
                    <span>Markdown UUID: </span>
                    <span @click="copyText(data.content.md)">{{ data.content.md }}</span>
                </div>

            </div>
            <div class="right-col">
                <ProcessMarkdown
                    v-if="data?.markdownContent?.md"
                    :userInput="data.markdownContent.md"
                />
            </div>
        </div>

        <ItemListCustomizer
            :items="data.content.items"
            @updateItems="data.content.items = $event"
            v-else-if="data.tab === 'questions'"
        />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { v4 as uuid } from 'uuid'
import defaultMarkdown from '../../helpers/demo-questions/defaultMarkdown.js'
import MarkdownInput from '../MarkdownHelpers/MarkdownInput.vue'
import ProcessMarkdown from '../MarkdownHelpers/ProcessMarkdown.vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import ItemListCustomizer from '../Sequence/ItemListCustomizer.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])
const data = reactive({
    content: null,  // will be  synced to scope for item def
    tab: 'markdown', // or 'questions'
    markdownContent: null // will be populated from uuid at data.content.md
})

data.content = await Agent.state(props.id)

// on first customize, need to initialize sub-scope for markdown content
if (data.content.md === null) {
    const newMarkdownContentScopeId = uuid()
    data.content.md = newMarkdownContentScopeId
    const x = await Agent.state(newMarkdownContentScopeId)
    x.md = defaultMarkdown
}

// bind to reactive set in data above
data.markdownContent = await Agent.state(data.content.md)

function copyText(val) {
  const textarea = document.createElement("textarea")
  textarea.value = val
  textarea.style.position = "fixed"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

</script>

<style scoped>
.customizer {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.markdown-edit {
    display: flex;
}
.uuid-grab {
    text-align: left;
    font-size: 0.8rem;
}
.uuid-grab span:nth-of-type(1) {
    font-weight: bold;
}
.uuid-grab span:nth-of-type(2) {
    padding: 1px 6px;
    border-radius: 3px;
}
.uuid-grab span:nth-of-type(2):hover {
    background: #eee;
    cursor: pointer;
    color: darkblue;
}
.left-col, .right-col {
    flex: 0 0 50%;
    padding: 8px;
    height: 100%;
    border-right: 1px solid black;
}
.left-col {
    padding-top: 56px;
    min-width: 400px;
}
</style>
