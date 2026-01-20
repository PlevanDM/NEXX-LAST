#!/bin/bash

# Скрипт для запуска проекта в Docker с туннелем

echo "🚀 Запуск NEXX в Docker..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Проверяем наличие docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose не установлен. Установите docker-compose."
    exit 1
fi

# Выбираем режим (dev или prod)
MODE=${1:-prod}

if [ "$MODE" = "dev" ]; then
    echo "📦 Запуск в режиме разработки..."
    docker-compose up --build nexx-dev
elif [ "$MODE" = "prod" ]; then
    echo "📦 Запуск в production режиме..."
    docker-compose up --build nexx-prod
else
    echo "❌ Неверный режим. Используйте: dev или prod"
    exit 1
fi
