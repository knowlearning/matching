<template>
  <span>
    {{ displayString }}
  </span>
</template>

<script setup>
import { ref } from 'vue'
import { validate as isUUID } from 'uuid'

// NOTE This is the UUID for the Name Itself, not the content with that name.
const props = defineProps({
  possibleUUIDString: {
    required: true,
    type: String
  }
})

let displayString = ref(props.possibleUUIDString)

// relies upon the id's source domain validating cross domain state requests
if (isUUID(props.possibleUUIDString)) {
  const { source_string } = await Agent.state(props.possibleUUIDString)
  if (source_string) displayString = source_string
}

</script>