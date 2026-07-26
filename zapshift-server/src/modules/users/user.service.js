import createHttpError from "http-errors";
import { pool } from "../../config/db.js";


const getUserById = async (user_id) => {
  const [rows] = await pool.query(
    "SELECT user_id, full_name, email FROM User WHERE user_id = ?",
    [user_id]
  );

  if (rows.length === 0)
    throw createHttpError(404, "User not found");

  return {
    user_id: rows[0].user_id,
    name: rows[0].full_name,
    email: rows[0].email
  };
};


// Get all users
const getAllUsers = async () => {
  const [rows] = await pool.query(
    `
    SELECT 
      user_id,
      full_name,
      email,
      role
    FROM User
    ORDER BY user_id DESC
    `
  );

  return rows.map(user => ({
    _id: user.user_id,
    name: user.full_name,
    email: user.email,
    role: user.role,
    status: user.status
  }));
};


// Update user status
const updateUserStatus = async (user_id, status) => {
  await pool.query(
    "UPDATE User SET status = ? WHERE user_id = ?",
    [status, user_id]
  );

  return getUserById(user_id);
};


// Make admin
const updateUserRole = async (user_id, role) => {
  await pool.query(
    "UPDATE User SET role = ? WHERE user_id = ?",
    [role, user_id]
  );

  return getUserById(user_id);
};


const updateUser = async (user_id, { name }) => {
  await pool.query(
    "UPDATE User SET full_name = ? WHERE user_id = ?",
    [name, user_id]
  );

  return getUserById(user_id);
};


export const userService = {
  getUserById,
  getAllUsers,
  updateUser,
  updateUserStatus,
  updateUserRole
};