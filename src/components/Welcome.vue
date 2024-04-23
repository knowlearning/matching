<template>
  <div class="welcome">
    <div class="card-container">
    <button 
      v-for="(type, index) in types"
      :key="index"
      class="button"
      @click="emit('addNew', type)"
      style="margin: 10px; padding: 10px; width: 200px; height: 200px;"
    >
    <span 
    class="button-text"
    style="justify-content: center;"
    >
    <span class="button-text">{{ getTypeDescription(type) }}</span>
    </span>
    </button>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import questionTypes from '../helpers/questionTypes.js'

const store = useStore();
const emit = defineEmits(['addNew'])

const types = ref(Object.keys(questionTypes))

const getTypeName = (type) => {
  const parts = type.split(';type=');
  return parts[parts.length - 1];
}
const getTypeDescription = (type) => {
  const typeDescriptions = {
    'application/json;type=matching': 'Matching ToQ',
    'application/json;type=rearrange-items': 'Rearrange Items ToQ',
    'application/json;type=select-from-pairs': 'Select From Pairs ToQ',
    'application/json;type=sequence': 'Sequence'
  };
  return typeDescriptions[type] || 'Unknown Type';
}

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
