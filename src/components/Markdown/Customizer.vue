<template>
    <div class="customizer" v-if="data?.content">
        <AbsolutePreviewAndItemId :id="props.id" />
        <div class="left-col">
            <v-text-field
                v-model="data.content.name"
                :label="t('item-name')"
                class="vuetify-text-input"
            />
            <MarkdownInput v-model="data.content.md" />
        </div>
        <div class="right-col">
            <ProcessMarkdown
                v-if="data?.content?.md"
                :userInput="data.content.md"
            />
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { v4 as uuid } from 'uuid'
import MarkdownInput from './MarkdownHelpers/MarkdownInput.vue'
import ProcessMarkdown from './MarkdownHelpers/ProcessMarkdown.vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])
const data = reactive({ content: null })
Agent
    .state(props.id)
    .then(state => {
        if (!state.name) state.name = ''
        if (!state.md) state.md = ''
        data.content = state
    })
</script>

<style scoped>
.customizer {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
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
