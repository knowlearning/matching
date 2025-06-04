<template>
    <div class="player">
        <div v-if="item?.instructions" class="instructions">
            <span class="instructions-prefix">{{ t('instructions') }}:</span>{{ item.instructions }}
        </div>
        
        <div class="choices-wrapper">
            <v-radio-group
                v-model="runstate.userSelect"
                hide-details
            >
                <v-radio 
                    :label="t('true')" 
                    :value="true" 
                    hide-details
                />
                <v-radio 
                    :label="t('false')" 
                    :value="false" 
                    hide-details
                />
            </v-radio-group>
        </div>
        <v-btn @click="handleSubmit" color="green">{{ t('submit') }}</v-btn>
    </div>
</template>
    
<script setup>
import { ref, reactive } from 'vue'
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
    userSelect: () => null,
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


function isCorrect() {
    return runstate.userSelect.value === item.answer
}

async function handleSubmit() {
    const correct = isCorrect()
    if (Agent.embedded) {
        Agent.close({
            success: correct,
            message: getMessage(correct)
        })
    } else {
        await itemFeedbackSwal(t, correct, getMessage(correct))
    }

    runstate.xapi = {
        verb: 'submitted',
        object: props.id,
        result: { success: correct },
        extensions: {
            message: getMessage(correct)
        }
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
    height: 100%;
    padding: 0 6px;
}
.choices-wrapper {
    width: 100%;
    max-width: 400px;
    margin: 12px 0;
}
.instructions {
    font-size: 1.2em;
    margin-bottom: 10px;

}
.instructions-prefix {
    font-weight: bold;
}
</style>