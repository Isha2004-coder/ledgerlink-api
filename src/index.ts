import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import transactionRoutes from "./routes/transactions";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(limiter);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "LedgerLink API",
    message: "Welcome to LedgerLink! A demo backend with JWT auth, REST APIs, and PostgreSQL.",
    try: [
      "/health",
      "/auth/signup",
      "/auth/login",
      "/users/me",
      "/transactions"
    ],
    repo: "https://github.com/Isha2004-coder/ledgerlink-api"
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 LedgerLink API listening on ${PORT}`));
