import dotenv from "dotenv";
dotenv.config({ debug: true });
console.log("ENV CHECK:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import cloudinary, { initCloudinary } from "./config/cloudinary.js";
initCloudinary();


connectDB();

const app = express();

// Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",   // React dev server
  "http://127.0.0.1:3000",   // Live Server (127.0.0.1)
  "http://localhost:3000",    // Live Server (localhost)
  "https://mern-resume-shortlister.vercel.app"
];


app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());



app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Serve uploaded files publicly
// app.use("/uploads", express.static("uploads"));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// export default app;

