import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initializeDatabase } from "./config/databaseInit.js";
import { seedDatabase } from "./config/seed.js";

const startServer = async () => {
  await connectDB();
  await initializeDatabase();
  await seedDatabase();
  app.listen(env.PORT, () => {
    console.log(`ZapShift Server running on http://localhost:${env.PORT}`);
  });
};

startServer();
