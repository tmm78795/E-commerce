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
      res.status(201).send({ message: 'Order Placed', order });
    } catch (err) {
      res.status(404).send({ message: 'Could not place order' });
    }
  })
);

orderRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res) => {
    const orders = await Order.find({user:req.user._id})
   
      res.send(orders)
  

}))

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.params.id);
    // const order = await Order.findById(req.params.id);

    // if (order) {
    //   // console.log(typeof order);
    //   res.send(order);
    // } else {
    //   res.status(404).send({ message: 'Not found' });
    // }
    try {
      const order = await Order.findById(req.params.id);
      res.send(order);
    }
    catch (err) {
      res.status(404).send({ message: 'Not found' })
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const orderDetails = req.body;
    const order = await Order.findById(id);
    if (order) {
      (order.isPaid = true), (order.paidAt = Date.now());
      order.paymentResult = {
        id: orderDetails.id,
        status: orderDetails.status,
        update_time: orderDetails.update_time,
        email_address: orderDetails.email_address,
      };

      const updatedOrder = await order.save();

      res.send({ message: 'Order Paid Successfully!', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order not found!' });
    }
  })
);

export default orderRouter;
