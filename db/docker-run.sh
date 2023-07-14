# build image
docker build . -t mongo:scrapper-db

# build container
docker container run -d -it \
        -p 27017:27017 \
        -v mongo-data:/data/db \
        --name scrapper-db mongo:scrapper-db

