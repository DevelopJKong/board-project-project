import Board from "../models/Board";
import Order from "../models/Order";
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
  const isHeroku = process.env.MODE === "production";
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
    boardImg: file ? (isHeroku ? file.location : file.path) : boardImg,
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
  const isHeroku = process.env.MODE === "production";
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

/*************************************** 결제 기능 구현중 */

export const getShopList = (req,res) => {
  return res.render("shop-list");
}

export const postShopList = (req,res) => {
  return res.redirect("/board/shop");
}



export const getShopSuccess = (req,res) => {
  return res.render("shop-success");
}

export const getShop = (req, res) => {
  console.log(req.session.user);
  return res.render("shop");
};
//1. axios가 없다 => node-fetch로 대체
//2. Order 모델도 없다

export const postShop = async (req, res) => {
  try {
    //1. 굳이 body에서 받아와야하나? **************
    //2. 데이터 베이스 payments 스키마에 있음 ****************
    const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출

    // 액세스 토큰(access token) 발급 받기
    const getToken = await (
      await fetch({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.SHOP_API_KEY, // REST API키
          imp_secret: process.env.SHOP_API_SECRET, // REST API Secret
        },
      })
    ).json();

    const { access_token } = getToken.data.response; // 인증 토큰
    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await (
      await fetch({
        url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
        method: "get", // GET method
        headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      })
    ).json();

    const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    // DB에서 결제되어야 하는 금액 조회
    const order = await Order.findById(paymentData.merchant_uid);
    const amountToBePaid = order.amount; // 결제 되어야 하는 금액

    // 결제 검증하기
    const { amount, status } = paymentData;
    if (amount === amountToBePaid) {
      // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      await Order.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
      switch (status) {
        case "ready": // 가상계좌 발급
          // DB에 가상계좌 발급 정보 저장
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          await User.findByIdAndUpdate(_id, {
            $set: { vbank_num, vbank_date, vbank_name },
          });
          // 가상계좌 발급 안내 문자메시지 발송
          SMS.send({
            text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} \${vbank_date} \${vbank_name}`,
          });
          res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
          break;
        case "paid": // 결제 완료
          res.send({ status: "success", message: "일반 결제 성공" });
          break;
      }
    } else {
      // 결제 금액 불일치. 위/변조 된 결제
      throw { status: "forgery", message: "위조된 결제시도" };
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
