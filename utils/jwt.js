// utils/jwt.js
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  // Create a JWT token. The user ID is typically encoded into the token
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,  // JWT secret key (use an environment variable)
    { expiresIn: '3h' }      // Token expiration (3 hour)
  );
};
