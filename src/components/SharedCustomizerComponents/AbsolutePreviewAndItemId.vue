<template>
    <div class="absolute-preview-and-item-id">
      <v-btn
        @click="store.dispatch('previewContent', props.id)"
        append-icon="fa-solid fa-eye"
        class="preview-btn"
      >
        <span>{{ t('preview') }}</span>
      </v-btn>

      <div
        @click="copyText"
        class="item-id-wrapper"
      >
        <span v-if="idCopied" class="copied">{{ t('copied') }}</span>
        <span class="item-id">{{ props.id }}</span>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

let idCopied = ref(false)

const props = defineProps({
	id: { type: String, required: true}
})

function copyText() {
  const textarea = document.createElement("textarea")
  textarea.value = props.id
  textarea.style.position = "fixed" // delete?
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
  idCopied.value = true
}

</script>

<style scoped>
.absolute-preview-and-item-id {
	position: absolute;
	width: 100%;
	height: 100%;
}
button.preview-btn {
  position: absolute;
  top: 12px;
  left: 12px;
}
div.item-id-wrapper {
  position: absolute;
  right: 18px;
  bottom: 18px;
  font-weight: bold;
  font-size: 0.8rem;
  font-style: italic;
}
.item-id {
  padding: 4px 10px;
  border-radius: 8px;  
}
.item-id:hover {
  background: #eee;
  cursor: pointer;
  color: darkblue;
}
.copied {
  color: darkgray;
  margin-right: 10px;
}

</style>