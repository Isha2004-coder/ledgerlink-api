import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import pool from "../db/db";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const txSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional()
});

router.get("/", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const { rows } = await pool.query(
    "SELECT id, amount, description, created_at FROM transactions WHERE user_id=$1 ORDER BY created_at DESC",
    [req.userId]
  );
  res.json(rows);
}));

router.post("/", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const parsed = txSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { amount, description } = parsed.data;
  const { rows } = await pool.query(
    "INSERT INTO transactions(user_id, amount, description) VALUES($1,$2,$3) RETURNING id, amount, description, created_at",
    [req.userId, amount, description || null]
  );
  res.status(201).json(rows[0]);
}));

export default router;
