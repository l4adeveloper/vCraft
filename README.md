# vCraft

A React application built with TanStack Start, TanStack Router, TypeScript, Vite, and Tailwind CSS.

## Development

Use Node.js 24 or later and a PostgreSQL server. Create an empty database owned by the vCraft database user, then set `DATABASE_URL` to that user's PostgreSQL connection URL.

```sql
CREATE ROLE vcraft LOGIN PASSWORD 'replace-with-your-password';
CREATE DATABASE vcraft OWNER vcraft;
```

Run those SQL statements from an administrator connection to PostgreSQL.

```sh
npm ci
cp .env.example .env
# Set DATABASE_URL in .env before continuing.
npm run db:migrate
npm run dev
```

Open http://localhost:3000.

## Build and checks

```sh
npm run build
npm run preview
npm run typecheck
npm run lint
npm run check
```

The build produces browser assets in `dist/client` and a server bundle in `dist/server`. Production deployment requires a hosting adapter for your target platform; see the [TanStack Start hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting).

## Application structure

- `src/router.tsx` creates a router for each request.
- `src/routes/__root.tsx` defines the HTML document, metadata, stylesheet, and shared layout.
- `src/routes/index.tsx` redirects to `/home`; `src/routes/home/` is the public home page.
- `src/components/home/` holds the home page sections, `src/components/overlays/` the drawer contents (product, artisan, batch, quote form), `src/components/ui/` shared pieces.
- `src/data/` is the demo dataset (workshops, artisans, products, batches) linked by ID.
- `src/routes/api/` and `src/server/` handle sign-in, sessions, and quote requests. `src/lib/storage.ts` keeps drafts and receipts on the visitor’s device.
- `src/lib/motion.ts` and the tokens at the top of `src/styles.css` are the single source for motion, color and type.
- `assets/photos/` is the image registry: any `.webp` dropped there is picked up by key (see `src/data/images.ts`).
- `src/routeTree.gen.ts` is generated automatically by the Start plugin.

Start supplies the default client hydration and server rendering entry points. File routes live in `src/routes`; the Start plugin handles route generation and code splitting.

## Sign-in and registration

Run `npm run db:migrate` when upgrading an existing installation to enable artisan registration and the artisan workspace. Existing accounts and sessions carry forward.

On `/signup`, choose `Khách hàng` (customer) or `Nghệ nhân` (artisan), then complete the registration form. Signup signs you in automatically. `/login` accepts all account roles. Customers go to `/account`, artisans to `/artisan`, and admins to `/admin`.

Artisans save their workshop profile in `/artisan`, then publish products with dated production journals in `/san-pham`. Use public HTTPS links for workshop and product photos. Workshop information and certificate details are provided by the artisan.

Signed-in customers can write a quote request from `/account`. An unsent draft stays in the browser. Sending the request delivers it directly to every approved artisan account, including artisans without a workshop profile. An artisan can offer the proposed unit price and completion date, revise them, or decline. Declined requests can be hidden from the artisan's inbox and restored while bidding remains open. The buyer can accept one offer in `/account`, and the selected artisan updates the order to in production and then delivered. The admin allocation editor still handles earlier requests.

## Admin setup

New artisan registrations wait for approval. In `/admin`, open **Hộ gia đình** and verify that the applicant is a local craft household before approving the account. Approval grants workshop access and makes its listings eligible for public display. Accounts created before the approval workflow also start in **Chờ duyệt** when migrating.

In **Tin cộng đồng**, save or publish notices about material prices, power outages, and support policies. Published notices appear at `/tin-cong-dong`. **Yêu cầu báo giá** contains the existing wholesale allocation workflow.

Create an admin from the repository root. In Bash, enter a password of at least 15 characters when prompted.

```bash
read -rs -p 'Admin password: ' VCRAFT_SETUP_PASSWORD; printf '\n'
printf '%s' "$VCRAFT_SETUP_PASSWORD" | npm run admin:create -- admin@example.com
unset VCRAFT_SETUP_PASSWORD
```

Start the app with `npm run dev` and open [the admin page](http://localhost:3000/admin). Run the same command with an existing email to reset its password and revoke that account’s active sessions.

Visitors can submit quote requests without an account. Admins can review contact and order details, update each request’s status, and split its quantity across workshops. The available workshops come from the exhibition’s demo dataset. Old browser-only demo requests stay on their original device.

### Import from SQLite

If you have an existing vCraft SQLite database, stop the old app so all writes are included. After running `npm run db:migrate` against PostgreSQL, import the file:

```sh
npm run db:import-sqlite -- var/vcraft.sqlite
```

The import preserves admin password hashes, quote IDs, statuses, and workshop allocations. It can be rerun and skips emails and quote IDs already present in PostgreSQL. Admins sign in again after the move. Browser-only quote drafts and demo receipts are still stored on their original device.

### Production configuration

Set `DATABASE_URL` in the Node server environment and run `npm run db:migrate` with a role that can create tables in the target schema. The server uses PostgreSQL for accounts, sessions, and quote requests. Serve the app over HTTPS for production session cookies. If a reverse proxy changes the request origin seen by Node, set `VCRAFT_ORIGIN` to the public origin, such as `https://vcraft.example.com`, without a trailing slash.

## Server features

Import `createServerFn` from `@tanstack/react-start` to define server functions and call them from route loaders or components. API routes use `server.handlers` in `createFileRoute` and return standard `Response` objects.

See the official [server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) and [server routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes) guides.

## Repository skills

`AGENTS.md` requires the locally installed Intent CLI for skill discovery before substantial edits. Intent is currently absent; restore the project's intended tooling before using that workflow.
