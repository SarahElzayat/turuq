# Warehouse Moderator App

Frontend technical assessment, a Next.js (App Router) app for a warehouse moderator to view their info and manage product details.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `app/page.tsx`, home page with 5 info cards.
- `app/products/page.tsx`, product list, fetched from the mock API as a Server Component.
- `app/products/[id]/page.tsx`, product detail page (ID/Name/Variant/Price) plus an edit form.
- `app/products/[id]/actions.ts`, Server Action that saves an edit.
- `lib/products.ts`, data-fetching helpers for the mock API.
- `components/`, reusable UI (`side-nav`, `theme-toggle`, `info-card`, `product-detail`, and shadcn/ui primitives under `components/ui`).

Stack: Next.js 16 (App Router, Server Components + Server Actions), Tailwind CSS, shadcn/ui (Radix primitives), next-themes for the dark/light toggle.

## A note on the mock API

The assessment's mock API (`https://6776992512a55a9a7d0c4868.mockapi.io/products`) has a broken single-resource route: both `GET /products/:id` and `PUT /products/:id` return 404 for every id, even ids that exist in the `GET /products` list. Two adjustments were made to work around this rather than around it:

- `getProduct(id)` fetches the full list and finds the match there instead of hitting the (broken) single-resource route.
- The edit form's Server Action still attempts the `PUT`, and revalidates the page on success. When it fails (as this backend always does), it doesn't block the moderator, the on-screen product summary still updates immediately from the submitted values, with a visible note that the warehouse sync didn't go through, instead of silently losing the edit or hanging on a request that will never succeed.
