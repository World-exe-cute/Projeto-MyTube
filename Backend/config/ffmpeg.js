const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath =
  "C:/Backup/ProjetoCurriculo/YouTube/my-tube/backend/programs/ffmpeg/bin/ffmpeg.exe";
const ffprobePath =
  "C:/Backup/ProjetoCurriculo/YouTube/my-tube/backend/programs/ffmpeg/bin/ffprobe.exe";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

module.exports = ffmpeg;
