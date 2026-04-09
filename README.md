# 📝 FuscoNotes | Full-Stack Productivity Suite

[](https://nestjs.com/)
[](https://reactjs.org/)
[](https://www.mysql.com/)
[](https://tailwindcss.com/)

**FuscoNotes** is a high-performance note-management platform designed to deliver a fluid, secure, and organized user experience. It leverages a robust architecture based on logical microservices and a cutting-edge reactive interface.

-----

## 🚀 Key Features

  * **Robust Authentication:** Secure system based on **JWT (JSON Web Tokens)** with route protection on both client and server sides.
  * **Smart Note Management:** Full CRUD operations with **archiving and recovery** capabilities to keep the workspace clutter-free.
  * **Dynamic Categorization:** Taxonomy system with customizable color-coded labels for efficient visual organization.
  * **Layered Architecture:** Backend structured into Controllers, Services, and Repositories to guarantee scalability and maintainability.
  * **Premium UI/UX:** Responsive interface built with **Shadcn/UI** and **Tailwind CSS**, optimized for mobile devices (Drawer Menu) and desktop.
  * **Real-Time Notifications:** Instant user feedback through a polished **Sonner Toasts** system.

-----

## 🛠️ Tech Stack

### **Frontend (Client Side)**

  * **Framework:** React 18 powered by **Vite** (ultra-fast build tool).
  * **Language:** TypeScript (Strict typing for reduced runtime errors).
  * **Styling:** Tailwind CSS & Lucide Icons.
  * **Navigation:** React Router Dom v6 (URL-driven state management).

### **Backend (Server Side)**

  * **Framework:** NestJS (A progressive Node.js framework).
  * **ORM:** TypeORM for efficient database communication.
  * **Security:** Passport.js & JWT Strategy.
  * **Validation:** Class-Validator & DTOs for data integrity.

### **Infrastructure**

  * **Database:** MySQL 8.0.
  * **Version Control:** Git / GitHub.

-----

## 📂 Ecosystem Structure

```bash
├── Frontend/             # React + Vite Application
│   ├── src/components/   # Atomic Components & UI (Shadcn)
│   ├── src/contexts/     # Global state management (Auth)
│   └── src/pages/        # Main views (Dashboard, Categories, Login)
├── backend/              # NestJS Server
│   ├── src/auth/         # Security & JWT logic
│   ├── src/notes/        # Note management module
│   └── src/categories/   # Taxonomy & Labeling module
└── setup.sh              # Environment automation script (macOS/Linux)
```

-----

## ⚙️ Local Setup & Deployment

### 1\. Prerequisites

  * Node.js (v18 or higher)
  * MySQL Server running
  * Homebrew (optional, for automatic installation on macOS)

### 2\. Automated Installation (Recommended)

I have developed a script that automates dependency installation and database configuration:

```bash
chmod +x setup.sh
./setup.sh
```

### 3\. Running in Development

To launch the full ecosystem, start both services in separate terminals:

**Terminal A (Backend):**

```bash
cd backend && npm run start:dev
```

**Terminal B (Frontend):**

```bash
cd Frontend && npm run dev
```

-----

## 🔌 API Endpoints (Summary)

| Method | Endpoint | Action |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | User authentication & Token generation. |
| `GET` | `/api/notes` | Fetch notes (Optional category filter). |
| `POST` | `/api/notes` | Create a new note linked to the user. |
| `PUT` | `/api/notes/:id` | Update content or archive status. |
| `DELETE` | `/api/notes/:id` | Permanent deletion. |

-----

**Developed with ❤️ by Riccardo Fusco**
*Software Engineer Portfolio Project*
