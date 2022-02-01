import express from "express";
import { see , edit, remove } from "../controllers/userController";

const userRouter = express();

userRouter.get("/edit",edit);
userRouter.get("/delete",remove);
userRouter.get("/:id",see);


export default userRouter;