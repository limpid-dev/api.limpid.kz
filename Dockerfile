FROM node:18-alpine AS base
WORKDIR /api

FROM base AS dependencies
COPY ./package*.json ./
RUN npm ci
COPY . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
RUN apk add --no-cache chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /api/build .
CMD [ "node", "server.js" ]
