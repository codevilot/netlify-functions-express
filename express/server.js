const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const users = require("./public/utils/user.js");

const app = express();
const port = 5500;
const SECRET_KEY =
  "5572227ac6e88738abaca65ded2d7965ffb7fca1c7a277c880ee8861dc5366aa619beba8255269153f6ef06a01aebedf3abf1ec34c4228ee3e68ef29ef098d35";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.get("/api/:page", (req, res) => {
  const { page } = req.params;
  res.sendFile(path.join(__dirname, `public/database/${page}.json`));
});

/* 토큰이 필요한 페이지에 접근했을 때 */
const auth = (req, res) => {
  const accessToken = req.cookies;

  jwt.verify(accessToken, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(decoded);
  });
};

app.post("/api/signin", (req, res) => {
  const { userid, password } = req.body;

  const user = users.findUser(userid, password);
  if (!user) {
    res.status(400).send("존재하지 않는 사용자입니다");
    console.error("존재하지 않는 사용자입니다");
    return;
  }

  const accessToken = jwt.sign({ userid }, SECRET_KEY);
  res.cookie("accessToken", accessToken, {
    maxAge: 900000,
    httpOnly: true,
  });
  res.send({ userid });
});

app.post("/api/signup", (req, res) => {
  const { userid, password } = req.body;

  const user = users.findUser(userid, password);
  if (user) {
    res.status(400).send("이미 존재하는 사용자입니다");
    console.error("이미 존재하는 사용자입니다");
    return;
  }

  users.addUser({ id: userid, password });

  res.send({ userid });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("accessToken");
});

// 브라우저 새로고침을 위한 처리 (다른 route가 존재하는 경우 맨 아래에 위치해야 한다)
// 브라우저 새로고침 시 서버는 index.html을 전달하고 클라이언트는 window.location.pathname를 참조해 다시 라우팅한다.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
