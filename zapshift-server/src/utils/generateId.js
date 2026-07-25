import { pool } from "../config/db.js";

/**
 * Generates the next sequential VARCHAR(10) id for a table, e.g. U007,
 * RD003, PC012. Falls back to retrying with a bigger number if a
 * collision is somehow hit (defensive, should not normally trigger).
 */
export const generateId = async (table, idColumn, prefix, pad = 3) => {
  const [rows] = await pool.query(
    `SELECT ${idColumn} FROM ${table} WHERE ${idColumn} LIKE ? ORDER BY ${idColumn} DESC LIMIT 1`,
    [`${prefix}%`]
  );

  let nextNum = 1;
  if (rows.length > 0) {
    const numPart = rows[0][idColumn].replace(prefix, "");
    const parsed = parseInt(numPart, 10);
    if (!Number.isNaN(parsed)) nextNum = parsed + 1;
  }

  let candidate = `${prefix}${String(nextNum).padStart(pad, "0")}`;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [existing] = await pool.query(`SELECT 1 FROM ${table} WHERE ${idColumn} = ? LIMIT 1`, [candidate]);
    if (existing.length === 0) return candidate;
    nextNum += 1;
    candidate = `${prefix}${String(nextNum).padStart(pad, "0")}`;
  }
};
