# Savely

A coupon and deals marketplace for the Philippines. Browse discounts, add coupons to your cart, and check out — with personalized deal recommendations based on your purchase history.

## Tech Stack

- **Next.js 15** (App Router, server components, server actions)
- **Supabase** — PostgreSQL database, auth, and PostgREST API
- **React Query** — optimistic cart updates on the client
- **Tailwind CSS v4**
- **Zod + React Hook Form** — form validation
- **TypeScript**

## Features

- Browse deals by category
- Product pages with live countdown timers
- Shopping cart (stored in Supabase, synced via `v_cart_detailed` view)
- Checkout with order history
- **Best Selling Deals** — ranked by purchase count
- **Picked For You** — personalized by your order history; falls back to highest-discount deals for guests
- User accounts with loyalty points
- Username availability check on sign-up

## Project Structure

```
app/
  page.tsx               # Homepage
  browse-deals/          # All deals
  category/[category]/   # Deals filtered by category
  products/[id]/         # Single product page
  shopping-cart/         # Cart
  checkout/              # Order placement
  login/                 # Auth
  sign-up/               # Auth
  account/               # User profile
components/
  BestDeals.tsx          # Ranked by purchases DESC
  PickedForYou.tsx       # Personalized via get_picked_for_you RPC
  Deals.tsx              # Deal card
  LongDeals.tsx          # Horizontal deal layout
  Countdown.tsx          # Expiry countdown timer
  Header.tsx / Footer.tsx
layouts/
  MainLayout.tsx         # Wraps all pages with header/footer
utils/
  supabase/              # Server, client, and middleware Supabase clients
  validation/            # Zod schemas
```

## Database (Supabase)

Tables: `profiles`, `coupons`, `orders`, `order_items`

Key DB objects:
- `v_cart_detailed` — view joining `profiles.shopping_cart` JSONB with `coupons`
- `cart_set_quantity(p_coupon_id, p_quantity)` — atomic cart update
- `cart_clear()` — empties the current user's cart
- `get_picked_for_you(p_user_id)` — recommendation algorithm
- `increment_coupon_purchases(p_coupon_ids, p_quantities)` — updates purchase counters on order
- `is_username_available(u)` — used for real-time username checking on sign-up

## Getting Started

1. Clone the repo
2. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_VARIANT_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
```
