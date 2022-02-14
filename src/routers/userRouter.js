import express from "express";
import { see , edit, remove, logout, naverLogin, postNaverCallback, getNaverCallback, postNaverMember, getNaverMember  } from "../controllers/userController";

const userRouter = express.Router();


userRouter.get("/edit",edit);
userRouter.get("/delete",remove);
userRouter.get("/logout",logout);
userRouter.get("/naverLogin",naverLogin); 
userRouter.route("/callback").get(getNaverCallback).post(postNaverCallback); 
userRouter.route("/member").get(getNaverMember).post(postNaverMember);
userRouter.get("/:id",see);

export default userRouter;