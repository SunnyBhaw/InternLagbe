# InternLagbe 🎓  
**An Internship Management Platform for Students & Companies**

InternLagbe is a **full-stack web application** designed to connect students with internship opportunities and help companies manage internship postings and applications efficiently.  
The system supports **role-based access** for Students, Companies, and Admins.

🚀 Features
---

### 👩‍🎓 Student
- Student registration & login
- Profile creation & update
- Browse available internships
- Apply for internships
- Upload resume (PDF)
- View application status
- Student dashboard

### 🏢 Company
- Company registration
- Company profile management
- Post new internship opportunities
- Edit & manage internships
- View student applications
- Company dashboard

### 🛠️ Admin
- Admin authentication
- Manage users (students & companies)
- Manage internships
- View reports & system overview
- Seeded admin account support

## 🧰 Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT Authentication**
- **Multer** (Resume upload)
- **bcryptjs** (Password hashing)
- **dotenv**, **cors**

### Frontend
- **React 18**
- **Vite**
- **React Router DOM**
- **Axios**
- **Tailwind CSS**
- **Lucide React Icons**

## 📁 Project Structure

```
InternLagbe/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── internshipController.js
│   │   ├── applicationController.js
│   │   ├── profileController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── CompanyProfile.js
│   │   ├── Internship.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── internships.js
│   │   ├── applications.js
│   │   ├── profile.js
│   │   └── admin.js
│   ├── uploads/
│   │   └── resumes/
│   └── utils/
│       └── seedAdmin.js
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── App.css
│       ├── components/
│       │   └── CompanySidebar.jsx
│       │   └── ProfileBanner.jsx
│       │   └── Sidebar.jsx
│       │   └── StudentSidebar.jsx
│       ├── pages/
│       │   └── AdminDashboard.jsx
│       │   └── AdminInternships.jsx
│       │   └── AdminReports.jsx
│       │   └── BrowseInternships.jsx
│       │   └── CompanyApplications.jsx
│       │   └── CompanyDashboard.jsx
│       │   └── CompanyOnboarding.jsx
│       │   └── CompanyProfile.jsx
│       │   └── EditInternship.jsx
│       │   └── InternshipDetail.jsx
│       │   └── Login.jsx
│       │   └── ManageInternships.jsx
│       │   └── MyApplications.jsx
│       │   └── PostInternship.jsx
│       │   └── Signup.jsx
│       │   └── StudentDashboard.jsx
│       │   └── StudentOnboarding.jsx
│       │   └── StudentProfile.jsx
│       │   └── UserManagement.jsx
│       ├── utils/
│       │   └── api.js
│       └── assets/
│       │   └── Banner1.png
│       │   └── Logo.png
│
└── README.md 
```

## ⚙️ Backend Setup

1️⃣ Navigate to backend 
```
cd backend
```
2️⃣ Install dependencies 
```
npm install
```
3️⃣ Create .env file 
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
4️⃣ Run backend server 
```
npm run dev
# or
npm start
```

## 🎨 Frontend Setup

1️⃣ Navigate to frontend 
```
cd frontend
```
2️⃣ Install dependencies
```
npm install
```
3️⃣ Run frontend 
```
npm run dev
```

## 🌱 Future Improvements

- Email & SMS notifications
- Internship recommendation system
- Admin analytics dashboard
- Chat system between student & company

## 👨‍💻 Author
[Sunny Bhaw](https://github.com/SunnyBhaw)
