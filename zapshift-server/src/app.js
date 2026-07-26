import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { userRouter } from "./modules/users/user.route.js";
import { regionRouter } from "./modules/regions/region.route.js";
import { pricingRouter } from "./modules/pricing/pricing.route.js";
import { riderRouter } from "./modules/riders/rider.route.js";
import { parcelRouter } from "./modules/parcels/parcel.route.js";
import { paymentRouter } from "./modules/payments/payment.route.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ZapShift Server is Running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/regions", regionRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/riders", riderRouter);
app.use("/api/parcel", parcelRouter);
app.use("/api/payments", paymentRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
