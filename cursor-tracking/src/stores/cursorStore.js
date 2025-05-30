import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { throttle } from 'lodash-es';

export const useCursorStore = defineStore('cursor', {
  state: () => ({
    socket: null,
    userId: 'user-' + Math.random().toString(36).substr(2, 6),
    myCursor: { x: 0, y: 0 },
    otherCursors: {},
    connectionLogs: [],
    movementHistory: [],
    userColors: {}
  }),

  actions: {
    initSocket() {
      this.socket = io('http://localhost:3000', {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      this.socket.on('heartbeat', () => {
        this.socket.emit('heartbeat-ack');
      });
      
      this.socket.on('connect', () => {
        this.socket.emit('register', this.userId);
        this.userColors[this.userId] = this.generateColor(this.userId);
        this.addConnectionLog('connect');
      });

      this.socket.on('cursorUpdate', ({ userId, x, y }) => {
        if (!this.userColors[userId]) {
          this.userColors[userId] = this.generateColor(userId);
        }
        this.otherCursors[userId] = { 
          x, 
          y, 
          color: this.userColors[userId],
          lastUpdated: Date.now()
        };
        this.addMovementLog(userId, x, y);
      });

      this.socket.on('userConnected', (userId) => {
        this.addConnectionLog('connect', userId);
      });

      this.socket.on('userDisconnected', (userId) => {
        this.addConnectionLog('disconnect', userId);
        delete this.otherCursors[userId];
      });

      setInterval(() => this.cleanInactiveCursors(), 1000);
    },

    addConnectionLog(event, userId = this.userId) {
      this.connectionLogs.push({
        userId,
        event,
        timestamp: new Date()
      });
    },

    addMovementLog(userId, x, y) {
      this.movementHistory.push({
        userId,
        x,
        y,
        timestamp: new Date()
      });
    },

    cleanInactiveCursors() {
      const now = Date.now();
      for (const userId in this.otherCursors) {
        if (now - this.otherCursors[userId].lastUpdated > 10000) { // 10 секунд
          delete this.otherCursors[userId];
          this.addConnectionLog('timeout', userId);
        }
      }
    },

    sendCursorPosition: throttle(function(x, y) {
      if (this.socket?.connected) {
        this.socket.emit('cursorMove', {
          userId: this.userId,
          x: Math.round(x),
          y: Math.round(y)
        });
      }
    }, 50),

    generateColor(userId) {
      const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'];
      const hash = [...userId].reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      return colors[hash % colors.length];
    }
  },

  getters: {
    formattedConnectionLogs: (state) => {
      return [...state.connectionLogs].reverse().map(log => ({
        ...log,
        time: new Date(log.timestamp).toLocaleTimeString()
      }));
    },
    formattedMovementHistory: (state) => {
      return [...state.movementHistory].reverse().map(move => ({
        ...move,
        time: new Date(move.timestamp).toLocaleTimeString()
      }));
    }
  }
});