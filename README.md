# InternLagbe 🎓
### **A Premium Internship Ecosystem for the Next Generation of Talent**

InternLagbe is a state-of-the-art **Full-Stack Internship Management System** built to bridge the gap between ambitious students and industry-leading companies. With a focus on visual excellence and seamless user experience, InternLagbe provides specialized portals for students to find their dream roles and for companies to manage talent pipelines with ease.

![Project Banner](frontend/src/assets/Banner1.png)

---

## ✨ Core Pillars

### 👩‍🎓 For Students: The Career Launchpad
*   **Intelligent Browsing**: Search and filter internships by category, location, and role.
*   **Single-Click Applications**: Apply instantly with automated resume processing.
*   **Live Tracking**: Real-time dashboard to monitor application statuses (Pending, Shortlisted, Hired).
*   **Professional Identity**: Comprehensive profiles showcasing skills and experiences.
*   **Mobile-First Design**: Browse and apply on the go with a fully responsive interface.

### 🏢 For Companies: The Recruitment Hub
*   **Opportunity Management**: Create, edit, and manage internship postings with a rich UI.
*   **Talent Pipeline**: Centralized dashboard to review applicants, view resumes, and manage hiring statuses.
*   **Analytics At-A-Glance**: Track active postings, total applications, and shortlisted candidates.
*   **Branded Presence**: Customizable company profiles to establish industry identity.

### 🛠️ For Admins: The System Command Center
*   **User Governance**: Full control over student and company accounts.
*   **Content Moderation**: Monitor and manage all platform-wide internship postings.
*   **System Analytics**: Detailed reports on user growth, application trends, and platform activity.
*   **Security First**: Role-based access control (RBAC) ensuring data integrity.

---

## 🛠️ Technical Excellence

### Frontend (The Visual Layer)
*   **React 18 & Vite**: Lightning-fast development and optimized production builds.
*   **Tailwind CSS 4.0**: A modern, utility-first styling system for premium aesthetics.
*   **Lucide React**: High-quality, consistent iconography.
*   **Responsive Engine**: Custom-built breakpoints ensuring 100% responsiveness on mobile, tablet, and desktop.

### Backend (The Logic Layer)
*   **Node.js & Express.js**: Scalable, asynchronous server-side architecture.
*   **MongoDB & Mongoose**: Flexible, document-oriented database for complex talent data.
*   **JWT Authentication**: Secure, stateless session management.
*   **Multer Ecosystem**: Robust file handling for secure resume uploads and processing.

---

## 📁 Project Architecture

```bash
InternLagbe/
├── frontend/             # React application (Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable UI (Sidebars, Headers, Banners)
│   │   ├── pages/        # Route-level components
│   │   ├── utils/        # API configurations & helpers
│   │   └── assets/       # Branding & Media
├── backend/              # Express API (Node.js + MongoDB)
│   ├── models/           # Mongoose schemas (User, Internship, App)
│   ├── controllers/      # Core business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & File processing
│   └── uploads/          # Secure storage for resumes
```

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas account or local MongoDB instance

### 2. Backend Installation
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_ultra_secure_secret
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```
The application will be live at `http://localhost:5173`.

---

## 🎨 Design Philosophy
InternLagbe isn't just a tool; it's an experience. We utilize:
*   **Glassmorphism**: Subtle blurs and translucent layers.
*   **Micro-Animations**: Smooth transitions using Tailwind and CSS.
*   **Lining Nums**: Professional typography for statistical data.
*   **Fluid Layouts**: Seamless transitions between mobile and desktop viewports.

---

## 👨‍💻 Author
**Sunny Bhaw**
*   [GitHub](https://github.com/SunnyBhaw)
*   [LinkedIn](https://linkedin.com/in/sunnybhaw)

---
*Developed with ❤️ for the Developer Community.*
