const mongoose = require("mongoose")
const {Schema} = mongoose

const listSchema = new Schema({
    title: String,
    userId: mongoose.ObjectId,
    userName: String,
  },
  {
    timestamps: true,
  }
)
const List = mongoose.model("List", listSchema);

module.exports = List
