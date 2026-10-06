const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//services
const { randomCode } = require("../../services/emailVerify");

//models
const User = require("../../models/User");
const Email = require("../../models/Email");

const jwtSecret = process.env.JWT_SECRET;

//generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

//register user and sign in
const register = async (req, res, next) => {
  const step = req.body.step;

  switch (step) {
    case "name":
      const name = req.body.name;
      if (name) {
        req.session.name = req.body.name;
        req.session.lastName = req.body.lastName;
        req.body = {};
        res.status(200).json({ success: true, next: true });
        return;
      } else {
        res.status(411).json({
          errors: "os campos estão faltando.",
        });
        return;
      }
    case "day":
      const gen = req.body.selectGen;
      if (gen) {
        req.session.day = req.body.day;
        req.session.month = req.body.month;
        req.session.year = req.body.year;
        req.session.selectGen = req.body.selectGen;

        if (gen.includes("Personalizar")) {
          req.session.gen = req.body.gen;
          req.session.optGen = req.body.optGen;
        } else {
          req.session.gen = undefined;
          req.session.optGen = undefined;
        }

        req.body = {};
        res.status(200).json({ success: true, next: true });
        return;
      } else {
        res.status(411).json({
          errors: "os campos estão faltando.",
        });
        return;
      }
    case "email":
      const eMail = req.body.email;

      const captchaToken = req.body.captchaToken;
      let tokenResponse;

      try {
        tokenResponse = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              secret: process.env.RECAPTCHA_SECRET,
              response: captchaToken,
            }),
          },
        );
      } catch (err) {
        return res
          .status(500)
          .json({ errors: "Não foi possivel validar o reCAPTCHA" });
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.success) {
        return res
          .status(403)
          .json({ errors: "Falha na validaçao do reCAPTCHA." });
      }

      if (tokenData.action !== "register_email") {
        return res.status(403).json({ errors: "Ação inválida" });
      }

      if (tokenData.score < 0.7) {
        return res.status(403).json({ errors: "Ação suspeita" });
      }

      if (eMail) {
        const user = await User.findOne({ email: eMail });

        if (user) {
          req.body = {};
          res.status(422).json({
            errors: [
              {
                msg: "O e-mail já existe, por favor escreva outro.",
                path: "email",
              },
            ],
          });
          return;
        }

        req.session.email = req.body.email;

        const email = await Email.findOne({ email: eMail });

        if (email) {
          req.body = {};
          res.status(422).json({
            errors: [
              {
                msg: "Por favor, verifique o email antes de tentar denovo ou espere 1 minuto.",
                path: "email",
              },
            ],
          });
          return;
        } else {
          const code = randomCode();

          const newEmail = await Email.create({ email: eMail, code: code });

          if (!newEmail) {
            req.body = {};
            res.status(422).json({
              errors: [
                {
                  msg: "Houve um erro, por favor tente mais tarde.",
                  path: "email",
                },
              ],
            });
            return;
          }

          req.body = {};
          res.status(200).json({ success: true, next: true });
          return;
        }
      } else {
        res.status(411).json({
          errors: "o campo esta faltando.",
        });
        return;
      }
    case "confirmCode":
      const code = req.body.confirmCode;
      if (code) {
        req.session.confirmCode = req.body.confirmCode;

        const userCode = req.body.confirmCode;
        const confirmCode = await Email.findOne({ code: userCode });

        req.body = {};

        if (confirmCode) {
          res.status(200).json({ success: true, next: true });
          return;
        } else {
          res.status(422).json({
            errors: [
              {
                msg: "Codigo não compativel, tente novamente.",
                path: "confirmCode",
              },
            ],
          });
          return;
        }
      } else {
        res.status(411).json({
          errors: "o campo esta faltando.",
        });
        return;
      }
    case "password":
      const pass = req.body.password;

      const captchaTokenPass = req.body.captchaToken;
      let tokenResponsePass;

      try {
        tokenResponsePass = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              secret: process.env.RECAPTCHA_SECRET,
              response: captchaTokenPass,
            }),
          },
        );
      } catch (err) {
        return res
          .status(500)
          .json({ errors: "Não foi possivel validar o reCAPTCHA" });
      }

      const tokenDataPass = await tokenResponsePass.json();

      if (!tokenDataPass.success) {
        return res
          .status(403)
          .json({ errors: "Falha na validaçao do reCAPTCHA." });
      }

      if (tokenDataPass.action !== "register_pass") {
        return res.status(403).json({ errors: "Ação inválida" });
      }

      if (tokenDataPass.score < 0.7) {
        return res.status(403).json({ errors: "Ação suspeita" });
      }

      if (pass) {
        const confirmPass = req.body.confirmPassword;

        if (pass === confirmPass) {
          const salt = await bcrypt.genSalt();
          const passwordHash = await bcrypt.hash(pass, salt);

          req.session.password = passwordHash;
          req.body = {};
          break;
        } else {
          req.body = {};
          res.status(400).json({
            errors: [
              {
                msg: "As senhas devem ser iguais.",
                path: "password",
              },
            ],
          });
          return;
        }
      } else {
        res.status(411).json({
          errors: "o campo esta faltando.",
        });
        return;
      }

    default:
      res.status(404).json({
        errors: "etapa desconhecida.",
      });
      return;
  }
  const name = req.session.name;
  const lastName = req.session.lastName;
  const idTag = `@${name}_${lastName}`;
  const day = req.session.day;
  const month = req.session.month;
  const year = req.session.year;
  const selectGen = req.session.selectGen;
  const viewMode = "white";
  const restrictMode = "desactive";
  const tags = [
    "mundo",
    "arvores",
    "animais",
    "gato",
    "cachorro",
    "passaros",
    "comida",
    "esportes",
    "montanhas",
    "rios",
    "oceano",
    "flores",
    "deserto",
    "estradas",
    "pessoas",
    "cachoeira",
    "nuvens",
  ];
  let gen;
  let optGen;
  if (req.session.gen !== undefined) {
    gen = req.session.gen;
    optGen = req.session.optGen;
  } else {
    gen = "";
    optGen = "";
  }
  const email = req.session.email;
  const password = req.session.password;
  const inscription = [];
  const photoUrl = { cel: {}, pc: {}, photo: {}, tv: {} };
  const pronouns = "";
  const description = "";
  const like = [];
  const dislike = [];
  const history = [];
  const userPost = [];
  const theater = "";

  //Create user
  const newUser = await User.create({
    name,
    lastName,
    idTag,
    day,
    month,
    year,
    selectGen,
    gen,
    optGen,
    email,
    password,
    tags,
    inscription,
    photoUrl,
    pronouns,
    description,
    like,
    dislike,
    history,
    viewMode,
    restrictMode,
    userPost,
    theater,
  });

  if (!newUser) {
    req.body = {};
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    return;
  }

  const token = generateToken(newUser._id);
  req.token = token;

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(201).json({
    success: true,
  });
};

//sign user in
const login = async (req, res, next) => {
  const step = req.body.step;
  console.log(step);

  switch (step) {
    case "email":
      const email = req.body.email;
      if (email) {
        const user = await User.findOne({ email: email });

        if (!user) {
          res.status(404).json({
            errors: [
              {
                msg: "Usuário não encontrado",
                path: "email",
              },
            ],
          });
          return;
        }

        req.session.email = email;
        console.log("EMAIL SALVO NA SESSÃO:", req.session.email);
        console.log("SESSION ID:", req.sessionID);
        req.body = {};
        res.status(200).json({ success: true, next: true });
        return;
      } else {
        res.status(411).json({
          errors: "o campo esta faltando.",
        });
        return;
      }
    case "password":
      console.log("EMAIL RECUPERADO:", req.session.email);
      console.log("SESSION ID:", req.sessionID);
      const password = req.body.password;
      const userEmail = req.session.email;
      const captchaToken = req.body.captchaToken;
      let tokenResponse;
      try {
        tokenResponse = await fetch(
          "https://www.google.com/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              secret: process.env.RECAPTCHA_SECRET,
              response: captchaToken,
            }),
          },
        );
      } catch (err) {
        return res
          .status(500)
          .json({ errors: "Não foi possivel validar o reCAPTCHA" });
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.success) {
        return res
          .status(403)
          .json({ errors: "Falha na validaçao do reCAPTCHA." });
      }

      if (tokenData.action !== "login") {
        return res.status(403).json({ errors: "Ação inválida" });
      }

      if (tokenData.score < 0.7) {
        return res.status(403).json({ errors: "Ação suspeita" });
      }

      if (password) {
        const user = await User.findOne({ email: userEmail });

        if (!user)
          return res.status(404).json({ errors: "Usuario nao encontrado." });

        if (!(await bcrypt.compare(password, user.password))) {
          res.status(422).json({
            errors: [
              {
                msg: "Senha inválida",
                path: "password",
              },
            ],
          });
          return;
        }

        const token = generateToken(user._id);
        req.token = token;

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(201).json({
          success: true,
        });
        return;
      } else {
        res.status(411).json({
          errors: "o campo esta faltando.",
        });
        return;
      }
    default:
      res.status(404).json({
        errors: "etapa desconhecida.",
      });
      return;
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ success: true, next: true });
};

module.exports = {
  register,
  login,
  logout,
};
