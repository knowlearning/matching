<template>
    <div class="player">
        <div v-if="item?.instructions" class="instructions">
            <span class="instructions-prefix">{{ t('instructions') }}:</span>{{ item.instructions }}
        </div>
        
        <div class="choices-wrapper">
            <v-radio-group v-model="userSelect">
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
    
        <v-btn @click="handleSubmit" color="green" class="submit-btn">{{ t('submit') }}</v-btn>
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
    padding: 30px;
    background: linear-gradient(135deg, #f0f4f8, #d0d8e0);
    border-radius: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    max-width: 100%;
    margin: auto;
    font-family: 'Roboto', sans-serif;
    color: #333;
}

.instructions {
    font-size: 1.2em;
    margin-bottom: 10px;
    color: #333;
}

.instructions-prefix {
    font-weight: bold;
}

.choices-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-btn {
    background-color: #1e88e5;
    color: #fff;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.submit-btn:hover {
    background-color: #1669a2;
}
</style>
