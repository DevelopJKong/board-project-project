import express from "express";
import { see , edit, remove, logout, naverLogin, naverCallback } from "../controllers/userController";

const userRouter = express.Router();


userRouter.get("/edit",edit);
userRouter.get("/delete",remove);
userRouter.get("/logout",logout);
userRouter.get('/naverlogin', naverLogin);
userRouter.get('/callback',naverCallback);
userRouter.get("/:id",see);

export default userRouter;