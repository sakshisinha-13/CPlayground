# CPlayground 

A full-stack web application that allows users to practice and track Online Assesment and interview questions by company, topic, and difficulty level. It includes an integrated code compiler service.

---

## Live Deployed Link

**Frontend:** https://c-playground.vercel.app/dashboard

---

## ⚙️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/sakshisinha-13/CPlayground.git
cd CPlayground
```

### 2. Setup Environment Variables

#### `client/.env`

```
REACT_APP_API_BASE=http://localhost:5000
```

#### `server/.env`

```
MONGO_URI=mongodb://localhost:27017/codeplayground
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

> Note: Ensure `.env` files are listed in `.gitignore`

### 3. Install Dependencies (If running locally without Docker)

```bash
# Backend
cd server
npm install

# Compiler Service
cd ../compiler
npm install

# Frontend
cd ../client
npm install
```

### 4. Run Locally (Without Docker)

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Compiler Service
cd compiler
npm start

# Terminal 3: Frontend
cd client
npm start
```

### 5. Run with Docker Compose

```bash
docker-compose up --build
```

> Ensure Docker is installed and running.

---

## Project Structure

```
CPlayground/
├── client/             # React frontend
├── server/             # Express backend API
├── compiler/           # Node.js compiler service
├── docker-compose.yml  # Docker Compose for all services
├── README.md
```

---

## Features

* User Authentication with JWT
* Filter by Company, Topic, Difficulty, Year, Role
* Export Questions to CSV, Markdown, and PDF
* Light/Dark Mode
* Mark Questions as Solved
* Integrated Code Compiler 

---

## Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Frontend   | React.js, Tailwind CSS   |
| Backend    | Node.js, Express.js      |
| Compiler   | Node.js (child\_process) |
| Database   | MongoDB                  |
| Auth       | JWT                      |
| Charts     | Chart.js                 |
| Deployment | Docker, AWS EC2          |

---

## Developer Notes

* Backend server: `http://localhost:5000`
* Frontend: `http://localhost:3000`
* Compiler API: `http://localhost:8000`
* The app stores login session and filters in localStorage.
* Filtering by difficulty/topic is live after search.

---

## Author

**Sakshi Sinha**
GitHub: [@sakshisinha-13](https://github.com/sakshisinha-13)

---
