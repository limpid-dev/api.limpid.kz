FROM node:18-alpine AS base
RUN mkdir -p /home/node/api && chown node:node /home/node/api
WORKDIR /home/node/api
USER node

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production

COPY --chown=node:node ./package*.json ./
RUN npm ci --omit=dev
COPY --chown=node:node --from=build /home/node/api/build .
CMD [ "node", "server.js" ]