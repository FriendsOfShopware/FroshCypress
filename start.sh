#!/usr/bin/env bash
set -euo pipefail

clone_shopware() {
  git clone --depth=1 https://github.com/shopware/shopware.git web
}

setup_shopware() {
  docker-compose run --rm -u "$(id -u):$(id -g)" --entrypoint composer cli install -o

  touch ./web/recovery/install/data/install.lock

  echo "<?php
  return [
      'db' => [
          'username' => 'root',
          'password' => 'root',
          'dbname' => 'shopware',
          'host' => 'mysql',
          'port' => '3306'
      ]
  ];" > ./web/config.php
}

initialize_db () {
  docker-compose run --rm cli bin/console sw:database:setup --steps=drop,create,import
  docker-compose run --rm cli bin/console sw:database:setup --steps=setupShop --shop-url="http://shopware.test"
  docker-compose run --rm cli bin/console sw:snippets:to:db --include-plugins
  docker-compose run --rm cli bin/console sw:theme:initialize
  docker-compose run --rm cli bin/console sw:firstrunwizard:disable
  docker-compose run --rm cli bin/console sw:admin:create --name="Demo" --email="demo@demo.de" --username="demo" --password="demo" --locale=en_GB -n
  docker-compose run --rm cli bin/console sw:plugin:refresh
  docker-compose run --rm cli bin/console sw:plugin:install FroshCypressHelper --activate
  docker-compose run --rm cli bin/console sw:cache:clear
  docker-compose exec -T mysql mysql -uroot -proot shopware < web/recovery/install/data/sql/en.sql
  docker-compose exec -T mysql mysql -uroot -proot shopware < setup.sql

  echo "Shopware is ready!"
}

start_containers() {
  docker-compose run --rm wait_for_mysql && docker-compose up -d nginx
}

cypress_run() {
  docker-compose run --rm \
    -u "$(id -u):$(id -g)" \
    --entrypoint bash \
    cypress -c 'npm install && $(npm bin)/cypress install && $(npm bin)/cypress run'
}

cypress_open() {
  # quick & dirty method to allow the containers to access the hosts xserver temporarily
  xhost +si:localuser:$(whoami)

  docker-compose run --rm \
    -u "$(id -u):$(id -g)" \
    --entrypoint bash \
    -e "DISPLAY=unix${DISPLAY}" \
    -v "/tmp/.X11-unix:/tmp/.X11-unix" \
    cypress -c 'npm install && $(npm bin)/cypress install && $(npm bin)/cypress open'

  xhost -
}

prepare() {
  if [[ ! -d web ]]; then
    clone_shopware && setup_shopware
  fi

  start_containers && initialize_db
}

TEAR_DOWN=0
HELP="run: run headless
open: run cypress GUI
Use the '--rm' flag to remove all containers when finished, e.g.:
  ./start.sh open --rm"

if [[ $# -lt 1 ]]; then
  echo "$HELP"
  exit 0
fi

while [[ (($# > 0)) ]]
do
  case "$1" in
    "run")
      prepare && cypress_run
      shift
      ;;
    "open")
      prepare && cypress_open
      shift
      ;;
    "--rm")
      TEAR_DOWN=1
      shift
      ;;
    *)
      echo "$HELP"
      exit 0
      ;;
    esac
done

if [[ $TEAR_DOWN -gt 0 ]]; then
  docker-compose down
fi
