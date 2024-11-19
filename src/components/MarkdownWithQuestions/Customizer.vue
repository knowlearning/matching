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
            >Questions</v-btn>
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
                <MarkdownInput v-model="data.content.md" />
            </div>
            <div class="right-col">
                <ProcessMarkdown
                    v-if="data?.content?.md"
                    :userInput="data.content.md"
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
    tab: 'markdown' // or 'questions'
})
Agent
    .state(props.id)
    .then(state => {
        if (!state.name) state.name = ''
        if (!state.md) state.md = ''
        if (!state.items) state.items = [ {id: 'abc'}]
        data.content = state
    })
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
