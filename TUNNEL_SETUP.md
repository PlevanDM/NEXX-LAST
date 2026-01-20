# 🌐 Настройка туннеля для NEXX

Этот документ описывает, как запустить проект NEXX в Docker с туннелем для внешнего доступа.

## 🚀 Быстрый старт

### Вариант 1: Cloudflare Tunnel (рекомендуется)

1. **Создайте Cloudflare Tunnel:**
   ```bash
   # Установите cloudflared (если еще не установлен)
   # Windows: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   
   # Авторизуйтесь
   cloudflared tunnel login
   
   # Создайте туннель
   cloudflared tunnel create nexx-tunnel
   
   # Создайте конфиг (файл ~/.cloudflared/config.yml)
   tunnel: nexx-tunnel
   credentials-file: ~/.cloudflared/[tunnel-id].json
   
   ingress:
     - hostname: nexx-tunnel.your-domain.com
       service: http://localhost:3000
     - service: http_status:404
   ```

2. **Получите токен:**
   ```bash
   cloudflared tunnel token nexx-tunnel
   ```

3. **Запустите с туннелем:**
   ```bash
   export TUNNEL_TOKEN=your-token-here
   docker-compose -f docker-compose.tunnel.yml up
   ```

### Вариант 2: ngrok (проще, но требует регистрации)

1. **Получите бесплатный токен:**
   - Зарегистрируйтесь на https://ngrok.com/
   - Получите токен на странице https://dashboard.ngrok.com/get-started/your-authtoken

2. **Запустите с ngrok:**
   ```bash
   export NGROK_AUTH_TOKEN=your-ngrok-token
   docker-compose -f docker-compose.tunnel.yml --profile ngrok up
   ```

3. **URL будет в логах ngrok:**
   ```
   Forwarding  https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://nexx-prod:3000
   ```

### Вариант 3: localhost.run (без регистрации, но нестабильно)

1. **Установите SSH туннель:**
   ```bash
   ssh -R 80:localhost:3000 ssh.localhost.run
   ```

2. **Или используйте встроенный скрипт:**
   ```bash
   # Сначала запустите Docker контейнер
   docker-compose up -d nexx-prod
   
   # Затем создайте туннель
   ssh -R 80:localhost:3000 ssh.localhost.run
   ```

## 📋 Команды Docker

### Простой запуск (без туннеля, только локально)

```bash
# Production режим
docker-compose up --build nexx-prod

# Development режим
docker-compose up --build nexx-dev
```

### Запуск с туннелем

```bash
# Cloudflare Tunnel
TUNNEL_TOKEN=your-token docker-compose -f docker-compose.tunnel.yml up

# ngrok
NGROK_AUTH_TOKEN=your-token docker-compose -f docker-compose.tunnel.yml --profile ngrok up
```

### Остановка

```bash
docker-compose down
# или
docker-compose -f docker-compose.tunnel.yml down
```

### Просмотр логов

```bash
docker-compose logs -f nexx-prod
docker-compose logs -f cloudflare-tunnel
docker-compose logs -f ngrok
```

## 🔧 Переменные окружения

Создайте файл `.env` для удобства:

```env
# Cloudflare Tunnel
TUNNEL_TOKEN=your-cloudflare-tunnel-token

# ngrok (альтернатива)
NGROK_AUTH_TOKEN=your-ngrok-authtoken

# Режим работы
NODE_ENV=production
```

## 📝 Примечания

1. **Cloudflare Tunnel** - бесплатный, стабильный, но требует настройки
2. **ngrok** - простой в использовании, но бесплатный план ограничен
3. **localhost.run** - самый простой, но нестабильный

## 🔒 Безопасность

- Не коммитьте `.env` файл с токенами
- Используйте HTTPS для production
- Настройте CORS для API endpoints

## 🆘 Решение проблем

### Порт уже занят
```bash
# Измените порт в docker-compose.yml
ports:
  - "3001:3000"  # Вместо 3000:3000
```

### Туннель не подключается
```bash
# Проверьте логи
docker-compose logs cloudflare-tunnel

# Проверьте, что контейнер запущен
docker ps
```

### Нужно пересобрать образ
```bash
docker-compose build --no-cache
docker-compose up
```
