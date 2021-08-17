FROM node:14.17.5-alpine3.11
WORKDIR /home/node/app
RUN apk update && apk add git

# Install packages
COPY package.json package-lock.json ./
RUN npm install --quiet

# Give owner rights to the current user
RUN chown -Rh node:node /home/node/app
USER node
