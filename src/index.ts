import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import transactionRoutes from "./routes/transactions";
import pool from "./db/db";
import { initDb } from "./db/init";
import { openApiSpec, docsHtml } from "./docs/openapi";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(limiter);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/health/db", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    console.error("Database health check failed:", (err as Error).message);
    res.status(503).json({ ok: false, db: "unavailable" });
  }
});
app.get("/openapi.json", (_req, res) => res.json(openApiSpec));
app.get("/docs", (_req, res) => res.type("html").send(docsHtml));
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "LedgerLink API",
    message: "Welcome to LedgerLink! A demo backend with JWT auth, REST APIs, and PostgreSQL.",
    docs: "/docs",
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

// Any error thrown in a route lands here instead of crashing the process.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Request failed:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`LedgerLink API listening on ${PORT}`);
  initDb().catch((err) => console.error("Schema init failed:", err.message));
});
