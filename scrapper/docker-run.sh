# create image
docker build . -t ubuntu:scrapper-service

# build container
docker container run -d \
        -p 4000:4000 \
        --mount type=bind,source="$(pwd)",target=/usr/project/scrapper \
        --name scrapper-service ubuntu:scrapper-service

