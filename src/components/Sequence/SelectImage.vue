<template>
	<div class="select-image">

		<v-btn
			icon="fa-solid fa-trash"
			size="small"
			:disabled="!props.active"
			@click="$emit('select', null)"
		/>

		<div
			v-for="image,i in imageChoices" :key="`image-choice-${i}`"
			@click="$emit('select', image)"
			:class="{
				'image-wrapper' : true,
				'active' : props.active === image
			}"
		>
			<KLImage
				:id="image"
				:size="{ width: 'auto', height: '96px' }"
			/>
		</div>

		<PickFileButton
			fas-icon="fa-file-image"
			acceptType="image/*"
			@newFile="$emit('select', $event)"
		/>

		<!-- SHOW ACTIVE IF NOT ONE OF DEFAULT CHOICES -->
		<div
			v-if="props.active && !imageChoices.includes(props.active)"
			class="image-wrapper active"
		>
			<KLImage
				:id="props.active"
				:size="{ width: 'auto', height: '96px' }"
			/>
		</div>


	</div>
</template>


<script setup>
import KLImage from '../kl-image.vue'
import PickFileButton from '../PickFileButton.vue'

const KAREL_IMAGE = "e5d78100-07dc-11ef-8569-81c43f03de09"
const BETTY_IMAGE = "c31ea520-07e7-11ef-b18d-099b318b5a6f"
const imageChoices = [ KAREL_IMAGE, BETTY_IMAGE ]

const props = defineProps([ 'active' ])


</script>

<style scoped>
.select-image {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 20px;
}
.image-wrapper {
	margin: 20px;
}
.image-wrapper.active {
	border: 4px solid chartreuse;
}

</style>