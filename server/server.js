require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const auth = require('./middleware/auth'); 
const studentsRoute = require("./routes/Students");

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8081', // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
  }));

const PORT = process.env.PORT || 9000;
const secretKey = process.env.JWT_SECRET; // This can be used later for authentication

// Connect to MongoDB
connectDB();

const chatRoute = require("./routes/chat");
const recommendationsRoute = require("./routes/recommendations");
const certificatesRoute = require("./routes/certificate");

// Mount the routes so they are accessible
app.use("/api", chatRoute);
app.use("/api", recommendationsRoute);
app.use("/auth", authRoutes);
app.use("/api", certificatesRoute);
app.use("/api/leaderboard", studentsRoute);
app.use('/uploads', express.static('uploads'));


app.get("/", (req, res) => {
    res.send("Welcome to Level Up");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
