#!/bin/bash

#THis file runs the docker-compose.prod.yml file, pulling the images from DH

# These environment variables are consumed by the docker-compose file.
# We can supply explicit defaults that are checked in with source code 
# since they are only used for local development.
clear


# Set environment variables for DB and Django
export SECRET_KEY=birdistheword
export DEBUG=True
export POSTGRES_DB=recipe_app_db
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres

# Require DOCKERHUB_USERNAME as the first argument
if [ -z "$1" ]; then
  echo "ERROR: You must provide your DockerHub username as the first argument."
  echo "Usage: ./build-and-push-images.sh <DOCKERHUB_USERNAME>"
  exit 1
fi

# Require DOCKERHUB image version as the second argument
#Exampple of version would be using the string 'latest'
if [ -z "$2" ]; then
  echo "ERROR: You must provide the DockerHub image version as the 2nd argument."
  echo "Usage: ./build-and-push-images.sh <DOCKERHUB_USERNAME> <IMAGE_VERSION"
  exit 1
fi

# Export for docker-compose to use
export DOCKERHUB_UNAME=$1
export NEW_VERSION=$2

# Launch containers using production config
docker-compose -f docker-compose.prod.yml up -d 


docker exec recipeapp-api-1  python /src/recipe_app_project/manage.py makemigrations 
docker exec recipeapp-api-1  python /src/recipe_app_project/manage.py migrate
