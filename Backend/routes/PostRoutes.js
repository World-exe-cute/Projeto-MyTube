const express = require("express");
const {
  setPost,
  getPost,
  getPostImage,
  likePost,
  setComment,
  getInfoPost,
  getComments,
  postCommentLike,
  checkPoll,
  getPostChannel,
  getOnlyPost,
  deletePost,
} = require("../controllers/PostController");
const router = express.Router();
const { postValidation } = require("../middlewares/User/postValidations");
const validate = require("../middlewares/handleValidation");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

router.patch("/likePost", authGuard, likePost);
router.patch("/setComment", authGuard, setComment);
router.patch("/commentLike", authGuard, postCommentLike);

router.post("/checkPoll/:id", authGuard, checkPoll);
router.post("/getPost/:id", getPost);
router.post(
  "/setPost",
  authGuard,
  imageUpload.array("photo", 10),
  postValidation(),
  validate,
  setPost,
);
router.post("/deletePosts", authGuard, deletePost);
router.post("/getPostChannel", authGuard, getPostChannel);
router.post("/getSearchPostChannel/:id", authGuard, getPostChannel);

router.get("/check-image/:hash", getPostImage);
router.get("/getInfoPost/:id", getInfoPost);
router.get("/getComments/:id", getComments);
router.get("/getOnlyPost/:id", authGuard, getOnlyPost);

module.exports = router;
