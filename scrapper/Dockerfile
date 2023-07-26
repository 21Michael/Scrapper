FROM node:18.16.1

RUN apt-get update \
    && apt install sudo -y \
    && sudo apt install curl -y \
    && curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y ./google-chrome-stable_current_amd64.deb \
    && rm -rf ./google-chrome-stable_current_amd64.deb

WORKDIR /usr/scrapper

# Dev:
#COPY . .
#
#RUN npm i

# Prod:
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm i

COPY ./dist ./dist

EXPOSE 4000

CMD ["npm", "run", "start", "--STAGE=$STAGE"]
