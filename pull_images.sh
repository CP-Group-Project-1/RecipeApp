# This file is to be exdcuted om the ec2 instance


# Require DOCKERHUB_USERNAME as the first argument
if [ -z "$1" ]; then
  echo "ERROR: You must provide your DockerHub username as the first argument."
  echo "Usage: ./pull_images.sh <DOCKERHUB_USERNAME>"
  exit 1
fi

DOCKERHUB_UNAME=$1

docker pull $DOCKERHUB_UNAME/recipe_backend:latest
docker pull $DOCKERHUB_UNAME/recipe_frontend:latest