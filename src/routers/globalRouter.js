import express from "express";
import { home,search } from "../controllers/boardController";
import { getJoin,getLogin, postJoin, postLogin } from "../controllers/userController";
const globalRouter = express.Router();

globalRouter.get("/",home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.get("/search",search);

export default globalRouter;