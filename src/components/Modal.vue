<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper" >
        <div class="modal-container" @click.stop>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="close" @click="$emit('close')">
                <i class="fas fa-times" />
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
  
<script>
export default {
  name: 'Modal',
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  display: flex;
  flex-direction: column;
  margin: 10px auto;  
  height: 95%;
  width: 80%;
  min-width: 500px;
  overflow: scroll;
  background-color: #fff;
  border-radius: 12px;
}
.modal-header {
  background: black;
  color: white;
}
.modal-body {
  flex-grow: 1;
}
.modal-footer {
  text-align: right;
}
.modal-footer button.close {
  background: #eee;
}
.modal-footer button.close:hover {
  color: red;
}

</style>
