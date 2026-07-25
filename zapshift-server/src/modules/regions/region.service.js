import createHttpError from "http-errors";
import { pool } from "../../config/db.js";
import { generateId } from "../../utils/generateId.js";

const listRegions = async () => {
  const [rows] = await pool.query("SELECT * FROM Region ORDER BY division, district");
  return rows;
};

/**
 * Finds a Region row matching division+district, creating it on the fly
 * if a new district ever shows up on the client that is not seeded yet.
 */
const findOrCreateRegion = async (division, district) => {
  if (!division || !district) {
    throw createHttpError(400, "Both division and district are required.");
  }
  const [rows] = await pool.query(
    "SELECT * FROM Region WHERE division = ? AND district = ?",
    [division, district]
  );
  if (rows.length > 0) return rows[0];

  const region_id = await generateId("Region", "region_id", "RG", 3);
  await pool.query("INSERT INTO Region (region_id, division, district) VALUES (?, ?, ?)", [
    region_id,
    division,
    district,
  ]);
  return { region_id, division, district };
};

export const regionService = { listRegions, findOrCreateRegion };
