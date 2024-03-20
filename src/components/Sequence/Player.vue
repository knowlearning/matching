<template>
	<div class="sequence-player">
		<SequenceHeader
			:items="data.correctMap"
			:activeItem="data.activeItem"
			@select="data.activeItem = $event"
		/>

		<div
			v-for="{ id: item } in questionDef.items"
			:key="`play-${item}`"
			v-show="item === data.activeItem"
			class="embedded-question-wrapper"
		>
			<Suspense>
				<vueEmbedComponent
					:id="item"
					@close="handleClose(item, $event)"
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
const initialCorrectMap = questionDef.items
	.map(obj => obj.id )
	.reduce((acc, id) => {
    acc[id] = null
    return acc
  }, {})

const data = reactive({
  activeItem: null,
  correctMap: initialCorrectMap
})

function handleClose(id, e) {
	// TODO: What about other "info"... not just close on correct?
	// Need state watching / reacting OR other messaging.
	data.correctMap[id] = e.success
	data.activeItem = getNextItem(id)
}

function getNextItem(itemId) {
	const i = questionDef.items.findIndex(obj => obj?.id === itemId)
	if (i === -1) return null
	else if (i === questionDef.items.length - 1) return null
	else return questionDef.items[i+1].id
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

