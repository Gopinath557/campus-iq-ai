# CampusIQ AI — Intelligent Campus Placement Platform

CampusIQ AI is an AI-powered placement preparation and student readiness assessment platform designed to streamline student evaluation, aptitude practice, mock interviews, and skill verification.

---

## 🚀 Features

- **Personalized Student Dashboard:** Track preparation readiness, skill proficiencies, and placement eligibility.
- **AI-Powered Mock Interviews:** Interactive technical and HR interview simulation with real-time feedback.
- **Aptitude & Technical Assessment:** Adaptive quizzes across quantitative, logical, and verbal tracks.
- **Comprehensive Profile Management:** Projects, certifications, work experiences, and achievements tracking.
- **Secure Authentication:** JWT-based user authentication and Google OAuth 2.0 integration.
- **FastAPI REST API:** Fully documented modular REST architecture with Swagger UI documentation.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, Modern CSS Design System, Responsive Glassmorphism UI.
- **Backend:** FastAPI (Python 3.10+), SQLAlchemy 2.0, Alembic, Pydantic v2, PyMySQL.
- **Database:** MySQL / MariaDB (`campusiq`).
- **Security:** Argon2/Bcrypt password hashing, JWT authentication, Rate limiting (SlowAPI), Security headers.

---

## 🏁 Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
```

Configure your environment in `backend/.env`:
```env
APP_NAME=CampusIQ AI
APP_VERSION=1.0.0
JWT_SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=15
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=campusiq
DB_USER=root
DB_PASSWORD=your_db_password
```

Start the backend server:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- Interactive API Docs: `http://localhost:8000/docs`
- Health Probe: `http://localhost:8000/health`

### 2. Frontend Setup

```bash
cd frontend
node server.js
```
- Frontend Web App: `http://localhost:3000`

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.