<template>
  <div class="welcome">
    <div class="card-container">
    <button 
      v-for="(type, index) in Object.keys(questionTypes)"
      :key="index"
      class="button"
      @click="emit('addNew', type)"
      style="margin: 10px; padding: 10px; width: 200px; height: 200px;"
    >
    <span 
    class="button-text"
    style="justify-content: center;"
    >
    <span class="button-text">{{ questionTypes[type].description }}</span>
    </span>
    </button>
  </div>
</div>
</template>

<script setup>
import questionTypes from '../helpers/questionTypes.js'

const emit = defineEmits(['addNew'])

</script> 

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

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
}
</style>
