const mongoose = require("mongoose");

const { Schema } = mongoose;

const emailSchema = new Schema(
  {
    email: String,
    code: String,
    createdAt: { type: Date, default: Date.now, expires: 160 },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
