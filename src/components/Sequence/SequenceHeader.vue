<template>
	<div class="item-selector">
		
		<div
			v-for="(isCorrect, i) in isCorrectArray"
			:key="i"
			:class="{
				oneItem: true,
				pointer: selectable,
				active: activeItemIndex === i
			}"
			@click="selectItem(i)"
		>
			<svg
				class="item-circle"
				viewBox="0 0 100 100"
			>
				<circle
					cx="50" cy="50"
					r="48"
					:fill="getCircleFill(isCorrect)"
					stroke="grey"
				/>
				<text
					x="50"
					y="50"
					:fill="isCorrect  === null ? 'grey' : 'white'"
					text-anchor="middle"
					alignment-baseline="middle"
				>{{ i+1 }}</text>
			</svg>

			<!-- Dashed Line Btw Items -->
			<svg class="dashed-line"
				v-if="i !== isCorrectArray.length - 1"
				viewBox="0 0 100 100"
			>
				<line
					x1="0" y1="50"
					x2="100" y2="50"
					stroke-width="10"
					stroke="black"
				/>
			</svg>
		</div>
		
	</div>
</template>

<script>
export default {
	props: {
		selectable: {
			type: Boolean,
			required: false,
			default: true
		},
		activeItemIndex: {
			type: [Number, null],
			required: true,

		},
		isCorrectArray: {
			// array matching order of sequence [ null, t, or f ]
			required: true, 
			type: Array

		}
	},
	methods: {
		selectItem(i) {
			if (this.selectable) {
				this.$emit('select', i)
			}
		},
		getCircleFill(isCorrect) {
			if (isCorrect === null) return 'white'
			else if (isCorrect === true) return 'green'
			else return 'darkorange'
		}
	}
}
</script>

<style scoped>
.item-selector {
	user-select: none;
	width: fit-content;
	display: flex;
	align-items: center;
	justify-content: center;	
}
.oneItem {
	display: flex;
}
.oneItem.pointer {
	cursor: pointer;
}
.oneItem svg.item-circle {
	width: 60px;
	margin: 0 10px;
	stroke-width: 0.5px;
	font-size: 2.8em;
	opacity: 0.7;
}
.oneItem svg.item-circle text {
	stroke-width: 1.5px
}
.oneItem.active svg.item-circle {
	stroke-width: 1.5px;
	animation: pulse 1.6s ease-in-out infinite;
}
svg.dashed-line {
	width: 10px;
}
@keyframes pulse {
  000% { stroke-width: 4.8px; }
  050% { stroke-width: 3.0px; }
  100% { stroke-width: 4.8px; }
}

</style>