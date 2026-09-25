import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.router.js";
import projectRoutes from "./routes/project.routes.js"
const app = express();

app.use(express.json());

app.use(cookieParser())

// app.get("/", (req, res) => {
//     res.json({ message: "welcome to teamflow apis" })
// })


// app.get("/health", (req, res) => {
//     res.json({
//         status: "success",
//         message: "teamflow api is running"
//     })
// })


app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/project", projectRoutes)


export default app;