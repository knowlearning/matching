<template>
  <div class="welcome">
    <h2>{{ t('welcome-to-the-pila-customiser') }}</h2>

    <v-container>
      <v-row>
        <v-col

          cols="12"
          sm="12" md="6" lg="6" 
          v-for="type in Object.keys(questionTypes)"
          :key="`card-for-type-${type}`"
        >
          <v-card
            elevation="6"
            style="margin: 8px auto; max-width: 400px;"
          >
            <template v-slot:title>
              <span class="font-weight-black">{{  t(type.split('=')[1]) }}</span>
            </template>

            <v-card-text
              class="bg-surface-light pt-4"
              style=" height: 100px; overflow-y: auto;"
            >
              {{ t(type.split('=')[1] + '-description') }}
            </v-card-text>
            <v-card-actions class="justify-space-around">
              <v-btn
                @click="previewType(type)"
                prepend-icon="fa-solid fa-eye"
              >
                {{ t('see-example') }}
              </v-btn>
              <v-btn
                @click="emit('addNew', type)"
                prepend-icon="fa-solid fa-plus">
                {{ t('create-new') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import questionTypes from '../helpers/questionTypes.js'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }
const emit = defineEmits(['addNew'])

function previewType(type) {
  const idToPreview = questionTypes[type].sample
  store.dispatch('previewContent', idToPreview)
}

</script> 

<style scoped>
.welcome h2 {
  margin-top: 30px;
}

</style>
