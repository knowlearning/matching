<template>
    <div class="absolute-preview-and-item-id">
      <v-btn
        @click="store.dispatch('previewContent', props.id)"
        @click.shift="store.dispatch('tagContent', props.id)"
        append-icon="fa-solid fa-eye"
        class="preview-btn"
      >
        <span>{{ t('preview') }}</span>
      </v-btn>

<!--       <v-btn
        append-icon="fa-solid fa-tag"
        class="tag-btn"
        @click="store.dispatch('tagContent', props.id)"
      >
        <span> {{ t('tags') }} </span>
      </v-btn> -->

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
  pointer-events: none;
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
}
button.preview-btn {
  pointer-events: auto;
  position: absolute;
  top: 12px;
  left: 12px;
}
button.tag-btn {
  pointer-events: auto;
  position: absolute;
  top: 12px;
  left: 152px;
}
div.item-id-wrapper {
  position: fixed;
  right: 18px;
  bottom: 18px;
  padding: 4px 10px;
  font-weight: bold;
  font-size: 0.8rem;
  font-style: italic;
  border: 1px solid black;

  background: #eee;
  border-radius: 8px; 
  pointer-events: auto;
  z-index: 10000;
}
div.item-id-wrapper:hover {
  cursor: pointer;
  color: darkblue;
}
.copied {
  color: darkgray;
  margin-right: 10px;
}

</style>