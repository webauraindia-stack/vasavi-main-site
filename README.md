# Vasavi Main Site (`vasavi-main-site`)

Public hotel booking website — search, book, donor benefits, account, and **extend stay** from booking details.

Runs on port **3000**. Pairs with the separate [`vasavi-portal`](../vasavi-portal) role-based admin portal on port **3001**.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment

Copy `.env.example` to `.env.local`:

```bash
AUTH_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPERADMIN_URL=http://localhost:3001
NEXT_PUBLIC_SUPERADMIN_URL=http://localhost:3001
```

Stay extension requests from the customer site are proxied to the management portal API.

## Repository

https://github.com/webauraindia-stack/vasavi-main-site
