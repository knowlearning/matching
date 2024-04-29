<template>
	<v-btn
		@click="uploadFile"
		:size="props.size"
		class="ma-2"
		:icon="props.text ? undefined : `fa-solid ${props.fasIcon}`"
		:prepend-icon="props.text ? `fa-solid ${props.fasIcon}` : undefined"
		:text="props.text"
	/>
</template>


<script setup>
import validate from '../helpers/validateUpload.js'
import {
	uploadSizeNotificationSwal,
	fileNotUploadedLikelyTooLargeSwal
} from '../helpers/swallows.js'
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
		default: 'fa-upload'
	},
	size: {
		type: String,
		required: false,
		default: 'small'
	},
	text: {
		type: String,
		required: false
	}
})

async function uploadFile() {
	try {
		await uploadSizeNotificationSwal(t)
		const options = { validate, browser: true }
		if (props.acceptType) options.accept = props.acceptType
		const id = await Agent.upload(options)
		if (!id) await fileNotUploadedLikelyTooLargeSwal(t)
		else emits('newFile', id)
	} catch (error) {
	    console.error('Error uploading:', error)
    	alert('Error uploading.')
	}
}
</script>