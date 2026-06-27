# Memo By Miraal Storefront Projects + Admin


- `react-website/` - React/Vite storefront

The FastAPI backend and admin panel remain at the repository root.

## React Website

```powershell
cd react-website
npm install
npm run dev
```

For the React production build:

```powershell
cd react-website
npm run build
```

The FastAPI backend serves this React build from `react-website/dist` when you run the backend from the repository root.


## Backend + Admin

Install Python dependencies if needed:

```powershell
python -m pip install -r requirements.txt
```

Start the backend from the repository root:

```powershell
python -m uvicorn backend.app:app --reload --port 8000
```

Then visit:

- Storefront served by backend: `http://127.0.0.1:8000/`
- Admin panel: `http://127.0.0.1:8000/admin`

The admin URL is intentionally not linked from the public website.

## First Admin Setup

1. Open `/admin`.
2. Use the `First signup` tab to create the first Super Admin.
3. After the first Super Admin exists, public signup closes automatically.
4. Additional Super Admin, Editor, and Viewer accounts can only be created from the Admin Users section by a Super Admin.

## Data

- SQLite database: `memo.sqlite3`
- Uploaded product images: `assets/uploads/`
- Passwords are hashed with PBKDF2-SHA256.
- Admin routes require bearer-token sessions and server-side permission checks.