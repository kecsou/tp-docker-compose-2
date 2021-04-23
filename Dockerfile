FROM node

LABEL maintainer="kecsou"

RUN mkdir /app

COPY package.json /app
COPY yarn.lock /app
COPY index.js /app
COPY src /app/src

WORKDIR /app

RUN yarn install --production

CMD ["yarn", "start"]
