import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utilis';

export const SignUpScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { search } = useLocation();
  const redirectURL = new URLSearchParams(search).get('redirect');
  const redirect = redirectURL ? redirectURL : '/';

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error("Password don't match")
      return;
    }
    //console.log(JSON.stringify({ email: email, password: password }));
    let res, data;
    try {
      res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      data = await res.json();
    } catch (err) {
      toast.error(getError(err));
    }

    if (res.ok) {
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } else {
      toast.error(getError(data));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <h2 className="my-3"> Sign Up</h2>
      <Form action="/api/users/signin" method="POST" onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="name"
            required
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="confirmPassword"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button className="mb-3" type="submit">
          Sign Up
        </Button>
        <div className="mb-3">
          Already registered?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
};
