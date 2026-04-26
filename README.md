# 🍳 VitalsLog Backend — Node.js + Express + MongoDB

> REST API backend for the VitalsLog health tracking app. Built with Node.js, Express.js, and MongoDB Atlas with JWT authentication and bcrypt password encryption.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure token-based auth system
- 🔒 **Password Encryption** — bcrypt hashing for all passwords
- 🤖 **Auto Status Calculation** — MongoDB pre-save hook calculates Normal/Warning/Critical
- 👤 **User Management** — Register, login, profile endpoints
- 💾 **Vitals CRUD** — Save, get, delete vital records
- 🛡️ **Auth Middleware** — Protected routes with token verification
- ☁️ **MongoDB Atlas** — Cloud database integration

---

## 🏗️ Project Structure

```
vitalslog-backend/
├── server.js              # Entry point — starts server + DB connection
├── .env                   # Environment variables (not in repo!)
├── .gitignore             # Ignores node_modules and .env
├── package.json           # Dependencies
│
├── models/
│   ├── User.js            # User schema (name, email, password, etc.)
│   └── Vital.js           # Vital schema + auto status calculation
│
├── routes/
│   ├── auth.js            # /register, /login, /profile
│   └── vitals.js          # /vitals CRUD endpoints
│
└── middleware/
    └── auth.js            # JWT token verification middleware
```

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login and get JWT token |
| GET | `/api/auth/profile` | ✅ | Get logged in user profile |

### Vitals Routes (`/api/vitals`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/vitals` | ✅ | Save new vital reading |
| GET | `/api/vitals` | ✅ | Get all vitals (latest first) |
| GET | `/api/vitals/latest` | ✅ | Get most recent vital |
| GET | `/api/vitals/today` | ✅ | Get today's vitals |
| DELETE | `/api/vitals/:id` | ✅ | Delete a vital record |

---

## 📋 Request & Response Examples

### Register
```json
POST /api/auth/register
{
  "name": "Sahil",
  "email": "sahil@example.com",
  "password": "sahil2200"
}

Response:
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhgvey...",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Save Vitals
```json
POST /api/vitals
Authorization: Bearer eyJhbGc...
{
  "heartRate": 72,
  "spo2": 98,
  "systolic": 120,
  "diastolic": 80,
  "temperature": 98.6
}

Response:
{
  "success": true,
  "message": "Vitals saved successfully!",
  "vital": {
    "heartRate": 72,
    "spo2": 98,
    "bloodPressure": { "systolic": 120, "diastolic": 80 },
    "temperature": 98.6,
    "status": "Normal",
    "createdAt": "2026-04-27T..."
  }
}
```

---

## 🤖 Auto Status Calculation

The Vital model automatically calculates health status before saving:

```javascript
Normal  → heartRate: 60-100, spo2: 95+, systolic: <130, temp: <99.5
Warning → heartRate: 50-120, spo2: 90+, systolic: <140, temp: <101
Critical → anything outside Warning range
```

---

## 🛡️ Authentication Flow

```
Client sends: POST /api/auth/login { email, password }
                        ↓
Server finds user in MongoDB
                        ↓
bcrypt compares password with encrypted hash
                        ↓
If valid → jwt.sign({ userId }) → returns token
                        ↓
Client stores token → sends with every request:
Authorization: Bearer eyJhbGc...
                        ↓
authMiddleware verifies token → extracts userId
                        ↓
Route handler uses req.userId to fetch user's data only
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works!)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/SahillmalikUI/vitalslog-backend.git
cd vitalslog-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create .env file**
```bash
# Create .env in root directory and add:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vitalslog
JWT_SECRET=your_super_secret_key_here
```

**4. Run the server**
```bash
# Development (with auto-restart):
npm run dev

# Production:
npm start
```

**5. Test the API**
```bash
# Server running check:
GET http://localhost:5000
# Response: { "message": "🏥 VitalsLog API is running!", "status": "success" }
```

---

## 🧪 Testing with Postman

Import these requests in Postman:

1. `POST http://localhost:5000/api/auth/register` — Create account
2. `POST http://localhost:5000/api/auth/login` — Get token
3. Copy token from login response
4. `POST http://localhost:5000/api/vitals` — Add Authorization: Bearer {token}
5. `GET http://localhost:5000/api/vitals` — Get all vitals

---

## 📦 Dependencies

```json
{
  "express": "^5.2.1",
  "mongoose": "^9.4.1",
  "dotenv": "latest",
  "jsonwebtoken": "latest",
  "bcryptjs": "latest",
  "nodemon": "latest (dev)"
}
```

---

## 🔗 Frontend Repository

👉 **[VitalsLog Flutter App](https://github.com/SahillmalikUI/vitalslog)**

---

## 👨‍💻 Developer

**Sahil Ali**
- Flutter & Embedded UI Developer
- 16+ months professional experience

📧 mohdsahilali6051@gmail.com
🐙 [github.com/SahillmalikUI](https://github.com/SahillmalikUI)

---

## 📄 License

MIT License — feel free to use this project for learning!

---

⭐ **If this helped you learn backend development, give it a star!**
