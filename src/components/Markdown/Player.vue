<template>
    <div class="player">
        <ProcessMarkdown :userInput="item.md" />
        <v-btn color="green" @click="handleSubmit">
            {{ t('next') }}
        </v-btn>
    </div>
</template>

<script setup>
import ProcessMarkdown from './MarkdownHelpers/ProcessMarkdown.vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'


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

async function handleSubmit() {
    if (Agent.embedded) {
        Agent.close({ success: true })
    } else {
        await itemFeedbackSwal(t, true)
    }
}
</script>

<style scoped>
.player {
    display: flex;
    padding: 12px;
    height: calc(100% - 24px);
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}
</style>
