import { pool } from "../../config/db.js";

const listPricingRules = async () => {
  const [rows] = await pool.query("SELECT * FROM Pricing_rule ORDER BY min_weight ASC");
  return rows;
};

/**
 * Resolves the pricing tier for a given weight. If the weight exceeds the
 * highest seeded tier, extrapolates using the top tier's price plus a
 * per-kg surcharge for the extra weight (keeps the original app's
 * incremental-pricing feel while still anchoring on the DB tiers).
 */
const resolvePricingForWeight = async (weight) => {
  const rules = await listPricingRules();
  if (rules.length === 0) {
    throw new Error("No pricing rules configured");
  }

  const match = rules.find((r) => weight >= r.min_weight && weight <= r.max_weight);
  if (match) {
    return { pricing_id: match.pricing_id, delivery_price: Number(match.delivery_price) };
  }

  const top = rules[rules.length - 1];
  if (weight > top.max_weight) {
    const extraKg = Math.ceil(weight - top.max_weight);
    const price = Number(top.delivery_price) + extraKg * 40;
    return { pricing_id: top.pricing_id, delivery_price: price };
  }

  const bottom = rules[0];
  return { pricing_id: bottom.pricing_id, delivery_price: Number(bottom.delivery_price) };
};

export const pricingService = { listPricingRules, resolvePricingForWeight };
