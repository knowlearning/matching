<template>
	<Suspense>
		<PlayOrCustomizeByTypeSwitcher
			v-if="embedded"
			:id="id"
			mode="player"
		/>
		<vueEmbedComponent
			v-else
			:id="id"
			allow="camera;microphone;fullscreen"
		/>
	</Suspense>
</template>

<script>
import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import PlayOrCustomizeByTypeSwitcher from './PlayOrCustomizeByTypeSwitcher.vue'

export default {
	name: 'embedded-player',
	components: {
		vueEmbedComponent,
		PlayOrCustomizeByTypeSwitcher
	},
	props: {
		id: {
			type: String,
			required: true
		}
	},
	data: () => {
		return {
			embedded: Agent.embedded
		}
	}
}
</script>