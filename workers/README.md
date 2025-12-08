# Cloudflare Worker для Telegram бота и заявок

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка секретов
```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
```

### 3. Создание БД
```bash
wrangler d1 create kpftse-orders
# Скопируйте database_id в wrangler.toml
```

### 4. Создание схемы БД
```bash
wrangler d1 execute kpftse-orders --remote --command="CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, company TEXT, comment TEXT, status TEXT DEFAULT 'new', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
wrangler d1 execute kpftse-orders --remote --command="CREATE TABLE IF NOT EXISTS order_products (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER, product_name TEXT NOT NULL, product_price TEXT, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE);"
```

### 5. Настройка Webhook
```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://kpftse-telegram-api.300amiri.workers.dev/api/telegram-webhook"}'
```

### 6. Деплой
```bash
npm run deploy
```

## API Endpoints

- `POST /api/orders` - Создать заявку
- `POST /api/contact` - Отправить контактную форму
- `GET /api/orders` - Получить заявки (query: ?status=new&limit=10)
- `GET /api/stats` - Статистика
- `GET /api/export` - Экспорт заявок в CSV (query: ?status=new&startDate=2025-01-01&endDate=2025-12-31)
- `PATCH /api/orders/:id` - Обновить статус
- `POST /api/telegram-webhook` - Webhook для Telegram бота
- `GET /health` - Проверка работоспособности

## Команды Telegram бота

- `/start` - Главное меню
- `/orders` - Список заявок
- `/stats` - Статистика
- Кнопка "📥 Экспорт" - Экспорт заявок в CSV (выбор фильтра)

## Локальная разработка

```bash
# Создайте .dev.vars
TELEGRAM_BOT_TOKEN=ваш_токен
TELEGRAM_CHAT_ID=ваш_chat_id

# Запустите локально
npm run dev
```

## Полезные команды

```bash
# Просмотр логов
wrangler tail

# Проверка БД
wrangler d1 execute kpftse-orders --remote --command="SELECT * FROM orders;"

# Проверка webhook
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```
