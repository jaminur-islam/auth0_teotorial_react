const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");
const port = process.env.PORT || 5000;

// Login system implementation, secure api, get user information
// auth0 , jwt token , userInformation

// middleware
app.use(cors());
app.use(express.json());

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-qr4kktsb.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "my-first-auth-application",
  issuer: "https://dev-qr4kktsb.us.auth0.com/",
  algorithms: ["RS256"],
}).unless({ path: "/" });

app.use(verifyJwt);

app.get("/", async (req, res) => {
  res.send("not secure server");
});

app.get("/secure", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const response = await axios("https://dev-qr4kktsb.us.auth0.com/userinfo", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const userinfo = response.data;
    res.send(userinfo);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/secure2", async (req, res) => {
  res.send("secure2 server ");
});

// custom error created
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const status = error.status;
  const message = error.message;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`server running port ${port}`);
});
