import express from "express";
import {
  getSeeBoard,
  getEditBoard,
  getDeleteBoard,
  getWriteBoard,
  postWriteBoard,
  postEditBoard,
  getShop,
  getShopSuccess,
  postShop,
  getShopList,
  postShopList,
  getShopItem,
} from "../controllers/boardController";
import { boardImgFiles, itemFiles, protectorMiddleware } from "../middlewares";
const boardRouter = express.Router();

boardRouter.route("/:id([0-9a-f]{24})").get(getSeeBoard);

boardRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEditBoard)
  .post(boardImgFiles.single("boardImg"),postEditBoard);

boardRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(getDeleteBoard);

boardRouter
  .route("/write")
  .all(protectorMiddleware)
  .get(getWriteBoard)
  .post(boardImgFiles.single("boardImg"),postWriteBoard);

boardRouter
  .route("/success")
  .get(getShopSuccess)
  .post(postShop)

boardRouter
  .route("/shop")
  .get(getShopList)
  .post(itemFiles.single("itemImg"),postShopList)

boardRouter
  .route("/shop/list")
  .get(getShopItem)

boardRouter
  .route("/shop/list/:id([0-9a-f]{24})")
  .get(getShop)

export default boardRouter;
