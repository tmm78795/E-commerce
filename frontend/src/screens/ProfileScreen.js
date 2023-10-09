import React, { useContext, useReducer, useState } from 'react';
import LoadingBox from '../components/LoadingBox';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { Store } from '../Store';
import { getError } from '../utilis';
import MessageBox from '../components/MessageBox';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_CREATED':
      return { ...state, loading: true };

    case 'REQUEST_SUCCESS':
      return { ...state, loading: false };

    case 'REQUEST_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const {
    state,
    dispatch: ctxDispatch,
  } = useContext(Store);

  const {userInfo} = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loading}, dispatch ] = useReducer(reducer, { loading: false });

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const header = { 'Content-type': 'application/json', authorization: `Barer ${userInfo.token}` };
      const data = {
        name: name,
        email: email,
        password: password,
      };
      const res = await fetch('api/users/profile', {
        method: 'PUT',
        headers: header,
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const user = await res.json();
        dispatch({ type: 'REQUEST_SUCCESS' });
        ctxDispatch({ type: 'USER_SIGNIN', payload: user });
        toast.success("User updated Successfully");
      } else {
        const err = await res.json();
        dispatch({ type: 'REQUEST_FAIL' });
        toast.error(getError(err));
      }
    } catch (err) {
      dispatch({ type: 'REQUEST_FAIL' });
      toast.error(getError(err));
    }
  };
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : (
    <Container className="container small-container">
      <Helmet>
        <title>Profile Screen</title>
      </Helmet>
      <h2>Update Profile</h2>
      <Form onSubmit={updateProfile}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            
          ></Form.Control>
        </Form.Group>

        <Button className="mb-3" type="submit">
          Update
        </Button>
      </Form>
    </Container>
  );
}
