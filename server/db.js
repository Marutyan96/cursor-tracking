const { Sequelize } = require('sequelize');

// Тестовые данные для подключения (работают без доп. настроек)
const sequelize = new Sequelize('cursor_tracking', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false
});

// Проверка подключения
sequelize.authenticate()
  .then(() => console.log('PostgreSQL подключен успешно!'))
  .catch(err => console.error('Ошибка подключения:', err));

const models = {
  ConnectionLog: sequelize.define('ConnectionLog', {
    userId: { type: Sequelize.STRING, allowNull: false },
    event: { type: Sequelize.STRING, allowNull: false },
    socketId: { type: Sequelize.STRING, allowNull: false },
    timestamp: { type: Sequelize.DATE, allowNull: false }
  }),
  MovementLog: sequelize.define('MovementLog', {
    userId: { type: Sequelize.STRING, allowNull: false },
    x: { type: Sequelize.INTEGER, allowNull: false },
    y: { type: Sequelize.INTEGER, allowNull: false },
    timestamp: { type: Sequelize.DATE, allowNull: false }
  })
};

// Синхронизация (создание таблиц)
sequelize.sync({ force: true }) // force: true - пересоздает таблицы при каждом запуске
  .then(() => console.log('Таблицы созданы!'))
  .catch(err => console.error('Ошибка создания таблиц:', err));

module.exports = { sequelize, models };