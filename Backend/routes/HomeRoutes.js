const express = require("express");
const {
  getAllPublicVideos,
  getUserInfo,
  getChannelInfo,
  getTagVideos,
  searchVideos,
  sendFeedback,
} = require("../controllers/HomeController");
const router = express.Router();
const authGuard = require("../middlewares/authGuard");

router.post("/sendFeedback", sendFeedback);
router.post("/search/:id", searchVideos);
router.post(
  "/getVideos/inscriptions",
  authGuard,
  (req, res, next) => {
    req.id = "inscriptions";
    next();
  },
  getAllPublicVideos,
);

router.patch("/getHomeVideos/:id", getAllPublicVideos);

router.get("/getUserInfo", authGuard, getUserInfo);
router.get("/getChannelInfo", authGuard, getChannelInfo);
router.get("/getTagVideos", getTagVideos);
module.exports = router;
