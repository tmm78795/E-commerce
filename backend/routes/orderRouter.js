import express from 'express';

import expressAsyncHandler from 'express-async-handler';
import Order from '../Models/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //console.log("in3");
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      itemsPrice: req.body.itemsPrice,
      paymentMethod: req.body.paymentMethod,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    //console.log(newOrder);
    try {
      const order = await newOrder.save();
      console.log(order)
    }
    catch (err) {
      console.log(err)
    }
    const order = await newOrder.save();
    //console.log("in4");
    res.status(201).send({ message: 'Order Placed', order });
  })
);

export default orderRouter;
