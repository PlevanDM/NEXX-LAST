# 🚀 Быстрый запуск NEXX в Docker

## Шаг 1: Установка Docker Desktop

**Вариант A: Через скрипт (требует прав администратора)**
```powershell
.\install-docker.ps1
```

**Вариант B: Вручную**
1. Скачайте: https://docs.docker.com/desktop/install/windows-install/
2. Установите Docker Desktop
3. Запустите Docker Desktop и дождитесь загрузки

## Шаг 2: Запуск проекта

### Простой запуск (production):
```powershell
.\start-docker.ps1
```

### Development режим (с hot reload):
```powershell
.\start-docker.ps1 dev
```

Приложение будет доступно:
- **Production**: http://localhost:3000
- **Development**: http://localhost:5173

## Шаг 3: Настройка туннеля (для внешнего доступа)

### Cloudflare Tunnel (рекомендуется):
```powershell
# 1. Установите cloudflared
winget install --id Cloudflare.cloudflared

# 2. Создайте туннель и получите токен
cloudflared tunnel login
cloudflared tunnel create nexx-tunnel
cloudflared tunnel token nexx-tunnel

# 3. Запустите с туннелем
$env:TUNNEL_TOKEN="your-token"
.\start-tunnel.ps1
```

### ngrok (проще):
```powershell
# 1. Получите токен на https://ngrok.com/
# 2. Запустите
$env:NGROK_AUTH_TOKEN="your-token"
docker-compose -f docker-compose.tunnel.yml --profile ngrok up
```

## 📋 Команды

```powershell
# Запуск
docker-compose up --build

# Остановка
docker-compose down

# Логи
docker-compose logs -f

# Проверка статуса
docker ps
```

## 🔍 Проверка

```powershell
# Проверьте, что Docker работает
docker --version
docker info

# Проверьте, что контейнер запущен
docker ps

# Откройте браузер
start http://localhost:3000
```

## ⚠️ Если что-то не работает

1. **Docker не запускается**: Перезапустите Docker Desktop
2. **Порт занят**: Измените порт в `docker-compose.yml`
3. **Ошибки при сборке**: `docker-compose build --no-cache`

Полная документация: см. `DOCKER_SETUP.md` и `TUNNEL_SETUP.md`
