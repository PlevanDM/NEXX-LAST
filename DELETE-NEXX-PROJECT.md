# Удаление старого проекта nexx

## Проблема
Старый проект `nexx` имеет привязанный custom domain `nexxgsm.com`, который нужно удалить перед удалением проекта.

## Решение через Dashboard (РЕКОМЕНДУЕТСЯ)

1. Откройте: https://dash.cloudflare.com
2. Перейдите: **Pages** → Проект **nexx**
3. Откройте вкладку **Custom domains**
4. Найдите домен **nexxgsm.com** и нажмите **Remove** или **Delete**
5. После удаления домена:
   - Перейдите в **Settings** проекта
   - Прокрутите вниз до **Delete project**
   - Подтвердите удаление

## Решение через API (если есть правильный токен)

### 1. Создайте API Token:
- https://dash.cloudflare.com/profile/api-tokens
- **Create Token** → **Edit Cloudflare Workers**
- Permissions: **Account > Cloudflare Pages > Edit**
- Скопируйте токен

### 2. Удалите домен:
```powershell
$token = "ВАШ_API_TOKEN"
$accountId = "ad170d773e79a037e28f4530fd5305a5"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/nexx/domains/nexxgsm.com" -Method Delete -Headers $headers
```

### 3. Удалите проект:
```powershell
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/nexx" -Method Delete -Headers $headers
```

## После удаления

Домен `nexxgsm.com` можно будет подключить к новому проекту `nexx-gsm`:
1. Pages → nexx-gsm → Custom domains → Add domain
2. Введите: `nexxgsm.com`
