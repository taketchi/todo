FROM node:lts-alpine AS base
RUN apk update && apk add libc6-compat sqlite openssl --update-cache --no-cache

FROM base AS deps
WORKDIR /app
COPY /package.json* ./
RUN npm i

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma migrate dev --name init
RUN npm run build

FROM golang:alpine AS builder2
WORKDIR /app
RUN apk add --update --no-cache ca-certificates fuse wget
RUN go install github.com/googlecloudplatform/gcsfuse@master

FROM base AS runner
WORKDIR /app

RUN apk add --no-cache tini ca-certificates fuse
ENTRYPOINT ["/sbin/tini", "--"]

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder2 /go/bin/gcsfuse /usr/bin

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY ./gcsfuse_run.sh ./gcsfuse_run.sh
RUN chmod +x /app/gcsfuse_run.sh
COPY --chown=nextjs:nodejs .gcs .gcs
ENV GOOGLE_APPLICATION_CREDENTIALS /app/.gcs/portforio-todo-4aca4a8326d1.json
ENV MNT_DIR /app/.next/standalone/prisma

USER nextjs
CMD ["/app/gcsfuse_run.sh"]

