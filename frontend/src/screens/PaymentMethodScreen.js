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
    cart: { shippingAddress, paymentMethod },
  } = state;


  const [PaymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'Paypal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: PaymentMethodName });
    navigate('/placeorder');
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
          <div className="mb-3">
            <Form.Check
              type="radio"
              label="Paypal"
              id="Paypal"
              value="Paypal"
              checked={PaymentMethodName === 'Paypal'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            ></Form.Check>
          </div>
          <div className="mb-3">
            <Form.Check
              className="mb-3"
              type="radio"
              label="Stripe"
              id="Stripe"
              value="Stripe"
              checked={PaymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            ></Form.Check>
          </div>
          <div className='mb-3'>
          <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
