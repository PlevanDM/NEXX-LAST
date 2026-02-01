# Настройка деплоя (один раз)

Чтобы GitHub Actions деплоил сайт на Cloudflare Pages при пуше в `main`, нужно один раз добавить секреты в репозиторий.

## Вариант A: через скрипт (если есть gh CLI)

1. **Скопируйте пример конфига:**
   ```powershell
   copy .env.example .env
   ```

2. **Заполните в `.env`:**
   - **CLOUDFLARE_ACCOUNT_ID** — ID аккаунта: [Cloudflare Dashboard](https://dash.cloudflare.com) → правый сайдбар → **Account ID**
   - **CLOUDFLARE_API_TOKEN** — API-токен (не Global Key): [Create API Token](https://dash.cloudflare.com/profile/api-tokens) → шаблон **Edit Cloudflare Workers** или свой с правами **Account / Cloudflare Pages / Edit**

3. **Установите gh и войдите** (если ещё не сделано):
   - https://cli.github.com/
   - `gh auth login`

4. **Загрузите секреты в GitHub:**
   ```powershell
   .\scripts\set-github-cloudflare-secrets.ps1
   ```

5. **Запустите деплой:** GitHub → **Actions** → **Deploy to Cloudflare Pages** → **Run workflow** (или сделайте push в `main`).

---

## Вариант B: вручную в GitHub

1. Откройте: **https://github.com/PlevanDM/1/settings/secrets/actions**

2. **New repository secret** → имя `CLOUDFLARE_ACCOUNT_ID`, значение — ваш Account ID из Cloudflare.

3. **New repository secret** → имя `CLOUDFLARE_API_TOKEN`, значение — ваш API Token из Cloudflare.

4. В **Actions** → **Deploy to Cloudflare Pages** → **Re-run all jobs** (или push в `main`).

---

## После настройки

- **Деплой при пуше:** любой `git push origin main` запускает сборку и деплой на Cloudflare Pages (проект `nexx-gsm`, домен nexxgsm.com).
- **Ручной деплой:** Actions → Deploy to Cloudflare Pages → **Run workflow**.
- **Локальная сборка:** `npm run build`
- **Локальный деплой (без GitHub):** заполните `.env` и выполните `.\deploy-2026.ps1` или `npm run deploy` (нужен `wrangler login`).

Файл `.env` в репозиторий не коммитить (он в `.gitignore`).
