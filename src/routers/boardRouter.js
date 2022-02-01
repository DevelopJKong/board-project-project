import express from "express";
import { seeBoard,editBoard,deleteBoard,writeBoard } from "../controllers/boardController";
const boardRouter = express();

boardRouter.get("/write", writeBoard);
boardRouter.get("/:id", seeBoard);
boardRouter.get("/:id/edit", editBoard);
boardRouter.get("/:id/delete", deleteBoard);




export default boardRouter;