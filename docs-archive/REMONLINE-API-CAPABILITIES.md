# Remonline API — что подключено и что ещё можно использовать

## Текущая интеграция (NEXX)

### POST `/api/remonline` (Cloudflare Worker)

| formType / action | Назначение |
|-------------------|------------|
| `repair_order` | Заказ ремонта: клиент + заказ (branch_id, client_id, kindof_good, brand, model, malfunction, manager_notes) |
| `callback` | Заявка на обратный звонок (тот же заказ с пометкой в manager_notes) |
| `diagnostic` | Отправка результата диагностики (POST на условный `/diagnostics`) |
| `document` / `document_request` | Запрос документа по заказу (POST на условный `/documents/request`) |
| `create_inquiry` / `create_lead` | Лид с калькулятора: клиент + заказ с пометкой "Calculator lead" |
| `generate_document` | Генерация документа по шаблону (локально, без вызова Remonline) |
| `send_document_email` | Отправка документа на email (очередь, без реальной почты в коде) |
| `booking` / `appointment` / `create_booking` | Запись на визит: создаётся заказ с типом «Vizită» и пометкой PROGRAMARE VIZITĂ |

Используемые вызовы Remonline:
- `POST /token/new` — получение токена по `api_key`
- `POST /clients/` — создание клиента (name, phone)
- `GET /clients/?phones[]=...` — поиск клиента по телефону
- `POST /order/` — создание заказа (branch_id, client_id, kindof_good, brand, model, malfunction, manager_notes)

### GET `/api/remonline?action=...`

| action | Параметры | Описание |
|--------|-----------|----------|
| `get_order` | `id` — ID заказа | Статус заказа. Запрос к Remonline: `GET /order/?token=...&ids[]=id` |
| `get_branches` | — | Список филиалов (адреса, телефоны). `GET /branches/?token=...` |
| `get_statuses` | — | Список статусов заказов (для подписи «В работе», «Готов» и т.д.). `GET /statuses/?token=...` |
| `get_services` | — | Список услуг (без цен). `GET /services/?token=...` |
| `get_prices` | `device_type`, `issue_type` | Цены (если у Remonline есть endpoint `/prices`; иначе 404) |

Конфиг в проекте: `remonline.config.json` (baseUrl, branchId, endpoints-справочник).

---

## Что ещё можно использовать

Ниже — возможности API по открытым клиентам (например [RemonlineClient](https://github.com/mityayka1/RemonlineClient)) и типичным CRM. Точные пути нужно сверять с актуальной документацией Remonline (api.remonline.app / api.remonline.ru).

### Уже есть в конфиге, но не вызываются из воркера

- **Orders (список)** — получение списка заказов с фильтрами (по клиенту, дате, филиалу) для личного кабинета или админки.
- **Inquiries** — если в Remonline есть отдельные «обращения», их можно создавать/читать через `/api/inquiries`.
- **Services** — список услуг и, при наличии, прайс для отображения на сайте.
- **People** — сотрудники (мастера/менеджеры), например для формы «Выбор мастера» или контактов.
- **Bookings** — запись на приём: чтение слотов и создание брони (если API поддерживает).
- **Stock** — остатки/склад при необходимости показа «есть в наличии».

### Идеи для сайта

1. **Страница «Отследить заказ»**  
   Уже есть: `GET /api/remonline?action=get_order&id=...`. На фронте можно добавить форму ввода номера заказа и показывать статус; подписи брать из `get_statuses`.

2. **Блок «Наши филиалы»**  
   `get_branches` — вывести адреса, телефоны, часы работы (если приходят в ответе).

3. **Человекочитаемые статусы**  
   `get_statuses` — маппинг `status_id` заказа на название и, при желании, на цвет/иконку в интерфейсе.

4. **Запись на приём**  
   Если Remonline даёт API по бронированию — отдельный action в воркере (например `get_slots` + `create_booking`) и форма на сайте.

5. **Прайс/услуги**  
   При наличии `/services` или `/prices` — блок «Услуги и цены» без ручного дублирования.

---

## Безопасность

- API key и опционально `REMONLINE_BASE_URL`, `REMONLINE_BRANCH_ID` задаются в Cloudflare (env), не в коде.
- GET `get_order` отдаёт данные заказа по ID — имеет смысл не показывать чувствительные поля клиенту или проверять привязку к сессии/телефону.
- Остальные GET (branches, statuses) — справочники, кэшируются в воркере (Cache-Control).

---

## Полезные ссылки

- [RemonlineClient (JS)](https://github.com/mityayka1/RemonlineClient) — примеры: token, branches, order (GET/POST), statuses, clients.
- [remonline (PHP)](https://github.com/ushakovme/remonline) — ещё один клиент с токеном и запросами к API.
- Официальная документация Remonline — уточнять на remonline.app / в кабинете партнёра.
