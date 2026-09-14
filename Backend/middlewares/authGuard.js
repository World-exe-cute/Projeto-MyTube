const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.cookies.token;

  const token = authHeader;
  if (!token) return res.status(401).json({ errors: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, jwtSecret);
    await User.findById(verified.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ errors: "Token inválido." });
  }
};

module.exports = authGuard;
