import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import Verification from "../models/Verification";
const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_PASSWORD,
  },
};

const sendMailer = async (data) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      return info.response;
    }
  });
};

export const postCheck = async (req, res) => {
  const { username, checkEmail } = req.body;
  const user = await User.findOne({ username });
  const verification = await Verification.findOne({ user });
  if (checkEmail === verification.code) {
    user.verified = true;
    await user.save();
  }
  return res.redirect("/login");
};

export const getCheck = (req, res) => {
  return res.render("check");
};

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
  const codeNum = uuidv4();
  const mailVar = {
    form: `${process.env.GOOGLE_MAIL}`,
    to: email,
    subject: `${username} Cafe Small House 에 오신것을 환영합니다!`,
    html: `
    <strong>Cafe Small House</strong>
    <br/>
    <hr/>
    <p style="font-size:25px">아래에 있는 확인 코드를 입력해주세요☕</p>
    <p style="color:#0984e3; font-size: 25px;">${codeNum}</p>
    <br/>
    <p> 더 열심히 하는 cafe small house가 되겠습니다</p>
    <p>&copy; ${new Date().getFullYear()} Cafe Small House</p>
    `,
  };
  try {
    const user = await User.create({
      name,
      username,
      email,
      password,
      region,
    });

    await Verification.create({
      code: codeNum,
      user,
    });

    await sendMailer(mailVar);
    return res.render("check", { user });
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

  if (!user.verified) {
    console.log(user.verified);
    return res.render("check", { user });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile");
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatar, email: sessionEmail, username: sessionUsername },
    },
    body: { name, email, username, region },
    file,
  } = req;
  let searchParam = [];
  if (sessionEmail !== email) {
    searchParam.push({ email });
  }
  if (sessionUsername !== username) {
    searchParam.push({ username });
  }
  if (searchParam.length > 0) {
    const foundUser = await User.findOne({ $or: searchParam });
    if (foundUser && foundUser._id.toString() !== _id) {
      return res.status(400).render("edit-profile", {
        errorMessage: "이미 있는 아아디나 이메일 입니다 ❌",
      });
    }
  }
  const isHeroku = process.env.MODE === "production";
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatar: file ? (isHeroku ? file.location : file.path) : avatar,
      name,
      email,
      username,
      region,
    },

    { new: true }
  );

  req.session.user = updateUser;
  console.log(updateUser);
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    console.log("hi");
    return res.redirect("/");
  }
  return res.render("change-password");
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const validationChecker = await bcrypt.compare(oldPassword, user.password);

  if (!validationChecker) {
    return res.render("change-password", {
      errorMessage: "비밀번호가 맞지 않습니다 ❌",
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).redirect("change-password", {
      errorMessage: "비밀번호가 다릅니다 ❌",
    });
  }

  user.password = newPassword;
  await user.save();
  return res.redirect("users/logout");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const remove = (req, res) => {
  return res.send("Delete Users ☕");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("boards");

  if (!user) {
    return res.status(404).render("404");
  }
  return res.render("profile", { user });
};

/*********************************네이버 소셜 로그인 시작************************************ */
/*
기본 아이디어 :
먼저 네이버의 api 를 가지고 와서 로그인을 할수있도록 해줍니다 그런다음 콜백으로 넘겨서
네이버 아이디,이름,이메일 등의 정보를 가지고 와야 합니다 그럴때 access_token 이 필요한데
이렇게 전달되는 과정에 있어서 post로 왜 전달이 되지 않는지 현재 이곳에서 막혀있습니다
*/

export const naverLogin = (req, res) => {
  const config = {
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    state: process.env.RANDOM_STATE,
    redirectURI: process.env.MY_CALLBACK_URL,
  };

  const { client_id, client_secret, state, redirectURI } = config;

  const api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectURI +
    "&state=" +
    state;
  //res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  return res.redirect(api_url);
};

export const naverCallback = async (req, res) => {
  const baseUrl = "https://nid.naver.com/oauth2.0/token";
  const grantType = "grant_type=authorization_code";
  const config = {
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    redirectURI: process.env.MY_CALLBACK_URL,
    state: req.query.state,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${grantType}&${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://openapi.naver.com/v1/nid/me";
    const allData = await (
      await fetch(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    if (!allData.response.email) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: allData.response.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        name: allData.response.name ? allData.response.name : "Unknown",
        username: allData.response.nickname,
        email: allData.response.email,
        password: "",
        socialOnly: true,
        region: "korea",
      });

      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

/*********************************네이버 소셜 로그인 끝************************************ */
