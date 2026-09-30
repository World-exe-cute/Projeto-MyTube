const mongoose = require("mongoose");
const Video = require("../models/Video");
const User = require("../models/User");
const path = require("path");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { deleteFile } = require("../middlewares/videoUpload");
const { formatDistanceToNow, formatDistanceToNowStrict } = require("date-fns");
const { ptBR } = require("date-fns/locale");

const jwtSecret = process.env.JWT_SECRET;

const videoView = async (req, res) => {
  const hash = req.params.id;
  const token = req.cookies.token;
  let user;
  if (token) {
    tokenDecode = jwt.verify(token, jwtSecret);

    user = await User.findById(tokenDecode.id).select(
      "history restrictMode tags inscription _id",
    );

    if (!user)
      return res.status(404).json({ error: "usuario nao encontrado." });
  }

  const video = await Video.findOneAndUpdate(
    { "videoUrl.hash": hash },
    { $inc: { view: 1 } },
    { new: true },
  )
    .select(
      "-_id -comments -videoUrl.thumb -videoUrl.name -videoSize -videoName -updatedAt",
    )
    .populate("userId", "photoUrl.photo like myInscription name idTag")
    .populate("comments.userId", "name photoUrl.photo")
    .lean();

  if (!video) return res.status(404).json({ errors: "Video não encontrado" });

  const time = formatDistanceToNowStrict(new Date(video.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  if (token) {
    const someHistory = user.history.filter(
      (doc) => doc.videoHash !== String(hash),
    );

    someHistory.unshift({
      videoHash: String(hash),
    });

    const userTags = user.tags.map((item) => item.toLowerCase());
    const videoTags = video.videoTag.map((item) => item.toLowerCase());

    const newTags = [
      ...videoTags,
      ...userTags.filter((item) => !videoTags.includes(item)),
    ].slice(0, 17);

    user.tags = newTags;
    user.history = someHistory;

    await user.save();
  }

  const newVideo = {
    ...video,
    postTime: video.createdAt,
    createdAt: time,
    checkUserInscription: token
      ? video.userId.myInscription.some(
          (doc) => String(doc.userId) === String(user._id),
        )
      : undefined,
    userPhoto: video.userId.photoUrl.photo?.hash,
    name: video.userId.name,
    userTag: video.userId.idTag,
    like: {
      likeCount: video.like.length,
      likeUser: token
        ? video.like.some((doc) => String(doc.userId) === String(user._id))
        : false,
      dislikeUser: token
        ? video.dislike.some((doc) => String(doc.userId) === String(user._id))
        : false,
    },
    view: video.view,
  };

  return res.status(200).json({ success: true, videos: newVideo });
};

const insertVideo = async (req, res) => {
  //console.log(req.body.size);
  try {
    const token = req.cookies.token;

    const tokenDecode = jwt.verify(token, jwtSecret);

    //const url = "http://localhost:5000/api/videos/check-video";

    const videoPath = req.file.path;
    const thumbPath = path.join(path.dirname(videoPath), req.thumb);

    const videoResult = await cloudinary.uploader.upload(videoPath, {
      folder: `MyTube/videos/${tokenDecode.id}`,
      resource_type: "video",
    });

    const thumbResult = await cloudinary.uploader.upload(thumbPath, {
      folder: `MyTube/thumbnails/${tokenDecode.id}`,
      resource_type: "image",
    });

    const newVideo = await Video.create({
      videoUrl: {
        hash: videoResult.secure_url.split("/").at(-1),
        thumb: thumbResult.secure_url.split("/").at(-1),
        type: req.fileType,
        name: req.hash,
      },
      videoName: req.fileName,
      videoSize: req.file.size,
      public: req.body.public,
      userId: tokenDecode.id,
      title: req.fileName,
      description: "",
      originalCreator: "",
      videoTag: [],
      dislike: [],
      like: [],
      view: 0,
      comments: [],
    });

    if (!newVideo) {
      deleteFile(videoPath);
      deleteFile(thumbResult);

      req.body = {};

      return res
        .status(422)
        .json({ errors: "Houve um erro, tente novamente mais tarde." });
    }

    deleteFile(videoPath);
    deleteFile(thumbResult);

    return res.status(201).json({
      success: true,
      videoInfo: {
        hash: videoResult.secure_url.split("/").at(-1),
        thumb: thumbResult.secure_url.split("/").at(-1),
        name: req.fileName,
      },
      next: true,
    });
  } catch (error) {
    console.log(error);
    if (req.file?.path) {
      deleteFile(req.file.path);

      if (req.thumb) {
        const thumbPath = path.join(path.dirname(req.file.path), req.thumb);

        deleteFile(thumbPath);
      }
    }

    return res.status(500).json({
      errors: "Erro ao enviar o video.",
    });
  }

  /*const newVideo = await Video.create({
    videoUrl: {
      hash: `${req.onlyHash}`,
      thumb: `${req.thumb}`,
      type: req.fileType,
      name: req.hash,
    },
    videoName: req.fileName,
    videoSize: req.file.size,
    public: req.body.public,
    userId: tokenDecode.id,
    title: req.fileName,
    description: "",
    originalCreator: "",
    videoTag: [],
    dislike: [],
    like: [],
    view: 0,
    comments: [],
  });

  if (!newVideo) {
    req.body = {};
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    return;
  }

  return res.status(201).json({
    success: true,
    videoInfo: {
      hash: `${url}/${req.onlyHash}`,
      name: `${req.fileName}.${req.fileType}`,
    },
    next: true,
  });*/
};

const infoVideo = async (req, res) => {
  const video = await Video.findOne({ "videoUrl.hash": req.body.hash });

  if (!video) return res.status(404).json({ errors: "O video nao existe" });

  video.originalCreator = req.body.copy;
  video.videoTag = req.body.tag.split(",");
  video.description = req.body.description;
  video.public = req.body.public;
  video.title = req.body.title;

  await video.save();

  return res.status(200).json({ success: true });
};

const getVideos = async (req, res) => {
  const hashUrl = req.params.id;

  const video = await Video.findOne({
    "videoUrl.hash": hashUrl,
  }).select("videoUrl");

  if (!video) return res.status(404).json({ errors: "Video não encontrado." });

  return res.redirect(video.videoUrl.hash);
};

const getUserVideos = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const frontHash = req.body.frontHash.length;
  const search = req.params.id;
  const order = req.body.order;

  const video = await Video.find({ userId: tokenDecode.id })
    .select(
      "videoUrl.hash videoUrl.type description videoTag title public originalCreator createdAt updatedAt view comments like dislike -_id",
    )
    .sort({ createdAt: order ? 1 : -1 })
    .skip(frontHash)
    .limit(12)
    .lean();

  if (video.length === 0)
    return res
      .status(201)
      .json({ success: true, videoHash: [], hash: [], lock: true });

  const newVideo = video.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString().split("T")[0],
    updatedAt: i.updatedAt.toISOString().split("T")[0],
    comments: i.comments.length,
    like: i.like.length,
    dislike: i.dislike.length,
  }));

  if (!video.length)
    return res.status(404).json({ errors: "Videos não encontrados." });

  const videoHash = newVideo.map((e) => e.videoUrl.hash);

  return res.status(201).json({
    success: true,
    videoHash: newVideo,
    hash: videoHash,
  });
};

const checkVideoThumb = async (req, res) => {
  const hash = req.params.id;
  const video = await Video.findOne({ "videoUrl.hash": hash }).select(
    "videoUrl.thumb userId -_id",
  );

  if (!video)
    return res.status(404).json({ errors: "Videos não encontrados." });

  /*const filePath = path.join(
    __dirname,
    `../uploads/profileVideos/${video.userId}/${video.videoUrl.thumb}`,
  );*/
  const fullUrl = `https://res.cloudinary.com/dkg4uwof9/image/upload/v1790787726/MyTube/thumbnails/${video.userId}/${video.videoUrl.thumb}`;

  return res.redirect(fullUrl);
};

const subScribeVideo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const videoHash = req.body.videoHash;

  const channel = await User.findOne({ idTag: videoHash }).select(
    "myInscription",
  );

  if (!channel)
    return res.status(404).json({ errors: "Usuario nao encontrado" });

  if (String(channel._id) === String(tokenDecode.id))
    return res
      .status(400)
      .json({ errors: "O usuario nao pode se inscrever no proprio canal." });

  if (
    channel.myInscription.some(
      (i) => String(i.userId) === String(tokenDecode.id),
    )
  ) {
    return res
      .status(400)
      .json({ errors: "O usuario ja esta inscrito no canal." });
  }

  const user = await User.findById(tokenDecode.id).select("inscription");

  if (!user) return res.status(404).json({ errors: "usuario nao encontrado" });

  if (user.inscription.some((i) => String(i.userId) === String(channel._id))) {
    return res
      .status(400)
      .json({ errors: "O usuario ja esta inscrito no canal." });
  }

  channel.myInscription.push({
    userId: user._id,
  });
  user.inscription.push({ userId: channel._id });

  await channel.save();
  await user.save();

  return res.status(200).json({ success: true });
};

const cancelScribeVideo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const videoHash = req.body.videoHash;

  const userVideo = await User.findOneAndUpdate(
    { idTag: videoHash },
    {
      $pull: { myInscription: { userId: tokenDecode.id } },
    },
  );

  const user = await User.findByIdAndUpdate(tokenDecode.id, {
    $pull: { inscription: { userId: userVideo._id } },
  });

  if (!userVideo && !user)
    return res.status(404).json({ errors: "Usuario nao inscrito" });

  return res.status(200).json({ success: true });
};

const likeVideo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const videoHash = req.body.hash;
  const button = req.body.button;

  const video = await Video.findOne({ "videoUrl.hash": videoHash }).select(
    "like dislike",
  );

  if (!video) return res.status(404).json({ errors: "Video nao encontrado" });

  const user = await User.findById(tokenDecode.id).select("like dislike");

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  const videoLike = video.like.some(
    (i) => String(i.userId) === String(user._id),
  );
  const videoDislike = video.dislike.some(
    (i) => String(i.userId) === String(user._id),
  );
  const userLike = user.like.some(
    (i) => String(i.videoId) === String(video._id),
  );
  const userDislike = user.dislike.some(
    (i) => String(i.videoId) === String(video._id),
  );
  if (videoLike || videoDislike || userLike || userDislike) {
    const videoRemove = await Video.findOneAndUpdate(
      { "videoUrl.hash": videoHash },
      {
        $pull: {
          like: { userId: tokenDecode.id },
          dislike: { userId: tokenDecode.id },
        },
      },
    );
    if (!videoRemove) {
      return res.status(404).json({ errors: "Video nao curtido" });
    }
    const userRemove = await User.findByIdAndUpdate(tokenDecode.id, {
      $pull: { like: { videoId: video._id }, dislike: { videoId: video._id } },
    });

    if (!userRemove) {
      return res.status(404).json({ errors: "Video nao curtido" });
    }

    if (
      (button === "like" && videoLike) ||
      (button === "dislike" && videoDislike)
    ) {
      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: false } });
    }
  }

  switch (button) {
    case "like":
      user.like.push({ videoId: video._id });
      video.like.push({ userId: tokenDecode.id });

      await user.save();
      await video.save();

      return res
        .status(200)
        .json({ success: true, data: { like: true, dislike: false } });
    case "dislike":
      user.dislike.push({ videoId: video._id });
      video.dislike.push({ userId: tokenDecode.id });

      await user.save();
      await video.save();

      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: true } });
  }
};

const getInfo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const videos = await Video.aggregate([
    {
      $match: {
        public: true,
        userId: new mongoose.Types.ObjectId(tokenDecode.id),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "America/Sao_Paulo",
          },
        },
        views: { $sum: "$view" },
        likes: { $sum: { $size: { $ifNull: ["$like", []] } } },
        dislikes: { $sum: { $size: { $ifNull: ["$dislike", []] } } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (!videos)
    return res.status(404).json({ errors: "videos nao encontrados." });

  const user = await User.findById(tokenDecode.id).select(
    "inscription myInscription -_id",
  );

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado." });

  const inscriptionNum = user.inscription.length;
  const myInscriptionNum = user.myInscription.lenght;

  return res.status(200).json({
    success: true,
    videoInfo: videos,
    userInfo: { inscriptionNum, myInscriptionNum },
  });
};

const getLastInfo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id).select("inscription -_id");

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  const video = await Video.findOne({
    userId: new mongoose.Types.ObjectId(tokenDecode.id),
  })
    .sort({ createdAt: -1 })
    .select("videoName videoUrl.hash view like dislike createdAt -_id");

  if (!video) return res.status(200).json({ success: false });

  const newInfo = {
    inscription: user.inscription.length,
    videoName: video.videoName,
    videoUrl: video.videoUrl.hash,
    view: video.view,
    like: video.like.length,
    dislike: video.dislike.length,
    timeNow: formatDistanceToNow(new Date(video.createdAt), {
      addSuffix: true,
      locale: ptBR,
    }),
  };

  return res.status(200).json({ success: true, videoInfo: newInfo });
};

const deleteVideos = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const videosHash = req.body.videosHash;

  if (videosHash.length === 0)
    return res.status(400).json({ errors: "Nenhum video para deletar." });

  const video = await Video.deleteMany({
    userId: new mongoose.Types.ObjectId(tokenDecode.id),
    "videoUrl.hash": { $in: videosHash },
  });

  if (video.deletedCount === 0)
    return res.status(400).json({ errors: "Nenhum video foi deletado." });

  return res.status(200).json({ success: true });
};

const commentLike = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const videoHash = req.body.hash;
  const button = req.body.button;

  const video = await Video.findOne(
    { "comments._id": videoHash },
    { comments: { $elemMatch: { _id: videoHash } } },
  ).select("like dislike");

  if (!video) return res.status(404).json({ errors: "Video nao encontrado" });

  const comment = video.comments[0];

  const videoLike = comment.like.some(
    (i) => String(i.userId) === String(tokenDecode.id),
  );
  const videoDislike = comment.dislike.some(
    (i) => String(i.userId) === String(tokenDecode.id),
  );

  if (videoLike || videoDislike) {
    const videoRemove = await Video.findOneAndUpdate(
      { "comments._id": videoHash },
      {
        $pull: {
          "comments.$.like": { userId: tokenDecode.id },
          "comments.$.dislike": { userId: tokenDecode.id },
        },
      },
    );
    if (!videoRemove) {
      return res.status(404).json({ errors: "Video nao curtido" });
    }

    if (
      (button === "like" && videoLike) ||
      (button === "dislike" && videoDislike)
    ) {
      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: false } });
    }
  }

  switch (button) {
    case "like":
      video.comments[0].like.push({ userId: tokenDecode.id });

      await video.save();

      return res
        .status(200)
        .json({ success: true, data: { like: true, dislike: false } });
    case "dislike":
      video.comments[0].dislike.push({ userId: tokenDecode.id });

      await video.save();

      return res
        .status(200)
        .json({ success: true, data: { like: false, dislike: true } });
  }
};

const setCommentVideo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const video = await Video.findOne({
    "videoUrl.hash": req.body.hash,
  }).select("comments");

  if (!video) return res.status(404).json({ errors: "video nao encontrado." });

  if (req.body.data.comment) {
    video.comments.push({
      userId: tokenDecode.id,
      comment: req.body.data.comment,
      like: [],
      dislike: [],
    });
  }

  await video.save();

  return res.status(201).json({ success: true });
};

const getAllComments = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const skip = req.body.comments.length;

  const video = await Video.find({ userId: tokenDecode.id })
    .select("comments -_id")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(15)
    .populate("comments.userId", "name photoUrl.photo idTag -_id")
    .lean();

  if (!video)
    return res
      .status(404)
      .json({ errors: "Videos do usuario nao encontrados." });

  const newVideo = video
    .filter((i) => i.comments.length > 0)
    .map((e) => {
      return {
        ...e.comments[0],
        createdAt: formatDistanceToNowStrict(
          new Date(e.comments[0].createdAt),
          {
            addSuffix: true,
            locale: ptBR,
          },
        ),
        userTag: e.comments[0].userId.idTag,
      };
    });

  return res.status(200).json({ success: true, videoComment: newVideo });
};

const getVideoComments = async (req, res) => {
  const hash = req.params.id;
  const order = req.body.order;
  const skip = req.body.frontHash.length;
  const token = req.cookies.token;
  let userId;
  if (token) {
    const tokenDecode = jwt.verify(token, jwtSecret);
    userId = await User.findById(tokenDecode.id).select("_id");

    if (!userId)
      return res.status(404).json({ errors: "Usuario nao encontrado." });
  }

  const video = await Video.aggregate([
    {
      $match: {
        "videoUrl.hash": hash,
      },
    },

    {
      $project: {
        comments: 1,
        _id: 0,
      },
    },

    {
      $unwind: "$comments",
    },

    {
      $addFields: {
        likeCount: {
          $size: {
            $ifNull: ["$comments.like", []],
          },
        },
      },
    },

    {
      $sort: {
        [order === "like" ? "likeCount" : "comments.createdAt"]:
          order === "like" || order === false ? -1 : 1,
      },
    },

    {
      $skip: skip,
    },

    {
      $limit: 15,
    },

    {
      $lookup: {
        from: "users",
        localField: "comments.userId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              "photoUrl.photo": 1,
              name: 1,
              _id: 0,
            },
          },
        ],
        as: "user",
      },
    },

    {
      $set: {
        "comments.userId": {
          $arrayElemAt: ["$user", 0],
        },
      },
    },

    {
      $project: {
        comments: 1,
      },
    },
  ]);

  if (!video) return res.status(404).json({ errors: "Video nao encontrado." });

  if (video.length === 0)
    return res
      .status(200)
      .json({ success: true, comments: [], lock: true, hash: [] });

  const newComments = video.map((v) => {
    return {
      ...v.comments,
      like: {
        likeCount: v.comments.like.length,
        likeUser: v.comments.like.some(
          (e) => String(e.userId) === String(userId._id),
        ),
      },
      dislike: {
        dislikeCount: v.comments.dislike.length,
        dislikeUser: v.comments.dislike.some(
          (e) => String(e.userId) === String(userId._id),
        ),
      },
      createdAt: formatDistanceToNowStrict(new Date(v.comments.createdAt), {
        addSuffix: true,
        locale: ptBR,
      }),
    };
  });

  const commentHash = video.map((e) => e.comments._id);

  return res
    .status(200)
    .json({ success: true, comments: newComments, hash: commentHash });
};

module.exports = {
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
};
