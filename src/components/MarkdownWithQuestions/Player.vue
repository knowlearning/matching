<template>
    <div class="player">
        <div class="left-side-markdown">
            <ProcessMarkdown :userInput="itemData.md" />
            <v-btn color="green" @click="handleSubmit">
                {{ t('next') }}
            </v-btn>
        </div>
        <div class="right-side-questions">
            {{ data.activeItemIndex }}
            <div
                v-for="item,i in itemData.items"
                :key="`play-item-wrapper-${i}`"
                class="embedded-question-wrapper"
                v-show="i === data.activeItemIndex"
            >
                <vueEmbedComponent
                    v-show="i === data.activeItemIndex"
                :key="`play-item-embedded-${i}`"
                    style="position: absolute; top: 0; left: 0;"
                    :id="item.id"
                    allow="camera;microphone;fullscreen"
                />
            </div>
            <div class="navbar">
                <v-btn
                    @click="data.activeItemIndex = Math.max(data.activeItemIndex - 1, 0)"
                    icon="fa-solid fa-arrow-left"
                    size="x-small"
                    class="ml-2"
                />
                <span>{{ itemNumberDisplayString }}</span>
                <v-btn
                    @click="data.activeItemIndex = Math.min(data.activeItemIndex + 1, itemData.items.length - 1)"
                    icon="fa-solid fa-arrow-right"
                    size="x-small"
                    class="mr-2"
                />

            </div>

        </div>

    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import ProcessMarkdown from '../MarkdownHelpers/ProcessMarkdown.vue'
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

const itemData = await Agent.state(props.id)
const data = reactive(await Agent.state(`markdown-${props.id}`))
data.activeItemIndex = 0

const itemNumberDisplayString = computed(() => {
    if (data.activeItemIndex === null || data.activeItemIndex === undefined) return ''
    let active = data.activeItemIndex + 1
    if (active < 10) active = '0' + active
    let total = itemData.items.length
    if (total < 10) total = '0' + total
    return `${active}/${total}`
})

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
    height: 100%;
    justify-content: space-between;
}
.left-side-markdown,
.right-side-questions {
    border: 1px solid #111;
    border-radius: 8px;
    padding: 6px;
}

.left-side-markdown {
    height: 100% ;
    flex: 0 0 48%;
}
.right-side-questions {
    height: calc(100% - 32px);
    flex: 0 0 49%;
    height: 100%;
    position: relative;
}
.right-side-questions .navbar {
    height: 32px;
    background: lightgrey;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 0 0px 8px 8px;

    display: flex;
    justify-content: space-between;

}
</style>
