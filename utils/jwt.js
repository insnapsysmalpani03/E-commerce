// utils/jwt.js
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  // Create a JWT token. The user ID is typically encoded into the token
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,  // JWT secret key (use an environment variable)
    { expiresIn: '1h' }      // Token expiration (1 hour)
  );
};
