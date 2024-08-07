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
            v-model="userSelect"
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

// v-checkbox models either a value (in my case, the selected index) or an array of values depending on "multiple" attribute.
let userSelect = ref(item.selectMultiple ? [] : false)

function isCorrect() {
    if (item.selectMultiple) {
        const neededIndices = []
        item.choices.forEach((c,i) => c.isCorrect && neededIndices.push(i))
        const all = neededIndices.every(i => userSelect.value.includes(i))
        const only = userSelect.value.every(i => neededIndices.includes(i))
        return all && only
    } else {
        const correctIndex = item.choices.findIndex(c => c.isCorrect)
        return userSelect.value === correctIndex
    }
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