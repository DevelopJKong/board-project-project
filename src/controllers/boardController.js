export const home = (req, res) => res.render("home");

export const search = (req, res) => {
  return res.send("Search ☕");
};

export const seeBoard = (req, res) => {
  return res.send("See Board ☕");
};

export const editBoard = (req, res) => {
  return res.send("Edit Board ☕");
};

export const deleteBoard = (req, res) => {
  return res.send("Delete Board ☕");
};

export const writeBoard = (req, res) => {
  return res.send("Write Board ☕");
};
