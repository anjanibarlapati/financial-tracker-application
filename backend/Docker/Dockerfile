FROM node:23-slim

WORKDIR /fingrow-server

RUN apt-get update && apt-get install -y curl

COPY package*.json ./

RUN npm install

COPY  . .

CMD ["npm", "start"]
