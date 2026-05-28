import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

// CONNECT DATABASE

connectDB();

// MIDDLEWARES

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// TEST ROUTE

app.get("/", (req, res) => {
  res.send("Server is running");
});

// ROUTES

app.use("/api/auth", authRouter);

// PORT

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});