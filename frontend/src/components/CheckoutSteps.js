import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.Step1 ? 'active' : ''}>Sign In</Col>
      <Col className={props.Step2 ? 'active' : ''}>Address</Col>
      <Col className={props.Step3 ? 'active' : ''}>Payment</Col>
      <Col className={props.Step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  );
}
