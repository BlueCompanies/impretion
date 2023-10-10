import mongoose, { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    productName: { type: String },
    productQuantity: { type: String },
    productId: { type: String },
    productPrice: { type: String },
    rawImagesUrl: { type: Array },
    orderReference: { type: String },
    orderType: { type: String },
    orderStatus: { type: String },
    orderDetails: { type: Object },
    userData: { type: Object },
    priceData: { type: Object },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;
