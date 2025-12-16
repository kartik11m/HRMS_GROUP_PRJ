import express from "express";
import { signup, login, logout, getAllUsers, updateUser, searchUsers, getProfile } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/search", authMiddleware, searchUsers);
router.get("/me", authMiddleware, getProfile);
router.get("/", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, updateUser);
router.get("/:id", authMiddleware, getProfile);

export default router;
