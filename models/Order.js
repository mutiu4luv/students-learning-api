const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const OrderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: { type: Number, required: true },
        color: { type: String, required: true },
      },
    ],

    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      // required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,

      default: 0.0,
    },
    totalPrice: {
      type: Number,

      default: 0.0,
    },
    isPaid: {
      type: Boolean,

      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,

      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", OrderSchema);
