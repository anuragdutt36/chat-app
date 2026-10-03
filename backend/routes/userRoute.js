import express from "express";
import { getOtherUsers, login, logout, register, toggleBlock, updateProfilePhoto, updateProfile } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile-photo").put(isAuthenticated, singleUpload, updateProfilePhoto);
router.route("/profile").put(isAuthenticated, singleUpload, updateProfile);
router.route("/block/:id").post(isAuthenticated, toggleBlock);
router.route("/").get(isAuthenticated, getOtherUsers);

export default router;