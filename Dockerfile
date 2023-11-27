FROM node:lts-alpine AS base
RUN apk update && apk add libc6-compat sqlite openssl --update-cache --no-cache

FROM base AS deps
WORKDIR /app
COPY /package.json* ./
RUN npm i

FROM golang:alpine AS builder
WORKDIR /app
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.tar.gz litestream.tar.gz
RUN tar -xzf litestream.tar.gz -C ./

FROM base AS builder2
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma migrate dev --name init
RUN npm run build

FROM base AS runner
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/litestream /usr/local/bin/litestream
COPY --from=builder2 /app/.next/standalone ./
COPY --from=builder2 /app/prisma ./prisma
RUN rm -rf ./prisma/sqlite/todo.db
COPY --from=builder2 /app/.next/static ./.next/static
COPY litestream.yml /etc/litestream.yml
COPY run.sh ./run.sh
EXPOSE 8080
RUN chmod +x /app/run.sh
CMD ["/app/run.sh"]

