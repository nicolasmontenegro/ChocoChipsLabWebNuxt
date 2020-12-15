FROM node:13.13.0-alpine3.11
WORKDIR /home/node/app
RUN apk update && apk add git
COPY package.json package-lock.json ./
RUN npm install --quiet
