import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/db";
import { z } from "zod";

const router = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/signup", async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password } = parsed.data;

  const existing = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);
  if (existing.rowCount && existing.rowCount > 0) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users(email, password) VALUES($1,$2) RETURNING id, email",
    [email, hashed]
  );
  return res.status(201).json(result.rows[0]);
});

router.post("/login", async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password } = parsed.data;
  const { rows } = await pool.query("SELECT id, email, password FROM users WHERE email=$1", [email]);
  if (rows.length === 0) return res.status(400).json({ error: "User not found" });

  const ok = await bcrypt.compare(password, rows[0].password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1h" });
  return res.json({ token });
});

export default router;
