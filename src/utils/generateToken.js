import jwt from "jsonwebtoken";

/**
 * Generate a JWT token
 * @param {String} id - The user or business ID
 * @param {String} type - 'user' or 'business'
 * @returns {String} Signed JWT token
 */
const generateToken = (id, type) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(
    { id, type }, // Payload
    process.env.JWT_SECRET, // Secret
    {
      expiresIn: "30d", // Token expiry
    }
  );
};

export default generateToken;
