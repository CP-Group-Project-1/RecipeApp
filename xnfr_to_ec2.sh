# This script transfers files to ec2 instance
# MAKE SURE THE EC2 INSANCE IS ALIVE BEFORE RUNNING THIS SCRIPT
# The script assumes this file is executed from the parent directory of
# the project, to copy the files below.
# The script assumes the <file_name>.pem file is located in the .ssh directory

# Require .pem file name as the first argument
# Require EC2 instance name as the first argument
if [ -z "$1" ]; then
  echo "ERROR: You must provide your .pem file name."
  echo "Usage: ./xnfr_to_ec2.sh <PEM_FILE_NAME> <EC2_NAME>"
  exit 1
fi

# Require EC2 instance name as the first argument
if [ -z "$2" ]; then
  echo "ERROR: You must provide your ec2 instance name"
  echo "Usage: ./xnfr_to_ec2.sh <PEM_FILE_NAME> <EC2_NAME>"
  exit 1
fi

PEM_FILE_NAME=$1

EC2_NAME=$2  # Get arg value
echo $EC2_NAME

echo "Xnfring pull_images"
scp -i ~/.ssh/"$PEM_FILE_NAME.pem" pull_images.sh ec2-user@$EC2_NAME:~/

echo "Xnfring setup-ec2.sh"
scp -i ~/.ssh/"$PEM_FILE_NAME.pem" setup-ec2.sh ec2-user@$EC2_NAME:~/

echo "Xnfring docker-compose.prod.yml"
scp -i ~/.ssh/"$PEM_FILE_NAME.pem" docker-compose.prod.yml ec2-user@$EC2_NAME:~/

echo "Xnfring run_ec2.sh"
scp -i ~/.ssh/"$PEM_FILE_NAME.pem" run_ec2.sh ec2-user@$EC2_NAME:~/
