#!/bin/sh
set -e

cd /var/www/html

# Railway assigns a dynamic port via $PORT. Default to 8080 if not set (e.g. local docker-compose).
export PORT="${PORT:-8080}"
echo "Starting on port $PORT"

# Substitute the port into the nginx config template
sed -i "s/listen 8080;/listen $PORT;/" /etc/nginx/http.d/default.conf

# Clear any stale cache from previous build, then re-cache fresh
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Jalankan migration otomatis saat startup
php artisan migrate --force

# Jalankan nginx + php-fpm
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf