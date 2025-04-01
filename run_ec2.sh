# THis script should be ran inside the ec2 instance


# Require DOCKERHUB_USERNAME as the first argument
if [ -z "$1" ]; then
  echo "ERROR: You must provide your DockerHub username as the first argument."
  echo "Usage: ./build-and-push-images.sh <DOCKERHUB_USERNAME> <IMAGE_VERSION> <IMAGE_VERSION> <AWS_SECRET_NAME>"
  exit 1
fi

# Require DOCKERHUB image version as the second argument
#Exampple of version would be using the string 'latest'
if [ -z "$2" ]; then
  echo "ERROR: You must provide the DockerHub image version as the 2nd argument."
  echo "Usage: ./build-and-push-images.sh <DOCKERHUB_USERNAME> <IMAGE_VERSION> <IMAGE_VERSION> <AWS_SECRET_NAME>"
  exit 1
fi

# Require AWS Secret Name as the third argument
if [ -z "$3" ]; then
  echo "ERROR: You must provide the AWS Secret Name as the 3rd argument."
  echo "Usage: ./build-and-push-images.sh <DOCKERHUB_USERNAME> <IMAGE_VERSION> <AWS_SECRET_NAME> "
  exit 1
fi

# Export for docker-compose to use
export DOCKERHUB_UNAME=$1
export NEW_VERSION=$2
export SECRET_NAME=$3

export $(aws secretsmanager get-secret-value --secret-id $SECRET_NAME --query SecretString --output text | jq -r 'to_entries|map("\(.key)=\(.value)")|.[]')

docker-compose -f docker-compose.prod.yml up -d

