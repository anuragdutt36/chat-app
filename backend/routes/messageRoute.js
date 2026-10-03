import express from "express";
import { clearMessages, getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/clear/:id").delete(isAuthenticated, clearMessages);
router.route("/:id").get(isAuthenticated, getMessage);

export default router;