FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS prepare

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc ./doc

FROM node:22-alpine AS run

WORKDIR /app

COPY --from=prepare /app .

EXPOSE 4000
CMD ["npm", "run", "start:prod"]