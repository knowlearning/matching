<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            style="width: 560px; margin-top: 50px;"
        />
        <v-switch
            v-model="data.content.selectMultiple"
            :label="t('select-multiple')"
            color="primary"
            hide-details
        />
        <EditMCOptions
            :choices="data.content?.choices"
            :selectMultiple="data.content.selectMultiple"
            @toggleChoice="toggleChoice"
            @removeChoice="removeChoice"
        />
        <v-btn
            @click="data.content.choices.push({
                value: t('new-choice'),
                isCorrect: false
            })"
            class="mb-12"
        >
            {{ t('new-choice') }}
        </v-btn>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import EditMCOptions from './EditMCOptions.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }


const props = defineProps(['id'])
const data = reactive({
    content: null,
})

const state = await Agent.state(props.id)
data.content = state

function removeChoice(index) {
    const choicesCopy = JSON.parse(JSON.stringify(data.content.choices))
    choicesCopy.splice(index,1)
    data.content.choices = choicesCopy
}

function toggleChoice(index,value) {
    // if  turning on and not selectMultiple, set all others to false 
    if (!data.content.selectMultiple && value === true) {
        unselectAll()
    }
    data.content.choices[index].isCorrect = value
}
function unselectAll() {
    data.content.choices.forEach(c => c.isCorrect = false)
}

watch( // if selectMultiple is turned off unselect all
    () => data.content.selectMultiple,
    val => val || unselectAll()
)

</script>

<style scoped>
.customizer {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}
</style>