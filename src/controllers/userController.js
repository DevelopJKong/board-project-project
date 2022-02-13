import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join");
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, region } = req.body;

  if (password !== password2) {
    return res.status(400).render("join", {
      errorMessage: "비밀번호가 일치하지 않습니다 ❌",
    });
  }

  const validationChecker = await User.exists({
    $or: [{ username }, { email }],
  });

  if (validationChecker) {
    return res.status(400).render("join", {
      errorMessage: "이미 사용중인 이름/이메일 입니다 ❌",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      region,
    });

    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login");
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .render("login", { errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌" });
  }
  const validaionCheck = await bcrypt.compare(password, user.password);

  if (!validaionCheck) {
    return res.status(400).render("login", {
      errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  return res.send("Log out ☕");
};

export const see = (req, res) => {
  return res.send("See Users ☕");
};

export const edit = (req, res) => {
  return res.send("Edit Users ☕");
};

export const remove = (req, res) => {
  return res.send("Delete Users ☕");
};

const config = {
  client_id: process.env.NAVER_CLIENT_ID,
  client_secret: process.env.NAVER_CLIENT_SECRET,
  state: process.env.RANDOM_STATE,
  redirectURI: encodeURI(`${process.env.MY_CALLBACK_URL}`),
  api_url: "",
};

export const naverLogin = (req, res) => {
  config.api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    config.client_id +
    "&redirect_uri=" +
    config.redirectURI +
    "&state=" +
    config.state;
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.end(
    "<a href='" +
      config.api_url +
      "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>"
  );
};

export const naverCallback = (req, res) => {
  code = req.query.code;
  config.state = req.query.state;
  config.api_url =
    "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
    config.client_id +
    "&client_secret=" +
    config.client_secret +
    "&redirect_uri=" +
    config.redirectURI +
    "&code=" +
    config.code +
    "&state=" +
    config.state;
  let request = require("request");
  let options = {
    url: config.api_url,
    headers: {
      "X-Naver-Client-Id": config.client_id,
      "X-Naver-Client-Secret": config.client_secret,
    },
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
};
