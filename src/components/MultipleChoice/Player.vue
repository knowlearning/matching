<template>
<div class="player">
    <div
        v-if="item?.instructions"
        class="instructions"
    ><span class="instructions-prefix">{{ t('instructions') }}:</span>{{ item.instructions }}</div>
    <div
        v-if="item.selectMultiple"
        class="font-weight-bold"
    >{{ t('select-all-that-apply') }}</div>

    <div class="choices-wrapper">
        <v-checkbox class="checkbox-row"
            v-for="choice,i in item.choices"
            :key="`checkbox-for-choice-${i}`"
            :label="choice.value"
            :value="i"
            :multiple="item.selectMultiple"
            :model-value="runstate.userSelect"
            @update:model-value="value => {
                runstate.userSelect = value
                runstate.currentlyCorrect = determineCorrect()
            }"
            hide-details
        />
    </div>
    <v-btn
        @click="handleSubmit"
        color="green"
        :text="t('submit')"
    />
</div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import translateScopeId from '../../helpers/translateScopeId.js'


import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const language = store.getters.language()
const item = await translateScopeId(props.id, language)

const runstate = reactive(await Agent.state(`runstate-${props.id}`))
const initialRunstateMap = {
    currentlyCorrect: () => null,
    // userSelect ->  v-checkbox models either a value (in my case, the selected index) or an array of values depending on "multiple" attribute.
    userSelect: () => item.selectMultiple ? [] : false
}

Object.entries(initialRunstateMap).forEach(([key, fn]) => {
    if (runstate[key] === undefined) runstate[key] = fn()
})

setTimeout(() => {
    runstate.xapi = {
        actor: props.id,
        verb: 'initialized',
        object: props.id,
        extensions: { language }
    }
})

function determineCorrect() {
    if (item.selectMultiple) {
        const neededIndices = []
        item.choices.forEach((c,i) => c.isCorrect && neededIndices.push(i))
        const all = neededIndices.every(i => runstate.userSelect.includes(i))
        const only = runstate.userSelect.every(i => neededIndices.includes(i))
        return all && only
    } else {
        const correctIndex = item.choices.findIndex(c => c.isCorrect)
        return runstate.userSelect === correctIndex
    }
}

async function handleSubmit() {
    const success = runstate.currentlyCorrect
    if (!Agent.embedded) {
        await itemFeedbackSwal(t, success, getMessage(success))
    }
    runstate.xapi = {
        verb: 'submitted',
        object: props.id,
        result: { success },
        extensions: {
            message: getMessage(success)
        },
    }
}

function getMessage(isCorrect) {
    if (isCorrect && item.feedback?.correct) return item.feedback.correct 
    else if (!isCorrect && item.feedback?.incorrect) return item.feedback.incorrect
    else return undefined
}

</script>

<style scoped>
.player {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 8px;
}
.choices-wrapper {
    width: 100%;
    max-width: 500px;
    border-bottom: 1px solid grey;
    margin: 12px 0;
}
.checkbox-row {
    border-top: 1px solid grey;
    text-align: left;
    padding: 8px 0;
}
</style>