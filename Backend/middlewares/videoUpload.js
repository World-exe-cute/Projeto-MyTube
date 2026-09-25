const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("../config/ffmpeg");

const jwtSecret = process.env.JWT_SECRET;

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const token = req.cookies.token;
    const tokenDecode = jwt.verify(token, jwtSecret);

    let folder = "";

    if (req.baseUrl.includes("videos")) {
      folder = "profileVideos";
    }

    if (!fs.existsSync(`./uploads/${folder}/${tokenDecode.id}`)) {
      fs.mkdirSync(`./uploads/${folder}/${tokenDecode.id}`);
    }

    cb(null, `uploads/${folder}/${tokenDecode.id}/`); //aqui
  },
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];

    const unique_id = uuidv4();
    const hash = crypto.randomBytes(32).toString("hex");
    req.fileName = `${file.originalname}`;
    req.hash = `${unique_id}.${fileType}`;
    req.onlyHash = `${hash}`;
    req.fileType = `${fileType}`;

    cb(null, `${unique_id}.${fileType}`);
  },
});

//arquive type validation
const fileValidation = (req, file, cb) => {
  const types = ["video/mp4", "video/mkv", "video/webm"];

  if (!types.includes(file.mimetype)) {
    return cb(new Error("Arquivo não permitido"), false);
  }

  cb(null, true);
};

//validate file oversize
const fileOversize = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ errors: "Arquivo maior que 20mb" });
    }
  }
  return next(err);
};

//create thumbnail
const fileThumb = (req, res, next) => {
  console.log("======fileThumb check=======");
  const videoPath = req.file.path;
  const thumbnail = videoPath.replace(path.extname(videoPath), ".jpg");
  const unique_id = uuidv4();

  ffmpeg(videoPath)
    .screenshots({
      timestamps: ["1"],
      filename: `${unique_id}.jpg`,
      folder: path.dirname(thumbnail),
      size: "480x?",
    })
    .on("end", () => {
      req.thumb = `${unique_id}.jpg`;
      next();
    })
    .on("error", (err) => {
      return res.status(500).json({ errors: "Erro ao gerar thumnail" });
    });
};

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: fileValidation,
  limits: { fileSize: 20 * 1024 * 1024 }, //20mb
});

module.exports = { videoUpload, fileOversize, fileThumb, deleteFile };
