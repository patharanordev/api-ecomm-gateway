FROM node:12.16.1-alpine3.9

LABEL version="0.4.0"
LABEL maintainer="patharanor@gmail.com"

WORKDIR /app

COPY package*.json ./

RUN apk update \
    && apk add --no-cache openssl \
    && apk add tzdata \
    && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" > /etc/timezone \
    && npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]