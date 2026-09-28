# Social Community Management (DEMO)

Mock-data Angular wireframe for triaging social feature signals into product decisions.

## Run locally

```bash
cd apps/social-community-management
npm install
npm start
```

Open the URL from the CLI (default `http://localhost:4200/`). Use the session **role switcher** in the header (does not persist).

## Demo path

1. `/signals` → open **post-bulk-export**
2. Role **Community Manager** → mark feature request → fill intake → save draft
3. Role **Infrastructure scout** → save correlation → submit
4. Role **Product Manager** → `/decisions` → review → record decision

`npm run build` must pass before handoff.
