<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 600 400"
	>
		<rect width="600" height="400" fill="orange" opacity="0.5" />
		<ArrowController
			x="200" y="0" width="400" height="400"
		/>
		<EditSvg
			x="25" y="25" width="150" height="150"
			@click="$emit('edit')"
		/>

		<RemoveSvg
			x="25" y="225" width="150" height="150"
			@click="$emit('remove')"
		/>
	</svg>
</template>

<script>
import ArrowController from './ArrowController.vue'
import EditSvg from './EditSvg.vue'
import RemoveSvg from './RemoveSvg.vue'
export default {
	name: 'choice-edit-overlay',
	components: { ArrowController, EditSvg, RemoveSvg }
}
</script>

<style scoped>

</style>
