const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const { formatDistanceToNowStrict } = require("date-fns");
const { ptBR } = require("date-fns/locale");

//models
const User = require("../../models/User");
const Video = require("../../models/Video");

const jwtSecret = process.env.JWT_SECRET;

const getUserPhoto = async (req, res) => {
  const hash = req.params.hash;
  const fullURL = `http://localhost:5000/api/users/check-image/${hash}`;

  const user = await User.findOne({
    $or: [
      { "photoUrl.photo.hash": fullURL },
      { "photoUrl.pc.hash": fullURL },
      { "photoUrl.tv.hash": fullURL },
      { "photoUrl.cel.hash": fullURL },
    ],
  }).select("photoUrl");

  if (!user)
    return res.status(404).json({ errors: "Usuario da foto nao encontrado." });

  const photoUrl = Object.values(user.photoUrl).filter(
    (i) => i?.hash === fullURL,
  );
  let filePath;

  photoUrl.forEach((key) => {
    const keySplit = key.hash.split("/");

    if (`${keySplit[keySplit.length - 1]}` === `${hash}`) {
      filePath = path.join(
        __dirname,
        `../../uploads/profilePhotos/${user._id}/${key.name}`,
      );
    }
  });

  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });

  return res.sendFile(path.resolve(filePath));
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
      "-password",
    );

    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ errors: ["Usuário não encontrado."] });
  }
};

const channelCustom = async (req, res) => {
  const token = req.cookies.token;

  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(
    new mongoose.Types.ObjectId(tokenDecode),
  ).select("name idTag pronouns description");
  if (req.body.name) {
    user.name = req.body.name;
  }
  if (req.body.identify) {
    const identify = req.body.identify;
    if (identify.startsWith("@")) {
      user.idTag = identify;
    } else {
      user.idTag = `@${identify}`;
    }
  }
  if (req.body.pronouns) {
    user.pronouns = req.body.pronouns;
  }
  if (req.body.description) {
    user.description = req.body.description;
  }

  if (req.files[0]?.filename) {
    const folder = path.join("uploads/profilePhotos", tokenDecode.id);
    const files = fs.readdirSync(folder);
    const photoObject = {};

    const url = "http://localhost:5000/api/users/check-image";

    files.forEach(async (arq) => {
      const filePhoto = path.join(folder, arq);

      const hash = crypto
        .createHmac("sha256", jwtSecret)
        .update(filePhoto)
        .digest("hex");

      switch (arq.split(".")[0]) {
        case "photo":
          photoObject.photo = {
            hash: `${url}/${hash}`,
            name: `${arq}`,
          };
          break;
        case "pc":
          photoObject.pc = {
            hash: `${url}/${hash}`,
            name: `${arq}`,
          };
          break;
        case "tv":
          photoObject.tv = {
            hash: `${url}/${hash}`,
            name: `${arq}`,
          };
          break;
        case "cel":
          photoObject.cel = {
            hash: `${url}/${hash}`,
            name: `${arq}`,
          };
          break;
      }
    });

    user.photoUrl = photoObject;
  }

  await user.save();

  return res.status(201).json({ success: true });
};

const getUserTag = async (req, res) => {
  const token = req.cookies.token;

  const tag = req.params.id;

  const user = await User.findOne({ idTag: tag })
    .select(
      "name lastName idTag inscription description pronouns photoUrl.photo.hash photoUrl.pc.hash photoUrl.cel.hash photoUrl.tv.hash",
    )
    .lean();

  if (!user)
    return res.status(404).json({ errors: "O usuario nao foi encontrado" });

  let newUser;
  if (token) {
    const tokenDecode = jwt.verify(token, jwtSecret);

    newUser = {
      ...user,
      inscription: user.inscription.some(
        (e) => String(e.userId) === String(tokenDecode.id),
      ),
    };
  }

  return res
    .status(201)
    .json({ success: true, userTag: token ? newUser : user });
};

const getUserVideo = async (req, res) => {
  const tag = req.params.id;
  const frontHash = req.body.frontHash.length;
  const order = req.body.order;

  const user = await User.findOne({ idTag: tag });

  if (!user)
    return res.status(404).json({ errors: "O usuario nao foi encontrado" });

  const allVideos = await Video.find({ userId: user._id, public: true })
    .select(
      "-_id -videoUrl.thumb -videoUrl.name -videoSize -videoName -updatedAt",
    )
    .sort({ createdAt: order ? 1 : -1 })
    .skip(frontHash)
    .limit(9)
    .populate("userId", "photoUrl.photo like inscription name idTag");

  if (!allVideos)
    return res.status(404).json({ errors: "Videos não encontrados." });

  if (allVideos.length === 0)
    return res
      .status(201)
      .json({ success: true, videoInfo: [], hash: [], lock: true });

  const newVideo = await Promise.all(
    allVideos.map(async (v) => {
      const time = formatDistanceToNowStrict(new Date(v.createdAt), {
        addSuffix: true,
        locale: ptBR,
      });
      var view = v.view;

      return {
        ...v._doc,
        originalTime: v.createdAt,
        createdAt: time,
        userPhoto: v.userId.photoUrl.photo?.hash,
        userName: v.userId.name,
        userTag: v.userId.idTag,
        view: view,
      };
    }),
  );

  const videoHash = newVideo.map((e) => e.videoUrl.hash);

  return res
    .status(200)
    .json({ success: true, videoInfo: newVideo, hash: videoHash });
};

const checkUserToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(200).json({ success: false });

  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id).select(
    "idTag theater tags description pronouns restrictMode viewMode name photoUrl.photo.hash photoUrl.pc.hash photoUrl.tv.hash photoUrl.cel.hash -_id",
  );

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  return res.status(200).json({ success: true, userInfo: user });
};

const getHistory = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const search = req.params.id;
  const skip = req.body.frontHash.length;
  const searchSplit = search.toLowerCase().split(" ").filter(Boolean);
  const searchRegex = searchSplit.map((e) => new RegExp(e, "i"));

  const user = await User.findById(tokenDecode.id).select("history -_id");

  if (!user) return res.status(404).json({ errors: "usuario nao encontrado." });

  const newHistory = user.history.map((doc) => doc.videoHash);

  const videos = await Video.aggregate([
    {
      $match: {
        "videoUrl.hash": { $in: newHistory },
        ...(search !== "false" && {
          title: { $in: searchRegex },
        }),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        order: { $indexOfArray: [newHistory, "$videoUrl.hash"] },
        ...(search !== "false" && {
          searchScore: {
            $sum: {
              $map: {
                input: searchSplit,
                as: "word",
                in: {
                  $cond: [
                    {
                      $regexMatch: {
                        input: "$title",
                        regex: "$$word",
                        options: "i",
                      },
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        }),
      },
    },

    ...(search !== "false"
      ? [{ $sort: { searchScore: -1, order: 1 } }]
      : [{ $sort: { order: 1 } }]),

    {
      $skip: search !== "false" ? 0 : skip,
    },
    {
      $limit: 15,
    },
    {
      $project: {
        title: 1,
        view: 1,
        createdAt: 1,
        "videoUrl.hash": 1,
        userName: "$user.name",
        userPhoto: "$user.photoUrl.photo.hash",
        _id: 0,
      },
    },
  ]);

  if (!videos)
    return res.status(404).json({ errors: "Videos nao encontrados." });

  if (!videos.length === 0)
    return res
      .status(200)
      .json({ success: true, history: [], lock: true, hash: [] });

  const newVideo = videos.map((doc) => {
    return {
      ...doc,
      createdAt: formatDistanceToNowStrict(new Date(doc.createdAt), {
        addSuffix: true,
        locale: ptBR,
      }),
    };
  });

  const historyHash = newVideo.map((e) => e.videoUrl.hash);

  return res.status(200).json({
    success: true,
    history: newVideo,
    hash: historyHash,
    lock: videos.length < 15 ? true : false,
  });
};

const getLikeVideos = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id).select("like name -_id");

  if (!user) return res.status(404).json({ errors: "usuario nao encontrado." });

  const newId = user.like.map((doc) => doc.videoId);

  const videos = await Video.aggregate([
    {
      $match: {
        _id: { $in: newId },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        order: { $indexOfArray: [newId, "$_id"] },
      },
    },
    {
      $sort: { order: 1 },
    },
    {
      $project: {
        title: 1,
        view: 1,
        createdAt: 1,
        "videoUrl.hash": 1,
        userName: "$user.name",
        userPhoto: "$user.photoUrl.photo.hash",
        _id: 0,
      },
    },
  ]);

  if (!videos)
    return res.status(404).json({ errors: "Videos nao encontrados" });

  if (videos.length === 0)
    return res
      .status(200)
      .json({ success: true, likeVideo: [], userInfo: user.name, lock: true });

  const newVideo = videos.map((doc) => {
    return {
      ...doc,
      createdAt: formatDistanceToNowStrict(new Date(doc.createdAt), {
        addSuffix: true,
        locale: ptBR,
      }),
    };
  });

  return res
    .status(200)
    .json({ success: true, likeVideo: newVideo, userInfo: user.name });
};

const setRestrict = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id);

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  user.restrictMode = user.restrictMode === "active" ? "desactive" : "active";

  await user.save();

  return res.status(200).json({ success: true });
};

const setViewMode = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const viewValue = req.body.value;

  const user = await User.findById(tokenDecode.id);

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  user.viewMode = viewValue;

  await user.save();

  return res.status(200).json({ success: true, viewValue: user.viewMode });
};

const deleteHistory = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id).select("history");

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  user.history = [];

  await user.save();

  return res.status(200).json({ success: true });
};

const setTheater = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);
  const theaterValue = req.body.value;

  const user = await User.findById(tokenDecode.id);

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado" });

  user.theater = theaterValue;

  await user.save();

  return res.status(200).json({ success: true, theaterValue: user.theater });
};

module.exports = {
  getUserById,
  channelCustom,
  getUserPhoto,
  getUserTag,
  getUserVideo,
  checkUserToken,
  getHistory,
  getLikeVideos,
  setRestrict,
  setViewMode,
  deleteHistory,
  setTheater,
};
