# ZapShift — Full-Stack Parcel Delivery Platform

A complete parcel-delivery web app: React (Vite) frontend, Express/Node backend,
MySQL database, JWT email/password auth, and Stripe checkout — wired end to
end against the normalized schema you supplied (Region, Admin, User, Rider,
Pricing_rule, Parcel, Payment).

---

## 1. Project Structure

```
zapshift-server/         Express API (JWT auth, MySQL, Stripe)
  src/
    config/               env, MySQL pool, schema DDL, reference-data seeding
    middlewares/          auth guard, validation, error handling
    modules/
      auth/                register / login / me
      users/               profile
      regions/             division + district lookup (Region table)
      pricing/             weight-tier lookup (Pricing_rule table)
      riders/              rider applications (Rider table)
      parcels/             parcel booking + listing (Parcel table)
      payments/            Stripe checkout + Payment table
    app.js / server.js
zapshift-client/         React 19 + Vite + Tailwind/DaisyUI frontend
  src/
    Context/AuthProvider   real JWT auth (replaces the old mock)
    hooks/useAxiosSecure    attaches JWT, auto-logout on 401/403
    Pages/, component/, Routes/
```

## 2. Why some frontend fields changed

The schema you gave is intentionally minimal/normalized. A few UI fields in
the original mockup (parcel name, receiver name/phone/address) have **no
column anywhere in the schema**, and the instructions were to keep the schema
as the source of truth rather than add columns. So:

- **Sender info** is *not* duplicated on Parcel — it is already available via
  `Parcel.user_id -> User.full_name/email`, which is the correct normalized
  design (this is why those fields were removed from the Send Parcel form).
- **Receiver name/phone/address** and **parcel name** have been dropped from
  the form because there is nowhere to persist them. If you want that data
  tracked later, the clean way is a new `Receiver` table (parcel_id, name,
  phone, address) — left as a documented extension rather than an
  unrequested schema change.
- `parcel_source` / `parcel_destination` reference `Region.region_id`. Regions
  are looked up by (division, district) and auto-created on first use; they
  are also pre-seeded on server boot from the same division/district pairs
  the Coverage map uses (see `src/config/seed.js`).
- Latitude/longitude/covered-area for the map are **not** in the schema, so
  they intentionally stay as static public JSON on the client
  (`public/serviceCenters.json`) — purely presentational map data, not
  business data.
- `Pricing_rule` (weight tiers 1-5 / 6-10 / 11-15 kg) is the source of truth
  for parcel cost. The server resolves the matching tier (or extrapolates a
  per-kg surcharge past the top tier) and stores `pricing_id` on the Parcel.
- `Payment` has no `paid_at`/transaction-reference column, so Payment
  History shows `payment_id` as the transaction id and derives the "name"
  column from the parcel's type + destination rather than a stored name.

## 3. Prerequisites

- Node.js 18+
- MySQL 8+ (or MariaDB 10.5+)
- A Stripe account (test mode is fine) for the payment feature

## 4. MySQL Setup

```sql
CREATE DATABASE zapshift_db;
```

No manual table import is needed — `zapshift-server/src/config/databaseInit.js`
creates all tables (`Region, Admin, User, Rider, Pricing_rule, Parcel, Payment`)
with `CREATE TABLE IF NOT EXISTS` on every boot, exactly matching your schema.
`src/config/seed.js` then seeds baseline reference rows (regions, one default
admin, the 3 pricing tiers) the first time those tables are empty.

## 5. Environment Variables

### `zapshift-server/.env` (copy from `.env.example`)

| Variable | Description |
|---|---|
| `PORT` | API port, default `3000` |
| `CLIENT_URL` | Frontend origin, used for CORS + Stripe redirect URLs |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode: `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Only needed if you add a webhook endpoint later |

### `zapshift-client/.env` (copy from `.env.example`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api` in development |

## 6. Install & Run (Development)

```bash
# Backend
cd zapshift-server
cp .env.example .env      # then fill in DB_PASSWORD, JWT_SECRET, STRIPE_SECRET_KEY
npm install
npm run dev                # nodemon, http://localhost:3000

# Frontend (new terminal)
cd zapshift-client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

On first boot the server logs:
```
MySQL Connected Successfully
Database tables checked successfully
Seeded 18 regions
Seeded default admin
Seeded 3 pricing rules
ZapShift Server running on http://localhost:3000
```

> **Note:** copy your existing `zapshift-client/src/assets/*` image folder
> into the new client folder — images are unchanged and were not
> regenerated here since they are binary files, not text.

## 7. API Reference

All routes are prefixed with `/api`. Protected routes require
`Authorization: Bearer <token>`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | – | `{ name, email, password }` → `{ user, token }` |
| POST | `/auth/login` | – | `{ email, password }` → `{ user, token }` |
| GET | `/auth/me` | required | current user |
| GET | `/users/me` | required | profile |
| PATCH | `/users/me` | required | `{ name }` |
| GET | `/regions` | – | all Region rows |
| GET | `/pricing` | – | all Pricing_rule rows |
| POST | `/riders/apply` | required | `{ vehicleType, division, district }` |
| GET | `/riders/me` | required | your rider application, if any |
| GET | `/riders` | required | list riders |
| POST | `/parcels` | required | `{ weight, parcelType, senderRegion, senderDistrict, receiverRegion, receiverDistrict }` |
| GET | `/parcels` | required | your parcels |
| GET | `/parcels/:id` | required | one parcel |
| DELETE | `/parcels/:id` | required | delete (blocked once paid) |
| POST | `/payments/create-checkout-session` | required | `{ parcelId }` → Stripe Checkout URL |
| PATCH | `/payments/payment-success?session_id=...` | required | confirms payment, writes `Payment` row |
| GET | `/payments` | required | your payment history |

## 8. Validation, Auth & Errors

- **Validation:** Zod schemas on register/login/parcel/rider bodies
  (`middlewares/validate.middleware.js`).
- **Auth:** bcrypt-hashed passwords, JWT bearer tokens (`middlewares/auth.middleware.js`).
  The client stores the token in `localStorage` and `useAxiosSecure` attaches
  it to every request; a `401`/`403` triggers an automatic logout + redirect
  to `/auth/login`.
- **Authorization:** parcel delete/read enforces `Parcel.user_id === req.user.user_id`;
  paid parcels cannot be deleted.
- **Errors:** a single `errorMiddleware` turns thrown `http-errors` (and MySQL
  FK/duplicate errors) into consistent JSON `{ success, statusCode, message }`.

## 9. Build & Production Deployment

### Backend
```bash
cd zapshift-server
npm install --omit=dev
NODE_ENV=production npm start
```
Run behind a process manager (`pm2 start src/server.js --name zapshift-api`)
and a reverse proxy (Nginx) that terminates TLS and forwards to the API port.
Set `CLIENT_URL` to your deployed frontend origin so CORS works.

### Frontend
```bash
cd zapshift-client
npm install
npm run build        # outputs dist/
npm run preview       # sanity-check the production build locally
```
Deploy the `dist/` folder to any static host (Netlify, Vercel static, Nginx,
S3+CloudFront). Set `VITE_API_BASE_URL` to your deployed API's `/api` URL at
build time.

### Stripe in production
Switch `STRIPE_SECRET_KEY` to a live key, and update the success/cancel URLs
implicitly via `CLIENT_URL`.

## 10. Troubleshooting

| Symptom | Fix |
|---|---|
| `MySQL Connection Failed` on boot | Check `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME` and that MySQL is running; confirm the database exists. |
| CORS error in browser console | `CLIENT_URL` in the server `.env` must exactly match the origin the frontend is served from (protocol+host+port). |
| `401` immediately after login | Confirm `VITE_API_BASE_URL` points at `.../api` (not just the host) and that the browser actually stored `zapshift-token` in localStorage. |
| Stripe checkout 500s | `STRIPE_SECRET_KEY` missing/invalid in server `.env`. |
| "No admin is configured to approve riders yet" | The `Admin` table was emptied manually; restart the server so `seed.js` re-inserts the default admin, or insert one yourself. |
| Parcel creation 400s on region | `senderRegion/senderDistrict/receiverRegion/receiverDistrict` must match values from `public/serviceCenters.json`; unseen districts are auto-added to `Region`. |

## 11. What Was Intentionally Not Changed

- The database DDL (`databaseInit.js`) is byte-for-byte your schema.
- The overall page layout, DaisyUI styling, and navigation are unchanged.
- Coverage map, banners, services, reviews, brand marquee are unchanged.
