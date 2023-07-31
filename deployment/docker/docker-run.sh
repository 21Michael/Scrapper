#cd ../../api
#
#npm run build
#
#cd ../scrapper
#
#npm run build
##
#cd ../deployment/docker
# 1) build and run
#docker compose up -d --build

# 2) Stop Remove containers
#docker compose down

# 3) Push images to docker hub
#docker push mikhail21/scrapper-service:latest
#docker push mikhail21/scrapper-api:latest
#docker push mikhail21/scrapper-client-dev:latest
#docker push mikhail21/scrapper-client-prod:latest

# 4) Remove cache
#docker system prune -a

# 5) Remove images
#docker image rm mikhail21/scrapper-api:latest

# 6) Pull images
#docker pull mikhail21/scrapper-api:latest
