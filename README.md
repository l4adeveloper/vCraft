# vCraft

A React application built with TanStack Start, TanStack Router, TypeScript, Vite, and Tailwind CSS.

## Development

```sh
npm install
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
- `src/data/` is the demo dataset (workshops, artisans, products, batches) linked by ID; `src/lib/storage.ts` keeps quote requests in localStorage until a backend exists.
- `src/lib/motion.ts` and the tokens at the top of `src/styles.css` are the single source for motion, color and type.
- `assets/photos/` is the image registry: any `.webp` dropped there is picked up by key (see `src/data/images.ts`).
- `src/routeTree.gen.ts` is generated automatically by the Start plugin.

Start supplies the default client hydration and server rendering entry points. File routes live in `src/routes`; the Start plugin handles route generation and code splitting.

## Server features

Import `createServerFn` from `@tanstack/react-start` to define server functions and call them from route loaders or components. API routes use `server.handlers` in `createFileRoute` and return standard `Response` objects.

See the official [server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) and [server routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes) guides.

## Repository skills

`AGENTS.md` requires the locally installed Intent CLI for skill discovery before substantial edits. Intent is currently absent; restore the project's intended tooling before using that workflow.
