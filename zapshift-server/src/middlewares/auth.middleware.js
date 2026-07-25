import createHttpError from "http-errors";
import { verifyToken } from "../utils/verifyToken.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * Verifies the Bearer JWT on the Authorization header and attaches the
 * decoded payload ({ user_id, email, full_name }) to req.user.
 */
export const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createHttpError(401, "You are not logged in. Please log in to continue.");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    throw createHttpError(401, "Invalid or expired session. Please log in again.");
  }

  req.user = decoded;
  next();
});

/**
 * Restricts a route to the parcel/rider/etc owner, or an admin.
 * Expects req.params to contain the id to compare, and a getOwnerId
 * resolver to be passed in by the route.
 */
export const restrictToOwner = (getOwnerUserId) =>
  catchAsync(async (req, res, next) => {
    const ownerId = await getOwnerUserId(req);
    if (ownerId !== req.user.user_id) {
      throw createHttpError(403, "You do not have permission to perform this action.");
    }
    next();
  });
