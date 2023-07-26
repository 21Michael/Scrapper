FROM node:18.16.1

WORKDIR /usr/api

# Dev:
#COPY . .
#
#RUN npm i

# Prod:
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm i

COPY ./dist ./dist

EXPOSE 4001

CMD ["npm", "run", "start", "--STAGE=$STAGE"]
