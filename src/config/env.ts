import "dotenv/config";

export const env = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL || "",
    jwtSecret: process.env.JWT_SECRET || "",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || ""
}