FROM node:18-alpine AS base
WORKDIR /api

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /api/build .
CMD [ "node", "server.js" ]
