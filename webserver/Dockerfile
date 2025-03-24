###########################
# This is a "builder" pattern in Docker.
# We need to process our React code into static files that we can serve (npm run build).
# You could also skip this part and just run "npm run build" and copy over the output manually like some kind of barbarian
###########################

# Use Node.js Alpine for a lightweight image
FROM node:lts-alpine AS builder

# Set working directory inside container
WORKDIR /recipe-frontend/recipe_app

# These two lines will allow us to pass in an environment
# variable when the image is *built* (not run).  For local
# development, localhost; for production, your EC2's IP address
ARG VITE_BASE_URL=localhost
ENV VITE_BASE_URL=$VITE_BASE_URL

# Copy package.json and install dependencies
COPY ./recipe-frontend/recipe_app/package.json .
RUN npm install

# Copy the rest of the fronend code and build it
COPY ./recipe-frontend/recipe_app .
RUN npm run build

###########################
# This is the final image we want.
#  First, it copies over a config file which basically says:
# "if any requests come in whose uri starts with /api/,
# then hand them off to the gunicorn (Django) server, 
# otherwise, serve up the React static files."
# Second, it copies over the React static files to the place
# where nginx expects them to be.
###########################
# Use Nginx to serve the built frontend
FROM nginx:alpine

# Copy the Nginx configuration file
COPY ./webserver/default.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend (dist directory) to the Nginx root directory
COPY --from=builder /recipe-frontend/recipe_app/dist /usr/share/nginx/html