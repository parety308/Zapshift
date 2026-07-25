import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
