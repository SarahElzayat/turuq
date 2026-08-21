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
