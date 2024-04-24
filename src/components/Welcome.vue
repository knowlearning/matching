<template>
  <div class="welcome">
    <h2>Welcome to the PILA Customiser</h2>

    <v-container>
      <v-row>
        <v-col

          cols="12"
          sm="12" md="6" lg="6" 
          v-for="type in Object.keys(questionTypes)"
          :key="`card-for-type-${type}`"
        >
          <v-card style="margin: 8px 20px; max-width: 400px;">
            <template v-slot:title>
              <span class="font-weight-black">{{ type.split('=')[1] }}</span>
            </template>

            <v-card-text class="bg-surface-light pt-4">
              {{ questionTypes[type].description}}
            </v-card-text>
            <v-card-actions class="justify-space-around">
              <v-btn prepend-icon="fa-solid fa-eye">
                see example
              </v-btn>
              <v-btn
                @click="emit('addNew', type)"
                prepend-icon="fa-solid fa-plus">
                create new
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

const emit = defineEmits(['addNew'])

</script> 

<style scoped>
.welcome h2 {
  margin-top: 30px;
}

.cards-container {
  background: yellow;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
}
.card { margin: 20px; }
/*
.button {
  margin: 10px;
  padding: 10px;
  width: 200px;
  height: 200px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
  overflow: hidden;
  position: relative;
}
.button:active {
  transform: scale(0.95);
}
.button:focus {
  outline: none;
}
.button:hover {
  transform: scale(1.05);
  background-color: #e0e0e0;
}
.button:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.8) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.button:hover:before {
  opacity: 1;
}
.button-text {
  position: relative;
  z-index: 1;
  color: #333;
  font-size: 20px;
  text-align: center;
  transition: color 0.3s ease;
}
.button:hover .button-text {
  color: #fff;
}*/
</style>
