import createHttpError from "http-errors";
import { pool } from "../../config/db.js";
import { generateId } from "../../utils/generateId.js";
import { regionService } from "../regions/region.service.js";
import { getDefaultAdminId } from "../../config/seed.js";

/**
 * Apply as Rider
 */
const applyAsRider = async (
    user_id,
    {
        vehicleType,
        division,
        district
    }
) => {

    // Already applied?
    const [existing] = await pool.query(
        `
        SELECT rider_id
        FROM Rider
        WHERE user_id=?
        `,
        [user_id]
    );

    if (existing.length) {
        throw createHttpError(
            409,
            "You have already applied as a rider."
        );
    }

    // Create / Find Region
    const region =
        await regionService.findOrCreateRegion(
            division,
            district
        );

    const admin_id = await getDefaultAdminId();

    if (!admin_id) {
        throw createHttpError(
            500,
            "No admin found."
        );
    }

    const rider_id = await generateId(
        "Rider",
        "rider_id",
        "RD",
        3
    );

    await pool.query(
        `
        INSERT INTO Rider
        (
            rider_id,
            vehicle_type,
            availability_status,
            user_id,
            region_id,
            admin_id
        )

        VALUES
        (
            ?,?,?,?,?,?
        )
        `,
        [
            rider_id,
            vehicleType,
            "available",
            user_id,
            region.region_id,
            admin_id
        ]
    );

    return await getRiderByUserId(user_id);

};


/**
 * Rider Profile
 */

const getRiderByUserId = async (
    user_id
) => {

    const [rows] = await pool.query(
        `
        SELECT

            r.*,

            rg.division,

            rg.district,

            u.full_name,

            u.email

        FROM Rider r

        JOIN Region rg
        ON rg.region_id=r.region_id

        JOIN User u
        ON u.user_id=r.user_id

        WHERE r.user_id=?
        `,
        [user_id]
    );

    return rows[0] || null;

};


/**
 * All Riders
 */

const listRiders = async () => {

    const [rows] = await pool.query(
        `
        SELECT

            r.rider_id,

            u.full_name,

            u.email,

            r.vehicle_type,

            r.availability_status,

            rg.division,

            rg.district

        FROM Rider r

        JOIN User u
        ON u.user_id=r.user_id

        JOIN Region rg
        ON rg.region_id=r.region_id

        ORDER BY r.rider_id
        `
    );

    return rows;

};


/**
 * Active Riders
 */

const activeRiders = async () => {

    const [rows] = await pool.query(
        `
        SELECT

            r.rider_id,

            u.full_name,

            u.email,

            r.vehicle_type,

            r.availability_status,

            rg.division,

            rg.district

        FROM Rider r

        JOIN User u
        ON u.user_id=r.user_id

        JOIN Region rg
        ON rg.region_id=r.region_id

        WHERE r.availability_status='active'

        ORDER BY u.full_name
        `
    );

    return rows;

};


/**
 * Approve Rider
 */

const approveRider = async (
    rider_id
) => {

    const [exist] = await pool.query(
        `
        SELECT rider_id
        FROM Rider
        WHERE rider_id=?
        `,
        [rider_id]
    );

    if (!exist.length) {

        throw createHttpError(
            404,
            "Rider not found."
        );

    }

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


/**
 * Remove Rider
 */

const removeRider = async (
    rider_id
) => {

    const [exist] = await pool.query(
        `
        SELECT rider_id

        FROM Rider

        WHERE rider_id=?
        `,
        [rider_id]
    );

    if (!exist.length) {

        throw createHttpError(
            404,
            "Rider not found."
        );

    }

    await pool.query(
        `
        DELETE FROM Rider

        WHERE rider_id=?
        `,
        [rider_id]
    );

};

/**
 * Get Unassigned Parcels
 */
const getUnassignedParcels = async () => {

    const [rows] = await pool.query(
        `
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
            ON u.user_id = p.user_id

        JOIN Region rs
            ON rs.region_id = p.parcel_source

        JOIN Region rd
            ON rd.region_id = p.parcel_destination

        WHERE
            p.rider_id IS NULL

        ORDER BY p.parcel_id
        `
    );

    return rows;

};


/**
 * Assign Rider
 */
const assignRider = async (
    parcel_id,
    rider_id
) => {

    // Rider exists?
    const [rider] = await pool.query(
        `
        SELECT *

        FROM Rider

        WHERE
            rider_id=?
        AND
            availability_status='active'
        `,
        [rider_id]
    );

    if (!rider.length) {

        throw createHttpError(
            404,
            "Active rider not found."
        );

    }

    // Parcel exists?
    const [parcel] = await pool.query(
        `
        SELECT *

        FROM Parcel

        WHERE parcel_id=?
        `,
        [parcel_id]
    );

    if (!parcel.length) {

        throw createHttpError(
            404,
            "Parcel not found."
        );

    }

    // Already assigned?
    if (parcel[0].rider_id) {

        throw createHttpError(
            400,
            "Parcel already assigned."
        );

    }

    await pool.query(
        `
        UPDATE Parcel

        SET

            rider_id=?,
            parcel_status='Assigned'

        WHERE parcel_id=?
        `,
        [
            rider_id,
            parcel_id
        ]
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


/**
 * Assigned Parcels
 */
const getAssignedParcels = async (
    rider_id
) => {

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
            ON u.user_id = p.user_id

        WHERE
            p.rider_id=?

        ORDER BY p.parcel_id
        `,
        [rider_id]
    );

    return rows;

};


/**
 * Pending Deliveries
 */
const getPendingDeliveries = async (
    user_id
) => {

    const [rider] = await pool.query(
        `
        SELECT rider_id

        FROM Rider

        WHERE user_id=?
        `,
        [user_id]
    );

    if (!rider.length) {

        return [];

    }

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
            ON u.user_id=p.user_id

        WHERE

            p.rider_id=?

        AND

            p.parcel_status='Assigned'

        ORDER BY p.parcel_id
        `,
        [riderId]
    );

    return rows;

};


/**
 * Mark Parcel Delivered
 */
const markDelivered = async (
    parcelId
) => {

    const [parcel] = await pool.query(
        `
        SELECT *

        FROM Parcel

        WHERE parcel_id=?
        `,
        [parcelId]
    );

    if (!parcel.length) {

        throw createHttpError(
            404,
            "Parcel not found."
        );

    }

    if (parcel[0].parcel_status === "Delivered") {

        throw createHttpError(
            400,
            "Parcel already delivered."
        );

    }

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

/**
 * Completed Deliveries
 */
const getCompletedDeliveries = async (
    user_id
) => {

    const [rider] = await pool.query(
        `
        SELECT rider_id

        FROM Rider

        WHERE user_id=?
        `,
        [user_id]
    );

    if (!rider.length) {

        return [];

    }

    const riderId = rider[0].rider_id;

    const [rows] = await pool.query(
        `
        SELECT

            p.parcel_id,

            p.weight,

            p.parcel_type,

            p.parcel_status,

            u.full_name,

            pay.amount

        FROM Parcel p

        JOIN User u
            ON u.user_id = p.user_id

        LEFT JOIN Payment pay
            ON pay.parcel_id = p.parcel_id

        WHERE

            p.rider_id=?

        AND

            p.parcel_status='Delivered'

        ORDER BY p.parcel_id DESC
        `,
        [riderId]
    );

    return rows;

};


/**
 * Rider Earnings
 */
const getMyEarnings = async (
    user_id
) => {

    const [rider] = await pool.query(
        `
        SELECT rider_id

        FROM Rider

        WHERE user_id=?
        `,
        [user_id]
    );

    if (!rider.length) {

        return {

            totalEarned: 0,

            thisMonth: 0,

            deliveriesCompleted: 0,

            pendingPayout: 0,

            history: []

        };

    }

    const riderId = rider[0].rider_id;

    const [history] = await pool.query(
        `
        SELECT

            p.parcel_id,

            pay.amount,

            pay.payment_method,

            pay.payment_status

        FROM Parcel p

        JOIN Payment pay
            ON pay.parcel_id = p.parcel_id

        WHERE

            p.rider_id=?

        AND

            p.parcel_status='Delivered'

        ORDER BY p.parcel_id DESC
        `,
        [riderId]
    );

    const totalEarned = history.reduce(

        (sum, item) => sum + Number(item.amount),

        0

    );

    return {

        totalEarned,

        thisMonth: totalEarned,

        deliveriesCompleted: history.length,

        pendingPayout: 0,

        history

    };

};


/**
 * Export
 */

export const riderService = {

    applyAsRider,

    getRiderByUserId,

    listRiders,

    activeRiders,

    approveRider,

    removeRider,

    getUnassignedParcels,

    assignRider,

    getAssignedParcels,

    getPendingDeliveries,

    markDelivered,

    getCompletedDeliveries,

    getMyEarnings

};