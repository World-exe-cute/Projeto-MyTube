const express = require("express");
const router = express.Router();

//controller
const {
  register,
  login,
  logout,
} = require("../controllers/User/AuthController");
const {
  update,
  getUserById,
  channelCustom,
  //getUserPhoto,
  getUserTag,
  checkUserToken,
  getHistory,
  getLikeVideos,
  setRestrict,
  setViewMode,
  getUserVideo,
  deleteHistory,
  setTheater,
} = require("../controllers/User/ProfileController");

//middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
} = require("../middlewares/User/userValidations");
const {
  profileUpdateValidation,
} = require("../middlewares/User/profileValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

//routes

router.patch(
  "/channelCustom",
  authGuard,
  imageUpload.array("photo"),
  profileUpdateValidation(),
  validate,
  channelCustom,
);
router.patch("/setRestrict", authGuard, setRestrict);
router.patch("/setViewMode", authGuard, setViewMode);
router.patch("/setTheaterMode", authGuard, setTheater);

router.post("/getUserVideo/:id", getUserVideo);
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login /*getCurrentUser*/);
router.post("/logout", logout);
router.post("/getHistory/:id", authGuard, getHistory);

router.get("/profile/:id", getUserById);
//router.get("/check-image/:hash", getUserPhoto);
router.get("/check-tag/:id", getUserTag);
router.get("/check-token", checkUserToken);
router.get("/getLikeVideos", authGuard, getLikeVideos);
router.get("/privateRoute", authGuard, (req, res) =>
  res.status(200).json({ success: true }),
);
router.delete("/deleteHistory", authGuard, deleteHistory);

module.exports = router;
