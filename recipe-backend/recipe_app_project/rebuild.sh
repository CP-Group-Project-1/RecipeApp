docker-compose down -v
docker-compose up --build -d
docker-compose exec api python manage.py makemigrations
docker-compose exec api python manage.py migrate
#echo "Loggged in, Execute injection script..python manage.py shell < inject.py"
#docker exec -it back_end-api-1 bash



