import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getMyStudents } from "../controllers/studentController.js";

const router = express.Router();

router.get("/my", auth, getMyStudents);

export default router;
