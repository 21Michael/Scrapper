FROM ubuntu

RUN apt-get update \
    && apt install sudo -y \
    && sudo apt install curl -y \
    && curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - \
    && sudo apt install nodejs -y \
    && curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y ./google-chrome-stable_current_amd64.deb \
    && rm -rf ./google-chrome-stable_current_amd64.deb

WORKDIR /usr/scrapper

COPY . .

RUN npm i

EXPOSE 4000

CMD ["npm", "run", "start"]
