<template>
  <div class="welcome">
    <div class="card-container">
    <button 
      v-for="(type, index) in types"
      :key="index"
      @click="emit('customize', type)"
    >
      {{ type }} There will be the explanation of the type here
      <br>
      <i class="fas fa-plus"></i>
    </button>
  </div>
</div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import questionTypes from '../helpers/questionTypes.js'

const store = useStore();
const emit = defineEmits(['customize'])

const types = ref(Object.keys(questionTypes))

</script>

<style scoped>
.card-container {
  display: flex;
  widows: 800%;
  height: 100%;
  margin-top: 5%;
  margin-right: 5%;
}
.button {
  background-color: #f1f1f1;
  border: none;
  color: black;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 16px;
  padding: 10px 24px;
}

.card {
  width: 100px;
  height: 100px;
  margin: 10px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
}

/* Additional styling for button if needed */
.card button {
  background-color: #f1f1f1;
  border: none;
  color: black;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 16px;
  padding: 10px 24px;
}
</style>