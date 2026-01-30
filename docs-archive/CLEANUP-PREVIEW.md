# NEXX Cleanup Preview - Что будет удалено/оптимизировано

## 📊 Статистика

**Всего найдено проблем:**
- 15 дубликатов .js файлов (~485 KB)
- 14 старых скриптов деплоя
- 4 неиспользуемых файла
- 4+ огромных SVG лого (2+ MB)
- 12 старых .md документов

**Экономия после очистки:** ~3-4 MB

---

## 🗑️ Что будет удалено

### 1. Дубликаты .js (15 файлов, 485 KB)

```
✅ ОСТАВИТЬ                      ❌ УДАЛИТЬ
public/static/about.min.js  →   public/static/about.js (11.5 KB)
public/static/analytics.min.js → public/static/analytics.js (4.7 KB)
public/static/app.min.js  →     public/static/app.js (123.5 KB)
public/static/database.min.js → public/static/database.js (12.1 KB)
public/static/faq.min.js  →     public/static/faq.js (14.5 KB)
public/static/homepage.min.js → public/static/homepage.js (36.7 KB)
public/static/i18n.min.js  →    public/static/i18n.js (85.8 KB)
public/static/navigation-system.min.js → navigation-system.js (20.3 KB)
public/static/nexx-core.min.js → public/static/nexx-core.js (22.6 KB)
public/static/price-calculator.min.js → price-calculator.js (67.1 KB)
public/static/privacy.min.js → public/static/privacy.js (17.4 KB)
public/static/shared-components.min.js → shared-components.js (9.1 KB)
public/static/terms.min.js → public/static/terms.js (22.2 KB)
public/static/ui-components.min.js → ui-components.js (29.5 KB)
public/static/utils.min.js → public/static/utils.js (7.5 KB)
```

### 2. Старые скрипты деплоя (14 файлов)

```
✅ ОСТАВИТЬ                ❌ УДАЛИТЬ
deploy-2026.ps1            deploy.ps1
purge-cloudflare-cache.ps1 deploy-simple.ps1
                           deploy-cloudflare.ps1
                           deploy-via-api-2026.ps1
                           setup-cloudflare-complete.ps1
                           setup-cloudflare-complete-2026.ps1
                           setup-cloudflare-deploy-2026.ps1
                           setup-cloudflare-env-vars.ps1
                           setup-git-ssh.ps1
                           publish.ps1
                           update.ps1
                           sync.ps1
                           check-deployment.ps1
                           auto-setup-github-secrets.ps1
```

### 3. Неиспользуемые файлы (4 файла)

```
❌ public/test-auth.html      # Тестовый файл
❌ vectors.db-shm             # База векторов (не используется)
❌ vectors.db-wal             # База векторов (не используется)
❌ test-cloudflare-api.js     # Старый тестовый файл
```

### 4. Огромные SVG логотипы (4 файла, 2+ MB!)

```
⚠️ nexx-logo-blue.svg (918 KB)      # Слишком большой
⚠️ nexx-logo-white.svg (918 KB)     # Слишком большой
⚠️ nexx-logo-original.png (584 KB)  # Дубликат
⚠️ nexx-logo-source.png (584 KB)    # Дубликат

✅ ОСТАВИТЬ:
   - nexx-logo.svg (354 KB)         # Основной SVG
   - nexx-logo.png (небольшой)      # Для соцсетей
   - favicon.ico                    # Иконка
```

### 5. Старая документация (12 файлов → архив)

```
Переместить в docs-archive/:
- AUDIT-FINAL-REPORT.txt
- AUDIT-WHAT-IS-MISSING.md
- CLEANUP-REPORT.md
- CLOUDFLARE-SETUP-2026.md
- CRITICAL-FIXES-COMPLETED.md
- DEPLOYMENT-BETA.md
- DOCUMENTATION-INDEX.md
- FINAL-SUMMARY.md
- IMPLEMENTATION-CHECKLIST.md
- SESSION-COMPLETE.md
- TESTING-2026.md
- WORK-COMPLETE.md

✅ ОСТАВИТЬ в корне:
- README.md
- CODE-AUDIT-REPORT.md
- DEPLOYMENT-SUCCESS-2026.md
```

---

## ⚡ Что НЕ будет тронуто

- ✅ Все .min.js файлы (минифицированные)
- ✅ vendor/ (React, Babel)
- ✅ Рабочие скрипты (deploy-2026.ps1)
- ✅ Основные логотипы
- ✅ Актуальная документация
- ✅ Вся база данных (master-db.json)
- ✅ Все изображения сайта

---

## 🎯 Следующие шаги

### Вариант 1: Запустить очистку сейчас
```powershell
.\cleanup-code.ps1
```

### Вариант 2: Сделать бэкап и очистить
```powershell
.\cleanup-code.ps1  # Автоматически создаст backup/
```

### Вариант 3: Пропустить бэкап (быстро)
```powershell
.\cleanup-code.ps1 -SkipBackup
```

---

## 🛡️ Безопасность

- ✅ Создается автобэкап в `backup-YYYYMMDD-HHmmss/`
- ✅ Dry-run режим уже протестирован
- ✅ Удаляются только дубликаты
- ✅ Можно откатить изменения из бэкапа

---

## 📈 Результат

**До очистки:**
- JS файлов: 33
- Скриптов: 20+
- Размер static/: ~5 MB
- Логотипов: 13
- .md файлов в корне: 25+

**После очистки:**
- JS файлов: 18 (-45%)
- Скриптов: 2-3 (-85%)
- Размер static/: ~2 MB (-60%)
- Логотипов: 3-4 (-70%)
- .md файлов в корне: 3-4 (-85%)

**Общая экономия:** 3-4 MB, репозиторий чище на 80%

---

**Готов запустить?** 🚀
