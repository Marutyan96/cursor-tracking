<template>
  <div class="container">
    <h2>Трекинг курсоров в реальном времени</h2>
    <div class="canvas-wrapper">
      <div 
        ref="canvas" 
        class="cursor-canvas"
        @mousemove="handleMouseMove"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- След курсора -->
        <div 
          v-for="(point, index) in trail"
          :key="index"
          class="trail-dot"
          :style="{
            left: `${point.x}px`,
            top: `${point.y}px`,
            backgroundColor: store.userColors[store.userId],
            opacity: index / trail.length * 0.7
          }"
        />

        <!-- Плавный курсор текущего пользователя -->
        <div 
          v-if="isMouseInside"
          class="cursor-point my-cursor"
          :style="{
            left: `${smoothCursor.x}px`,
            top: `${smoothCursor.y}px`,
            backgroundColor: store.userColors[store.userId]
          }"
        >
          <span class="cursor-label">Вы ({{ Math.round(smoothCursor.x) }}, {{ Math.round(smoothCursor.y) }})</span>
        </div>
        
        <!-- Курсоры других пользователей -->
        <div 
          v-for="(cursor, userId) in store.otherCursors"
          :key="userId"
          class="cursor-point other-cursor"
          :style="{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            backgroundColor: cursor.color
          }"
        >
          <span class="cursor-label">Пользователь {{ userId }} ({{ cursor.x }}, {{ cursor.y }})</span>
        </div>
      </div>
    </div>
    <div class="info-panel">
      <div>Ваш ID: {{ store.userId }}</div>
      <div>Пользователей онлайн: {{ Object.keys(store.otherCursors).length + 1 }}</div>
    </div>
  </div>
</template>

<script setup>
import { useCursorStore } from '@/stores/cursorStore';
import { ref, reactive, onMounted } from 'vue';
// Автоматическое обновление активности
const updateActivity = () => {
  if (store.socket?.connected) {
    store.sendCursorPosition(
      store.myCursor.x, 
      store.myCursor.y
    );
  }
};

// Обновляем позицию каждые 2 секунды, даже если курсор не двигается
const activityInterval = setInterval(updateActivity, 2000);
import { onUnmounted } from 'vue' 

onUnmounted(() => {
  clearInterval(activityInterval);
});
const store = useCursorStore();
const canvas = ref(null);
const isMouseInside = ref(false);
const trail = reactive([]);
const smoothCursor = reactive({ x: 0, y: 0 });

const animate = () => {
  requestAnimationFrame(animate);
  smoothCursor.x += (store.myCursor.x - smoothCursor.x) * 0.15;
  smoothCursor.y += (store.myCursor.y - smoothCursor.y) * 0.15;
  
  if (isMouseInside.value) {
    if (trail.length > 10) trail.shift();
    trail.push({ x: smoothCursor.x, y: smoothCursor.y });
  }
};

onMounted(() => {
  store.initSocket();
  animate();
});

const handleMouseMove = (e) => {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, 300));
    const y = Math.max(0, Math.min(e.clientY - rect.top, 300));
    
    store.myCursor = { x, y };
    store.sendCursorPosition(x, y);
  }
};

const handleMouseEnter = () => {
  isMouseInside.value = true;
};

const handleMouseLeave = () => {
  isMouseInside.value = false;
  trail.length = 0;
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.canvas-wrapper {
  border: 2px solid #2c3e50;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.cursor-canvas {
  width: 300px;
  height: 300px;
  position: relative;
  background-color: white;
}

.cursor-point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: transform 0.05s ease-out;
}

.my-cursor {
  border: 2px solid white;
  box-shadow: 0 0 0 2px currentColor;
  z-index: 15;
}

.other-cursor {
  animation: pulse 1.5s infinite;
}

.trail-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
}

.cursor-label {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.info-panel {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #2c3e50;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); }
}
</style>