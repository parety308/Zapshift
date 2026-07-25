import createHttpError from "http-errors";
import { pool } from "../../config/db.js";
import { generateId } from "../../utils/generateId.js";
import { regionService } from "../regions/region.service.js";
import { getDefaultAdminId } from "../../config/seed.js";

const applyAsRider = async (user_id, { vehicleType, division, district }) => {
  const [already] = await pool.query("SELECT rider_id FROM Rider WHERE user_id = ?", [user_id]);
  if (already.length > 0) {
    throw createHttpError(409, "You have already applied to be a rider.");
  }

  const region = await regionService.findOrCreateRegion(division, district);
  const admin_id = await getDefaultAdminId();
  if (!admin_id) throw createHttpError(500, "No admin is configured to approve riders yet.");

  const rider_id = await generateId("Rider", "rider_id", "RD", 3);
  await pool.query(
    `INSERT INTO Rider (rider_id, vehicle_type, availability_status, user_id, region_id, admin_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [rider_id, vehicleType, "available", user_id, region.region_id, admin_id]
  );

  return getRiderByUserId(user_id);
};

const getRiderByUserId = async (user_id) => {
  const [rows] = await pool.query(
    `SELECT r.*, rg.division, rg.district
     FROM Rider r JOIN Region rg ON r.region_id = rg.region_id
     WHERE r.user_id = ?`,
    [user_id]
  );
  return rows[0] || null;
};

const listRiders = async () => {
  const [rows] = await pool.query(
    `SELECT r.rider_id, r.vehicle_type, r.availability_status, rg.division, rg.district,
            u.full_name, u.email
     FROM Rider r
     JOIN Region rg ON r.region_id = rg.region_id
     JOIN User u ON r.user_id = u.user_id
     ORDER BY r.rider_id`
  );
  return rows;
};

export const riderService = { applyAsRider, getRiderByUserId, listRiders };
