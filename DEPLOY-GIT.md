# Deploy to Git — чистый экспорт

Скрипт экспортирует проект в чистую папку (только tracked файлы, без `node_modules`, `dist`, `.env` и т.д.) и пушит в git.

## Команды

```bash
# Экспорт в deploy-git-output/ (без пуша)
npm run deploy:git:export

# Экспорт + commit + push в текущий remote
npm run deploy:git

# Вручную с параметрами
powershell -ExecutionPolicy Bypass -File scripts/deploy-git-clean.ps1 -TargetDir "C:\nexx-clean" -RemoteUrl "https://github.com/user/nexx.git" -Push
```

## Параметры

| Параметр | Описание |
|----------|----------|
| `-TargetDir` | Папка для экспорта (по умолчанию: `deploy-git-output/`) |
| `-RemoteUrl` | URL удалённого репозитория |
| `-Branch` | Ветка (по умолчанию: `main`) |
| `-CommitMsg` | Сообщение коммита |
| `-ExportOnly` | Только экспорт, без git |
| `-Push` | Выполнить push после commit |

## Что исключается

- `node_modules/`, `dist/`, `build/`, `.output/`
- `.env`, `.dev.vars`, `.wrangler/`
- Логи, кэш, временные файлы
- И другие пути из `.gitignore`

Экспортируются только файлы, которые отслеживаются git (`git ls-files`).
