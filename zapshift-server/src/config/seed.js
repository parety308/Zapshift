import { pool } from "./db.js";
import bcrypt from "bcryptjs";

/**
 * Seeds baseline reference data the app needs to function on a fresh
 * database: service-area Regions (division + district), a default Admin
 * (needed as a FK target for Rider rows), and the delivery Pricing_rule
 * tiers. Safe to run every boot — it only inserts rows that do not exist.
 */

// Same division/district pairs used by the client's coverage map, kept in
// sync manually since Region has no lat/long columns (those stay static
// on the client for the map UI only).

const REGIONS = [
  ["Dhaka", "Dhaka"],
  ["Dhaka", "Faridpur"],
  ["Dhaka", "Gazipur"],
  ["Dhaka", "Gopalganj"],
  ["Dhaka", "Kishoreganj"],
  ["Dhaka", "Madaripur"],
  ["Dhaka", "Manikganj"],
  ["Dhaka", "Munshiganj"],
  ["Dhaka", "Narayanganj"],
  ["Dhaka", "Narsingdi"],
  ["Dhaka", "Rajbari"],
  ["Dhaka", "Shariatpur"],
  ["Dhaka", "Tangail"],
  ["Chattogram", "Chattogram"],
  ["Chattogram", "Cox's Bazar"],
  ["Chattogram", "Cumilla"],
  ["Chattogram", "Brahmanbaria"],
  ["Chattogram", "Chandpur"],
  ["Chattogram", "Feni"],
  ["Chattogram", "Khagrachari"],
  ["Chattogram", "Lakshmipur"],
  ["Chattogram", "Noakhali"],
  ["Chattogram", "Rangamati"],
  ["Chattogram", "Bandarban"],
  ["Sylhet", "Sylhet"],
  ["Sylhet", "Moulvibazar"],
  ["Sylhet", "Habiganj"],
  ["Sylhet", "Sunamganj"],
  ["Rangpur", "Rangpur"],
  ["Rangpur", "Dinajpur"],
  ["Rangpur", "Thakurgaon"],
  ["Rangpur", "Panchagarh"],
  ["Rangpur", "Nilphamari"],
  ["Rangpur", "Lalmonirhat"],
  ["Rangpur", "Kurigram"],
  ["Rangpur", "Gaibandha"],
  ["Khulna", "Khulna"],
  ["Khulna", "Jessore"],
  ["Khulna", "Satkhira"],
  ["Khulna", "Bagerhat"],
  ["Khulna", "Magura"],
  ["Khulna", "Narail"],
  ["Khulna", "Jhenaidah"],
  ["Khulna", "Chuadanga"],
  ["Khulna", "Meherpur"],
  ["Khulna", "Kushtia"],
  ["Rajshahi", "Rajshahi"],
  ["Rajshahi", "Natore"],
  ["Rajshahi", "Naogaon"],
  ["Rajshahi", "Chapainawabganj"],
  ["Rajshahi", "Pabna"],
  ["Rajshahi", "Sirajganj"],
  ["Rajshahi", "Joypurhat"],
  ["Rajshahi", "Bogura"],
  ["Barishal", "Barishal"],
  ["Barishal", "Bhola"],
  ["Barishal", "Patuakhali"],
  ["Barishal", "Pirojpur"],
  ["Barishal", "Barguna"],
  ["Barishal", "Jhalokati"],
  ["Mymensingh", "Mymensingh"],
  ["Mymensingh", "Netrokona"],
  ["Mymensingh", "Jamalpur"],
  ["Mymensingh", "Sherpur"]
];

const PRICING_RULES = [
  { min: 1, max: 5, price: 50 },
  { min: 6, max: 10, price: 70 },
  { min: 11, max: 15, price: 100 },
];

const nextId = async (table, idColumn, prefix, pad = 3) => {
  const [rows] = await pool.query(`SELECT ${idColumn} FROM ${table} ORDER BY ${idColumn} DESC LIMIT 1`);
  if (rows.length === 0) return `${prefix}${"1".padStart(pad, "0")}`;
  const lastNum = parseInt(rows[0][idColumn].replace(prefix, ""), 10) || 0;
  return `${prefix}${String(lastNum + 1).padStart(pad, "0")}`;
};

export const seedDatabase = async () => {
  // Regions
  const [regionRows] = await pool.query("SELECT COUNT(*) as count FROM Region");
  if (regionRows[0].count === 0) {
    let id = 1;
    for (const [division, district] of REGIONS) {
      const region_id = `RG${String(id).padStart(3, "0")}`;
      await pool.query(
        "INSERT INTO Region (region_id, division, district) VALUES (?, ?, ?)",
        [region_id, division, district]
      );
      id++;
    }
    console.log(`Seeded ${REGIONS.length} regions`);
  }

  // Default Admin (needed so Riders have a valid admin_id to attach to)
  const [adminRows] = await pool.query(
    "SELECT COUNT(*) as count FROM Admin"
  );
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  if (Number(adminRows[0].count) === 0) {
    // First create user
    await pool.query(
      `
  INSERT INTO User
  (user_id, full_name, email, password, role)
  VALUES (?, ?, ?, ?, ?)
  `,
      [
        "U001",
        "Parvez",
        "parvez@example.com",
        hashedPassword,
        "admin"
      ]
    );


    // Then create admin reference
    await pool.query(
      `
  INSERT INTO Admin
  (admin_id, user_id)
  VALUES (?, ?)
  `,
      [
        "AD001",
        "U001"
      ]
    );

    console.log("Seeded default admin");
  }
  // Pricing rules
  const [pricingRows] = await pool.query("SELECT COUNT(*) as count FROM Pricing_rule");
  if (pricingRows[0].count === 0) {
    let id = 1;
    for (const rule of PRICING_RULES) {
      const pricing_id = `PR${String(id).padStart(3, "0")}`;
      await pool.query(
        "INSERT INTO Pricing_rule (pricing_id, min_weight, max_weight, delivery_price) VALUES (?, ?, ?, ?)",
        [pricing_id, rule.min, rule.max, rule.price]
      );
      id++;
    }
    console.log(`Seeded ${PRICING_RULES.length} pricing rules`);
  }
};

export const getDefaultAdminId = async () => {
  const [rows] = await pool.query("SELECT admin_id FROM Admin ORDER BY admin_id ASC LIMIT 1");
  return rows[0]?.admin_id;
};

export { nextId };
