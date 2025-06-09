# 🏠 Home Library Service

**Home Library Service** is a RESTful API built with **NestJS**, **TypeORM**, and **PostgreSQL**. The service allows users to manage a personal media library: store data about **Artists**, **Albums**, **Tracks**, and mark them as **Favorites**.

---

## 📚 Features

- **User Management**
  - Register, update, delete users.
  - Tracks creation and update timestamps.
  - Password hashing and versioning.

- **Artists**
  - Full CRUD operations.
  - Stores Grammy award status (`grammy: boolean`).

- **Albums**
  - Full CRUD operations.
  - Associated with artists.

- **Tracks**
  - Full CRUD operations.
  - Associated with artists and albums.
  - Contains track duration.

- **Favorites**
  - Store favorite artist, album, and track IDs.
  - Add/remove from Favorites.

---

## 🛠️ Tech Stack

- [NestJS](https://nestjs.com/) – Backend framework
- [TypeORM](https://typeorm.io/) – ORM for PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) – Relational database
- [Docker](https://www.docker.com/) – Containerization
- [Docker Compose](https://docs.docker.com/compose/) – Container orchestration

---

## 🔨 Build & Run
```
docker compose --build
docker compose up
```
---

## 🌐 Access

 - Once the containers are running:

 - API Base URL: http://localhost:4000

 - PostgreSQL: Connect on localhost:5432 with:

 - Swagger UI (if configured): http://localhost:3000/docs

---

## 🌐 Docker Hub
```
Docker Hub and can be downloaded using the command:
docker pull lonelybush/home-library-app:latest
```

Link to profile on Docker Hub: https://hub.docker.com/u/lonelybush

---