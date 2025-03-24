#!/bin/bash

##############################
# This builds and pushes both the nginx/React image
# and the DRF one.  
#
# The nginx/React image gets built with an environment variable
# that sets the url of the DRF backend REACT_APP_BASE_URL.  Once you
# know the IP address of your EC2 instance, you would pass that in
# instead of localhost
##############################

##DOCKERHUB_UNAME=chadmowbray

#BASE_URL=$1
#NEW_VERSION=$2

#docker buildx build --platform linux/amd64 --build-arg VITE_BASE_URL=$BASE_URL -t $DOCKERHUB_UNAME/webserver-prod:$NEW_VERSION -f webserver/Dockerfile . --no-cache
#docker push $DOCKERHUB_UNAME/webserver-prod:$NEW_VERSION

#docker buildx build --platform linux/amd64  -t $DOCKERHUB_UNAME/api-prod:$NEW_VERSION -f backend/Dockerfile ./backend --no-cache
#docker push $DOCKERHUB_UNAME/api-prod:$NEW_VERSION


##############################
# This script builds and pushes both:
# - The Backend (Django + DRF)
# - The Frontend (React + Nginx)
#
# Usage:
# ./build-and-push-images.sh [DOCKERHUB_USERNAME] [BASE_URL] [VERSION]
#
# Example:
# ./build-and-push-images.sh mydockeruser http://api.myproject.com latest
#
# If no arguments are provided, default values will be used.
##############################

# Default values if no arguments are passed
DEFAULT_DOCKERHUB_USERNAME="mmccla1n"
DEFAULT_VERSION="latest"
DEFAULT_BASE_URL="http://127.0.0.1:8000"

# Assign arguments or use defaults
DOCKERHUB_USERNAME=${1:-$DEFAULT_DOCKERHUB_USERNAME}
BASE_URL=${2:-$DEFAULT_BASE_URL}
VERSION=${3:-$DEFAULT_VERSION}

echo "Starting Build & Push Process for Version: $VERSION"
echo "Using DockerHub Username: $DOCKERHUB_USERNAME"
echo "Backend API Base URL: $BASE_URL"

# Build and Push Backend (Django API)
echo "Building Backend Image..."
docker buildx build --platform linux/amd64,linux/arm64 -t $DOCKERHUB_USERNAME/pm_backend:$VERSION -f back_end/Dockerfile ./back_end --push --no-cache

echo "Pushing Backend Image to DockerHub..."
docker push $DOCKERHUB_USERNAME/pm_backend:$VERSION

# Build and Push Frontend (React + Nginx)
echo "Building Frontend Image..."
docker buildx build --platform linux/amd64,linux/arm64 --build-arg VITE_BASE_URL=$BASE_URL -t $DOCKERHUB_USERNAME/pm_frontend:$VERSION -f webserver/Dockerfile . --push --no-cache

echo "Pushing Frontend Image to DockerHub..."
docker push $DOCKERHUB_USERNAME/pm_frontend:$VERSION

echo "Build and Push Completed Successfully!"