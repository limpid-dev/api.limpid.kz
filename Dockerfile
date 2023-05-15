FROM node:18-alpine AS build
WORKDIR /api
COPY . .
RUN npm ci
RUN node ace build --production

FROM build AS production
COPY --from=build /api/build .
RUN npm ci --omit=dev --unsafe-perm=true
CMD [ "node", "server.js" ]
