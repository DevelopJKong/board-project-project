import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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


export const see = (req, res) => {
  return res.send("See Users ☕");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile");
};

export const postEdit = (req,res) => {
  return res.redirect("/");
}




export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const remove = (req, res) => {
  return res.send("Delete Users ☕");
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
