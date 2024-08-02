FROM node:20.9.0-alpine AS builder

COPY package*.json ./

RUN npm install -g npm@9.8.1
RUN npm ci

FROM builder AS production

WORKDIR /usr/src/app

COPY . .

RUN npm run build
RUN npm run seed

CMD ["npm", "run", "start:prod"]


