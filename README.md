
# 🧑‍🍳 RecipeApp

### Elevating Meal Planning for Busy Professionals

**RecipeApp** is a full-stack web application designed to simplify the cooking journey for busy professionals who want to eat better without the stress. It allows users to browse delicious, curated meals, save their favorites, and receive categorized shopping lists — making meal prep efficient and approachable.

Whether you're a beginner in the kitchen or just short on time, RecipeApp helps streamline your weekly planning by combining intuitive design, smart features, and modern web technologies.



## 📚 Table of Contents

- [Features](#-features)  
- [Tech Stack](#️-tech-stack)  
- [Getting Started](#-getting-started)  
- [Production Deployment (EC2)](#-production-deployment-ec2)  
- [Usage](#-usage)  
- [Important Notes About Deployment Scripts](#️-important-notes-about-deployment-scripts)



## 🚀 Features

- **User Registration & Authentication**  
  Securely sign up, log in, and manage your personalized recipe experience.

- **Save Favorite Recipes**  
  Browse and save meals to your personal collection for quick access anytime.

- **Generate a Smart Shopping List**  
  Select ingredients from your saved recipes and instantly create a shopping list.

- **Email the Shopping List**  
  Receive your shopping list directly via email, ready to take on the go.

- **Categorized Ingredients for Easy Shopping**  
  Ingredients in the shopping list email are automatically sorted into helpful categories like Produce, Dairy, Spices, and more — making grocery runs faster and more organized.



## 🛠️ Tech Stack

### **Frontend**
- **Vite** – Lightning-fast development environment and build tool  
- **React** – Component-based UI framework  
- **Material UI (MUI)** – Pre-built UI components for responsive design  
- **NGINX** – Web server and reverse proxy for routing frontend traffic and API requests

### **Backend**
- **Django** – Robust Python web framework for rapid development  
- **Django REST Framework (DRF)** – Flexible and powerful toolkit for building Web APIs  
- **Gunicorn** – WSGI HTTP server to serve the Django application

### **External APIs & Services**
- **TheMealDB API** – Provides recipe data and meal details  
- **Google Gemini AI** – Classifies recipe ingredients into grocery store categories  
- **Twilio SendGrid** – Sends shopping list emails to users  
- **Cloudinary** – Hosts embedded media (e.g., app logo in emails)

### **DevOps & Deployment**
- **Docker** – Containerizes the app for development and production  
- **AWS EC2** – Hosts the live application  
- **GitHub** – Version control and collaboration  
- **Slack** – Team communication throughout development  



## 🧩 Getting Started

To get a local copy of the project up and running, follow these steps:

### **Prerequisites**
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- (Optional for deployment) An AWS EC2 instance configured with Docker



### **Local Setup Using Docker**

1. **Clone the repository**

   git clone https://github.com/your-username/recipe-app.git
   cd recipe-app

2.	Run the production build locally

        ./run_build_prod.sh


3.	Access the app

	• Full-Stack Base URL: http://127.0.0.1:80

    (Serves the Vite/React frontend via NGINX and routes API calls to the Django backend)



## 🚀 Production Deployment (EC2)

To deploy the application to a live environment on AWS EC2, follow the steps below:

1. Build and Push Docker Images (Local)

    ./build-and-push-images.sh

Builds both frontend and backend images and pushes them to DockerHub.

2. Create the AWS EC2 Instance
```bash
	•	Launch a new EC2 instance (Ubuntu recommended)
	•	Ensure port 80 is open in the security group
	•	Save your SSH PEM key locally
```

3. Verify SSH Access (Important ✅)

Before transferring files, test SSH access to your instance:

    ssh -i your-key.pem ec2-user@<your-ec2-ip>

	If this works, you’re ready to proceed. If not, check your PEM file, IP address, and EC2 security group settings.

4. Transfer Files to EC2

    ./xnfr_to_ec2.sh

    Transfers:
    ```bash
        •	docker-compose.prod.yml
        •	pull_images.sh
        •	run_ec2.sh
        •	setup-ec2.sh
        •	Any additional config or environment files
    ```

5. SSH into the EC2 Instance
    ```bash
    ssh -i your-key.pem ec2-user@<your-ec2-ip>
    ```

6. Set Up the Environment

    ./setup-ec2.sh

Installs Docker, Docker Compose, and system dependencies.

7. Pull Docker Images

    ./pull_images.sh

8. Run the Application

    ./run_ec2.sh

Starts the frontend (NGINX), backend (Gunicorn), and database services using Docker Compose.

⸻

## 🧑‍🍳 Usage

Once the application is running, users can:
```bash
	1.	Sign Up / Log In
            - Create an account or log into an existing one to access personalized features.

	2.	Browse Recipes
            - Explore meals by category, cuisine, or ingredients using data from TheMealDB.

	3.	Save Recipes
            - Select favorite meals and save them to your personal recipe list.

	4.	Generate a Shopping List
            - Choose a saved recipe and add its ingredients to your shopping list.

	5.	Email the Shopping List
        - Click to receive your shopping list by email. The ingredients will be:
	        •	Organized into categories (e.g., Produce, Spices, Dairy)
	        •	Styled and branded with the RecipeApp logo
        Important Note:
            - Due to Webmail spam identifiers, user may need to send the email twice initially so the 
             email receiver knows that its not spam. Else it may take sometime for the email to be received
```


## ⚠️ Important Notes About Deployment Scripts

Before running the deployment scripts, please review their contents and ensure the following requirements are met:
## 🔐 Required Environment Variables
```bash
    
    The following environment variables must be set before running the application:

    | Variable Name         | Description                                                 |
    |-----------------------|-------------------------------------------------------------| 
    | `SECRET_KEY`          | Django secret key used for cryptographic signing            |
    | `DEBUG`               | Set to `True` for local development, `False` for production |
    | `DB_NAME`             | Name of the PostgreSQL database                             |
    | `DB_USER`             | Username for the PostgreSQL database                        |
    | `DB_PASS`             | Password for the PostgreSQL user                            |
    | `SENDGRID_API_KEY`    | API key used to send emails via Twilio SendGrid             |
    | `GEMINI_API_KEY`      | API key for Google Gemini AI, used to categorize ingredients|

    > These can be stored in a `.env` file for local development or managed securely via AWS Secrets Manager in production.


	•	build-and-push-images.sh
	    - Requires DockerHub authentication
	    - Uses Git tags or commit hashes for versioning
	    - Pushes images to a DockerHub repo (update this if needed)

	•	run_build_prod.sh
	    - Runs the app locally in production mode
	    - Expects proper environment configuration or access to AWS Secrets Manager
        
	•	xnfr_to_ec2.sh
	    - Uses scp and SSH — requires a valid PEM key and correct EC2 IP
	    - Edit the script to ensure proper file paths and credentials

	•	setup-ec2.sh
	    - Installs Docker and Docker Compose
	    - Requires sudo privileges on the EC2 instance

	•	pull_images.sh
	    - Pulls app images from DockerHub
	    - Ensure image tags match what was pushed during the build step

	•	run_ec2.sh
	    - Runs the Docker containers using docker-compose.prod.yml
	    - Assumes environment variables and Docker configs are set properly
```

	🛠️ Tip: Always inspect each script before running it to tailor it for your environment.
