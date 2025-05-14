<template>
	<Suspense>
		<div class="embed-wrapper">
			<PlayOrCustomizeByTypeSwitcher
				:id="id"
				mode="player"
			/>
		</div>
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

<style scoped>

	.embed-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
	}

	@supports (height: 100dvh) {
		.embed-wrapper {
			width: 100dvw;
			height: 100dvh;
		}
	}

</style>
