import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import pool from "../db/db";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const { rows } = await pool.query("SELECT id, email, created_at FROM users WHERE id=$1", [req.userId]);
  return res.json(rows[0] || null);
}));

export default router;
