require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const port = process.env.PORT || 5000;
const code = process.env.JWT_SECRET;

const app = express();

app.set("trust proxy", 1);

app.use(cookieParser());

// solve CORS
app.use(
  cors({
    credentials: true,
    origin: [
      "https://rodrigoleitedev2.com.br",
      "https://www.rodrigoleitedev2.com.br",
    ],
  }),
);

//upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//session
app.use(
  session({
    secret: code,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: "none" }, // secure true quando o site estiver ativo com https
  }),
);

//config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//DB connection
require("./config/db.js");

//routes
const router = require("./routes/Router.js");

app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
