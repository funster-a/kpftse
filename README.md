# Техснабэлектрикс - Сайт компании

Full-stack проект для компании Техснабэлектрикс.

## Структура проекта

- `frontend/` - React приложение (Vite)
- `workers/` - Cloudflare Worker (API для Telegram бота и заявок)
- `backend/` - Старый Node.js backend (не используется, можно удалить)

## Быстрый старт

### Локальная разработка

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend (Cloudflare Workers):**
```bash
cd workers
npm install
npm run deploy
```

### Деплой в продакшн

**Рекомендуется:** Cloudflare Pages (бесплатно, интеграция с Workers)

1. Подключите GitHub репозиторий к Cloudflare Pages
2. Настройки:
   - Framework: Vite
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `frontend`
3. Добавьте переменную окружения:
   - `VITE_API_URL` = `https://kpftse-telegram-api.300amiri.workers.dev`

Подробная инструкция в `DEPLOY.md`

## Основные возможности

- ✅ Каталог товаров
- ✅ Отправка заявок через формы
- ✅ Интеграция с Telegram ботом
- ✅ База данных заявок (Cloudflare D1)
- ✅ Экспорт заявок в CSV
- ✅ Управление заявками через Telegram бота
