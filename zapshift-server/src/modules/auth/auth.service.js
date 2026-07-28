import createHttpError from "http-errors";
import { pool } from "../../config/db.js";
import { generateId } from "../../utils/generateId.js";
import { generateToken } from "../../utils/generateToken.js";

const toPublicUser = (row, role = "user") => ({
  user_id: row.user_id,
  name: row.full_name,
  email: row.email,
  role,
});


const registerUser = async ({ name, email, password }) => {
  const [existing] = await pool.query(
    "SELECT user_id FROM User WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw createHttpError(409, "An account with this email already exists.");
  }


  const user_id = await generateId(
    "User",
    "user_id",
    "U",
    3
  );

  await pool.query(
    `
    INSERT INTO User 
    (user_id, full_name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      user_id,
      name,
      email,
      password,
      "user"
    ]
  );


  const user = toPublicUser(
    {
      user_id,
      full_name: name,
      email
    },
    "user"
  );


  const token = generateToken({
    user_id,
    email,
    full_name: name,
    role: "user"
  });


  return { user, token };
};



const loginUser = async ({ email, password }) => {

  // Find user
  const [userRows] = await pool.query(
    "SELECT * FROM User WHERE email = ?",
    [email]
  );


  if (userRows.length === 0) {
    throw createHttpError(
      401,
      "Invalid email or password."
    );
  }


  const dbUser = userRows[0];


  // Check password
  if (password !== dbUser.password) {
    throw createHttpError(
      401,
      "Invalid email or password."
    );
  }

  const user = {
    id: dbUser.user_id,
    email: dbUser.email,
    full_name: dbUser.full_name,
    role: dbUser.role
  };


  const token = generateToken({
    user_id: dbUser.user_id,
    email: dbUser.email,
    full_name: dbUser.full_name,
    role: dbUser.role
  });


  return {
    user,
    token
  };
};



const getMe = async (user_id) => {

  const [rows] = await pool.query(
    `
    SELECT user_id, full_name, email, role
    FROM User
    WHERE user_id = ?
    `,
    [user_id]
  );


  if (rows.length === 0) {
    throw createHttpError(
      404,
      "User not found"
    );
  }


  return rows[0];
};



export const authService = {
  registerUser,
  loginUser,
  getMe
};