import express from "express";
import {
  seeBoard,
  getEditBoard,
  deleteBoard,
  getWriteBoard,
  postWriteBoard,
  postEditBoard,
} from "../controllers/boardController";
const boardRouter = express.Router();

boardRouter.route("/write").get(getWriteBoard).post(postWriteBoard);
boardRouter.get("/:id", seeBoard);
boardRouter.route("/:id/edit").get(getEditBoard).post(postEditBoard);
boardRouter.get("/:id/delete", deleteBoard);

export default boardRouter;
