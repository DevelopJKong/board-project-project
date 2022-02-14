import express from "express";
import { see , getEdit,postEdit, remove, logout, naverLogin, naverCallback} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();


userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.route("/logout").all(protectorMiddleware).get(logout);
userRouter.route("/naverLogin").all(publicOnlyMiddleware).get(naverLogin); 
userRouter.route("/callback").all(publicOnlyMiddleware).get(naverCallback); 
userRouter.route("/delete").get(remove);
userRouter.route("/:id([0-9a-f]{24})",see);

export default userRouter;