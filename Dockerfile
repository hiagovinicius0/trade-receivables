FROM node:14.17.6

RUN apt-get update && apt-get install -y wget

WORKDIR /home/node/app
COPY package*.json .
COPY yarn*.lock .

RUN yarn install

COPY . .

EXPOSE 3000
RUN npm run build 

CMD node dist/main.js