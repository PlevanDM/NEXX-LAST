# Multi-stage build для оптимизации
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем production build
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Копируем собранные файлы из builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/index.html ./

# Устанавливаем serve для статических файлов
RUN npm install -g serve

# Открываем порт
EXPOSE 3000

# Запускаем статический сервер
CMD ["serve", "-s", "dist", "-l", "3000", "--host", "0.0.0.0"]
