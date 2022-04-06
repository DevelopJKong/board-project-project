import express from "express";
import { getShop, getShopItem, getShopList, postShopList } from "../controllers/shopController";
import { itemFiles } from "../middlewares";

const shopRouter = express.Router();

shopRouter
.route("/")
.get(getShopList)
.post(itemFiles.single("itemImg"),postShopList)

shopRouter
.route("/list")
.get(getShopItem)

shopRouter
.route("/list/:id([0-9a-f]{24})")
.get(getShop)

export default shopRouter;