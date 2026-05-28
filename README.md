# HireHub - AI-Powered Job Matcher

HireHub is a premium, AI-powered job matching portal designed to seamlessly connect job seekers and employers using semantic resume screening and vector similarity.

---

## 🚀 Key Features

* **AI-Powered Recommendation Engine:** Uses a local sentence-transformer model (`all-MiniLM-L6-v2`) to convert resume texts and job descriptions into semantic vector embeddings. Candidate profiles are matched with open roles in real time using **Cosine Similarity**.
* **Automatic Resume Parsing:** Upload a PDF resume in your Candidate profile to parse and match skills instantly.
* **Instant Keyword Filtering:** A search bar on the candidate dashboard allows instant, case-insensitive keyword filtering on job titles, functional roles, and descriptions.
* **Role-Based Portals:** Dedicated dashboards, navbars, and workspaces for:
  * **Candidates:** Explore jobs, upload resumes, see match percentages, track applications.
  * **Recruiters:** Post new jobs, view applicant lists, view candidates' PDF resumes, review AI-ranked top candidates.
  * **Administrators:** Global system overview metrics, user administration, global job listing controls.
* **Premium UI/UX:** Styled using a beautiful dark glassmorphic design theme with fluid responsive layouts and micro-animations.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, TypeScript, React Router, Axios, Custom Glassmorphic CSS.
* **Backend:** Node.js, Express, TypeScript, TypeORM, Multer (PDF uploads), PDF-parse-fork, JSON Web Tokens (JWT).
* **Database:** PostgreSQL.
* **AI Engine:** `@xenova/transformers` (running the `all-MiniLM-L6-v2` embedding model **locally** via WebAssembly/ONNX).

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Make sure you have **Node.js** (v18+) and **PostgreSQL** installed and running on your system.

### 2. Database Configuration
Create a database named `job_portal` in your PostgreSQL instance.

### 3. Backend Setup
1. Open the `back_end/` directory.
2. Verify or update the environment variables in `back_end/.env`:
   ```env
   PORT=8080
   DATABASE_URL=postgres://<username>:<password>@localhost:5432/job_portal
   JWT_SECRET=your_super_secret_jwt_key
   ```
3. Install dependencies and start the backend development server:
   ```bash
   cd back_end
   npm install
   npm run dev
   ```

### 4. Frontend Setup
1. Open the `frontend/job_portal/` directory.
2. Install dependencies and start the Vite development server:
   ```bash
   cd frontend/job_portal
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 📦 Production & Deployment

This project is optimized to run as a **single-origin monolith** in production:
1. The React frontend compiles into static assets (`dist/`).
2. The Express backend serves these static files directly and handles React Router history fallbacks.
3. This eliminates CORS issues and lets you host the entire app on a single port.

### How to Build:
1. Build the frontend:
   ```bash
   cd frontend/job_portal
   npm run build
   ```
2. Build the backend:
   ```bash
   cd back_end
   npm run build
   ```
3. Start the production server:
   ```bash
   cd back_end
   npm start
   ```
4. Access the unified app at `http://localhost:8080` (or whatever `PORT` is configured).

---

## 🔒 Security & Git Ignoring
Secret configurations (such as database credentials in `.env`), dependencies (`node_modules/`), and uploaded resumes (`back_end/uploads/`) are excluded from tracking as configured in the root `.gitignore`.
