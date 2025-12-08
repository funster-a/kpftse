# Деплой сайта

## Рекомендуемый вариант: Cloudflare Pages

### Преимущества:
- ✅ Бесплатный хостинг
- ✅ Автоматический деплой из GitHub
- ✅ Интеграция с Cloudflare Workers (уже используется)
- ✅ Быстрая загрузка (CDN)
- ✅ HTTPS автоматически
- ✅ Кастомный домен

### Шаг 1: Подготовка проекта

1. Убедитесь, что проект в GitHub репозитории
2. Проверьте, что `vite.config.ts` настроен правильно

### Шаг 2: Деплой через Cloudflare Dashboard

1. Зайдите на [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Выберите "Pages" → "Create a project"
3. Подключите GitHub репозиторий
4. Настройки сборки:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `frontend`

### Шаг 3: Настройка переменных окружения

В настройках проекта добавьте:
- `VITE_API_URL` = `https://kpftse-telegram-api.300amiri.workers.dev`

### Шаг 4: Деплой

После подключения репозитория, Cloudflare автоматически задеплоит сайт при каждом push в GitHub.

---

## Альтернативные варианты

### Вариант 2: Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Настройки:
   - **Framework:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Добавьте переменную окружения:
   - `VITE_API_URL` = `https://kpftse-telegram-api.300amiri.workers.dev`

### Вариант 3: Netlify

1. Зайдите на [netlify.com](https://netlify.com)
2. Подключите GitHub репозиторий
3. Настройки:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Добавьте переменную окружения:
   - `VITE_API_URL` = `https://kpftse-telegram-api.300amiri.workers.dev`

### Вариант 4: GitHub Pages

1. В `vite.config.ts` установите `base: '/your-repo-name/'`
2. Добавьте GitHub Action для автоматического деплоя
3. Ограничение: только статические файлы, нужен правильный base path

---

## Проверка после деплоя

1. Откройте задеплоенный сайт
2. Проверьте, что формы работают
3. Проверьте консоль браузера на ошибки
4. Убедитесь, что запросы идут на правильный API URL

## Настройка кастомного домена

### Cloudflare Pages:
1. В настройках проекта → Custom domains
2. Добавьте свой домен
3. Cloudflare автоматически настроит DNS

### Vercel/Netlify:
1. В настройках проекта → Domains
2. Добавьте свой домен
3. Настройте DNS записи согласно инструкциям

