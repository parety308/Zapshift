import createHttpError from "http-errors";
import Stripe from "stripe";
import { pool } from "../../config/db.js";
import { generateId } from "../../utils/generateId.js";
import env from "../../config/env.js";
import { parcelService } from "../parcels/parcel.service.js";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

const assertStripeConfigured = () => {
  if (!stripe) {
    throw createHttpError(500, "Payments are not configured on the server (missing STRIPE_SECRET_KEY).");
  }
};

const createCheckoutSession = async (user_id, parcelId) => {
  assertStripeConfigured();

  const parcel = await parcelService.getParcelById(parcelId);
  if (parcel.paymentStatus === "paid") {
    throw createHttpError(400, "This parcel has already been paid for.");
  }

  const [ownerRows] = await pool.query("SELECT user_id FROM Parcel WHERE parcel_id = ?", [parcelId]);
  if (ownerRows.length === 0 || ownerRows[0].user_id !== user_id) {
    throw createHttpError(403, "You cannot pay for a parcel you do not own.");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: parcel.parcelName },
          unit_amount: Math.round(parcel.cost * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { parcelId },
    success_url: `${env.CLIENT_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.CLIENT_URL}/dashboard/my-parcels`,
  });

  return { url: session.url };
};

const confirmPayment = async (session_id) => {
  assertStripeConfigured();
  if (!session_id) throw createHttpError(400, "Missing session_id");

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") {
    throw createHttpError(400, "Payment has not completed yet.");
  }

  const parcelId = session.metadata.parcelId;

  const [existing] = await pool.query("SELECT payment_id FROM Payment WHERE parcel_id = ?", [parcelId]);
  if (existing.length > 0) {
    return { transactionId: existing[0].payment_id, trackingId: parcelId };
  }

  const payment_id = await generateId("Payment", "payment_id", "PY", 3);
  const amount = (session.amount_total || 0) / 100;

  await pool.query(
    `INSERT INTO Payment (payment_id, amount, payment_method, payment_status, parcel_id)
     VALUES (?, ?, ?, ?, ?)`,
    [payment_id, amount, "Online", "Paid", parcelId]
  );

  return { transactionId: payment_id, trackingId: parcelId };
};

const listPaymentsForUser = async (user_id) => {
  const [rows] = await pool.query(
    `SELECT pay.payment_id, pay.amount, pay.payment_method, pay.payment_status,
            p.parcel_id, p.parcel_type, dst.district AS destination_district
     FROM Payment pay
     JOIN Parcel p ON pay.parcel_id = p.parcel_id
     JOIN Region dst ON p.parcel_destination = dst.region_id
     WHERE p.user_id = ?
     ORDER BY pay.payment_id DESC`,
    [user_id]
  );

  return rows.map((row) => ({
    _id: row.payment_id,
    transactionId: row.payment_id,
    name: `${row.parcel_type} parcel to ${row.destination_district}`,
    amount: Number(row.amount),
    method: row.payment_method,
    status: row.payment_status,
    parcelId: row.parcel_id,
  }));
};

export const paymentService = { createCheckoutSession, confirmPayment, listPaymentsForUser };
