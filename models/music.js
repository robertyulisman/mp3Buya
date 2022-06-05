"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const musicSchema = Schema(
  {
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    image: {
      type: String,
      required: true,
      default: "/images/defaults/default-placeholder.png",
    },
    url: { type: String, required: true },
    urlDownload: { type: String, required: true, default: "UjBCsixkySI" },
    views: { type: Number, default: 0 },
    lyric: { type: String },
    last_view: { type: String, required: true },
    duration: { type: String, required: true, default: "tidak di ketahui" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Music", musicSchema);
