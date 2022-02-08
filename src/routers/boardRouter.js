import express from "express";
import {
  seeBoard,
  getEditBoard,
  getDeleteBoard,
  getWriteBoard,
  postWriteBoard,
  postEditBoard,
} from "../controllers/boardController";
const boardRouter = express.Router();

boardRouter.route("/:id([0-9a-f]{24})").get(seeBoard);
boardRouter.route("/:id([0-9a-f]{24})/edit").get(getEditBoard).post(postEditBoard);
boardRouter.route("/:id([0-9a-f]{24})/delete").get(getDeleteBoard);
boardRouter.route("/write").get(getWriteBoard).post(postWriteBoard);

export default boardRouter;
