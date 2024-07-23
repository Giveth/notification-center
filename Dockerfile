#https://hub.docker.com/_/node?tab=tags&page=1
FROM node:20.14.0

WORKDIR /usr/src/app

COPY tsconfig.json .
COPY tsoa.json .
COPY package*.json ./
COPY src ./src
COPY migrations ./migrations
COPY test ./test

RUN npm i -g pm2
RUN yarn install --frozen-lockfile
RUN yarn build #It will run prebuild script for generating swagger spec by tsoa as well
RUN cp -rv public ./dist
