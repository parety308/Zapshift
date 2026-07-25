import { pool } from "./db.js";

/**
 * SCHEMA SOURCE OF TRUTH
 * -----------------------
 * This mirrors the normalized schema exactly as provided (Region, Admin, User,
 * Rider, Pricing_rule, Parcel, Payment). Do NOT add/remove columns here —
 * every other part of the backend adapts to this shape, not the other way
 * around.
 */
export const initializeDatabase = async () => {
  try {
    // Region
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Region (
        region_id VARCHAR(10) PRIMARY KEY,
        division VARCHAR(50) NOT NULL,
        district VARCHAR(50) NOT NULL
      )
    `);

    // Admin
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Admin (
        admin_id VARCHAR(10) PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      )
    `);

    // User
    await pool.query(`
      CREATE TABLE IF NOT EXISTS User (
        user_id VARCHAR(10) PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Rider
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Rider (
        rider_id VARCHAR(10) PRIMARY KEY,
        vehicle_type VARCHAR(20) NOT NULL,
        availability_status VARCHAR(20) NOT NULL,
        user_id VARCHAR(10) NOT NULL,
        region_id VARCHAR(10) NOT NULL,
        admin_id VARCHAR(10) NOT NULL,

        FOREIGN KEY(user_id) REFERENCES User(user_id),
        FOREIGN KEY(region_id) REFERENCES Region(region_id),
        FOREIGN KEY(admin_id) REFERENCES Admin(admin_id)
      )
    `);

    // Pricing Rule
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Pricing_rule (
        pricing_id VARCHAR(10) PRIMARY KEY,
        min_weight DECIMAL(6,2) NOT NULL,
        max_weight DECIMAL(6,2) NOT NULL,
        delivery_price DECIMAL(10,2) NOT NULL,

        CHECK(max_weight >= min_weight)
      )
    `);

    // Parcel
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Parcel (
        parcel_id VARCHAR(10) PRIMARY KEY,
        weight DECIMAL(6,2) NOT NULL,
        parcel_source VARCHAR(10) NOT NULL,
        parcel_destination VARCHAR(10) NOT NULL,
        parcel_type VARCHAR(20) NOT NULL,

        user_id VARCHAR(10) NOT NULL,
        rider_id VARCHAR(10),
        pricing_id VARCHAR(10) NOT NULL,

        parcel_status VARCHAR(20) NOT NULL,

        FOREIGN KEY(user_id) REFERENCES User(user_id),
        FOREIGN KEY(rider_id) REFERENCES Rider(rider_id),
        FOREIGN KEY(pricing_id) REFERENCES Pricing_rule(pricing_id)
      )
    `);

    // Payment
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Payment (
        payment_id VARCHAR(10) PRIMARY KEY,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(30) NOT NULL,
        payment_status VARCHAR(20) NOT NULL,

        parcel_id VARCHAR(10) UNIQUE NOT NULL,

        FOREIGN KEY(parcel_id) REFERENCES Parcel(parcel_id)
      )
    `);

    console.log("Database tables checked successfully");
  } catch (error) {
    console.error("Database initialization failed");
    console.error(error.message);
    process.exit(1);
  }
};
