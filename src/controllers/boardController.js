import Board from "../models/Board";

export const home = async (req, res) => {
  const { id } = req.params;
  const boards = await Board.find(id);
  return res.render("home", { boards });
};

export const search = (req, res) => {
  return res.send("Search ☕");
};

export const seeBoard = (req, res) => {
  return res.render("watch");
};

export const getEditBoard = async (req, res) => {
  const { id } = req.params;
  const boards = await Board.find(id);
  return res.render("edit", { boards });
};
export const postEditBoard = (req, res) => {
  const { id } = req.params;
  return res.render("edit");
};

export const getWriteBoard = (req, res) => {
  return res.render("write");
};

export const postWriteBoard = async (req, res) => {
  const { title, imgUrl, content } = req.body;
  const board = new Board({
    title,
    imgUrl,
    content,
    createAt: Date.now(),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await board.save();
  return res.redirect("/");
};

export const deleteBoard = (req, res) => {
  return res.send("Delete Board ☕");
};
