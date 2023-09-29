import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import Form from 'react-bootstrap/Form';
import { Store } from '../Store';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  // console.log(state);

  const {
    userInfo,
    cart: { shippingAddress, PaymentMethod },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/payment');
    }
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [userInfo, shippingAddress, navigate]);

  const [PaymentMethodName, setPaymentMethodName] = useState(
    PaymentMethod || 'Paypal'
  );

  const submitHandler = (e) => {
    
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: PaymentMethodName }); 
    navigate('/placeorder')
  };

  return (
    <div>
      <Helmet>
        <title>Payment Mehtod</title>
      </Helmet>
      <CheckoutSteps Step1 Step2 Step3></CheckoutSteps>

      <div className="container small-container">
        <h1>Payment Method:</h1>

        <Form onSubmit={submitHandler}>
          <Form.Check
            className="mb-3"
            type="radio"
            label="Paypal"
            id="Paypal"
            value="Paypal"
            checked={PaymentMethodName === 'Paypal'}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          ></Form.Check>

          <Form.Check
            className="mb-3"
            type="radio"
            label="Stripe"
            id="Stripe"
            value="Stripe"
            checked={PaymentMethodName === 'Stripe'}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          ></Form.Check>

          <Button type="submit">Continue</Button>
        </Form>
      </div>
    </div>
  );
}
