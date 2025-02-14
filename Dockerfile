FROM node:16-alpine
WORKDIR /home/node/app
RUN apk update && apk add git

# Install packages
COPY package.json ./
RUN npm install --quiet

# Give owner rights to the current user
RUN chown -Rh node:node /home/node/app
USER node
