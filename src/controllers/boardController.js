import Board from "../models/Board";
import User from "../models/User";

export const home = async (req, res) => {
  const boards = await Board.find({}).sort({ createdAt: "desc" }); // find vs findById
  return res.render("home", { boards });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let boards = [];
  if (keyword) {
    boards = await Board.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { boards });
};

export const getSeeBoard = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id).populate("owner");
  if (!board) {
    return res.render("404", { pageTitle: "Page Not Found" });
  }
  console.log(board);
  return res.render("watch", { board, pageTitle: "Watch" });
};

export const getEditBoard = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const board = await Board.findById(id);
  if (!board) {
    return res.status(404).render("404", { pageTitle: "Page Not Found" });
  }
  if (String(board.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { board, pageTitle: "Edit" });
};
export const postEditBoard = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const {
    params: { id },
    body: { title, content, boardImg },
    file,
  } = req;

  const board = await Board.findById(id);
  if (!board) {
    return res.status(404).render("404", { pageTitle: "Page Not Found" });
  }
  if (String(board.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Board.findByIdAndUpdate(id, {
    title,
    content,
    boardImg: file ? file.path : boardImg,
  });
  return res.redirect(`/board/${id}`);
};

export const getWriteBoard = (req, res) => {
  return res.render("write");
};

export const postWriteBoard = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const {
    body: { title, content, boardImg },
    file,
  } = req;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newBoard = await Board.create({
      title,
      content,
      owner: _id,
      boardImg: file ? (isHeroku ? file.location : file.path) : boardImg,
    });
    const user = await User.findById(_id);
    user.boards.push(newBoard._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("write", {
      errorMessage: error._message,
      pageTitle: "Write",
    });
  }
};

export const getDeleteBoard = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const board = await Board.findById(id);
  if (!board) {
    return res.status(404).render("404", { pageTitle: "Page Not Found" });
  }
  if (String(board.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Board.findByIdAndDelete(id);

  return res.redirect("/");
};
