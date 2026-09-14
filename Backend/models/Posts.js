const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postText: String,
  postImage: [
    {
      hash: { type: String, required: true },
      fileName: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  postPublic: { type: Boolean, required: true },
  postPoll: [
    {
      text: String,
      check: [
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
    },
  ],
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
});

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
