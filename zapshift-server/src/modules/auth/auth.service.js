import createHttpError from "http-errors";
import { pool } from "../../config/db.js"
import bcrypt from "bcryptjs";
const regsterUserDB = async (payload) => {
    const { name, email, password, role } = payload;
    const [existingUser] = await pool.query(
        "SELECT * FROM User WHERE email = ?",
        [email]
    );

    if (existingUser.length > 0) {
        throw createHttpError(409, "Email already exists");
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const userId = `USR${Date.now().toString().slice(-7)}`;
    await pool.query(
        `INSERT INTO User(
    user_id,
    full_name,
    email,
    password
    ) VALUES(?,?,?,?)`,
        [userId, name, email, hashpassword]
    );
    const user = {
        user_id: userId,
        full_name: name,
        email
    };
    return user;
}


export const authService = { regsterUserDB };