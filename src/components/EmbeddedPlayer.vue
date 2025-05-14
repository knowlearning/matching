<template>
	<Suspense>
		<div
			style="
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: 100vh;
			"
		>
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
