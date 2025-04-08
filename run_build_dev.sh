#!/bin/bash

#THis file runs the docker-compose.dev.yml file, building the container

# These environment variables are consumed by the docker-compose file.
# We can supply explicit defaults that are checked in with source code 
# since they are only used for local development.
clear
export SECRET_KEY=birdistheword
export DEBUG=True
export POSTGRES_DB=recipe_app_db
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres


# Stop and remove all containers, networks, and volumes from the previous run
docker-compose -f docker-compose.dev.yml down -v --remove-orphans
docker-compose -f docker-compose.dev.yml up -d --build


docker exec recipeapp-api-1  python /src/recipe_app_project/manage.py makemigrations 
docker exec recipeapp-api-1  python /src/recipe_app_project/manage.py migrate
