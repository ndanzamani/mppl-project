#!/bin/sh
set -e

cd /var/www/html

# Cache config (aman dijalankan tiap start, cepat)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Jalankan migration otomatis saat startup
php artisan migrate --force

# Jalankan nginx + php-fpm
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf