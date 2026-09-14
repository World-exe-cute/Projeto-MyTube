const mongoose = require("mongoose");
const { Schema } = mongoose;

const optional = (val) => {
  if (val === "Personalizar") {
    return true;
  } else {
    return false;
  }
};

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: String,
    idTag: { type: String, required: true },
    day: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    selectGen: { type: String, required: true },
    gen: {
      type: String,
      required: optional(this.selectGen),
    },
    optGen: {
      type: String,
      required: optional(this.selectGen),
    },
    pronouns: String,
    description: String,
    photoUrl: { cel: Object, pc: Object, photo: Object, tv: Object },
    viewMode: { type: String, required: true },
    restrictMode: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tags: { type: [String], required: true },
    inscription: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    myInscription: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    like: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dislike: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    history: [
      {
        videoHash: { type: String, required: true },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    theater: String,
  },
  {
    minimize: false,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
