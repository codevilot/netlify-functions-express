"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

const router = express.Router();
router.get("/", (req, res) => {
  const { page } = req.params;
  res.sendFile(path.join(__dirname, `public/database/${page}.json`));
});
router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/index.html"))
);

module.exports = app;
module.exports.handler = serverless(app);
