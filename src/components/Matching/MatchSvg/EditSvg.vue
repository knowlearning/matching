<template>
	<svg id="edit-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
		<circle cx="7.5" cy="7.5" r="7" fill="white" />
		<path
			fill-rule="evenodd" clip-rule="evenodd" 
			d="M0 7.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Zm8.146-3.354a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708L6.707 11H4.5a.5.5 0 0 1-.5-.5V8.293l4.146-4.147Z"
		/>
	</svg>
</template>

<style scoped>
#edit-svg {
	cursor: pointer;
}
#edit-svg path {
	fill: blue;
	opacity: 0.6;
}
#edit-svg:hover path {
	opacity: 1;
}
</style>
