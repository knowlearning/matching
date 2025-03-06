<template>
    <div class="player">
        <transition name="slide">
            <div
                :class="{
                    'left-or-top-side-markdown' : true,
                    'collapsed': isBottomVisible,
                    'markdown-only' : numberOfItems === 0
                }"
            >
                <ProcessMarkdown v-if="markdownContent?.md" :userInput="markdownContent.md" />
                <v-btn color="green" @click="handleSubmit">
                    {{ t('next') }}
                </v-btn>
                <button
                    v-if="numberOfItems > 0"
                    class="toggle-button"
                    @click="isBottomVisible = !isBottomVisible"
                >
                    {{ isBottomVisible ? 'Show Markdown' : 'Show Questions' }}
                </button>
            </div>
        </transition>

        <div
            :class="{
                'right-or-bottom-side-questions' : true,
                'markdown-only' : numberOfItems === 0
            }"
        >
            <div
                v-for="item,i in item.items"
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
            <div
                :class="{
                    'navbar' : true,
                    'no-navbar' :numberOfItems === 1
                }"
            >
                <v-btn
                    @click="data.activeItemIndex = Math.max(data.activeItemIndex - 1, 0)"
                    icon="fa-solid fa-arrow-left"
                    size="x-small"
                    class="ml-2"
                />
                <span>{{ itemNumberDisplayString }}</span>
                <v-btn
                    @click="data.activeItemIndex = Math.min(data.activeItemIndex + 1, item.items.length - 1)"
                    icon="fa-solid fa-arrow-right"
                    size="x-small"
                    class="mr-2"
                />

            </div>

        </div>

    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import ProcessMarkdown from '../MarkdownHelpers/ProcessMarkdown.vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import translateScopeId from '../../helpers/translateScopeId.js'


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

const isBottomVisible = ref(false)

const lang = store.getters.language()
const item = await translateScopeId(props.id, lang)

const markdownContent = await Agent.state(item.md)
const data = reactive(await Agent.state(`markdown-${props.id}`))
data.activeItemIndex = 0

const numberOfItems = computed( () => item.items.length )

const itemNumberDisplayString = computed(() => {
    if (data.activeItemIndex === null || data.activeItemIndex === undefined) return ''
    let active = data.activeItemIndex + 1
    if (active < 10) active = '0' + active
    let total = item.items.length
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
    width: 100%;
    display: flex;
    padding: 12px;
    height: 100%;
    justify-content: space-between;
}
.left-or-top-side-markdown,
.right-or-bottom-side-questions {
    border: 1px solid #111;
    border-radius: 8px;
    padding: 6px;
}

.left-or-top-side-markdown {
    height: 100% ;
    flex: 0 0 48%;
}
.left-or-top-side-markdown.markdown-only {
    height: 100% ;
    flex: 0 0 100%;
    border: none;
}

.right-or-bottom-side-questions {
    height: calc(100% - 32px);
    flex: 0 0 49%;
    height: 100%;
    position: relative;
}
.right-or-bottom-side-questions.markdown-only {
    display: none;
}
.right-or-bottom-side-questions .navbar {
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
.right-or-bottom-side-questions .navbar.no-navbar {
    display: none;
}

.toggle-button { display: none; }

@media only screen and (max-width: 600px) {
    .player {
        flex-direction: column;
    }
    .left-or-top-side-markdown {
        width: 100%;
        padding: 20px;
        transition: min-height 0.3s ease;
        min-height: 85%; /* Expanded state */
        position: relative;
        overflow: hidden;
    }

    .left-or-top-side-markdown.collapsed {
        min-height: 15%; /* Collapsed state */
        max-height: 15%;
    }

    .right-or-bottom-side-questions {
        flex-grow: 1;
        padding: 20px;
    }

    .toggle-button {
        display: revert;
        position: absolute;
        bottom: -10px;
        right: 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .toggle-button:hover {
        background-color: #0056b3;
    }
}

</style>
