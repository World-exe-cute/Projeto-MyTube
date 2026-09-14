const mongoose = require("mongoose");

const { Schema } = mongoose;

const videoSchema = new Schema(
  {
    videoUrl: { type: Object, required: true },
    videoSize: { type: String, required: true },
    videoName: { type: String, required: true },
    originalCreator: String,
    videoTag: {
      type: [String],
      required: true,
    },
    description: String,
    public: { type: Boolean, required: true },
    view: { type: Number, required: true },
    title: { type: String, required: true },
    like: [
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
    dislike: [
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        like: [
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
        dislike: [
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
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
