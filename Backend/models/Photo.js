const mongoose = require("mongoose");
const { Schema } = mongoose;

const photoSchema = new Schema(
  {
    identify: { type: String, required: true },
    profileImage: String,
    bannerImage: Array,
    pronouns: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
