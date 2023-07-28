FROM node:18.16.1

WORKDIR /usr/api

COPY ./api/package.json ./package.json
COPY ./api/package-lock.json ./package-lock.json

RUN npm i

COPY ./api .

WORKDIR /usr/shared

COPY  ./shared .

RUN npm i

WORKDIR /usr/api

EXPOSE 4001

CMD ["npm", "run", "start", "--STAGE=$STAGE"]
