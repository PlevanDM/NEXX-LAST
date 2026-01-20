#!/bin/bash

# Скрипт для запуска с туннелем

echo "🌐 Запуск NEXX с туннелем..."

# Проверяем переменные окружения
if [ -z "$TUNNEL_TOKEN" ] && [ -z "$NGROK_AUTH_TOKEN" ]; then
    echo "⚠️  TUNNEL_TOKEN или NGROK_AUTH_TOKEN не установлен"
    echo ""
    echo "Для Cloudflare Tunnel:"
    echo "  export TUNNEL_TOKEN=your-token"
    echo "  docker-compose -f docker-compose.tunnel.yml up"
    echo ""
    echo "Для ngrok:"
    echo "  export NGROK_AUTH_TOKEN=your-token"
    echo "  docker-compose -f docker-compose.tunnel.yml --profile ngrok up"
    exit 1
fi

# Запускаем с туннелем
if [ ! -z "$TUNNEL_TOKEN" ]; then
    echo "☁️  Используется Cloudflare Tunnel"
    docker-compose -f docker-compose.tunnel.yml up --build
elif [ ! -z "$NGROK_AUTH_TOKEN" ]; then
    echo "🔗 Используется ngrok"
    docker-compose -f docker-compose.tunnel.yml --profile ngrok up --build
fi
