const User = require("../models/User");
const { formatDistanceToNowStrict } = require("date-fns");
const { ptBR } = require("date-fns/locale");
const { findVideos } = require("../services/findVideos");
const jwt = require("jsonwebtoken");
const { emailTransporter } = require("../services/emailVerify");
const jwtSecret = process.env.JWT_SECRET;

const getAllPublicVideos = async (req, res) => {
  const token = req.cookies.token;
  const id = req.params.id;
  const privateId = req.id;
  const num = req.body.frontHash.length;
  const frontTag = req.body.frontTag;
  const frontHash = req.body.frontHash;
  const order = req.body.order;

  let tokenDecode;
  let user;
  let allVideos;
  let restrict;
  let videoInclude;
  if (token) {
    tokenDecode = jwt.verify(token, jwtSecret);

    user = await User.findById(tokenDecode.id).select(
      "history restrictMode tags inscription _id",
    );

    if (!user)
      return res.status(404).json({ error: "usuario nao encontrado." });

    restrict = user.restrictMode;

    videoInclude = user.history.some((e) => String(e.videoHash) === String(id));
  }
  if (privateId === "inscriptions" && token) {
    allVideos = await findVideos(
      "inscription",
      tokenDecode,
      restrict,
      num,
      frontTag,
      frontHash,
      order,
    );
  } else {
    allVideos = await findVideos(
      "home",
      tokenDecode,
      restrict,
      num,
      frontTag,
      frontHash,
      order,
    );
  }

  if (!allVideos)
    return res.status(404).json({ errors: "Videos não encontrados." });

  if (allVideos.length === 0)
    return res
      .status(200)
      .json({ success: true, videos: [], lock: true, hash: [] });

  if (videoInclude) {
    const someHistory = user.history.filter(
      (doc) => doc.videoHash !== String(id),
    );

    someHistory.unshift({
      videoHash: String(id),
    });

    const userTags = user.tags.map((item) => item.toLowerCase());
    const videoTags = frontTag.map((item) => item.toLowerCase());

    const newTags = [
      ...videoTags,
      ...userTags.filter((item) => !videoTags.includes(item)),
    ].slice(0, 17);

    user.tags = newTags;
    user.history = someHistory;

    await user.save();
  }

  const newVideo = await Promise.all(
    allVideos.map(async (v) => {
      const time = formatDistanceToNowStrict(new Date(v.createdAt), {
        addSuffix: true,
        locale: ptBR,
      });

      return {
        ...v,
        postTime: v.createdAt,
        createdAt: time,
        checkUserInscription: token
          ? v.userId.myInscription.some(
              (doc) => String(doc.userId) === String(user._id),
            )
          : undefined,
        userPhoto: v.userId.photoUrl.photo?.hash,
        name: v.userId.name,
        userTag: v.userId.idTag,
        like: {
          likeCount: v.like.length,
          likeUser: token
            ? v.like.some((doc) => String(doc.userId) === String(user._id))
            : false,
          dislikeUser: token
            ? v.dislike.some((doc) => String(doc.userId) === String(user._id))
            : false,
        },
        view: v.view,
      };
    }),
  );

  const videoHash = newVideo.map((e) => e.videoUrl.hash);

  return res
    .status(200)
    .json({ success: true, videos: newVideo, hash: videoHash });
};

const getUserInfo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id)
    .select("inscription")
    .populate({
      path: "inscription.userId",
      select: "name photoUrl.photo idTag -_id",
    });

  if (!user) return res.status(404).json({ errors: "usuario nao encontrado" });

  const result = user.inscription.map((i) => ({
    userId: i.userId,
  }));

  return res.status(200).json({ success: true, channels: result });
};

const getChannelInfo = async (req, res) => {
  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id)
    .select("inscription")
    .populate({
      path: "inscription.userId",
      select:
        "name photoUrl.photo idTag description inscription myInscription -_id",
    })
    .lean();

  if (!user) return res.status(404).json({ errors: "usuario nao encontrado" });

  const result = user.inscription.map((i) => ({
    userId: {
      ...i.userId,
      inscription: i.userId.inscription.length,
      myInscription: token
        ? i.userId.myInscription.some(
            (doc) => String(doc.userId) === String(tokenDecode.id),
          )
        : undefined,
    },
  }));

  return res.status(200).json({ success: true, channels: result });
};

const getTagVideos = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    const tokenDecode = jwt.verify(token, jwtSecret);
    const user = await User.findById(tokenDecode.id).select("tags -_id");

    if (!user)
      return res.status(404).json({ errors: "usuario nao encontrado" });

    res.status(200).json({ success: true, tags: user.tags });
  } else {
    const tagsDefault = [
      "arvores",
      "paisagem",
      "animais",
      "gato",
      "cachorro",
      "passaros",
      "comida",
      "esportes",
      "montanhas",
      "rios",
      "oceanos",
      "flores",
      "deserto",
      "estradas",
      "pessoas",
      "cachoeira",
      "nuvens",
    ];
    res.status(200).json({ success: true, tags: tagsDefault });
  }
};

const searchVideos = async (req, res) => {
  const num = req.body.frontHash.length;
  const frontHash = req.body.frontHash;
  const tags = req.params.id
    .split(" ")
    .map((key) => key.replace(/[.,!?]/g, ""));

  const token = req.cookies.token;
  let restrict = false;
  let tokenDecode;
  if (token) {
    tokenDecode = jwt.verify(token, jwtSecret);

    const user = await User.findById(tokenDecode.id).select(
      "restrictMode -_id",
    );

    if (!user)
      return res.status(404).json({ errors: "Usuario nao encontrado." });
    restrict = user.restrictMode;
  }

  const videos = await findVideos(
    "search",
    tokenDecode,
    restrict,
    num,
    tags,
    frontHash,
  );

  if (!videos)
    return res.status(404).json({ errors: "Videos nao encontrados." });

  if (videos.length === 0)
    return res
      .status(200)
      .json({ success: true, videos: [], lock: true, hash: [] });

  for (let i = videos.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [videos[i], videos[random]] = [videos[random], videos[i]];
  }

  const newVideo = videos.map((video) => ({
    ...video,
    createdAt: formatDistanceToNowStrict(new Date(video.createdAt), {
      addSuffix: true,
      locale: ptBR,
    }),
  }));

  const videoHash = videos.map((e) => e.videoUrl.hash);

  res.status(200).json({ success: true, videos: newVideo, hash: videoHash });
};

const sendFeedback = async (req, res) => {
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

  const feedback = String(req.body.feedbackInfo)
    .replace(/[\r\n]/g, "")
    .trim();

  if (feedback.length > 5000)
    return res.status(400).json({ errors: "texto muito grande" });

  const token = req.cookies.token;
  const tokenDecode = jwt.verify(token, jwtSecret);

  const user = await User.findById(tokenDecode.id).select("idTag -_id");

  if (!user) return res.status(404).json({ errors: "Usuario nao encontrado." });

  const createEmail = await emailTransporter("feedback", feedback, user.idTag);

  if (createEmail) {
    req.body = {};
    res.status(200).json({ success: true, next: true });
    return;
  } else {
    res.status(422).json({
      errors: [
        {
          msg: "Por favor, verifique o email e tente novamente.",
          path: "email",
        },
      ],
    });
    return;
  }
};

module.exports = {
  getAllPublicVideos,
  getUserInfo,
  getChannelInfo,
  getTagVideos,
  searchVideos,
  sendFeedback,
};
