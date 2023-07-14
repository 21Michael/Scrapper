#FROM node:14.18.3 as build
FROM ubuntu

RUN apt-get update \
    && apt install sudo -y \
    && sudo apt install curl -y \
    && curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - \
    && sudo apt install nodejs -y

ENV SERVER_DIR "$/api"

WORKDIR ${SERVER_DIR}

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 4001

CMD ["npm", "run", "start"]
