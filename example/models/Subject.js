const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sem: {
    type: Number,
    required: true,
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
});
module.exports = mongoose.model("Subject", Schema);
