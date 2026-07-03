# Memo By Miraal Storefront + Admin

## React Website

```powershell
npm install
npm run dev
```

For the React production build:

```powershell
npm run build
```

The FastAPI backend serves the React production build from `dist/`. The `public/` folder is only for React assets that need to be copied as-is, such as product photos, the logo, and the favicon.

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

## Admin Password Recovery

The login screen includes `Forgot password?` for registered admin emails. Recovery links expire after 30 minutes and can only be used once.

To send recovery email, create a `.env` file from `.env.example` and add your SMTP settings:

```powershell
Copy-Item .env.example .env
```

For Gmail, use:

```env
MEMO_PASSWORD_RESET_BASE_URL=http://127.0.0.1:8000/admin
MEMO_SMTP_HOST=smtp.gmail.com
MEMO_SMTP_PORT=587
MEMO_SMTP_FROM=your-gmail@gmail.com
MEMO_SMTP_USER=your-gmail@gmail.com
MEMO_SMTP_PASSWORD=your-google-app-password
MEMO_SMTP_SSL=false
```

Gmail requires a Google App Password, not your normal Gmail password. After editing `.env`, restart the FastAPI backend.

## Data

- SQLite database: `memo.sqlite3`
- Uploaded product images: `assets/uploads/`
- Passwords are hashed with PBKDF2-SHA256.
- Admin routes require bearer-token sessions and server-side permission checks.
