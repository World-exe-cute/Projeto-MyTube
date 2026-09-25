//const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
/*const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const token = req.cookies.token;
    const tokenDecode = jwt.verify(token, jwtSecret);

    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "profilePhotos";
    } else if (req.baseUrl.includes("posts")) {
      folder = "postImage";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }
    if (!fs.existsSync(`./uploads/${folder}/${tokenDecode.id}`)) {
      fs.mkdirSync(`./uploads/${folder}/${tokenDecode.id}`, {
        recursive: true,
      });
    }

    cb(null, `uploads/${folder}/${tokenDecode.id}/`); //aqui
  },
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];

    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}.${fileType}`);
  },
});*/

const uploadToCloudinary = (file, userId) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `MyTube/profilePhotos/${userId}`,
        public_id: fileName,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(file.buffer);
  });
};

const imageStorage = multer.memoryStorage();

const fileValidation = (req, file, cb) => {
  const types = ["image/jpeg", "image/png", "image/webp"];

  if (!types.includes(file.mimetype)) {
    return cb(new Error("Arquivo não permitido"), false);
  }

  cb(null, true);
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: fileValidation,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { imageUpload, uploadToCloudinary };
