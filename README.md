# 🐾 Pet Adoption & Services Backend API

Backend REST API untuk aplikasi **Pet Adoption & Pet Services**. Dibangun dengan **Node.js, Express, dan MySQL**, backend ini dirancang **stabil, scalable, dan siap dikonsumsi aplikasi Flutter**.

> Project ini dibuat sebagai **portofolio profesional** dan fondasi backend untuk aplikasi mobile.

---

## ✨ Features

* 🔐 **Authentication & Authorization** (JWT)
* 👤 User registration, login, dan profile (`/auth/me`)
* 🐶 **Create Post** (Pet Adoption & Services)
* 🖼️ **Upload multiple images** (multipart/form-data)
* 🔁 **Database transaction** (atomic & safe)
* 📦 Modular & clean folder structure
* ⚡ MySQL connection pooling
* 🛡️ Middleware-based security

---

## 🧰 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MySQL / MariaDB
* **Auth**: JWT (jsonwebtoken)
* **Password Hashing**: bcryptjs
* **File Upload**: Multer
* **Environment Config**: dotenv

---

## 📂 Project Structure

```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── auth.controller.js
│   ├── db.controller.js
│   ├── health.controller.js
│   └── post.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── routes/
│   ├── index.js
│   └── post.routes.js
├── uploads/            # ignored by git
├── app.js
└── server.js
```

---

## 🗄️ Database Schema (Core Tables)

* `users`
* `posts`
* `pet_details`
* `service_details`
* `post_images`

> Semua relasi menggunakan **foreign key + ON DELETE CASCADE**

---

## ⚙️ Environment Setup

Buat file `.env` di root project:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=pet_db
JWT_SECRET=supersecretkey
```

---

## 🚀 Installation & Run

```bash
# install dependencies
npm install

# run server (development)
npm run dev

# or
node src/server.js
```

Server akan berjalan di:

```
http://localhost:3000
```

---

## 🔌 API Endpoints

### 🔐 Auth

#### Register

```
POST /api/auth/register
```

```json
{
  "name": "Dwi",
  "email": "dwi@mail.com",
  "password": "123456"
}
```

#### Login

```
POST /api/auth/login
```

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer <TOKEN>
```

---

### 🐾 Create Post (Pet / Service)

```
POST /api/posts
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data
```

#### Pet Post Example

| key           | type | value         |
| ------------- | ---- | ------------- |
| type          | text | pet           |
| title         | text | Kucing Persia |
| description   | text | Sehat & jinak |
| location      | text | Jakarta       |
| species       | text | Cat           |
| breed         | text | Persian       |
| age           | text | 2             |
| gender        | text | female        |
| is_vaccinated | text | true          |
| images        | file | cat.jpg       |

#### Service Post Example

| key          | type | value           |
| ------------ | ---- | --------------- |
| type         | text | service         |
| title        | text | Grooming Kucing |
| location     | text | Depok           |
| service_type | text | Pet Grooming    |
| price        | text | 50000           |
| duration     | text | 30 menit        |

---

## 📸 Image Upload Notes

* Maksimal **5 gambar** per post
* Maksimal **5MB per file**
* Format: image/*
* Disimpan di `src/uploads/`
* Path disimpan di database

> Folder `uploads` **tidak di-commit ke Git**

---

## 🛡️ Security Notes

* Password disimpan dalam bentuk **hash (bcrypt)**
* JWT digunakan untuk proteksi endpoint
* Middleware auth memastikan akses aman

---

## 🧪 Testing

API dapat diuji menggunakan:

* Postman
* Insomnia
* curl

Pastikan:

* Header Authorization benar
* Multipart form tidak set Content-Type manual

---

## 📱 Flutter Integration

Backend ini dirancang untuk digunakan oleh aplikasi **Flutter** sebagai frontend:

* Auth → login/register
* Home → list posts
* Detail → post detail + images
* Create → create pet/service post

---

## 📌 Roadmap

* [ ] Get posts (list & pagination)
* [ ] Get post detail
* [ ] Update & delete post
* [ ] Chat & messages
* [ ] API documentation (OpenAPI / Swagger)
* [ ] Flutter mobile app

---

## 👨‍💻 Author

**Primantoro Dwi Yogo**
Backend & Mobile Enthusiast

---

## 📄 License

MIT License
