<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            class="name-instructions"
        />
        <v-radio-group v-model="data.content.answer" class="choices-wrapper">

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
</template>

<script setup>
import { reactive } from 'vue'
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
</script>

<style scoped>
.customizer {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    padding: 20px;
    background: linear-gradient(135deg, #f0f4f8, #d0d8e0);
    border-radius: 20px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    max-width: 100%;
    margin: auto;
}

.name-instructions {
    width: 560px;
    margin-top: 50px;
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
</style>
