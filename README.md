Vehicle Rental System API

🔗 **Live URL:** [https://express-server-one-orcin.vercel.app/](https://express-server-one-orcin.vercel.app/)
📦 **Project Type:** Backend REST API
🛠 **Tech Stack:** Node.js, Express.js, TypeScript, PostgreSQL (Neon)

---

## 📌 Project Overview

The **Vehicle Rental System API** is a full-featured backend application that allows users to:

* Register & authenticate using JWT
* Browse and manage vehicles
* Book vehicles with automatic price calculation
* Manage bookings with role-based access
* Automatically update expired bookings using a cron job

---

## ✨ Features

### 🔐 Authentication & Authorization

* User Registration (Customer/Admin)
* Secure Login with JWT
* Role-based access control (Admin & Customer)

---

### 🚗 Vehicle Management

* Create vehicle (Admin only)
* Update vehicle details (Admin only)
* Delete vehicle (Admin only, only if no active bookings)
* Get all vehicles (Public)
* Get single vehicle by ID

---

### 👥 User Management

* Get all users (Admin only)
* Update user (Admin or self)
* Delete user (restricted if active bookings exist)

---

### 📅 Booking System

* Create booking (Authenticated users)
* Auto price calculation:

  ```
  total_price = daily_rent_price × number_of_days
  ```
* View bookings:

  * Admin → all bookings
  * Customer → own bookings
* Update booking:

  * Customer → cancel
  * Admin → mark as returned

---

### ⏱ Auto-Return System (Cron Job)

* Runs daily at **midnight**
* Automatically:

  * Marks expired bookings as `returned`
  * Updates vehicle status to `available`

---

## 🧰 Technology Stack

| Technology           | Purpose              |
| -------------------- | -------------------- |
| Node.js              | Runtime              |
| Express.js           | Backend framework    |
| TypeScript           | Type safety          |
| PostgreSQL (Neon DB) | Database             |
| JWT (jsonwebtoken)   | Authentication       |
| bcryptjs             | Password hashing     |
| node-cron            | Background job       |
| cors                 | Cross-origin support |
| dotenv               | Environment config   |

---

## 📁 Project Structure

```
src/
│
├── config/           # Database & config setup
├── jobs/             # Cron job (auto return)
├── middleware/       # Auth middleware
│
├── modules/
│   ├── auth/         # Auth (login/signup)
│   ├── users/        # User management
│   ├── vehicles/     # Vehicle management
│   ├── bookings/     # Booking system
│
├── app.ts            # Express app config
├── server.ts         # Server entry point
```

---

## 🔐 Authentication

All protected routes require:

```
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | `/api/v1/auth/signup` | Register user |
| POST   | `/api/v1/auth/signin` | Login user    |

---

### 🚗 Vehicles

| Method | Endpoint               | Access |
| ------ | ---------------------- | ------ |
| GET    | `/api/v1/vehicles`     | Public |
| GET    | `/api/v1/vehicles/:id` | Public |
| POST   | `/api/v1/vehicles`     | Admin  |
| PUT    | `/api/v1/vehicles/:id` | Admin  |
| DELETE | `/api/v1/vehicles/:id` | Admin  |

---

### 👥 Users

| Method | Endpoint            | Access       |
| ------ | ------------------- | ------------ |
| GET    | `/api/v1/users`     | Admin        |
| PUT    | `/api/v1/users/:id` | Admin / Self |
| DELETE | `/api/v1/users/:id` | Admin        |

---

### 📅 Bookings

| Method | Endpoint               | Access        |
| ------ | ---------------------- | ------------- |
| GET    | `/api/v1/bookings`     | Authenticated |
| POST   | `/api/v1/bookings`     | Authenticated |
| PUT    | `/api/v1/bookings/:id` | Authenticated |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd assignment-2
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create `.env` file

```env
PORT=5001
CONNECTION_STRING=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run Development Server

```bash
npm run dev
```

---

### 5️⃣ Build Project

```bash
npm run build
```

---

## 🧠 Business Logic Rules

* ❌ Cannot delete user with active bookings
* ❌ Cannot delete vehicle with active bookings
* ✔ Booking automatically calculates price
* ✔ Booking updates vehicle availability
* ✔ Expired bookings auto-return via cron job

---

## 📊 Response Format

### ✅ Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### ❌ Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🚀 Deployment

* Hosted on **Vercel**
* PostgreSQL hosted on **Neon**

---

## 👨‍💻 Author

**Tanvir Mahtab Tafhim**
Full Stack Developer (MERN)

