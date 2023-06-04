FROM node:18-alpine AS base
WORKDIR /api

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN node ace build --production

FROM base AS production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /api/build .
CMD [ "node", "server.js" ]