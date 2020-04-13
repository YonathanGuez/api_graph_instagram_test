const express = require("express");
const https = require("https");
const axios = require("axios").default;
const fs = require("fs");
const qs = require("qs");
require("dotenv").config();

const appid = process.env.APP_ID_INSTA;
const redirecturi = process.env.URI_REDIRECTION;
const appsecret = process.env.APP_SECRET;

const app = express();
//midelleware
const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  next();
};
app.use(logger);

// Body parser Middleware we need this for POST end pars the Body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// GET home route
app.get("/", (req, res) => {
  res.header("Content-type", "text/html");

  const authorize = `https://api.instagram.com/oauth/authorize?client_id=${appid}&redirect_uri=${redirecturi}&scope=user_profile&response_type=code`;
  return res.end(`<h1>connection </h1><a href=${authorize}>connect</a>`);
});

async function test(code) {
  const url = `https://api.instagram.com/oauth/access_token`;
  console.log(`\n${url}`);
  try {
    const opts = {
      method: "POST",
      url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        client_id: appid,
        client_secret: appsecret,
        grant_type: "authorization_code",
        redirect_uri: redirecturi,
        code,
      },
      json: true,
    };
    let body = qs.stringify(opts.data);
    const res = await axios.post(opts.url, body);
    console.log("RES", res.data);
    return res.data;
  } catch (e) {
    console.error("ERROR", e);
  }
}
// GET home route
app.get("/auth", async (req, res) => {
  console.log("AUTH");
  const { code } = req.query;
  const data = await test(code);
  res.status(200);
  res.json(data);
});

// we will pass our 'app' to 'https' server
https
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
      passphrase: "tests",
    },
    app
  )
  .listen(3000, () => {
    console.log(`Server listening`);
  });

// // Start server
// app.listen(3000, () => {
//   console.log(`Server listening`);
// });
