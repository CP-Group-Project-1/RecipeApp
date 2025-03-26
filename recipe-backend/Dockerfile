FROM python:3.11-buster

# Assign working directory
WORKDIR /src

# Install netcat (required for database check)
RUN apt-get update && apt-get install -y netcat-traditional

# Copy and install requirements
COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy entire backend into container
COPY . .

# Needed for fullstack conatiners with Ngnix
ENV PYTHONPATH="${PYTHONPATH}:/src/recipe_app_project"

# Run DRF with Gunicorn
#CMD gunicorn --bind 0.0.0.0:8000 --workers 3 recipe_app_project.wsgi:application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "recipe_app_project.wsgi:application"]