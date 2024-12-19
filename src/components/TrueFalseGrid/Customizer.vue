<template>
    <div class="customizer" v-if="data?.content">
        <AbsolutePreviewAndItemId :id="props.id" />
        <NameAndInstructions
            :content="data.content"
            class="name-instructions"
        />
        <ItemListCustomizer
            :items="data.content.items"
            :supportedTypes="[ 'application/json;type=true-false' ]"
            @updateItems="data.content.items = $event"
        />
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'

import ItemListCustomizer from '../Sequence/ItemListCustomizer.vue'

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const data = reactive({ content: null })
data.content = await Agent.state(props.id)

</script>

<style scoped>
.customizer {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.name-instructions {
    width: 560px;
    margin-top: 50px;
}

</style>
