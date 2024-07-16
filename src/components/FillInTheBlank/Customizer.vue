<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            class="name-instructions"
        />
        <v-lazy>
            <v-textarea class="user-input"
                v-model="data.content.question"
                :label="t('fill-in-the-blank-question')"
                hide-details
                rows="4"
            />
        </v-lazy>
        <div class="question-preview">
            <h5>{{ t('preview') }}</h5>
            <div>{{ previewText }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
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

watch(
    // update blanks on each user string update
    () => data.content.question,
    val => {
        function getBlanksBtwUnderscores(str) {
            return [...str.matchAll(/_(.*?)_/g)].map(match => match[1])
        }
        data.content.blanks = getBlanksBtwUnderscores(val)
    },
    { immediate: true }
)

const previewText = computed(() => {
    return replaceUnderscoreStrings(data.content.question, replacerFn)

    function replacerFn(word) { return '______' }
    function replaceUnderscoreStrings(str, fn) {
        return str.replace(/_(.*?)_/g, (match, p1) => fn(p1))
    }
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
.question-preview {
    width: 560px;
    margin-top: 20px;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 18px;
    line-height: 1.6;
    color: #333;
}
</style>