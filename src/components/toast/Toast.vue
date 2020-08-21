<template>
  <div class="toast">
    <transition-group tag="div" name="toastShow">
      <div class="toastMsg" v-for="toast in toasts" :key="toast.id">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="iconMap[toast.type]" />
        </svg>
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toasts: [],
      iconMap: {
        success: "#icon-success",
        warning: "#icon-warning",
        info: "#icon-info",
        error: "#icon-error"
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.toastMsg {
  margin-bottom: 5px;
  padding: 0 16px;
  width: auto;
  height: 32px;
  line-height: 32px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.toastShow-enter {
  opacity: 0;
  transition: all 0.3s ease;
}

.toastShow-enter-active {
  opacity: 0;
  transition: all 0.3s ease-out;
}

.toastShow-enter-to {
  opacity: 1;
}

.toastShow-leave-active {
  opacity: 1;
  transition: all 0.3s ease-out;
}

.toastShow-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
