import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for any user type
 * @param {String} id         - The user, business, or admin ID
 * @param {String} role       - 'user', 'business', 'admin', etc.
 * @param {Object} extraData  - Any additional payload data (optional)
 * @param {String} expiresIn  - Token expiry (default: '30d')
 * @returns {String} Signed JWT token
 */
const generateToken = (id, role, extraData = {}, expiresIn = "30d") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const payload = {
    id,
    role,
    ...extraData   // Spread extra fields like email, permissions if needed
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
