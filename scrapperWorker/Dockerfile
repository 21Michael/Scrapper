FROM node:18.16.1

RUN apt-get update \
    && apt install sudo -y \
    && sudo apt install curl -y \
    && curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y ./google-chrome-stable_current_amd64.deb \
    && rm -rf ./google-chrome-stable_current_amd64.deb

WORKDIR /usr/scrapperWorker

COPY ./scrapperWorker/package.json ./package.json
COPY ./scrapperWorker/package-lock.json ./package-lock.json

RUN npm i

COPY ./scrapperWorker .

WORKDIR /usr/shared

COPY  ./shared .

RUN npm i

WORKDIR /usr/scrapperWorker

EXPOSE 4002

CMD ["npm", "run", "start", "--STAGE=$STAGE"]
