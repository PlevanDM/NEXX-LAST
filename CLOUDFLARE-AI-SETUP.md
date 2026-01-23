# 🤖 Cloudflare AI Gateway Setup для NEXX

## ✅ Что настроено

### 1. AI Functions
- ✅ `functions/api/ai-chat.js` - Базовый AI чат
- ✅ `functions/api/ai-assistant.js` - AI ассистент для сервиса NEXX

### 2. Доступные модели
- ✅ `@cf/meta/llama-3.1-8b-instruct` - Llama 3.1 8B (быстрая)
- ⚠️ `@cf/meta/llama-3.1-70b-instruct` - Llama 3.1 70B (более точная, но медленнее)

## 🚀 Использование

### API Endpoint: `/api/ai-chat`

**Простой AI чат:**
```javascript
const response = await fetch('https://nexxgsm.com/api/ai-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Why should you use Cloudflare for your AI inference?',
    gatewayId: 'gateway-123' // опционально
  })
});

const data = await response.json();
console.log(data.response);
```

### API Endpoint: `/api/ai-assistant`

**AI ассистент для сервиса NEXX:**
```javascript
const response = await fetch('https://nexxgsm.com/api/ai-assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'Cât costă repararea ecranului pentru iPhone 15?',
    device: 'iPhone 15',
    problem: 'Ecran spart',
    language: 'ro' // ro, uk, en
  })
});

const data = await response.json();
console.log(data.answer);
```

## 🔧 Настройка AI Gateway

### 1. Создание AI Gateway

1. Перейдите: https://dash.cloudflare.com/
2. Выберите ваш аккаунт
3. Перейдите в **AI Gateway**
4. Нажмите **"Create Gateway"**
5. Настройте:
   - **Name:** `nexx-ai-gateway`
   - **Model:** `@cf/meta/llama-3.1-8b-instruct`
   - **Rate Limits:** Настройте по необходимости
6. Скопируйте **Gateway ID**

### 2. Использование Gateway ID

Добавьте Gateway ID в запросы:
```typescript
const response = await env.AI.run(
  '@cf/meta/llama-3.1-8b-instruct',
  {
    prompt: 'Your prompt here',
  },
  {
    gateway: {
      id: 'your-gateway-id-here'
    }
  }
);
```

## 📊 Доступные модели Cloudflare AI

### Text Generation
- `@cf/meta/llama-3.1-8b-instruct` - Быстрая, хорошая для чатов
- `@cf/meta/llama-3.1-70b-instruct` - Более точная, медленнее
- `@cf/meta/llama-3.2-3b-instruct` - Очень быстрая, легкая
- `@cf/meta/llama-3.2-11b-instruct` - Баланс скорости и качества

### Embeddings
- `@cf/baai/bge-base-en-v1.5` - Английские эмбеддинги
- `@cf/baai/bge-small-en-v1.5` - Легкие английские эмбеддинги

### Translation
- `@cf/meta/m2m100-1.2b` - Многоязычный перевод

## 💡 Примеры использования

### 1. Интеграция в Callback Modal

```javascript
// В index.html или React компоненте
async function askAI(question) {
  const response = await fetch('/api/ai-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: question,
      language: window.i18n?.getLanguage() || 'ro'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    return data.answer;
  }
  return 'Извините, AI сервис временно недоступен.';
}
```

### 2. Автоматические ответы на вопросы

```javascript
// Автоматический ответ на частые вопросы
const faqAnswers = {
  'preț': async (device) => {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: `Care sunt prețurile pentru ${device}?`,
        device: device,
        language: 'ro'
      })
    });
    return await response.json();
  }
};
```

## 🔐 Безопасность

- ✅ CORS настроен для всех источников (можно ограничить)
- ✅ Валидация входных данных
- ✅ Обработка ошибок
- ✅ Rate limiting через AI Gateway

## 📝 Конфигурация

### wrangler.toml
```toml
# AI доступен автоматически в Cloudflare Workers/Pages
# Не требует дополнительной настройки
```

### Environment Variables
AI доступен через `env.AI` в Cloudflare Workers/Pages Functions.

## 🎯 Рекомендации

1. **Используйте AI Gateway** для мониторинга и rate limiting
2. **Кешируйте частые вопросы** для экономии токенов
3. **Настройте fallback** на статические ответы при ошибках AI
4. **Мониторьте использование** через Cloudflare Dashboard

## 📚 Документация

- [Cloudflare AI Models](https://developers.cloudflare.com/workers-ai/models/)
- [AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Workers AI](https://developers.cloudflare.com/workers-ai/)
