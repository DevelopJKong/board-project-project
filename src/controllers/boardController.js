import { render } from "pug";
import Board from "../models/Board";

export const home = async (req, res) => {
  const { id } = req.params;
  const boards = await Board.find({}); // find vs findById
  return res.render("home", { boards });
};

export const search = (req, res) => {
  return res.send("Search ☕");
};

export const seeBoard = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id);
  if (!board) {
    return res.render("404", { pageTitle: "Page Not Found" });
  }
  return res.render("watch", { board, pageTitle: "Watch" });
};

export const getEditBoard = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id);
  if (!board) {
    return res.render("404", { pageTitle: "Page Not Found" });
  }
  return res.render("edit", { board, pageTitle: "Edit" });
};
export const postEditBoard = async (req, res) => {
  const { id } = req.params;
  const { title, imgUrl, content } = req.body;
  const board = await Board.findById(id);
  if (!board) {
    return res.render("404", { pageTitle: "Page Not Found" });
  }
  await Board.findByIdAndUpdate(id, { title, imgUrl, content });
  return res.redirect(`/board/${id}`);
};

export const getWriteBoard = (req, res) => {
  return res.render("write");
};

export const postWriteBoard = async (req, res) => {
  const { title, imgUrl, content } = req.body;

  try {
    await Board.create({
      title,
      imgUrl,
      content,
    });
    return res.redirect("/");
  } catch (error) {
    return render("write", {
      errorMessage: error._message,
      pageTitle: "Write",
    });
  }
};

export const getDeleteBoard = async(req, res) => {
  const { id } = req.params;
  await Board.findByIdAndDelete(id);
  return res.redirect("/");

};
