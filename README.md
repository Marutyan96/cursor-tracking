# Real-time Cursor Tracking

Приложение для отслеживания курсоров нескольких пользователей в реальном времени с сохранением истории в PostgreSQL.

## Технологии
- Frontend: Vue 3, Pinia, PrimeVue
- Backend: Node.js, Express, Socket.IO
- База данных: PostgreSQL + Sequelize (ORM)

## Требования
- Node.js v18+
- PostgreSQL 13+
- npm 9+

## Быстрый запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/ваш-логин/cursor-tracker.git
cd cursor-tracker
```

### 2. Настройка базы данных
```bash
sudo -u postgres psql -c "CREATE DATABASE cursor_tracking;"
sudo -u postgres psql -c "CREATE USER cursor_user WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cursor_tracking TO cursor_user;"
```

### 3. Запуск сервера
```bash
cd server
npm install
echo "DB_NAME=cursor_tracking" > .env
echo "DB_USER=cursor_user" >> .env
echo "DB_PASSWORD=password" >> .env
echo "DB_HOST=localhost" >> .env
node server.js
```

### 4. Запуск клиента
```bash
cd ../cursor-tracking
npm install
npm run build
```

Откройте в браузере: [http://localhost:3000](http://localhost:3000)

## Docker-версия (рекомендуется)
```bash
docker-compose up --build
```
Доступно на [http://localhost:3000](http://localhost:3000)

## Структура БД (Sequelize)
Таблицы создаются автоматически при первом запуске:
- `ConnectionLogs` - история подключений
- `MovementLogs` - история перемещений

## Демонстрация
[Ссылка на видео-демонстрацию]()