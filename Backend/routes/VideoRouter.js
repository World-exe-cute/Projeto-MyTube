const express = require("express");
const router = express.Router();

//middleware
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const {
  videoUpload,
  fileOversize,
  fileThumb,
} = require("../middlewares/videoUpload");
const { videoValidation } = require("../middlewares/User/videoValidations");

//controller
const {
  videoView,
  insertVideo,
  infoVideo,
  getVideos,
  getUserVideos,
  checkVideoThumb,
  subScribeVideo,
  cancelScribeVideo,
  likeVideo,
  getInfo,
  getLastInfo,
  deleteVideos,
  commentLike,
  setCommentVideo,
  getAllComments,
  getVideoComments,
} = require("../controllers/VideoController");

//Routes
router.get("/check-video/:id", getVideos);
router.get("/check-thumb/:id", checkVideoThumb);
router.get("/getInfo", authGuard, getInfo);
router.get("/getLastInfo", authGuard, getLastInfo);

router.post(
  "/postVideo",
  authGuard,
  videoUpload.single("postVideo"),
  fileOversize,
  fileThumb,
  insertVideo,
);
router.post("/getComments/:id", getVideoComments);
router.post("/deleteVideos", authGuard, deleteVideos);
router.post("/getVideo", authGuard, getUserVideos);
router.post("/getSearchVideo/:id", getUserVideos);
router.post("/getAllComments", authGuard, getAllComments);

router.patch("/getViewVideo/:id", videoView);
router.patch("/putVideo", authGuard, videoValidation(), validate, infoVideo);
router.patch("/subScribe", authGuard, subScribeVideo);
router.patch("/cancelSubScribe", authGuard, cancelScribeVideo);
router.patch("/like", authGuard, likeVideo);
router.patch("/commentLike", authGuard, commentLike);
router.patch("/setComment", authGuard, setCommentVideo);

module.exports = router;
