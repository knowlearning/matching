<template>
	<svg id="remove-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
		<circle cx="7.5" cy="7.5" r="7" fill="white" />
		<line x1="5" y1="5" x2="10" y2="10" />
		<line x1="5" y1="10" x2="10" y2="5" />
	</svg>
</template>

<style scoped>
#remove-svg {
	cursor: pointer;
}
#remove-svg line {
	stroke: red;
	stroke-width: 1.5;
	opacity: 0.5;
}
#remove-svg:hover line {
	opacity: 1;
}
</style>