<template>
    <div class="customizer">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            style="width: 560px; margin-top: 50px;"
        />
        <v-radio-group v-model="data.content.answer" class="my-4">
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
}
</style>
