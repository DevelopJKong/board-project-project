let boards = [
  {
    id: 1,
    title: "1st board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 2,
    title: "2nd board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 3,
    title: "3rd board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 4,
    title: "4th board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 5,
    title: "5th board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 6,
    title: "6th board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 7,
    title: "7th board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 8,
    title: "8th board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 9,
    title: "9th board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
  {
    id: 10,
    title: "10th board",
    text: "Node.js simple project 입니다 📝",
    imgUrl: "/image/Node.js.png",
  },
];

export const home = (req, res) => res.render("home", { boards });

export const search = (req, res) => {
  return res.send("Search ☕");
};

export const seeBoard = (req, res) => {
  return res.render("watch", { boards });
};

export const editBoard = (req, res) => {
  const { id } = req.params;
  const board = boards[id - 1];
  return res.render("edit", { board });
};

export const deleteBoard = (req, res) => {
  return res.send("Delete Board ☕");
};

export const writeBoard = (req, res) => {
  return res.send("Write Board ☕");
};
