<template>
<div class="login-page">
	<div class="logo">
		<img data-v src="../assets/logo-green.svg" style="width: 300px; height: 300px; margin-top: 20px;" alt="pila" />
	</div>
	<div class="login-buttons">
		<div class="google-login">
			<v-btn @click="login">
				<img src="../assets/google.png" alt="google" />
				<span style="text-transform: capitalize;">Log in with Google</span>
			</v-btn>
		</div>
	</div>
	<div style="display: flex; margin-top: 16px; align-items: flex-start;">
		<img src="../assets/mascotte.png" style="width: 150px; height: 150px; margin-left: 400px;" alt="Google">
		<div>
			<p style="padding: 16px; width: 55%; text-align: left; margin-top: 20px;">
				Welcome to our platform! Powered by PILA Authoring Tools Customizer, please create an account or log in using the Service provided by your school. If your preferred Service is not listed, please ask your teacher to contact us at edu.pila@oecd.org for assistance.
			</p>
		</div>
	</div>
</div>
</template>
<script setup>
	function login() { Agent.login() }
</script>

<style scoped>
.login-page {
	padding: 40px;
}
.login-page img {
	width: 20px;
	height: 20px;
	margin-right: 5px;
}
</style>