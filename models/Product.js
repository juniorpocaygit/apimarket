const mongoose = require("mongoose")
const {Schema} = mongoose

const productSchema = new Schema({
    qtd: Number,
    unity:{
      type: String,
      enum: ['un','g'],
      default: 'un'
    },
    description: String,
    value: Number,
    listId: mongoose.ObjectId,
    listName: String,
  },
  {
    timestamps: true,
  }
)
const Product = mongoose.model("Product", productSchema);

module.exports = Product
