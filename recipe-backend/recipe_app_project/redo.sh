docker-compose down
docker-compose up -d
docker-compose exec api python manage.py makemigrations
docker-compose exec api python manage.py migrate
echo "DONE"