"use strict";
// const express = __non_webpack_require__("express");
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

// const router = express.Router();
// router.get("/", (req, res) => {
//   res.writeHead(200, { "Content-Type": "text/html" });
//   res.write("<h1>Hello from Express.js!</h1>");
//   res.end();
// });
// router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
// router.post("/", (req, res) => res.json({ postBody: req.body }));

// app.use(bodyParser.json());
// app.use("/.netlify/functions/server", router); // path must route to lambda
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(3000, () => console.log("Local app listening on port 3000!"));
module.exports = app;
module.exports.handler = serverless(app);
