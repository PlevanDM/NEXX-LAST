# Личный кабинет (Cabinet) — настройка

## Назначение
Пользователь входит по номеру телефона (который есть в Remonline как клиент) и видит список своих заказов.

## Переменные окружения
- **REMONLINE_API_KEY** — обязательна (уже используется для заказов).
- **CABINET_JWT_SECRET** — опционально; если не задана, для подписи JWT используется `REMONLINE_API_KEY`.

В Cloudflare Pages: Settings → Environment variables. Локально — в `.dev.vars` (в репозиторий не коммитить).

## API
- **POST /api/cabinet/login** — тело `{ "phone": "+40..." }`. Возвращает `{ success, token, client_id }` или ошибку (404 — клиент не найден).
- **GET /api/cabinet/orders** — заголовок `Authorization: Bearer <token>`. Возвращает `{ success, data: orders[] }`.
- **POST /api/cabinet/logout** — на клиенте достаточно удалить токен (сервер ничего не хранит).

## Remonline
- Поиск клиента: `GET /clients/?token=...&phones[]=...`.
- Заказы по клиенту: пробуем `GET /order/?token=...&client_id=...`; если API не поддерживает — запрашиваем список заказов и фильтруем по `client_id` на нашей стороне.

## Маршруты и фронт
- `/cabinet` отдаёт тот же `index.html` (SPA). В лендинге при `pathname === '/cabinet'` рендерится компонент кабинета (вход / список заказов).
- В навигации добавлена ссылка «Contul meu» / «Личный кабинет» на `/cabinet`.

## Безопасность
- JWT хранится в `localStorage` (или можно перейти на httpOnly cookie).
- Валидация телефона: минимум 8 символов, после нормализации — 10–15 цифр с `+`.
- Рекомендуется включить rate limit на `POST /api/cabinet/login` (Cloudflare Rate Limiting или Workers).
