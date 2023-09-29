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
    }
    catch (err) {
      res.status(404).send({message:"Could not place order"})
    }
    
    
    
  })
)


  orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {

      // console.log(req.params.id);
      const order = await Order.findById(req.params.id);

      if(order) {
        res.send(order)
      }
      else {
        res.status(404).send({message:"Not found"});
      }
      
    })
);

export default orderRouter;
