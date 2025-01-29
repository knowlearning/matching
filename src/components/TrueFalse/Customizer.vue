<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            class="name-instructions"
        />
        <v-radio-group v-model="data.content.answer" class="choices-wrapper">
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
        <CustomizeFeedback
            :feedback="data.content.feedback"
        />
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import CustomizeFeedback from '../SharedCustomizerComponents/CustomizeFeedback.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])
const data = reactive({
    content: null,
})

const state = await Agent.state(props.id)
// rehab old content without feedback
if (!state.feedback) state.feedback = { correct: null, incorrect: null }

data.content = state

</script>

<style scoped>
.customizer {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    height: 100%;
}

.name-instructions {
    width: 560px;
    margin-top: 50px;
}

.choices-wrapper {
    width: 100%;
    flex: 0 0 auto;
    max-width: 600px;
    margin: 20px 0;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
