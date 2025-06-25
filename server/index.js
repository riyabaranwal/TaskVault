const express = require("express");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/task.route");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/config");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, try again later.",
});

app.use("/api", limiter);

app.get("/", (req, res) => {
  res.send("Welcome to the Task Management API");
});

app.use("/api/tasks", taskRoutes);

connectDB();

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
