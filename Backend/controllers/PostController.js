//const Video = require("../models/Video");
const User = require("../models/User");
const Posts = require("../models/Posts");
const { formatDistanceToNowStrict } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const setPost = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const pollText = req.body.pollText;
  const text = req.body.text;
  const image = [];
  const poll = [];

  if (req.files[0]) {
    req.files.forEach((img) => {
      const hash = crypto.randomBytes(32).toString("hex");
      if (!img || !hash)
        return res
          .status(500)
          .json({ errors: "Erro ao processar as imagens." });

      image.push({
        hash: `${hash}`,
        fileName: img.filename,
        type: img.filename.split(".")[1],
      });
    });
  } else if (pollText !== "false") {
    const pollList = req.body.pollText.split(",");
    if (!pollList)
      return res.status(500).json({ errors: "Erro ao processar a enquete." });

    pollList.forEach((text) => {
      poll.push({
        text: text,
        check: [],
      });
    });
  }

  const newPost = await Posts.create({
    userId: tokenDecode.id,
    postText: text,
    postImage: image,
    postPoll: poll,
    comments: [],
    like: [],
    dislike: [],
    postPublic: true,
  });

  return res.status(200).json({ success: true });
};

const getPost = async (req, res) => {
  const userTag = req.params.id;
  const feedNum = req.body.postHash.length;
  const order = req.body.order;

  const user = await User.findOne({ idTag: userTag }).select("_id");

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  const post = await Posts.find({ userId: user._id })
    .select("_id")
    .sort({ createdAt: order ? 1 : -1 })
    .skip(feedNum)
    .limit(10);

  if (!post) return res.status(404).json({ errors: "post nao encontrado." });

  if (post.length === 0)
    return res
      .status(200)
      .json({ success: true, posts: [], lock: true, hash: [] });

  const postHash = post.map((e) => e._id);

  return res.status(200).json({
    success: true,
    posts: post,
    hash: postHash,
    userTag: userTag,
  });
};

const getPostImage = async (req, res) => {
  const hash = req.params.hash;

  const post = await Posts.findOne({ "postImage.hash": hash }).select(
    "postImage userId",
  );

  if (!post)
    return res.status(404).json({ errors: "Usuario da foto nao encontrado." });

  const postFilter = post.postImage.filter((e) => e.hash === hash);

  const filePath = path.join(
    __dirname,
    `../uploads/postImage/${post.userId}/${postFilter[0].fileName}`,
  );

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });

  return res.sendFile(path.resolve(filePath));
};

const likePost = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const postId = req.body.hash;
  const button = req.body.button;

  const post = await Posts.findById(postId).select("like dislike");

  if (!post) return res.status(404).json({ errors: "Post não encontrado." });

  const userLike = post.like.some(
    (i) => String(i.userId) === String(tokenDecode.id),
  );
  const userDislike = post.dislike.some(
    (i) => String(i.userId) === String(tokenDecode.id),
  );

  if (userLike || userDislike) {
    post.like = post.like.filter(
      (e) => String(e.userId) !== String(tokenDecode.id),
    );

    post.dislike = post.dislike.filter(
      (e) => String(e.userId) !== String(tokenDecode.id),
    );

    if (
      (button === "like" && userLike) ||
      (button === "dislike" && userDislike)
    ) {
      await post.save();
      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: false } });
    }
  }

  switch (button) {
    case "like":
      post.like.push({
        userId: tokenDecode.id,
      });

      await post.save();

      return res
        .status(200)
        .json({ success: true, data: { like: true, dislike: false } });
    case "dislike":
      post.dislike.push({
        userId: tokenDecode.id,
      });

      await post.save();

      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: true } });
  }

  return res.status(200).json({ success: true });
};

const getInfoPost = async (req, res) => {
  const id = req.params.id;

  const token = req.cookies.token;

  let tokenDecode;
  if (token) {
    tokenDecode = jwt.verify(token, jwtSecret);

    const user = await User.findById(tokenDecode.id);
    if (!user)
      return res.status(404).json({ error: "usuario nao encontrado." });
  }

  const post = await Posts.findById(id)
    .populate({
      path: "userId",
      select: "name photoUrl.photo.hash -_id",
    })
    .lean();

  if (!post) return res.status(404).json({ errors: "post não encontrado" });

  const newUser = {
    ...post,
    createdAt: formatDistanceToNowStrict(new Date(post.createdAt), {
      addSuffix: true,
      locale: ptBR,
    }),
    like: {
      likeCount: post.like.length,
      likeUser: token
        ? post.like.some((doc) => String(doc.userId) === String(tokenDecode.id))
        : false,
      dislikeUser: token
        ? post.dislike.some(
            (doc) => String(doc.userId) === String(tokenDecode.id),
          )
        : false,
    },
    comments: post.comments.length,
    postImage: post.postImage.map((e) => ({
      hash: e.hash,
    })),
    postPoll: post.postPoll.map((e) => ({
      check: e.check.length,
      checkUser: token
        ? e.check.some((f) => String(f.userId) === String(tokenDecode.id))
        : false,
      text: e.text,
    })),
  };

  return res.status(200).json({ success: true, postInfo: newUser });
};

const getComments = async (req, res) => {
  const postId = req.params.id;
  const token = req.cookies.token;

  let tokenDecode;
  if (token) {
    tokenDecode = jwt.verify(token, jwtSecret);

    const user = await User.findById(tokenDecode.id);
    if (!user)
      return res.status(404).json({ error: "usuario nao encontrado." });
  }

  const post = await Posts.findById(postId)
    .populate({
      path: "comments.userId",
      select: "name photoUrl.photo.hash -_id",
    })
    .select("comments")
    .lean();

  if (!post) return res.status(404).json({ errors: "post não encontrado" });

  const newPost = {
    comments: post.comments.map((e) => ({
      ...e,
      like: {
        likeCount: e.like.length,
        likeUser: token
          ? e.like.some((doc) => String(doc.userId) === String(tokenDecode.id))
          : false,
        dislikeUser: token
          ? e.dislike.some(
              (doc) => String(doc.userId) === String(tokenDecode.id),
            )
          : false,
      },
    })),
  };

  return res.status(200).json({ success: true, comment: newPost });
};

const setComment = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const hash = req.body.hash;
  const data = req.body.data;

  const post = await Posts.findById(hash).select("comments");

  if (!post) return res.status(404).json({ errors: "post não encontrado." });

  if (data.comment) {
    post.comments.push({
      userId: tokenDecode.id,
      comment: data.comment,
      like: [],
      dislike: [],
    });
  }

  await post.save();

  return res.status(200).json({ success: true });
};

const postCommentLike = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const hash = req.body.hash;
  const button = req.body.button;

  const post = await Posts.findOne(
    { "comments._id": hash },
    { comments: { $elemMatch: { _id: hash } } },
  ).select("like dislike");

  if (!post) return res.status(404).json({ errors: "Video nao encontrado" });

  const comment = post.comments[0];

  const postLike = comment.like.some(
    (i) => String(i.userId) === String(tokenDecode.id),
  );
  const postDislike = comment.dislike.some(
    (i) => String(i.userId) === String(tokenDecode.id),
  );

  if (postLike || postDislike /*|| userLike || userDislike*/) {
    const postRemove = await Posts.findOneAndUpdate(
      { "comments._id": hash },
      {
        $pull: {
          "comments.$.like": { userId: tokenDecode.id },
          "comments.$.dislike": { userId: tokenDecode.id },
        },
      },
    );
    if (!postRemove) {
      return res.status(404).json({ errors: "Post não curtido" });
    }

    if (
      (button === "like" && postLike) ||
      (button === "dislike" && postDislike)
    ) {
      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: false } });
    }
  }

  switch (button) {
    case "like":
      post.comments[0].like.push({ userId: tokenDecode.id });

      await post.save();

      return res
        .status(200)
        .json({ success: true, data: { like: true, dislike: false } });
    case "dislike":
      post.comments[0].dislike.push({ userId: tokenDecode.id });

      await post.save();

      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: true } });
  }
};

const checkPoll = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const hash = req.params.id;
  const index = req.body.index;

  const post = await Posts.findById(hash).select("postPoll");

  if (!post) return res.status(404).json({ errors: "Post não encontrado." });

  if (
    post.postPoll.some((e) =>
      e.check.some((f) => String(f.userId) === String(tokenDecode.id)),
    )
  ) {
    return res.status(409).json({ errors: "O usuario já marcou uma opção." });
  } else {
    post.postPoll[index].check.push({
      userId: tokenDecode.id,
    });
    await post.save();
    return res.status(200).json({ success: true });
  }
};

const getPostChannel = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const frontHash = req.body.frontHash.length;
  const order = req.body.order;
  const search = req.params.id;

  const post = await Posts.find({ userId: tokenDecode.id })
    .select("postText postImage postPoll")
    .sort({ createdAt: order ? 1 : -1 })
    .skip(frontHash)
    .limit(10)
    .lean();

  if (!post) return res.status(404).json({ errors: "post nao encontrado." });

  if (post.length === 0)
    return res
      .status(200)
      .json({ success: true, posts: [], hash: [], lock: true });

  const newPost = post.map((i) => ({
    ...i,
    title: i.postText,
    videoTag: [],
  }));

  const videoHash = newPost.map((e) => e._id);

  return res.status(200).json({
    success: true,
    posts: post,
    hash: videoHash,
  });
};

const getOnlyPost = async (req, res) => {
  const hash = req.params.id;
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const post = await Posts.findById(hash)
    .select("-userId -dislike -createdAt -__v -_id")
    .lean();

  const newPost = {
    ...post,
    comments: post.comments.length,
    like: post.like.length,
    postPoll: post.postPoll.map((e) => ({
      check: e.check.length,
      checkUser: e.check.some(
        (f) => String(f.userId) === String(tokenDecode.id),
      ),
      text: e.text,
    })),
    allPollCheck: post.postPoll.reduce((num, e) => {
      return num + e.check.length;
    }, 0),
  };

  return res.status(200).json({ success: true, posts: newPost });
};

const deletePost = async (req, res) => {
  const allId = req.body.postId;
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const post = await Posts.deleteMany({
    userId: new mongoose.Types.ObjectId(tokenDecode.id),
    _id: {
      $in: allId,
    },
  });

  if (!post) return res.status(404).json({ errors: "Posts nao encontrados" });

  return res.status(200).json({ success: true });
};

module.exports = {
  setPost,
  getPost,
  getPostImage,
  likePost,
  getInfoPost,
  getComments,
  setComment,
  postCommentLike,
  checkPoll,
  getPostChannel,
  getOnlyPost,
  deletePost,
};
