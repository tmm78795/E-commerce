import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5d',
    }
  );
};

export const isAuth = (req, res, next) => {
 
  //console.log('reached')
  const authorization = req.headers.authorization;
  //console.log(authorization);

  const arr = authorization && authorization.split(' ');
  const token = arr[1]
  
  console.log(typeof(token));
  // try {const token = authorization && authorization.split(' ', 1);}
  // catch(err) {res.send}
  if (!token) {
    res.status(401).send({ message: 'Authorization failed, No token' });
  } else {
    //console.log('in');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      
      if (err) {
        res
          .status(403)
          .send({ message: 'Could not verify user, Invalid Token' });
      } else {
        //console.log('in2');
        (req.user = user); next();
      }
    });
  }
};
