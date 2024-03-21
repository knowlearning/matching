<template>
	<div class="sequence-player">
		<SequenceHeader
			:isCorrectArray="data.isCorrectArray"
			:activeItemIndex="data.activeItemIndex"
			@select="data.activeItemIndex = $event"
		/>

		<div
			v-for="item,i in questionDef.items"
			:key="`play-item-${i}`"
			v-show="i === data.activeItemIndex"
			class="embedded-question-wrapper"
		>
			<Suspense>
				<vueEmbedComponent
					:id="item.id"
					@close="handleClose(i, $event)"
					:namespace="`sequence-${id}-item-${i}`"
				/>
			</Suspense>
		</div>
		
	</div>
</template>


<script setup>
import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import { reactive, computed } from 'vue'
import SequenceHeader from './SequenceHeader.vue'

const props = defineProps(['id'])

const questionDef = await Agent.state(props.id)

const data = reactive({
  activeItemIndex: 0,
  isCorrectArray: questionDef.items.map(el => null)
})

function handleClose(i, e) {
	// TODO: What about other "info"... not just close on correct?
	// Need state watching / reacting OR other messaging.
	data.isCorrectArray[i] = e.success
	data.activeItemIndex = i + 1
}

</script>

<style>
.sequence-player {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.sequence-player .embedded-question-wrapper {
	border: 2px dotted grey;
	margin-top: 14px;
	width: 100%;
	height: 100%;
}
.sequence-player .embedded-question-wrapper iframe {
	width: 600px;
	height: 600px;
}
</style>

