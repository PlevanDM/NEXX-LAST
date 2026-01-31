# 🤖 Cloudflare AI - Настройка

## ✅ Токен проверен и работает

**API Token:** `IjLuzAMJBTdHDI0R23Cd_cft56YJWhOwC6EjAyGa` ✅

**Тест:** API успешно отвечает на запросы.

---

## 📋 AI Endpoints в проекте

### 1. `/api/ai-assistant` - AI помощник для сервиса

**Модель:** `@cf/meta/llama-3.1-8b-instruct`

**Использование:**
```javascript
// В Cloudflare Pages Functions AI доступен через env.AI
// Не требует дополнительных токенов - работает автоматически!
```

**Пример запроса:**
```javascript
POST /api/ai-assistant
{
  "question": "Cât costă reparația ecranului iPhone 15?",
  "device": "iPhone 15",
  "problem": "Ecran spart",
  "language": "ro"
}
```

**Ответ:**
```json
{
  "success": true,
  "answer": "Reparația ecranului pentru iPhone 15 costă între 1300-2000 lei...",
  "model": "@cf/meta/llama-3.1-8b-instruct",
  "language": "ro"
}
```

---

### 2. `/api/ai-chat` - Общий AI чат (поддерживает оба формата)

**Модель:** `@cf/meta/llama-3.1-8b-instruct`

**Формат 1: Simple prompt (простой)**
```javascript
POST /api/ai-chat
{
  "prompt": "Explain how to repair iPhone screen",
  "max_tokens": 512,
  "temperature": 0.7,
  "gatewayId": "optional-gateway-id"
}
```

**Формат 2: Messages (чат)**
```javascript
POST /api/ai-chat
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Who won the world series in 2020?" }
  ],
  "max_tokens": 512,
  "temperature": 0.7
}
```

**Ответ:**
```json
{
  "success": true,
  "response": "The Los Angeles Dodgers won the World Series in 2020...",
  "model": "@cf/meta/llama-3.1-8b-instruct",
  "format": "messages",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 45,
    "total_tokens": 69
  }
}
```

---

### 3. `/api/ai-test` - Тестовый endpoint (демонстрация обоих форматов)

**GET /api/ai-test** - Тестирует оба формата и возвращает результаты

**Пример ответа:**
```json
{
  "success": true,
  "model": "@cf/meta/llama-3-8b-instruct",
  "tests": [
    {
      "format": "prompt",
      "inputs": { "prompt": "Tell me a joke about Cloudflare" },
      "response": "Why did Cloudflare break up with the server? Because it was too slow!",
      "usage": { "prompt_tokens": 8, "completion_tokens": 15, "total_tokens": 23 }
    },
    {
      "format": "messages",
      "inputs": {
        "messages": [
          { "role": "system", "content": "You are a helpful assistant." },
          { "role": "user", "content": "Who won the world series in 2020?" }
        ]
      },
      "response": "The Los Angeles Dodgers won the World Series in 2020...",
      "usage": { "prompt_tokens": 24, "completion_tokens": 45, "total_tokens": 69 }
    }
  ]
}
```

---

## 🔧 Как работает AI в Cloudflare Pages

### Автоматический доступ

В Cloudflare Pages Functions AI доступен **автоматически** через `env.AI`:

```javascript
// functions/api/ai-assistant.js
export default {
  async fetch(request, env) {
    // env.AI доступен автоматически!
    const response = await env.AI.run(
      '@cf/meta/llama-3.1-8b-instruct',
      {
        messages: [...],
        max_tokens: 512,
        temperature: 0.7
      }
    );
    
    return new Response(JSON.stringify({ answer: response.response }));
  }
};
```

**Не нужно:**
- ❌ Добавлять API токены в Environment Variables
- ❌ Настраивать дополнительные ключи
- ❌ Использовать внешние API

**Нужно:**
- ✅ Просто использовать `env.AI.run()`
- ✅ Указать модель (например, `@cf/meta/llama-3.1-8b-instruct`)

---

## 📊 Доступные модели Cloudflare AI

| Модель | Описание | Использование |
|--------|----------|---------------|
| `@cf/meta/llama-3.1-8b-instruct` | Llama 3.1 8B (рекомендуется) | AI Assistant, Chat |
| `@cf/meta/llama-3-8b-instruct` | Llama 3 8B | Альтернатива |
| `@cf/meta/llama-2-7b-chat-fp16` | Llama 2 7B | Старая версия |

**В проекте используется:** `@cf/meta/llama-3.1-8b-instruct` ✅

---

## 🧪 Тестирование AI

### Через API напрямую:

```powershell
$headers = @{
    "Authorization" = "Bearer IjLuzAMJBTdHDI0R23Cd_cft56YJWhOwC6EjAyGa"
    "Content-Type" = "application/json"
}
$body = '{
    "messages": [
        {"role": "system", "content": "You are NEXX GSM assistant"},
        {"role": "user", "content": "Cât costă reparația ecranului iPhone 15?"}
    ]
}'
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/ad170d773e79a037e28f4530fd5305a5/ai/run/@cf/meta/llama-3-8b-instruct" -Method Post -Headers $headers -Body $body
```

### Через сайт:

```javascript
// Тест AI Assistant
fetch('https://nexx-gsm.pages.dev/api/ai-assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'Cât costă reparația ecranului iPhone 15?',
    device: 'iPhone 15',
    language: 'ro'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## ✅ Статус

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| **API Token** | ✅ Работает | Проверен |
| **AI Assistant** | ✅ Настроен | Использует env.AI |
| **AI Chat** | ✅ Настроен | Использует env.AI |
| **Модель** | ✅ Llama 3.1 8B | Актуальная версия |

---

## 📝 Примечания

1. **AI работает автоматически** в Cloudflare Pages Functions через `env.AI`
2. **Не нужны токены** - Cloudflare предоставляет AI бесплатно для Workers/Pages
3. **API Token** (`IjLuzAMJBTdHDI0R23Cd_cft56YJWhOwC6EjAyGa`) используется только для прямых API запросов, не для Pages Functions
4. **Модель** `@cf/meta/llama-3.1-8b-instruct` - самая новая и быстрая

---

**AI готов к использованию!** 🚀
