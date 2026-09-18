import express from "express";
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.router.js"
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "welcome to teamflow apis" })
})


app.get("/health", (req, res) => {
    res.json({
        status: "success",
        message: "teamflow api is running"
    })
})


app.use("/users", userRoutes);
app.use("/auth", authRoutes)


export default app;