import createHttpError from "http-errors";
import { pool } from "../../config/db.js";
import { generateId } from "../../utils/generateId.js";
import { regionService } from "../regions/region.service.js";
import { pricingService } from "../pricing/pricing.service.js";

const PARCEL_SELECT = `
  SELECT
    p.parcel_id, p.weight, p.parcel_type, p.parcel_status,
    p.user_id, p.rider_id, p.pricing_id,
    src.division AS source_division, src.district AS source_district,
    dst.division AS destination_division, dst.district AS destination_district,
    pr.delivery_price AS cost,
    pay.payment_status AS payment_status
  FROM Parcel p
  JOIN Region src ON p.parcel_source = src.region_id
  JOIN Region dst ON p.parcel_destination = dst.region_id
  JOIN Pricing_rule pr ON p.pricing_id = pr.pricing_id
  LEFT JOIN Payment pay ON pay.parcel_id = p.parcel_id
`;

const mapParcelRow = (row) => ({
  _id: row.parcel_id,
  weight: Number(row.weight),
  parcelType: row.parcel_type,
  deliveryStatus: row.parcel_status,
  cost: Number(row.cost),
  paymentStatus: row.payment_status ? row.payment_status.toLowerCase() : "unpaid",
  senderRegion: row.source_division,
  senderDistrict: row.source_district,
  receiverRegion: row.destination_division,
  receiverDistrict: row.destination_district,
  parcelName: `${row.parcel_type} parcel to ${row.destination_district}`,
});

const createParcel = async (user_id, payload) => {
  const { weight, parcelType, senderRegion, senderDistrict, receiverRegion, receiverDistrict } = payload;

  const source = await regionService.findOrCreateRegion(senderRegion, senderDistrict);
  const destination = await regionService.findOrCreateRegion(receiverRegion, receiverDistrict);
  const { pricing_id } = await pricingService.resolvePricingForWeight(weight);

  const parcel_id = await generateId("Parcel", "parcel_id", "PC", 3);

  await pool.query(
    `INSERT INTO Parcel (parcel_id, weight, parcel_source, parcel_destination, parcel_type, user_id, rider_id, pricing_id, parcel_status)
     VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
    [parcel_id, weight, source.region_id, destination.region_id, parcelType, user_id, pricing_id, "ongoing"]
  );

  return getParcelById(parcel_id);
};

const getParcelById = async (parcel_id) => {
  const [rows] = await pool.query(`${PARCEL_SELECT} WHERE p.parcel_id = ?`, [parcel_id]);
  if (rows.length === 0) throw createHttpError(404, "Parcel not found");
  return mapParcelRow(rows[0]);
};

const listParcelsForUser = async (user_id) => {
  const [rows] = await pool.query(`${PARCEL_SELECT} WHERE p.user_id = ? ORDER BY p.parcel_id DESC`, [user_id]);
  return rows.map(mapParcelRow);
};

const deleteParcel = async (parcel_id, user_id) => {
  const [rows] = await pool.query("SELECT user_id, parcel_status FROM Parcel WHERE parcel_id = ?", [parcel_id]);
  if (rows.length === 0) throw createHttpError(404, "Parcel not found");
  if (rows[0].user_id !== user_id) throw createHttpError(403, "You cannot delete a parcel you do not own.");

  const [payment] = await pool.query("SELECT payment_id FROM Payment WHERE parcel_id = ?", [parcel_id]);
  if (payment.length > 0) {
    throw createHttpError(400, "A paid parcel cannot be deleted.");
  }

  await pool.query("DELETE FROM Parcel WHERE parcel_id = ?", [parcel_id]);
};

export const parcelService = { createParcel, getParcelById, listParcelsForUser, deleteParcel, mapParcelRow, PARCEL_SELECT };
