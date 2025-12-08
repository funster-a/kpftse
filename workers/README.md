# Cloudflare Worker для отправки заявок в Telegram

Этот проект использует Cloudflare Workers для отправки заявок из сайта в Telegram. Workers предоставляет бесплатный хостинг с хорошими лимитами.

## Преимущества Cloudflare Workers

- ✅ Бесплатный хостинг (100,000 запросов/день бесплатно)
- ✅ Глобальная сеть CDN (быстрая работа по всему миру)
- ✅ Автоматическое масштабирование
- ✅ Не нужно управлять сервером
- ✅ Интеграция с Cloudflare Pages

## Установка

1. Установите Wrangler CLI:
```bash
npm install -g wrangler
```

2. Войдите в Cloudflare:
```bash
wrangler login
```

3. Установите зависимости:
```bash
cd workers
npm install
```

## Настройка

### 1. Получите Telegram Bot Token

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям и сохраните токен

### 2. Получите Chat ID

**Для личного чата:**
- Начните диалог с вашим ботом
- Отправьте любое сообщение
- Используйте [@userinfobot](https://t.me/userinfobot) для получения Chat ID

**Для группы:**
- Добавьте бота в группу как администратора
- Отправьте сообщение в группу
- Используйте: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`

### 3. Установите секреты в Cloudflare

```bash
# Установите токен бота
wrangler secret put TELEGRAM_BOT_TOKEN
# Введите токен когда попросит

# Установите Chat ID
wrangler secret put TELEGRAM_CHAT_ID
# Введите Chat ID когда попросит
```

## Разработка

### Локальная разработка

1. Создайте файл `.dev.vars` в папке `workers`:
```env
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
```

2. Запустите локальный сервер:
```bash
npm run dev
```

Worker будет доступен на `http://localhost:8787`

### Тестирование

```bash
# Health check
curl http://localhost:8787/health

# Тестовая заявка
curl -X POST http://localhost:8787/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест",
    "phone": "+7 (777) 123-45-67",
    "email": "test@example.com",
    "company": "Тестовая компания",
    "comment": "Тестовая заявка",
    "products": [
      {
        "id": 1,
        "name": "Тестовый товар",
        "price": "1000 руб"
      }
    ]
  }'
```

## Деплой

### Продакшн

```bash
npm run deploy
```

После деплоя вы получите URL вида: `https://kpftse-telegram-api.your-subdomain.workers.dev`

### Staging

```bash
npm run deploy:staging
```

## Просмотр логов

```bash
wrangler tail
```

## Настройка CORS

В файле `src/index.js` обновите список разрешенных доменов:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-domain.pages.dev', // Ваш домен Cloudflare Pages
  'https://your-custom-domain.com', // Ваш кастомный домен
];
```

## Интеграция с Frontend

Обновите URL API в вашем фронтенде:

```env
# frontend/.env
VITE_API_URL=https://kpftse-telegram-api.your-subdomain.workers.dev
```

Или в коде:

```javascript
const API_URL = 'https://kpftse-telegram-api.your-subdomain.workers.dev';
```

## Лимиты Cloudflare Workers (бесплатный план)

- 100,000 запросов в день
- 10ms CPU time на запрос (достаточно для отправки в Telegram)
- 128MB памяти
- 50ms timeout (достаточно для Telegram API)

Для большинства сайтов этого более чем достаточно!

## Обновление секретов

```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
```

## Устранение неполадок

### Ошибка "chat not found"

1. Проверьте правильность Chat ID
2. Убедитесь, что бот добавлен в группу (если это группа)
3. Убедитесь, что вы начали диалог с ботом (если это личный чат)

### CORS ошибки

Обновите список `allowedOrigins` в `src/index.js` с вашим доменом.

### Проверка логов

```bash
wrangler tail --format pretty
```

## Миграция с Node.js backend

Если у вас был Node.js backend:

1. Удалите папку `backend/` (или оставьте для справки)
2. Обновите `VITE_API_URL` в frontend на URL вашего Worker
3. Деплойте Worker
4. Готово! 🎉

