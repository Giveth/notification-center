#https://hub.docker.com/_/node?tab=tags&page=1
# Pinned to a Node 20 LTS patch >= 20.18.0: a transitive dep
# (@solana/codecs-numbers) raised its engine floor to node >=20.18.0,
# which the previously pinned 20.14.0 no longer satisfied.
FROM node:20.18.0

WORKDIR /usr/src/app

COPY tsconfig.json .
COPY tsoa.json .
COPY package*.json ./
# Copy the committed lockfile so `yarn install --frozen-lockfile` installs the
# exact, known-good dependency tree instead of fresh-resolving to latest (which
# pulled an incompatible @solana transitive and mismatched @types/express).
COPY yarn.lock ./
COPY src ./src
COPY migrations ./migrations
COPY test ./test

RUN npm i -g pm2
RUN yarn install --frozen-lockfile
RUN yarn build #It will run prebuild script for generating swagger spec by tsoa as well
RUN cp -rv public ./dist
