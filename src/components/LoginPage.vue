<template>
	<div class="login-page">
		<v-btn @click="login">
			LOGIN
		</v-btn>
	</div>
</template>

<script setup>
	function login() { Agent.login() }
</script>

<style scoped>
.login-page {
	padding: 40px;
}
</style>