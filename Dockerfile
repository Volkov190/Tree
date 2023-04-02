# @name: Base
FROM node:16-alpine3.11 AS base

# @name: Npm-libs
# @description: Установка всех npm зависимостей
FROM base AS npm-libs

WORKDIR /app

COPY package-lock.json package.json ./

RUN npm ci


# @name: Build
# @description: Билдит артефакты приложения
FROM npm-libs AS build

WORKDIR /app


COPY ./ ./

RUN npm run build

# @name: Runner
# @description: Запуск собранного приложения
FROM nginx:stable-alpine AS runner

ARG SERVICE_PATH
WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /var/www/html
COPY spa.nginx.conf /etc/nginx/conf.d/default.conf

RUN chown nginx:nginx /var/www/html/*


CMD nginx -g 'daemon off;'
