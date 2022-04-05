import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    amount: { type: Number, require: true },
    merchantUid: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
