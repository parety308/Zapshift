import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initializeDatabase } from "./config/databaseInit.js";

const startServer = async () => {
  await connectDB();
  await initializeDatabase();
  app.listen(env.PORT, () => {
    console.log(
      `Zapshift Server running on http://localhost:${env.PORT}`
    );
  });
};

startServer();