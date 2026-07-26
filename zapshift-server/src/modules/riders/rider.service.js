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

const activeRiders = async()=>{

  const [rows] = await pool.query(
    `
    SELECT 
      r.rider_id,
      r.vehicle_type,
      r.availability_status,
      rg.division,
      rg.district,
      u.full_name,
      u.email

    FROM Rider r

    JOIN Region rg 
    ON r.region_id = rg.region_id

    JOIN User u
    ON r.user_id = u.user_id

    WHERE r.availability_status='active'

    ORDER BY r.rider_id
    `
  );


  return rows;

};

const approveRider = async (rider_id) => {

  await pool.query(
    `
        UPDATE Rider
        SET availability_status='active'
        WHERE rider_id=?
        `,
    [rider_id]
  );


  const [rows] = await pool.query(
    `
        SELECT *
        FROM Rider
        WHERE rider_id=?
        `,
    [rider_id]
  );


  return rows[0];
};

const removeRider = async (rider_id) => {

  await pool.query(
    `
        DELETE FROM Rider
        WHERE rider_id=?
        `,
    [rider_id]
  );

};


const getUnassignedParcels = async () => {
  const [rows] = await pool.query(`
    SELECT
      p.parcel_id,
      p.weight,
      p.parcel_type,
      p.parcel_status,
      u.full_name AS sender,
      rs.division AS source_division,
      rs.district AS source_district,
      rd.division AS destination_division,
      rd.district AS destination_district

    FROM Parcel p

    JOIN User u
      ON p.user_id=u.user_id

    JOIN Region rs
      ON p.parcel_source=rs.region_id

    JOIN Region rd
      ON p.parcel_destination=rd.region_id

    WHERE p.rider_id IS NULL

    ORDER BY p.parcel_id;
  `);

  return rows;
};

const assignRider = async (parcel_id, rider_id) => {

  const [rider] = await pool.query(
    `SELECT * FROM Rider
     WHERE rider_id=?
     AND availability_status='active'`,
    [rider_id]
  );

  if (!rider.length)
    throw createHttpError(404, "Active rider not found.");

  await pool.query(
    `
    UPDATE Parcel
    SET
      rider_id=?,
      parcel_status='Assigned'
    WHERE parcel_id=?
    `,
    [rider_id, parcel_id]
  );

  const [rows] = await pool.query(
    `
    SELECT *
    FROM Parcel
    WHERE parcel_id=?
    `,
    [parcel_id]
  );

  return rows[0];
};

const getAssignedParcels = async (rider_id) => {

  const [rows] = await pool.query(
    `
    SELECT
      p.parcel_id,
      p.weight,
      p.parcel_type,
      p.parcel_status,
      u.full_name

    FROM Parcel p

    JOIN User u
      ON p.user_id=u.user_id

    WHERE p.rider_id=?
    `,
    [rider_id]
  );

  return rows;
};

const getPendingDeliveries = async(user_id)=>{

    const [rider] = await pool.query(
        "SELECT rider_id FROM Rider WHERE user_id=?",
        [user_id]
    );

    if(!rider.length) return [];

    const riderId = rider[0].rider_id;

    const [rows] = await pool.query(
        `
        SELECT
            p.parcel_id,
            p.weight,
            p.parcel_type,
            p.parcel_status,
            u.full_name

        FROM Parcel p

        JOIN User u
        ON p.user_id=u.user_id

        WHERE
            p.rider_id=?
        AND
            p.parcel_status='Assigned'
        `,
        [riderId]
    );

    return rows;

};

const markDelivered = async(parcelId)=>{

    await pool.query(
        `
        UPDATE Parcel
        SET parcel_status='Delivered'
        WHERE parcel_id=?
        `,
        [parcelId]
    );

    const [rows] = await pool.query(
        `
        SELECT *
        FROM Parcel
        WHERE parcel_id=?
        `,
        [parcelId]
    );

    return rows[0];

};

const getCompletedDeliveries = async(user_id)=>{

    const [rider] = await pool.query(
        "SELECT rider_id FROM Rider WHERE user_id=?",
        [user_id]
    );

    if(!rider.length) return [];

    const riderId = rider[0].rider_id;

    const [rows] = await pool.query(
        `
        SELECT
            p.parcel_id,
            p.weight,
            p.parcel_type,
            p.parcel_status,
            u.full_name

        FROM Parcel p

        JOIN User u
        ON p.user_id=u.user_id

        WHERE
            p.rider_id=?
        AND
            p.parcel_status='Delivered'
        `,
        [riderId]
    );

    return rows;

};

const getMyEarnings = async(user_id)=>{

    const [rider] = await pool.query(
        "SELECT rider_id FROM Rider WHERE user_id=?",
        [user_id]
    );

    if(!rider.length){
        return {
            totalEarned:0,
            thisMonth:0,
            deliveriesCompleted:0,
            pendingPayout:0,
            history:[]
        };
    }

    const riderId = rider[0].rider_id;

    const [history] = await pool.query(
        `
        SELECT
            p.parcel_id,
            pay.amount

        FROM Parcel p

        JOIN Payment pay
        ON p.parcel_id=pay.parcel_id

        WHERE
            p.rider_id=?
        AND
            p.parcel_status='Delivered'
        `,
        [riderId]
    );

    const totalEarned = history.reduce(
        (sum,item)=>sum+Number(item.amount),
        0
    );

    return {

        totalEarned,

        thisMonth:totalEarned,

        deliveriesCompleted:history.length,

        pendingPayout:0,

        history

    };

};
export const riderService = {
  applyAsRider,
  getRiderByUserId,
  listRiders,
  approveRider,
  removeRider,
  activeRiders,

  getUnassignedParcels,
  assignRider,
  getAssignedParcels,

  getPendingDeliveries,
  markDelivered,
  getCompletedDeliveries,
  getMyEarnings
};