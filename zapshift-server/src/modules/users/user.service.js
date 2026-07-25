import createHttpError from "http-errors";
import { pool } from "../../config/db.js";

const getUserById = async (user_id) => {
  const [rows] = await pool.query(
    "SELECT user_id, full_name, email FROM User WHERE user_id = ?",
    [user_id]
  );
  if (rows.length === 0) throw createHttpError(404, "User not found");
  return { user_id: rows[0].user_id, name: rows[0].full_name, email: rows[0].email };
};

const updateUser = async (user_id, { name }) => {
  await pool.query("UPDATE User SET full_name = ? WHERE user_id = ?", [name, user_id]);
  return getUserById(user_id);
};

export const userService = { getUserById, updateUser };
