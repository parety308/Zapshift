import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js";
import { generateId } from "../../utils/generateId.js";
import { generateToken } from "../../utils/generateToken.js";

const toPublicUser = (row) => ({
  user_id: row.user_id,
  name: row.full_name,
  email: row.email,
});

const registerUser = async ({ name, email, password }) => {
  const [existing] = await pool.query("SELECT user_id FROM User WHERE email = ?", [email]);
  if (existing.length > 0) {
    throw createHttpError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user_id = await generateId("User", "user_id", "U", 3);

  await pool.query(
    "INSERT INTO User (user_id, full_name, email, password) VALUES (?, ?, ?, ?)",
    [user_id, name, email, hashedPassword]
  );

  const user = toPublicUser({ user_id, full_name: name, email });
  const token = generateToken({ user_id, email, full_name: name });
  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);
  if (rows.length === 0) {
    throw createHttpError(401, "Invalid email or password.");
  }

  const dbUser = rows[0];
  const passwordMatches = await bcrypt.compare(password, dbUser.password);
  if (!passwordMatches) {
    throw createHttpError(401, "Invalid email or password.");
  }

  const user = toPublicUser(dbUser);
  const token = generateToken({ user_id: dbUser.user_id, email: dbUser.email, full_name: dbUser.full_name });
  return { user, token };
};

const getMe = async (user_id) => {
  const [rows] = await pool.query("SELECT user_id, full_name, email FROM User WHERE user_id = ?", [user_id]);
  if (rows.length === 0) throw createHttpError(404, "User not found");
  return toPublicUser(rows[0]);
};

export const authService = { registerUser, loginUser, getMe };
