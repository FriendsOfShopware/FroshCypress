#!/usr/bin/env bash

if [[ ! -d web ]]; then
    git clone https://github.com/shopware/shopware.git web

    cd web
    composer install -o
    touch recovery/install/data/install.lock
    cd ..
fi

docker-compose up -d

echo "<?php
return [
    'db' => [
        'username' => 'root',
        'password' => 'root',
        'dbname' => 'shopware',
        'host' => 'mysql',
        'port' => '3306'
    ]
];" > web/config.php


docker-compose exec nginx /var/www/html/bin/console sw:database:setup --steps=drop,create,import
docker-compose exec nginx /var/www/html/bin/console sw:database:setup --steps=setupShop --shop-url="http://shopware.test"
docker-compose exec nginx /var/www/html/bin/console sw:snippets:to:db --include-plugins
docker-compose exec nginx /var/www/html/bin/console sw:theme:initialize
docker-compose exec nginx /var/www/html/bin/console sw:firstrunwizard:disable
docker-compose exec nginx /var/www/html/bin/console sw:admin:create --name="Demo" --email="demo@demo.de" --username="demo" --password="demo" --locale=en_GB -n
docker-compose exec nginx /var/www/html/bin/console sw:plugin:refresh
docker-compose exec nginx /var/www/html/bin/console sw:plugin:install FroshCypressHelper --activate
docker-compose exec nginx /var/www/html/bin/console sw:cache:clear
docker-compose exec -T mysql mysql -uroot -proot shopware < web/recovery/install/data/sql/en.sql
docker-compose exec -T mysql mysql -uroot -proot shopware < setup.sql

echo "Shopware is ready!"

# docker-compose exec cypress bash -c 'cd /app/ && npm install && $(npm bin)/cypress run --browser chrome'
