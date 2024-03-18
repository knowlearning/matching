<template>
	<div class="item-selector">
		
		<div
			v-for="(isCorrect,id, i) in items"
			:key="i"
			:class="{
				oneItem: true,
				pointer: selectable,
				active: activeItem === id
			}"
			@click="selectItem(id)"
		>
			<svg
				class="item-circle"
				viewBox="0 0 100 100"
			>
				<circle
					cx="50" cy="50"
					r="48"
					:fill="getCircleFill(isCorrect)"
				/>
				<text
					x="50"
					y="50"
					text-anchor="middle"
					alignment-baseline="middle"
				>{{ i+1 }}</text>
			</svg>

			<!-- Dashed Line Btw Items -->
			<svg class="dashed-line"
				v-if="i !== Object.keys(items).length - 1"
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
		activeItem: {
			type: String,
			required: false,
			default: 'def'
		},
		items: {
			// map of ids to correct status (null, t, or f)
			required: false, // set to true
			type: Object,
			default: () => ({
				'abc' : null,
				'def' : null,
				'efg' : null,
				'hij' : null,
				'klm' : null,
				'nop' : null
			})
		}
	},
	methods: {
		selectItem(id) {
			if (this.selectable) {
				this.$emit('select', id)
			}
		},
		getCircleFill(isCorrect) {
			if (isCorrect === null) return 'mintcream'
			else if (isCorrect === true) return 'lawngreen'
			else return 'gold'
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
	stroke-width: 1.5px;
	stroke: transparent;
	font-size: 2.8em;
}
.oneItem svg.item-circle text {
	stroke-width: 1.5px
}
.oneItem.active svg.item-circle {
	stroke: grey;
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