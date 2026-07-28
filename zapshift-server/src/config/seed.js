import { pool } from "./db.js";


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

const nextId = async (table, idColumn, prefix, pad = 3) => {
  const [rows] = await pool.query(
    `SELECT ${idColumn} FROM ${table} ORDER BY ${idColumn} DESC LIMIT 1`
  );

  if (rows.length === 0) {
    return `${prefix}${"1".padStart(pad, "0")}`;
  }

  const lastNum =
    parseInt(rows[0][idColumn].replace(prefix, ""), 10) || 0;

  return `${prefix}${String(lastNum + 1).padStart(pad, "0")}`;
};

export const seedDatabase = async () => {
  const [regionRows] = await pool.query(
    "SELECT COUNT(*) AS count FROM Region"
  );

  if (Number(regionRows[0].count) === 0) {
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
};

export { nextId };