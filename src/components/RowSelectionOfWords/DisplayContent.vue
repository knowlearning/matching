<template>
  <div class="display-content">
  	{{ props.content }}
  </div>
</template>

<script setup>
import { validate as isUUID } from 'uuid'
const props = defineProps(['content'])

const check = isUUID(props.content)

</script>

<style scoped>
.display-content {
	width: 100%;
	height: 100%;
}
</style>
