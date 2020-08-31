# Builder image.
FROM node:lts-alpine as builder

RUN apk add --no-cache --virtual .gyp python make g++

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Server image.
FROM node:lts-alpine as server

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
