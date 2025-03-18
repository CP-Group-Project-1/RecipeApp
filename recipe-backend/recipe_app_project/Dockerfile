FROM python:3.11-buster

# Assign working directory
WORKDIR /src

# Install netcat (required for database check)
#RUN apt-get update && apt-get install -y netcat-traditional

# Copy and install requirements
COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy entire backend into container
COPY . .

# Copy entrypoint
###COPY entrypoint.sh /entrypoint.sh
# Making file executable
#RUN chmod +x /entrypoint.sh

#Set entrypoint script to run when container starts
#ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]

# Run DRF with Gunicorn
CMD gunicorn --bind 0.0.0.0:8000 --workers 3 pm_project.wsgi:application
#Moving to enterypoint.sh
#CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "pm_project.wsgi:application"]