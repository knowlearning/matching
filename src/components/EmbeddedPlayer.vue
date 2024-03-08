<template>
	<Suspense>
		<Player :id="id" />
	</Suspense>
</template>

<script>
import Player from './Player.vue'
export default {
	name: 'embedded-player',
	components: { Player },
	props: {
		id: {
			type: String,
			required: true
		}
	}
}
</script>