<template>
	<div class="login-page">
		<div class="logo">
			<img src="../assets/logo-green.svg" alt="pila" />
		</div>
		<div class="bottom-wrapper">
			<div class="left-col">
				<div class="left-col-inner">
					<div class="button-wrapper">
						<v-btn
							prepend-icon="fab fa-google"
							@click="login('google')"
						>
								<span>{{ t('login-with-google') }}</span>
						</v-btn>
					</div>
					<div class="button-wrapper">
						<v-btn
							prepend-icon="fab fa-microsoft"
							@click="login('microsoft')"
						>
								<span>{{ t('login-with-microsoft') }}</span>
						</v-btn>
					</div>
					<img src="../assets/mascotte.png" alt="Google">
				</div>
			</div>
			<div class="right-col">
				<div class="text-area">
					<p>{{ t('login-page-text-pt-1') }}</p>
					<p>{{ t('login-page-text-pt-2') }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { useStore } from 'vuex'
	const store = useStore()
	function t(slug) { return store.getters.t(slug) }
	function login(provider) { Agent.login(provider) }
</script>

<style scoped>
.login-page {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.logo img {
	width: 200px;
	height: 200px;
}

.login-page .logo {
	margin-bottom: -40px;
}
.login-page .bottom-wrapper {
	display: flex;
	width: 100%;
}
.left-col,
.right-col {
	width: 50%;
	margin: 40px;
	display: flex;
}
.left-col {
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
}
.left-col .left-col-inner {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.left-col .button-wrapper {
	margin: 8px;
	width: 220px;
}
.right-col { align-items: flex-start; }

.left-col img {
	width: 200px;
	margin-top: 20px;
}
.right-col .text-area {
	width: 420px;
	text-align: left;
	font-size: 1.2rem;
}
.text-area p {
	margin: 0 0 24px 0;
}
</style>