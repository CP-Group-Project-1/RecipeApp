#!/bin/bash

#THis file runs the docker-compose.dev.yml file, building the container

# These environment variables are consumed by the docker-compose file.
# We can supply explicit defaults that are checked in with source code 
# since they are only used for local development.
export SECRET_KEY=birdistheword
export DEBUG=True
export POSTGRES_DB=recipe_app_db
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres

docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build

# Moved to back_end Dockerfile
#docker exec personal-project-api-prototype-api-1  python /src/manage.py makemigrations 
#docker exec personal-project-api-prototype-api-1  python /src/manage.py migrate
