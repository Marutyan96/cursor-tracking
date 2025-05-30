const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

// Инициализация приложения
const app = express();
app.use(cors());
const httpServer = createServer(app);

// Корректная инициализация Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 60000
  }
});

// Константы
const HEARTBEAT_INTERVAL = 3000; // 3 секунды
const activeUsers = new Map();
const connectionLogs = [];
const movementHistory = [];

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, '../cursor-tracking/dist')));

// Обработка WebSocket соединений
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  
  const userData = {
    lastHeartbeat: Date.now(),
    userId: null
  };

  // Heartbeat механизм
  const heartbeatInterval = setInterval(() => {
    if (Date.now() - userData.lastHeartbeat > HEARTBEAT_INTERVAL * 2) {
      handleDisconnect('heartbeat timeout');
      clearInterval(heartbeatInterval);
    } else {
      socket.emit('heartbeat');
    }
  }, HEARTBEAT_INTERVAL);

  socket.on('heartbeat', () => {
    userData.lastHeartbeat = Date.now();
  });

  socket.on('register', (userId) => {
    userData.userId = userId;
    activeUsers.set(socket.id, userData);
    
    connectionLogs.push({
      userId,
      event: 'connect',
      timestamp: new Date(),
      socketId: socket.id
    });
    
    socket.broadcast.emit('userConnected', userId);
  });

  socket.on('cursorMove', ({ userId, x, y }) => {
    movementHistory.push({
      userId,
      x,
      y,
      timestamp: new Date()
    });
    socket.broadcast.emit('cursorUpdate', { userId, x, y });
  });

  socket.on('disconnecting', (reason) => {
    handleDisconnect(reason);
  });

  socket.on('disconnect', () => {
    clearInterval(heartbeatInterval);
  });

  function handleDisconnect(reason) {
    if (userData.userId) {
      connectionLogs.push({
        userId: userData.userId,
        event: 'disconnect',
        timestamp: new Date(),
        socketId: socket.id,
        reason: reason || 'client disconnected'
      });
      io.emit('userDisconnected', userData.userId);
    }
    activeUsers.delete(socket.id);
  }
});

// Запуск сервера
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});