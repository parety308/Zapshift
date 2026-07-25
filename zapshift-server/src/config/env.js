import dotenv from "dotenv";
dotenv.config();

const val = (name, fallback) => process.env[name] ?? fallback;

const env = {
  NODE_ENV: val("NODE_ENV", "development"),
  PORT: Number(val("PORT", 3000)),
  CLIENT_URL: val("CLIENT_URL", "http://localhost:5173"),

  DB_HOST: val("DB_HOST", "localhost"),
  DB_PORT: Number(val("DB_PORT", 3306)),
  DB_USER: val("DB_USER", "root"),
  DB_PASSWORD: val("DB_PASSWORD", ""),
  DB_NAME: val("DB_NAME", "zapshift_db"),

  JWT_SECRET: val("JWT_SECRET", "dev-secret-change-me"),
  JWT_EXPIRES_IN: val("JWT_EXPIRES_IN", "7d"),

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};

export default env;
