# Cinema SkinFX

A Next.js storefront and admin inventory system for Cinema SkinFX, a skincare shop powered by CosmetiCore.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-6.8.2-2D3748)
![SQL Server](https://img.shields.io/badge/SQL%20Server-via%20Prisma-CC2927)

The runnable app lives in [`cinema-fx-next`](./cinema-fx-next). The package name is `cinema-fx-next` (`0.1.0`). The storefront calls itself Cinema SkinFX (page title `CinemaFX`). The admin login calls itself an Inventory Management System by CosmetiCore.

## Overview

Cinema SkinFX lets shoppers browse skincare products, keep a cart as a guest or as a signed-in customer, and place an order that updates stock. Staff with the `admin` role get a separate login and a dashboard for products, transactions, deliveries, and users.

The project is a full-stack Next.js app (Pages Router) backed by Microsoft SQL Server through Prisma. Passwords are hashed with bcrypt. Sessions are JWTs issued by NextAuth.

## Demo / Screenshots

Screenshots are not in the repo yet. Capture them after the app is running and drop the files in `docs/`.

![Home and featured slideshow](./docs/home.png)

Home page: hero, featured-product slideshow, and the About section.

![Product catalog](./docs/products.png)

Products page: search, category filter, sort, stock, and add to cart.

![Checkout and receipt](./docs/checkout.png)

Cart, checkout, and the order-placed receipt (including the PDF download).

![Admin dashboard](./docs/admin-dashboard.png)

Admin dashboard charts, the product manager, and the deliveries table.

![Demo](./docs/demo.gif)

Short clip: add a product in admin, then buy it on the storefront.

## Features

### Storefront

- Home page with a hero, a featured-product slideshow (10 second autoplay, previous, next, and pause), an about section, founder copy, and static stats.
- Product catalog loaded on the server. Shoppers can search by name or description, filter by category, and sort by name or price.
- Product cards show a Best Seller badge when `featured` is true, an out-of-stock badge, peso prices, and a quantity stepper capped by stock.
- Guest cart keyed by a `sessionId` stored in `localStorage` and a 30-day cookie.
- Signed-in cart. Guest lines are attached to the user's email when the cart is loaded or an item is added.
- Cart page with quantity changes, a confirm modal before removal, and a live total.
- Checkout for signed-in customers. Username and email are read-only. Phone must be 11 digits. Address can be edited and saved.
- Order placement in a Prisma transaction that decrements stock and writes `inStock`. Status is `SUCCESS` or `FAIL`.
- Order confirmation page that loads the latest successful order and can save a PDF receipt.
- My Orders list with a scrambled order code. Customers can mark an order `COMPLETED` (received).
- Reviews page with rating breakdown, filters (rating, photos only), and sort. The reviews are hardcoded in the page.
- Account registration with client and server validation, a password-strength hint, and an attempt to move the guest cart onto the new email.
- Customer login with email and password. Admin accounts are rejected on this form.
- Profile page to edit username, phone, and address, and to log out.
- Responsive header with a hamburger menu. Account and cart links. My Orders appears only when a session exists.

### Admin

- Separate login at `/admin/login` using username and password. Only users with `role === "admin"` can stay signed in.
- Middleware that rewrites non-admin visits to `/admin/*` as `/404`, sends signed-in customers away from `/admin/login`, and redirects admins away from `/profile` and `/orders`.
- Dashboard charts (Highcharts): orders by status, product count per customer, top seven products by units, and deliveries per day.
- Product manager: list, add (multipart image upload), edit, and delete, each confirmed in a modal.
- Transaction list with a modal of purchased items.
- Deliveries view for orders whose status is `SUCCESS` or `ONGOING`. Marking a row delivered sets the status to `ONGOING`.
- User list with role changes and delete. The signed-in admin cannot delete or change their own row from this page.
- Admin profile editor for username, phone, and address, plus logout back to `/admin/login`.
- Reports page with Excel and PDF buttons for products, deliveries, purchase orders, and users.

## Tech Stack

Versions below are the ones resolved in `cinema-fx-next/package-lock.json`.

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js | 15.3.2 | Pages Router, API routes, `next/image`, `next/font` (Inter) |
| React | 19.1.0 | UI |
| React DOM | 19.1.0 | DOM renderer |
| NextAuth | 4.24.11 | Credentials login and JWT sessions |
| `@next-auth/prisma-adapter` | 1.0.7 | Prisma adapter passed to NextAuth |
| Prisma | 6.8.2 | Schema, migrations, and database client |
| `@prisma/client` | 6.8.2 | Runtime queries |
| SQL Server | provider `sqlserver` | Database (`DATABASE_URL`) |
| bcryptjs | 3.0.2 | Password hashing on register and login |
| formidable | 3.5.4 | Multipart product image uploads |
| Highcharts | 12.2.0 | Admin dashboard charts |
| highcharts-react-official | 3.2.2 | React wrapper for Highcharts |
| html2pdf.js | 0.10.3 | Client-side order receipt PDF |
| react-icons | 5.5.0 | Listed dependency |
| mssql | 11.0.1 | Listed dependency. No import in the app source. Prisma talks to SQL Server itself. |
| ESLint | 9.27.0 | Linting |
| eslint-config-next | 15.3.2 | Next.js lint rules |
| `@eslint/eslintrc` | 3.3.1 | Flat-config compatibility in `eslint.config.mjs` |

There is no TypeScript config and no Tailwind config. Styling is global CSS, CSS Modules, and `styled-jsx`. `jsconfig.json` only sets a path alias.

`uuid` is imported in `pages/products.js` to mint guest cart ids. It is not a direct dependency in `package.json`. It is present in the lockfile as a transitive package (8.3.2).

Both `package-lock.json` (npm) and `bun.lock` are committed. The scripts below use npm.

## Project Structure

```text
CTFDMBSL-main/
├── README.md                          # This file
├── .gitignore                         # Root ignores for .DS_Store, node_modules, .next, .env*
└── cinema-fx-next/                    # The Next.js app
    ├── package.json                   # Scripts and dependencies
    ├── package-lock.json              # npm lockfile
    ├── bun.lock                       # Bun lockfile
    ├── next.config.mjs                # Empty Next.js config
    ├── jsconfig.json                  # Maps @/* to ./src/* (no src/ folder is present)
    ├── eslint.config.mjs              # Extends next/core-web-vitals
    ├── middleware.js                  # Role checks for /admin and a few customer paths
    ├── prisma/
    │   ├── schema.prisma              # User, Product, CartItem, Transaction, OrderItem
    │   └── migrations/                # SQL Server migration history
    ├── pages/
    │   ├── _app.js                    # SessionProvider and Inter font
    │   ├── _document.js               # HTML shell
    │   ├── index.js                   # Home and featured slideshow
    │   ├── products.js                # Catalog, filters, add to cart
    │   ├── cart.js                    # Cart and checkout
    │   ├── order-placed.js            # Receipt and PDF download
    │   ├── my-orders.js               # Customer order history
    │   ├── reviews.js                 # Hardcoded reviews UI
    │   ├── login.js                   # Customer login
    │   ├── create-account.js          # Registration
    │   ├── user-overview.js           # Customer profile
    │   ├── admin/                     # Admin pages (login, dashboard, products, orders, …)
    │   └── api/                       # REST handlers (auth, cart, orders, products, users)
    ├── components/                    # Header, toasts, modals, admin layout, charts, product list
    ├── styles/                        # globals.css and CSS modules
    └── public/                        # Default Next SVG files. Brand files are expected under public/assets/
```

## How It Works

### Data model

Prisma uses the SQL Server provider. Prices, stock, and order totals are integers. The storefront formats them as Philippine pesos (`₱`).

- `User` — unique `username` and `email`, hashed `password`, optional `address` and `phone`, `role` defaulting to `customer`.
- `Product` — name, description, price, image path, category, `featured`, `inStock`, and `stock`.
- `CartItem` — `sessionId`, optional `userEmail`, product, and quantity.
- `Transaction` — the order header (`username`, `email`, `status`, `totalPrice`, `purchaseDate`) plus related products and line items.
- `OrderItem` — quantity and the price at purchase time. Deleting a product cascades to order items.

### Authentication

Two NextAuth credential providers share one JWT session. Admins sign in with a username. Customers sign in with an email. Each provider rejects the other role, and the JWT and session callbacks copy `id`, `email`, `username`, and `role` onto the session.

```88:119:cinema-fx-next/pages/api/auth/[...nextauth].js
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    },
  },
```

Registration hashes the password with bcrypt (cost 10) and always creates `role: "customer"`.

`middleware.js` reads the JWT with `NEXTAUTH_SECRET`. It only runs on `/admin/:path*`, `/admin/login`, `/profile`, and `/orders`.

### Catalog and featured slideshow

`/products` loads every product in `getServerSideProps`. Filtering and sorting happen in the browser. Categories on the shop (cleansers, deodorant, hair cares, moisturizers, serums, soaps, sunscreens, toners, whitening) are matched case-insensitively against the product's `category` string.

The home page fetches `/api/products` and keeps rows where `featured` is true. The slideshow advances every 10 seconds unless it is paused.

### Cart and checkout

Adding a product creates a `sessionId` if one is missing, stores it in `localStorage`, and also writes a `sessionId` cookie. `POST /api/cart/add` upserts a `CartItem`. If a NextAuth session exists, guest rows for that `sessionId` are moved onto `userEmail` first.

`POST /api/order/place` loads the cart by email, checks stock inside `prisma.$transaction`, decrements stock, then writes a `Transaction` and `OrderItem` rows. The cart is cleared afterward. Insufficient stock sets status `FAIL` and returns an error. A successful order redirects to `/order-placed`, which reads `/api/order-latest` and can download `Order-receipt.pdf` through `html2pdf.js`.

Customer order codes on My Orders are not stored. They are derived from the numeric id:

```6:15:cinema-fx-next/pages/my-orders.js
function generateOrderCode(order) {
  const OFFSET = 987654;
  const PRIME = 9973;
  const baseId = order.id || Math.floor(Math.random() * 1e8);
  const uniqueNum = (baseId + OFFSET) * PRIME;
  const code = uniqueNum.toString(36).toUpperCase().padStart(8, "0");
  return code;
}
```

### Admin product uploads

`/admin/products` is the working product manager. Create sends `FormData` to `POST /api/product-manager`. That route disables Next's body parser and uses formidable. Images are written to `public/assets`, and the product stores a path like `/assets/<file>`.

```24:33:cinema-fx-next/pages/api/product-manager/index.js
    if (method === "POST") {
      const form = formidable({
        uploadDir: path.join(process.cwd(), "public", "assets"),
        keepExtensions: true,
        filename: (name, ext, part) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          return `${part.name}-${uniqueSuffix}${ext}`;
        },
      });
```

Edits and deletes use JSON on the same route. Delete also unlinks the image file under `public/`.

### Dashboard charts

`components/admindashboard.js` loads `/api/admin/transactions` and builds four Highcharts views in the browser: a pie of status counts, a column chart of units per username, a bar chart of the top seven products, and a line of `SUCCESS` orders per day. The "Add Today's Delivery" button only updates React state with a random count. It does not write to the database.

### Visual layer

There is no canvas, WebGL, or shader code. Motion is CSS and small bits of React state:

- Slideshow slides use a `.fade` class and `styled-jsx` to show only the active slide.
- Product cards lift on hover (`translateY(-5px)`).
- The header is sticky. Opening the mobile nav adds `no-scroll` on `body`.
- Accent color used across the shop is `#e91e63` (admin screens also use `#e75480` and `#E57393`).
- `_app.js` applies the Inter font to the whole app.

## Getting Started

### Prerequisites

- Node.js `^18.18.0`, `^19.8.0`, or `>= 20.0.0` (required by Next.js 15.3.2)
- npm (lockfile is `cinema-fx-next/package-lock.json`)
- A Microsoft SQL Server database the Prisma `sqlserver` provider can reach

### Installation

```bash
cd cinema-fx-next
npm install
npx prisma generate
```

Apply the existing migrations:

```bash
npx prisma migrate deploy
```

<!-- TODO: confirm --> There is no seed script. Add products from `/admin/products`, or insert rows yourself. Brand images referenced by the pages (`/assets/logo.jpg`, `/assets/CEO.png`, `/assets/placeholder.png`, review photos, and so on) are not in `public/`. Only the default Next.js SVG files are committed. Put missing files in `cinema-fx-next/public/assets/` or the image tags will 404.

### Environment variables

Create `cinema-fx-next/.env`. There is no `.env.example` in the repo. The names referenced in code are:

| Name | Used by |
| --- | --- |
| `DATABASE_URL` | `prisma/schema.prisma` |
| `NEXTAUTH_SECRET` | NextAuth, `middleware.js`, and `pages/api/admin/some-protected-route.js` |

Do not commit `.env`. `.env*` is gitignored.

<!-- TODO: confirm --> NextAuth deployments often also set `NEXTAUTH_URL`. This repository does not read that name in application code.

A SQL Server URL looks like this (replace the placeholders):

```bash
DATABASE_URL="sqlserver://HOST:1433;database=DATABASE;user=USER;password=PASSWORD;encrypt=true;trustServerCertificate=true"
NEXTAUTH_SECRET="generate-a-long-random-string"
```

### Running in development

```bash
npm run dev
```

This starts Next.js with Turbopack. Open [http://localhost:3000](http://localhost:3000).

Useful URLs:

| URL | Who |
| --- | --- |
| `/` | Shop home |
| `/products` | Catalog |
| `/cart` | Cart and checkout |
| `/login` | Customer login |
| `/create-account` | Registration |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin home (admin session required) |

You need at least one `User` row with `role` set to `admin` before the admin UI will accept a login. Passwords in the database must be bcrypt hashes. <!-- TODO: confirm --> This repo does not include a script that creates the first admin.

### Building and running in production

```bash
npm run build
npm start
```

`npm start` serves the production build on port 3000.

## Scripts

Run these from `cinema-fx-next/`.

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `next dev --turbopack` | Development server with Turbopack |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve the production build |
| `lint` | `next lint` | Run ESLint with the Next.js config |

Prisma commands (`npx prisma generate`, `npx prisma migrate deploy`) are not npm scripts. Run them yourself when the schema or database changes.

## Customization

**Shop colors and layout.** Global rules, the header, buttons, and the hero live in `cinema-fx-next/styles/globals.css`. The pink accent is `#e91e63`. Many pages also ship layout in a `<style jsx>` block at the bottom of the page file (products, cart, reviews, order receipt).

**Admin colors.** Dashboard, reports, sidebar, and login styles are CSS modules under `cinema-fx-next/styles/` and `cinema-fx-next/components/*.module.css`.

**Slideshow timing.** In `pages/index.js`, the interval is `10000` milliseconds. Featured slides are whatever products have `featured: true`.

**Catalog categories.** The shop filter list and `categoryMap` are in `pages/products.js`. The admin create form uses a separate list in `pages/admin/products.js` (`Soap`, `Toner`, `Serum`, and so on, plus a free-text "Other..."). Keep those two lists aligned if you add a category.

**Admin navigation.** Menu labels live in `components/sidebarMenu.js`. The click handler that maps a menu key to a route is `handleSelect` in `components/AdminLayout.js`.

**Auth pages.** Customer sign-in is `/login` even though NextAuth's `pages.signIn` is set to `/admin/login`. Customer forms call `signIn("user-credentials")` directly. Admin forms call `signIn("admin-credentials")`.

**Charts.** Series, colors, and the top-seven cutoff are built in `components/admindashboard.js`.

## Deployment

The app is a standard Next.js project and can be deployed on [Vercel](https://vercel.com/new). Set the root directory to `cinema-fx-next` if the Git repository root is this folder's parent.

1. Push the repo and import it in Vercel.
2. Set the project root to `cinema-fx-next`.
3. Add `DATABASE_URL` and `NEXTAUTH_SECRET` in the project environment settings.
4. Run `npx prisma migrate deploy` against the production database before or during release. <!-- TODO: confirm --> There is no `postbuild` script that does this.
5. Deploy. Vercel runs `next build`.

Local image uploads go to `public/assets` on the server disk. That directory is ephemeral on serverless hosts, so new product images will not survive a new deployment there. Serve uploads from object storage if you deploy this way. <!-- TODO: confirm --> No storage adapter is implemented in this repo.

The committed `cinema-fx-next/README.md` is still the create-next-app template. It mentions `app/page.js` and the Geist font. This app uses the Pages Router and Inter. Follow this file instead.

## Known Limitations / Roadmap

- `pages/admin/add.js` does not create a product. Submit only alerts. The comment in that file is `TODO: Add your create logic here (API call, etc.)`. The working form is the modal on `/admin/products`. `AdminLayout` still has a route key for `/admin/add`, but that item is not in `sidebarMenu.js`.
- `components/AdminReports.js` renders Excel and PDF buttons with no click handlers and no export code.
- Reviews are a fixed array inside `pages/reviews.js`. The Helpful button only calls `alert`. Nothing is stored.
- Dashboard status labels look for `PENDING`, `SUCCESS`, and `INCOMPLETE`. Order placement writes `SUCCESS` or `FAIL`. Deliveries write `ONGOING`. Customers write `COMPLETED`. Several of those statuses never appear on the pie chart.
- "Add Today's Delivery" on the dashboard is local React state with a random number.
- Middleware protects `/profile` and `/orders`. The pages that exist are `/user-overview` and `/my-orders`, so those two routes are not covered by the matcher.
- Several admin API handlers (`/api/users`, `/api/admin/transactions`, `/api/product-manager`, `/api/edit-admin`, `/api/get-user-role`, and others) do not check that the caller is an admin. Page middleware does not run on `/api/*`.
- `pages/products.js` imports `uuid` without declaring it in `package.json`.
- `mssql` is a dependency and the migration lock provider is `mssql`, but application code never imports the `mssql` package.
- `public/assets` brand and product images are not in the repository.
- `jsconfig.json` aliases `@/*` to `./src/*`, and there is no `src` directory. Imports in the app are relative.
- `next.config.mjs` is an empty object. There is no image remote-pattern config and no custom headers.
- Guest-cart migration in `pages/api/cart/newuser.js` assigns an existing user line's quantity back to itself, so a matching guest line is not added on top.
- A failed stock check in `pages/api/order/place.js` still deletes the user's cart items.
- No test script, no database seed, no `.env.example`, and no `LICENSE` file.

## Contributing

Issues and changes are welcome. Open a pull request against this repository.

1. Branch from the current line of development.
2. Keep changes scoped to the storefront or the admin area you are touching.
3. Run `npm run lint` inside `cinema-fx-next` before you open the PR.

There is no `LICENSE` file in this repository. Do not assume a license until one is added.

## Author

[gabcsx](https://github.com/gabcsx)
