# 📝 Task Management Project

This is a full-stack **Task Management Application** that is fully containerized using **Docker**. It includes a frontend (likely built with Vite/React), a Node.js backend, and an NGINX server for reverse proxy and static content serving.

## 📦 Project Structure
```
📂 task-manager/
├── 🗂 backend/ # Backend API (Node.js/Express)
│ ├── 📄 Dockerfile # Backend Docker configuration
│ └── 📄 .env # Backend environment variables
├── 🗂 frontend/ # Frontend application (Vite/React)
│ ├── 📄 Dockerfile # Frontend Docker configuration
│ └── 📄 .env # Frontend environment variables
├── 📄 nginx.conf # Custom NGINX configuration
├── 📄 docker-compose.yml # Docker Compose setup
└── 📄 README.md # Project documentation

```

## 🚀 Technologies Used

- **Frontend**: Vite, React (or similar)
- **Backend**: Node.js, Express
- **Web Server**: NGINX (Alpine)
- **Containerization**: Docker, Docker Compose

## 🐳 Docker Setup

The app consists of three main services:

### 1. `nginx`
- Acts as a reverse proxy for frontend and backend.
- Serves the built frontend files.
- Uses a custom `nginx.conf` for configuration.

### 2. `frontend`
- Runs the frontend app using `npm run dev`.
- Builds from Dockerfile in `./frontend`.
- Exposes port `3000`.

### 3. `backend`
- Runs the backend server with `npm run dev`.
- Builds from Dockerfile in `./backend`.
- Exposes port `5000`.

## 📁 Volumes

- `mt-frontend-dist`: Shared volume between frontend and nginx for built files.

## 🛠️ How to Run

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/hashim6789/task-management-platform.git
   cd task-management-platform
Add Environment Variables

Create .env files in frontend/ and backend/ directories as needed.

Start the Project using Docker Compose

bash
Copy
Edit
docker-compose up --build
Access the App

Frontend: http://localhost

Backend API: http://localhost:5000

🧾 Custom NGINX Configuration
Make sure your nginx.conf file properly routes traffic:

nginx
Copy
Edit
http {
  server {
    listen 80;
    location / {
      root /usr/share/nginx/html;
      index index.html index.htm;
      try_files $uri $uri/ /index.html;
    }

    location /api/ {
      proxy_pass http://mt-backend:5000/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
}
📌 Notes
VITE_SERVER_ORIGIN is set as an environment variable inside the frontend container.

Frontend and backend use the command: npm run dev to run in development mode.

Backend and frontend are mounted using volumes for live reload during development.

🧠 Future Improvements
Add production builds and static file serving.

Include authentication and role-based access.

Connect to a database service (e.g., MongoDB, PostgreSQL) in Docker.

## 🧑‍💻 Author

**hashim6789**  
[LinkedIn](https://www.linkedin.com/in/hashim6789) | [GitHub](https://github.com/hashim6789)

---

> Feel free to fork and enhance this project.

---
