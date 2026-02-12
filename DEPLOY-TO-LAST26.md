# Выгрузка полного проекта в GitHub PlevanDM/last26

Репозиторий **last26** сейчас пустой. Чтобы выгрузить туда полный чистый проект из папки `c:\NEXX LAST`:

## 1. Открой терминал (PowerShell или Git Bash) в папке проекта

```powershell
cd "c:\NEXX LAST"
```

## 2. Проверь текущий remote

```bash
git remote -v
```

Обычно будет `origin` → `https://github.com/PlevanDM/1.git` (или другой).

## 3. Добавь remote для last26

```bash
git remote add last26 https://github.com/PlevanDM/last26.git
```

Если `last26` уже есть и указывает не туда:

```bash
git remote remove last26
git remote add last26 https://github.com/PlevanDM/last26.git
```

## 4. Убедись, что всё закоммичено

```bash
git status
```

Если есть незакоммиченные изменения:

```bash
git add -A
git commit -m "Full clean project snapshot for last26"
```

## 5. Выгрузи в last26

```bash
git push last26 main
```

Если в last26 ветка по умолчанию пустая и просит `-u`:

```bash
git push -u last26 main
```

---

**Что попадёт в репозиторий:** весь код из текущей ветки (обычно `main`), без `node_modules`, `dist`, `.env` — они в `.gitignore`.

**После первой выгрузки** для обновления last26 достаточно:

```bash
git push last26 main
```
