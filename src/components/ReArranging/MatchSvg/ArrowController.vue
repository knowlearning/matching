<template>
	<svg class="arrow-controller"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 400 400"
	>
		<g
			class="btn"
			transform="translate(200, 100)"
			@click="$emit('move', 'up')"
		>
			<circle cx="0" cy="0" r="60"/>
			<polygon points="0,-30 30,22 -30,22" />
		</g>
		<g
			class="btn"
			transform="rotate(90, 300, 200) translate(300,200)" 
			@click="$emit('move', 'right')"
		>
			<circle cx="0" cy="0" r="60"/>
			<polygon points="0,-30 30,22 -30,22" />
		</g>
		<g
			class="btn"
			transform="rotate(180, 200, 300) translate(200 300)"
			@click="$emit('move', 'down')"
		>
			<circle cx="0" cy="0" r="60"/>
			<polygon points="0,-30 30,22 -30,22" />
		</g>
		<g
			class="btn"
			transform="rotate(270, 100, 200) translate(100, 200)"
			@click="$emit('move', 'left')"
		>
			<circle cx="0" cy="0" r="60"/>
			<polygon points="0,-30 30,22 -30,22" />
		</g>
	</svg>
</template>

<script>
export default {
	name: 'arrow-controller'
}
</script>

<style scoped>
.btn {
	fill: white;
	cursor: pointer;
}
.btn polygon {
	fill: green;
	opacity: 0.6;
}
.btn:hover polygon {
	opacity: 1;
}
</style>
