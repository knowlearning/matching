<template>
    <div class="player">
        <pre>{{ item }}</pre>
        <v-btn @click="handleSubmit" color="green">{{ t('submit') }}</v-btn>
    </div>
</template>
    
<script setup>
import { ref } from 'vue'
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
const item = await translateScopeId(props.id)

function handleSubmit() {
    return
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
</style>