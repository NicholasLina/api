FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i
RUN tsc

COPY . .

EXPOSE 9000
CMD [ "node", "build/server" ]