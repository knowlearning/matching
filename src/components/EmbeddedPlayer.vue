<template>
	<Suspense>
		<PlayOrCustomizeByTypeSwitcher
			:id="id"
			mode="player"
		/>
	</Suspense>
</template>

<script>
import PlayOrCustomizeByTypeSwitcher from './PlayOrCustomizeByTypeSwitcher.vue'
export default {
	name: 'embedded-player',
	components: { PlayOrCustomizeByTypeSwitcher },
	props: {
		id: {
			type: String,
			required: true
		}
	}
}
</script>