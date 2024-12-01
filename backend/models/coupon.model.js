import mongoose from "mongoose";


const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountPercentage: {
      type: String,
      required: true,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    useraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require :true,
      unique:true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
