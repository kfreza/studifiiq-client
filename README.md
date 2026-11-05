# Studifiiq

A peer-to-peer marketplace for creative workspaces. Studio owners list photo studios, film stages, podcast lounges, music suites and art workshops, and creators find, compare and book them by the hour.

**Live site:** https://studifiiq-client.vercel.app
**API server:** https://studifiiq-server.vercel.app
**Server repository:** https://github.com/kfreza/studifiiq-server

## Examiner login

| Email | Password |
|---|---|
| `examiner@studifiiq-client.vercel.app` | `Examiner123` |

This account hosts 8 studios and already has bookings in every status, incoming requests, and saved studios, so every page has data to review. Google sign-in works with any Google account.

## Features

- **Explore and filter studios:** search by name, city or type, filter by category, sort by newest, rating or price, with pagination and empty states.
- **Studio details:** photo gallery carousel, specifications, amenities, host card and reviews from creators who booked the space.
- **Hourly booking with double-booking prevention:** the booking modal shows live availability and a price breakdown. The server rejects any request that overlaps a confirmed booking, and checks again when the host confirms.
- **Host dashboard:** listing, booking and earnings stats, plus a requests table where hosts confirm or decline each booking.
- **Listing management:** add a studio with image upload (imgbb), update it with a pre-filled form, or delete it behind a confirmation dialog.
- **My Bookings:** status badges (Pending, Confirmed, Completed, Cancelled), status filters, cancellation for pending requests, and a downloadable **PDF invoice** for confirmed bookings.
- **Saved studios:** a heart on every studio card saves it to a personal wishlist stored in MongoDB.
- **Reviews:** creators with a confirmed or completed booking can leave one star-rated review per studio, and the studio rating updates.
- **Secure auth:** email/password and Google sign-in with BetterAuth. Server mutations are protected by a JWT in an HTTP-only cookie and return 401 without it. Private routes survive a page reload.
- **Light and dark themes** across the whole site, and a responsive layout for mobile, tablet and desktop.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| UI libraries | Swiper, Sonner toasts, lucide-react and react-icons, next-themes, jsPDF |
| Auth | BetterAuth with the MongoDB adapter, Google OAuth, JWT in an HTTP-only cookie |
| Backend | Express 5, MongoDB driver, jsonwebtoken, cookie-parser |
| Database | MongoDB Atlas |
| Images | imgbb API |
| Hosting | Vercel (client and server) |

## Run it locally

You need Node.js 20+, a MongoDB Atlas database, an imgbb API key, and a Google OAuth client.

**1. Server** ([studifiiq-server](https://github.com/kfreza/studifiiq-server))

```bash
git clone https://github.com/kfreza/studifiiq-server.git
cd studifiiq-server
npm install
cp .env.example .env    # fill in the values
npm run seed            # optional: demo studios, reviews and bookings
npm run dev             # http://localhost:5000
```

**2. Client** (this repository)

```bash
git clone https://github.com/kfreza/studifiiq-client.git
cd studifiiq-client
npm install
cp .env.example .env.local    # fill in the values
npm run dev                   # http://localhost:3000
```

**Client environment variables**

| Variable | Purpose |
|---|---|
| `CS_API_URL` | Express server URL, e.g. `http://localhost:5000` |
| `CS_MONGODB_URI` | MongoDB connection string (same database as the server) |
| `CS_DB_NAME` | Database name, e.g. `studioSpaceDB` |
| `BETTER_AUTH_SECRET` | Long random string for signing sessions |
| `BETTER_AUTH_URL` | Client URL, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth client. Add `<client URL>/api/auth/callback/google` as a redirect URI. |

In the browser, every `/api/*` request goes to the Next.js app, which forwards it to the Express server. Cookies therefore stay on one domain, and the JWT cookie works without cross-site settings.
