import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: Date,
  imgUrl: String,
  meta: {
    views: Number,
    rating: Number,
  },
});

const Board = mongoose.model("Board",boardSchema);
export default Board;
