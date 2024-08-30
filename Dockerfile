FROM node:20.12.2-alpine3.18 AS base

# Build stage
FROM base AS build
WORKDIR /app
ADD . .

RUN apk --no-cache add python3 && \
    npm ci && \
    node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
