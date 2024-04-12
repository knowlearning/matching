<template>
	<button @click="uploadFile">
		<i :class="{
				fas: true,
				[fasIcon]: true
			}"
		/>
	</button>
</template>


<script setup>
import validate from '../helpers/validateUpload.js'
import { uploadSizeNotificationSwal } from '../helpers/swallows.js'
import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const emits = defineEmits(['newFile'])
const props = defineProps({
	acceptType: {
		type: String,
		required: false
	},
	fasIcon: {
		type: String,
		required: false,
		default: 'fas-upload'
	}
})

async function uploadFile() {
	await uploadSizeNotificationSwal(t)
	const options = { validate, browser: true }
	if (props.acceptType) options.accept = props.acceptType
	const id = await Agent.upload(options)
	if (id) emits('newFile', id)
}
</script>