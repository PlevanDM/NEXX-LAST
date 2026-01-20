# 🐳 Docker Setup для NEXX

Инструкция по установке и запуску проекта NEXX в Docker на Windows.

## 📋 Требования

- Windows 10/11 (64-bit)
- 4GB RAM (минимум)
- WSL 2 (устанавливается автоматически с Docker Desktop)

## 🚀 Установка Docker Desktop

1. **Скачайте Docker Desktop:**
   - Перейдите на https://docs.docker.com/desktop/install/windows-install/
   - Скачайте Docker Desktop для Windows

2. **Установите Docker Desktop:**
   - Запустите установщик
   - Следуйте инструкциям мастера установки
   - Docker Desktop автоматически установит WSL 2, если его нет

3. **Запустите Docker Desktop:**
   - После установки запустите Docker Desktop из меню Пуск
   - Дождитесь полной загрузки (иконка Docker в трее перестанет мигать)

4. **Проверьте установку:**
   ```powershell
   docker --version
   docker-compose --version
   ```

## 🎯 Быстрый запуск

### Вариант 1: Production (собранное приложение)

```powershell
# Простой запуск
.\start-docker.ps1

# Или напрямую
docker-compose up --build nexx-prod
```

Приложение будет доступно по адресу: **http://localhost:3000**

### Вариант 2: Development (с hot reload)

```powershell
# Запуск в dev режиме
.\start-docker.ps1 dev

# Или напрямую
docker-compose up --build nexx-dev
```

Приложение будет доступно по адресу: **http://localhost:5173**

## 🌐 Запуск с туннелем

### Cloudflare Tunnel (рекомендуется)

1. **Установите cloudflared:**
   - Скачайте: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   - Или используйте Chocolatey: `choco install cloudflared`

2. **Создайте туннель:**
   ```powershell
   # Авторизуйтесь
   cloudflared tunnel login
   
   # Создайте туннель
   cloudflared tunnel create nexx-tunnel
   
   # Получите токен
   cloudflared tunnel token nexx-tunnel
   ```

3. **Запустите с туннелем:**
   ```powershell
   $env:TUNNEL_TOKEN="your-token-here"
   .\start-tunnel.ps1
   ```

### ngrok (проще, но требует регистрации)

1. **Зарегистрируйтесь на ngrok:**
   - Перейдите на https://ngrok.com/
   - Создайте бесплатный аккаунт
   - Получите токен на https://dashboard.ngrok.com/get-started/your-authtoken

2. **Запустите с ngrok:**
   ```powershell
   $env:NGROK_AUTH_TOKEN="your-ngrok-token"
   docker-compose -f docker-compose.tunnel.yml --profile ngrok up --build
   ```

3. **URL будет в логах:**
   ```
   Forwarding  https://xxxx-xxx-xxx-xxx.ngrok-free.app -> http://nexx-prod:3000
   ```

### localhost.run (без регистрации)

1. **Установите OpenSSH для Windows** (если еще не установлен)

2. **Создайте SSH туннель:**
   ```powershell
   # Сначала запустите Docker контейнер
   docker-compose up -d nexx-prod
   
   # Затем создайте туннель (в отдельном терминале)
   ssh -R 80:localhost:3000 ssh.localhost.run
   ```

## 📝 Команды Docker

### Управление контейнерами

```powershell
# Запуск
docker-compose up --build

# Запуск в фоне
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Пересборка образа
docker-compose build --no-cache
```

### Полезные команды

```powershell
# Список запущенных контейнеров
docker ps

# Список всех контейнеров
docker ps -a

# Просмотр логов конкретного контейнера
docker logs nexx-prod

# Войти в контейнер
docker exec -it nexx-prod sh

# Очистка неиспользуемых образов
docker system prune -a
```

## 🔧 Настройка

### Изменение портов

Отредактируйте `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Внешний порт:внутренний порт
```

### Переменные окружения

Создайте файл `.env`:

```env
NODE_ENV=production
TUNNEL_TOKEN=your-cloudflare-token
NGROK_AUTH_TOKEN=your-ngrok-token
```

## 🆘 Решение проблем

### Docker не запускается

1. Проверьте, что WSL 2 установлен:
   ```powershell
   wsl --list --verbose
   ```

2. Обновите WSL 2:
   ```powershell
   wsl --update
   ```

3. Перезапустите Docker Desktop

### Порт уже занят

Измените порт в `docker-compose.yml` или освободите порт:

```powershell
# Найти процесс, использующий порт
netstat -ano | findstr :3000

# Завершить процесс (замените PID)
taskkill /PID <PID> /F
```

### Ошибки при сборке

```powershell
# Очистите кэш и пересоберите
docker-compose build --no-cache
docker system prune -a
```

### Медленная работа на Windows

1. Убедитесь, что файлы проекта находятся в директории WSL, а не на Windows диске
2. Или переместите проект в `C:\Users\YourName\` (не на внешний диск)

## 📚 Дополнительные ресурсы

- [Docker Desktop документация](https://docs.docker.com/desktop/)
- [Docker Compose документация](https://docs.docker.com/compose/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [ngrok документация](https://ngrok.com/docs)

## ✅ Чеклист

- [ ] Docker Desktop установлен и запущен
- [ ] Docker daemon работает (`docker info`)
- [ ] Проект успешно собирается (`docker-compose build`)
- [ ] Приложение доступно локально (http://localhost:3000)
- [ ] Туннель настроен и работает (опционально)

---

**Готово!** Теперь вы можете запустить проект командой `.\start-docker.ps1`
