import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';

export const SignInScreen = () => {
  const { search } = useLocation();
  const redirectURL = new URLSearchParams(search).get('redirect');
  const redirect = redirectURL ? redirectURL : '/';

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <h2 className="my-3"> Sign In</h2>
      <Form action="/api/users/signin" method="POST">
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" required></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" required></Form.Control>
        </Form.Group>

        <Button className="mb-3" type="submit">
          Sign In
        </Button>
        <div className="mb-3">
          New User?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create Your Account</Link>
        </div>
      </Form>
    </Container>
  );
};
