<template>
  <transition name="message-fade" @after-leave="handleAfterLeave">
    <div 
      v-show="visible" 
      class="message" 
      :class="typeClass"
    >
      <span class="message-content">{{ content }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Message',
  props: {
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    duration: {
      type: Number,
      default: 1000 // 默认1秒
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    typeClass() {
      return `message-${this.type}`;
    }
  },
  mounted() {
    this.visible = true;
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    close() {
      this.visible = false;
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    handleAfterLeave() {
      this.onClose();
    }
  }
}
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 10px 20px;
  z-index: 2000;
  pointer-events: none;
}

.message-info {
  background-color: #f0f5ff;
  border: 1px solid #d6e4ff;
  color: #1890ff;
}

.message-success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.message-warning {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

.message-error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 