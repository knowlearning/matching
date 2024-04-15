<template>
	<span class="display-time">
		{{ displayTime }}
	</span>
</template>

<script>
function o(x) { return x<10 ? '0'+x : ''+x }
export default {
	name: 'display-time',
	props: {
		time: {
			type: Number,
			required: true
		}
	},
	computed: {
		displayTime() {
			const mins = o(Math.floor(this.time / 60))
			const secs = o((this.time % 60))
			return `${mins}:${secs}`
		}
	}
}
</script>