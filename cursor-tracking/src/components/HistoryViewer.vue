<template>
  <div class="history-viewer">
    <div class="history-section">
      <h3>История подключений</h3>
      <div v-if="store.formattedConnectionLogs.length" class="log-list">
        <div v-for="(log, index) in store.formattedConnectionLogs" :key="index" class="log-item">
          <span class="time">{{ log.time }}</span>
          <span class="user">{{ log.userId }}</span>
          <span class="event" :class="log.event">
            {{ log.event === 'connect' ? 'подключился' : 'отключился' }}
          </span>
        </div>
      </div>
      <div v-else class="empty-message">Нет данных о подключениях</div>
    </div>

    <div class="history-section">
      <h3>История перемещений</h3>
      <div v-if="store.formattedMovementHistory.length" class="movement-list">
        <div v-for="(move, index) in store.formattedMovementHistory.slice(0, 50)" 
             :key="index" class="move-item">
          <span class="time">{{ move.time }}</span>
          <span class="user">{{ move.userId }}</span>
          <span class="coords">({{ move.x }}, {{ move.y }})</span>
        </div>
      </div>
      <div v-else class="empty-message">Нет данных о перемещениях</div>
    </div>
  </div>
</template>

<script setup>
import { useCursorStore } from '@/stores/cursorStore';

const store = useCursorStore();
</script>

<style scoped>
.history-viewer {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.history-section {
  margin-bottom: 30px;
}

h3 {
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.log-list, .movement-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  background: #f9f9f9;
}

.log-item, .move-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 15px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.log-item:last-child, .move-item:last-child {
  border-bottom: none;
}

.time {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.user {
  font-family: monospace;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
}

.connect {
  background-color: #2ecc71;
  color: white;
}

.disconnect {
  background-color: #e74c3c;
  color: white;
}

.coords {
  font-family: monospace;
  color: #3498db;
}

.empty-message {
  padding: 15px;
  text-align: center;
  color: #7f8c8d;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px dashed #ddd;
}
</style>