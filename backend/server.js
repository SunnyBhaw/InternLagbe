const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Route files
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const internships = require('./routes/internships');
const applications = require('./routes/applications');
const profile = require('./routes/profile');


const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173/",
    credentials: true
}));
app.use(express.json());

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use('/api/internships', internships);
app.use('/api/applications', applications);
app.use('/api/profile', profile);

app.get("/",(req, res) =>{
    res.send("Backend Running")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
