const Order = require("../models/Order");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const {
    cartItems,
    user,
    deliveredAt,
    isDelivered,
    paidAt,
    isPaid,
    totalPrice,
    shippingPrice,
    taxPrice,
    paymentResult,
    paymentMethod,
    shippingAddress,
  } = req.body;

  const productlist = cartItems.map((item) => ({
    count: item.count,
    color: item.color,
    product: item.product,
  }));

  try {
    const orderItems = await Order.create({
      user,
      cartItems: productlist,
      deliveredAt,
      isDelivered,
      paidAt,
      isPaid,
      totalPrice,
      shippingPrice,
      taxPrice,
      paymentResult,
      paymentMethod,
      shippingAddress,
    });

    res.status(201).json({
      message: "Order created successfully,",
      orderItems,
    });
  } catch (error) {
    res.status(400).json({
      message: "Order creation failed",
      error: error.message, // Provide error details for debugging
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Fetch Successful",
      products,
    });
  } catch (err) {
    res.status(401).json({
      message: "Failed to fetch data",
      err,
    });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Order.findById(id);
    res.status(200).json({
      message: "Fetch Successful",
      products,
    });
  } catch (err) {
    res.status(401).json({
      message: "Failed to fetch data",
      err,
    });
  }
});

module.exports = router;
