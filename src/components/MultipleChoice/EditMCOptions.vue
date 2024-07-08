<template>
    <div class="edit-mc-options">
        <div class="choice-row"
            v-for="c,i in props.choices"
            :key="`choice-row-${i}`"
        >

            <v-text-field
                class="mx-4"
                v-model="c.value"
            >
                <template v-slot:prepend>
                    <v-switch
                        :modelValue="c.isCorrect"
                        @update:modelValue="emits('toggleChoice', i, $event)"
                        color="primary"
                        hide-details
                    />
                </template>
                <template v-slot:append-inner>
                    <v-btn
                        @click="emits('removeChoice',i)"
                        size="x-small"
                        color="red"
                        icon="fa-solid fa-remove"
                    />
                </template>
            </v-text-field>

        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    choices: {
        type: Array, // of form [ {value, isCorrect}, ... ]
        required: true
    },
    selectMultiple: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['toggleChoice', 'removeChoice'])

</script>

<style scoped>
.edit-mc-options {
    width: 100%;
}
.choice-row {
    display: flex;
    align-items: center;
}
.choice-row input {
    flex: 1 1 auto;
}
</style>