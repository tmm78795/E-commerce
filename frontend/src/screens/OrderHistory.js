import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { getError } from '../utilis';
import {Store} from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_CREATED':
      return { ...state, loading: true };

    case 'REQUEST_SUCCESS':
      return { ...state, orders: action.payload, loading: false };

    case 'REQUEST_FAIL':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchMyOrders = async () => {
      dispatch({ type: 'REQUEST_CREATED' });
      let res;
      const header = { authorization: `Bearer ${userInfo.token}` };
      try {
        res = await fetch('/api/order/mine', { headers: header });
      } catch (error) {
        dispatch({ type: 'REQUEST_FAIL', payload: getError(error) });
      }

      if (res?.ok) {
        const data = await res.json();
        dispatch({ type: 'REQUEST_SUCCESS', payload: data });
      } else {
        const error = await res.json();
        dispatch({ type: 'REQUEST_FAIL', payload: getError(error) });
      }
    };

    if (!userInfo) {
        navigate('/')
    }
    else {
        fetchMyOrders();
    }

    
  }, [userInfo, navigate]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error)}</MessageBox>
  ) : orders.length > 0 ? (
    <table className="table">
      <thead>
        <tr>
          <th>Id (click to see more details)</th>
          <th>Date</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Delivere</th>
          
        </tr>
      </thead>{' '}
      <tbody>
        
        {  
        orders.map((order) => (
          <tr key={order._id}>
            <td><Button
             type='button'
              variant="link"
              onClick={() => {navigate(`/order/${order._id}`)}}
            >{order._id}</Button></td>
            <td>{order.createdAt.substring(0, 10)}</td>
            <td>${order.totalPrice}</td>
            <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
            <td>
              {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}
            </td>
            {/* <td>
            <Button
              type="button"
              variant="light"
              onClick={() => {navigate(`/order/${order._id}`)}}
            >details</Button></td> */}
          </tr>
        ))}
      </tbody>
    </table>
     ) : (
        <div><p1>No orders <Link to='/'>go to homepage</Link></p1></div>
     )
        
  
}
