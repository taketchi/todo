FROM node:lts-alpine AS base
RUN apk update && apk add  libc6-compat  --update-cache --no-cache

FROM base AS deps
WORKDIR /app
COPY /todo/package.json* ./
RUN npm i

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./todo .
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs /sqlite ./sqlite

RUN apk add --no-cache tini sqlite openssl
ENTRYPOINT ["/sbin/tini", "--"]

USER nextjs
EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

