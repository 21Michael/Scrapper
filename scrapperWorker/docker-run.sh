# create image
docker build . -t ubuntu:scrapper-worker-service

# build container
docker container run -d \
        -p 4002:4002 \
        --mount type=bind,source="$(pwd)",target=/usr/project/scrapperWorker \
        --name scrapper-worker-service ubuntu:scrapper-worker-service

