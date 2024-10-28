<template>
    <div class="player">
        <div v-if="item?.instructions" class="instructions">
            <span class="instructions-prefix">{{ t('instructions') }}:</span>{{ item.instructions }}
        </div>
        
        <div class="choices-wrapper">
            <v-radio-group
                v-model="userSelect"
                hide-details
            >
                <v-radio 
                    label="True" 
                    :value="true" 
                    hide-details
                />
                <v-radio 
                    label="False" 
                    :value="false" 
                    hide-details
                />
            </v-radio-group>
        </div>
        <v-btn @click="handleSubmit" color="green">{{ t('submit') }}</v-btn>
    </div>
</template>
    
<script setup>
import { ref } from 'vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
const item = await Agent.state(props.id)

let userSelect = ref(null)

function isCorrect() {
    return userSelect.value === item.answer
}

async function handleSubmit() {
    if (Agent.embedded) Agent.close({ success: isCorrect() })
    else await itemFeedbackSwal(t, isCorrect())
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