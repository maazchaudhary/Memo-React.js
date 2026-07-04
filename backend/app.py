from __future__ import annotations

import base64
import hashlib
import hmac
import logging
import os
import secrets
import sqlite3
import smtplib
import ssl
import time
from email.message import EmailMessage
from pathlib import Path
from typing import Annotated, Literal

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field

BASE_DIR = Path(__file__).resolve().parent.parent


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        clean = line.strip()
        if not clean or clean.startswith("#") or "=" not in clean:
            continue
        key, value = clean.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


load_env_file(BASE_DIR / ".env")

BACKEND_DIR = BASE_DIR / "backend"
ADMIN_DIR = BASE_DIR / "admin"
ASSETS_DIR = BASE_DIR / "assets"
DIST_DIR = BASE_DIR / "dist"
DB_PATH = Path(os.getenv("MEMO_DB_PATH", BASE_DIR / "memo.sqlite3"))
UPLOAD_DIR = ASSETS_DIR / "uploads"
SESSION_SECONDS = 60 * 60 * 12
PASSWORD_RESET_SECONDS = 60 * 30
PBKDF2_ITERATIONS = 210_000
SPA_ROUTES = {
    "new-arrivals",
    "cart",
    "checkout",
    "order-confirmation",
    "contact-us",
    "payment",
    "disclaimer",
    "faqs",
    "terms-and-conditions",
    "care-instructions",
    "returns-and-exchanges",
}
DELIVERY_FEE = int(os.getenv("MEMO_DELIVERY_FEE", "250"))
PAYMENT_METHODS = {"Cash on Delivery", "Bank Transfer", "EasyPaisa / JazzCash"}
MANUAL_PAYMENT_METHODS = {"Bank Transfer", "EasyPaisa / JazzCash"}
SIZE_OPTIONS = {"Extra Small", "Small", "Medium", "Large", "Custom"}
ADD_ON_OPTIONS = {
    "pants": {"label": "Pants", "price": 4500},
    "dupatta": {"label": "Dupatta", "price": 3500},
}

app = FastAPI(title="Memo by Miraal Admin API")
logger = logging.getLogger("memo")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROLE_PERMISSIONS = {
    "super_admin": {"dashboard:view", "products:view", "products:create", "products:update", "products:delete", "inventory:update", "orders:view", "orders:update", "sales:view", "admins:manage"},
    "editor": {"dashboard:view", "products:view", "products:create", "products:update", "inventory:update", "orders:view", "orders:update"},
    "viewer": {"dashboard:view", "products:view", "orders:view", "sales:view"},
}

SEED_PRODUCTS = [
    {
        "title": "Dusk",
        "summary": "Silk shirt with embroidered details",
        "description": "This tea pink kaftan-style shirt features elegant embroidery that adds a graceful touch to it's timeless silhouette. Designed for effortless style.",
        "price": 16000,
        "category": "all-products",
        "stock": 14,
        "images": [
            "assets/photos/IMG_0445.jpg",
            "assets/photos/IMG_0441.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 1,
    },
    {
        "title": "Bloom",
        "summary": "Pastel embroidered long shirt",
        "description": "A beautiful statement neckline. Soft ivory and blue embroidery with delicate cutwork adds elegance to the design, while subtle appliqués and a lace border create a graceful finish. A timeless outfit, perfect for any occasion.",
        "price": 16000,
        "category": "all-products",
        "stock": 19,
        "images": [
            "assets/photos/IMG_1524.jpg",
            "assets/photos/IMG_1526.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 1,
    },
    {
        "title": "Amaya",
        "summary": "Embroidered occasion ensemble",
        "description": "Kaftan-style shirt made on pure silk adorned with elegant thread embroidery. Its effortless silhouette and timeless detailing make it a versatile addition to any wardrobe.",
        "price": 16000,
        "category": "all-products",
        "stock": 8,
        "images": [
            "assets/photos/IMG_9818.jpg",
            "assets/photos/IMG_9820.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 1,
    },
    {
        "title": "Kaira",
        "summary": "Botanical sage silk dress",
        "description": "Kaira featuring intricate Ari embroidery on the front and back. Pearl work on the sleeves, lace on daman & side slits and pearl tassels on the neckline. Perfect for festive occasions and celebrations. Note: Sleeves lining can be added upon request.",
        "price": 16000,
        "category": "all-products",
        "stock": 11,
        "images": [
            "assets/photos/IMG_8821.jpg",
            "assets/photos/IMG_8820.jpg",
            "assets/photos/IMG_1472.jpg",
            "assets/photos/SizeChart/IMG_6466.png",
        ],
        "featured": 1,
    },
    {
        "title": "Celine",
        "summary": "Easy elegance silk dress",
        "description": "Mint green kaftan-style shirt featuring intricate appliqué work with vibrant embroidery. Finished with floral tassels on the neckline, adding a graceful and elegant touch to the design.",
        "price": 16000,
        "category": "all-products",
        "stock": 7,
        "images": [
            "assets/photos/IMG_9828.jpg",
            "assets/photos/IMG_9838.jpg",
            "assets/photos/IMG_9840.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 0,
    },
    {
        "title": "Sapphire",
        "summary": "Embroidered silk kaftan",
        "description": "Butter yellow kaftan-style shirt featuring intricate appliqué work with vibrant embroidery. Finished with floral tassels on the neckline, adding a graceful and elegant touch to the design.",
        "price": 23000,
        "category": "all-products",
        "stock": 5,
        "images": [
            "assets/photos/IMG_1355.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 0,
    },
    {
        "title": "Lira Green",
        "summary": "Quiet colour embroidered set",
        "description": "Adorned with 3d embroidery, handwork, and pearl accents on butter silk fabric.",
        "price": 16000,
        "category": "all-products",
        "stock": 16,
        "images": [
            "assets/photos/IMG_7990.jpg",
            "assets/photos/IMG_7992.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 0,
    },
    {
        "title": "Lira Pink",
        "summary": "Fresh embroidered dress",
        "description": "Adorned with 3d embroidery, handwork, and pearl accents on butter silk fabric.",
        "price": 16000,
        "category": "all-products",
        "stock": 9,
        "images": [
            "assets/photos/IMG_5143.jpg",
            "assets/photos/IMG_5142.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 0,
    },
    {
        "title": "Raya",
        "summary": "Soft festive dress",
        "description": "Kaftan style shirt featuring intricate multicolor thread embroidery across the shirt and sleeves. Designed for effortless styling, it’s a versatile piece that’s perfect for casual outings and semi-formal occasions.",
        "price": 16000,
        "category": "all-products",
        "stock": 4,
        "images": [
            "assets/photos/IMG_4715.jpg",
            "assets/photos/IMG_4716.jpg",
            "assets/photos/IMG_4718.jpg",
            "assets/photos/IMG_4753.jpg",
            "assets/photos/SizeChart/IMG_7611.png",
        ],
        "featured": 0,
    },
    {
        "title": "Dove Blue",
        "summary": "Embroidered evening notes",
        "description": "Three-piece ensemble featuring an embroidered shirt paired with flared pants. The pants can be customized to culottes or balloon pants and the look is completed with a three-yard medium silk dupatta adorned with appliqué embroidery on all four corners.",
        "price": 25000,
        "category": "all-products",
        "stock": 6,
        "images": [
            "assets/photos/IMG_7747.jpg",
            "assets/photos/IMG_7750.jpg",
            "assets/photos/SizeChart/IMG_6466.png",
        ],
        "featured": 0,
    },
    {
        "title": "Dove Lilac",
        "summary": "Occasion embroidered dress",
        "description": "Three-piece ensemble featuring an embroidered shirt paired with flared pants. The pants can be customized to culottes or balloon pants and the look is completed with a three-yard medium silk dupatta adorned with appliqué embroidery on all four corners.",
        "price": 25000,
        "category": "all-products",
        "stock": 3,
        "images": [
            "assets/photos/IMG_7289.jpg",
            "assets/photos/IMG_7276.jpg",
            "assets/photos/SizeChart/IMG_6466.png",
        ],
        "featured": 0,
    },
]


class AdminCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["super_admin", "editor", "viewer"] = "viewer"


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequestPayload(BaseModel):
    email: EmailStr


class PasswordResetPayload(BaseModel):
    token: str = Field(min_length=32, max_length=300)
    password: str = Field(min_length=8, max_length=128)


class ProductPayload(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    summary: str = Field(min_length=2, max_length=180)
    description: str = Field(min_length=2, max_length=1200)
    price: int = Field(ge=0)
    category: str = Field(min_length=2, max_length=80)
    stock: int = Field(ge=0)
    image_url: str | None = Field(default=None, max_length=500)
    featured: bool = False
    active: bool = True
    out_of_stock: bool = False


class StockPayload(BaseModel):
    stock: int = Field(ge=0)
    out_of_stock: bool | None = None


class OrderItemPayload(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=99)
    size: str = Field(default="Medium", min_length=2, max_length=40)
    add_ons: list[str] = Field(default_factory=list, max_length=2)


class CheckoutPayload(BaseModel):
    customer_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=5, max_length=40)
    email: EmailStr
    address: str = Field(min_length=5, max_length=250)
    city: str = Field(min_length=2, max_length=80)
    notes: str | None = Field(default="", max_length=500)
    payment_method: str = Field(default="Cash on Delivery", max_length=80)
    transaction_reference: str | None = Field(default="", max_length=120)
    items: list[OrderItemPayload] = Field(min_length=1)


class StockRequestPayload(BaseModel):
    product_id: int
    customer_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=5, max_length=40)
    email: EmailStr
    notes: str | None = Field(default="", max_length=500)


class OrderStatusPayload(BaseModel):
    status: Literal["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"]


class PaymentStatusPayload(BaseModel):
    payment_status: Literal["Pending", "Awaiting Confirmation", "Paid", "Failed", "Refunded"]


class StockRequestStatusPayload(BaseModel):
    status: Literal["Pending", "Arranged", "Completed", "Cancelled"]


class RolePayload(BaseModel):
    role: Literal["super_admin", "editor", "viewer"]


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def row_dict(row: sqlite3.Row | None):
    return dict(row) if row else None


def rows_dict(rows):
    return [dict(row) for row in rows]


def public_asset_url(value: str | None):
    if not value:
        return value
    if value.startswith("../assets/"):
        return value.removeprefix("..")
    if value.startswith(("http://", "https://", "data:", "blob:", "/")):
        return value
    return f"/{value}" if value.startswith("assets/") else value


def storage_image_url(value: str | None):
    return public_asset_url((value or "").strip()) or "/assets/photos/img_9828.jpg"


def product_images(conn: sqlite3.Connection, product_id: int, fallback: str | None = None):
    rows = conn.execute(
        "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
        (product_id,),
    ).fetchall()
    images = [public_asset_url(row["image_url"]) for row in rows if row["image_url"]]
    fallback_url = public_asset_url(fallback)
    if fallback_url and fallback_url not in images:
        images.insert(0, fallback_url)
    return images[:5]


def set_product_images(conn: sqlite3.Connection, product_id: int, image_urls: list[str]):
    clean_urls = [storage_image_url(url) for url in image_urls if str(url or "").strip()][:5]
    if not clean_urls:
        clean_urls = [storage_image_url(None)]
    conn.execute("DELETE FROM product_images WHERE product_id = ?", (product_id,))
    for index, image_url in enumerate(clean_urls):
        conn.execute(
            "INSERT INTO product_images (product_id,image_url,sort_order,created_at) VALUES (?,?,?,?)",
            (product_id, image_url, index, int(time.time())),
        )
    conn.execute("UPDATE products SET image_url=?, updated_at=? WHERE id=?", (clean_urls[0], int(time.time()), product_id))


def serialize_product(row: sqlite3.Row | None, conn: sqlite3.Connection | None = None):
    product = row_dict(row)
    if product and "image_url" in product:
        product["image_url"] = public_asset_url(product["image_url"])
        images = product_images(conn, product["id"], product["image_url"]) if conn else [product["image_url"]]
        product["images"] = images
    return product


def serialize_products(rows, conn: sqlite3.Connection | None = None):
    return [serialize_product(row, conn) for row in rows]


def slugify(value: str) -> str:
    clean = "".join(char.lower() if char.isalnum() else "-" for char in value).strip("-")
    return "-".join(part for part in clean.split("-") if part) or secrets.token_hex(4)


def order_number(order_id: int):
    return f"MEMO-{order_id:05d}"


def normalize_add_ons(add_ons: list[str] | None):
    selected = []
    for add_on in add_ons or []:
        add_on_id = str(add_on or "").strip().lower()
        if add_on_id not in ADD_ON_OPTIONS:
            raise HTTPException(status_code=400, detail="Choose valid add-ons.")
        if add_on_id not in selected:
            selected.append(add_on_id)
    return selected


def add_ons_total(add_ons: list[str] | None):
    return sum(ADD_ON_OPTIONS[add_on]["price"] for add_on in normalize_add_ons(add_ons))


def add_ons_label(add_ons: list[str] | None):
    selected = normalize_add_ons(add_ons)
    return ", ".join(ADD_ON_OPTIONS[add_on]["label"] for add_on in selected) if selected else "None"


def password_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _, iterations, salt, digest = stored.split("$", 3)
        check = hashlib.pbkdf2_hmac("sha256", password.encode(), base64.b64decode(salt), int(iterations))
        return hmac.compare_digest(base64.b64encode(check).decode(), digest)
    except Exception:
        return False


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def password_reset_url(request: Request, token: str) -> str:
    configured = os.getenv("MEMO_PASSWORD_RESET_BASE_URL", "").strip()
    base = configured or str(request.url_for("admin_page"))
    separator = "&" if "?" in base else "?"
    return f"{base}{separator}reset_token={token}"


def send_password_reset_email(email: str, name: str, reset_url: str) -> bool:
    sender = os.getenv("MEMO_SMTP_FROM", "").strip()
    host = os.getenv("MEMO_SMTP_HOST", "").strip()
    port = int(os.getenv("MEMO_SMTP_PORT", "587"))
    username = os.getenv("MEMO_SMTP_USER", "").strip()
    password = os.getenv("MEMO_SMTP_PASSWORD", "")
    use_ssl = os.getenv("MEMO_SMTP_SSL", "").lower() in {"1", "true", "yes"}

    if not host or not sender:
        logger.warning("Password reset email was requested, but SMTP is not configured.")
        return False

    message = EmailMessage()
    message["Subject"] = "Reset your Memo admin password"
    message["From"] = sender
    message["To"] = email
    message.set_content(
        "\n".join(
            [
                f"Hello {name},",
                "",
                "Use this link to reset your Memo admin password. It expires in 30 minutes:",
                reset_url,
                "",
                "If you did not request this, you can ignore this email.",
            ]
        )
    )

    if use_ssl:
        with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context()) as smtp:
            if username:
                smtp.login(username, password)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(host, port) as smtp:
            smtp.starttls(context=ssl.create_default_context())
            if username:
                smtp.login(username, password)
            smtp.send_message(message)
    return True


def require_permission(permission: str):
    def dependency(authorization: Annotated[str | None, Header()] = None):
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Admin login required.")
        token = authorization.removeprefix("Bearer ").strip()
        with db() as conn:
            session = conn.execute(
                """
                SELECT admins.* FROM admin_sessions
                JOIN admins ON admins.id = admin_sessions.admin_id
                WHERE admin_sessions.token = ? AND admin_sessions.expires_at > ?
                """,
                (token, int(time.time())),
            ).fetchone()
        admin = row_dict(session)
        if not admin:
            raise HTTPException(status_code=401, detail="Session expired.")
        if permission not in ROLE_PERMISSIONS.get(admin["role"], set()):
            raise HTTPException(status_code=403, detail="You do not have permission for this action.")
        return admin

    return dependency


def product_row(conn: sqlite3.Connection, product_id: int):
    product = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product


def ensure_column(conn: sqlite3.Connection, table: str, column: str, definition: str):
    columns = {row["name"] for row in conn.execute(f"PRAGMA table_info({table})").fetchall()}
    if column not in columns:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


@app.on_event("startup")
def init_db():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    with db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS admins (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE COLLATE NOCASE,
              password_hash TEXT NOT NULL,
              role TEXT NOT NULL CHECK(role IN ('super_admin','editor','viewer')),
              created_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS admin_sessions (
              token TEXT PRIMARY KEY,
              admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
              expires_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS admin_password_resets (
              token_hash TEXT PRIMARY KEY,
              admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
              expires_at INTEGER NOT NULL,
              used_at INTEGER,
              created_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              slug TEXT NOT NULL UNIQUE,
              title TEXT NOT NULL,
              summary TEXT NOT NULL,
              description TEXT NOT NULL,
              price INTEGER NOT NULL CHECK(price >= 0),
              category TEXT NOT NULL,
              stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
              image_url TEXT NOT NULL,
              featured INTEGER NOT NULL DEFAULT 0,
              active INTEGER NOT NULL DEFAULT 1,
              out_of_stock INTEGER NOT NULL DEFAULT 0,
              created_at INTEGER NOT NULL,
              updated_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS product_images (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
              image_url TEXT NOT NULL,
              sort_order INTEGER NOT NULL DEFAULT 0,
              created_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS orders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              customer_name TEXT NOT NULL,
              phone TEXT NOT NULL,
              email TEXT NOT NULL,
              address TEXT NOT NULL,
              city TEXT NOT NULL,
              notes TEXT,
              subtotal INTEGER NOT NULL DEFAULT 0,
              delivery_fee INTEGER NOT NULL DEFAULT 0,
              total INTEGER NOT NULL,
              payment_method TEXT NOT NULL,
              payment_status TEXT NOT NULL DEFAULT 'Pending',
              transaction_reference TEXT,
              status TEXT NOT NULL DEFAULT 'Pending',
              created_at INTEGER NOT NULL,
              updated_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS order_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
              product_id INTEGER NOT NULL REFERENCES products(id),
              title TEXT NOT NULL,
              size TEXT NOT NULL DEFAULT 'Medium',
              price INTEGER NOT NULL,
              add_ons TEXT NOT NULL DEFAULT 'None',
              add_ons_total INTEGER NOT NULL DEFAULT 0,
              quantity INTEGER NOT NULL,
              line_total INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS stock_requests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              product_id INTEGER NOT NULL REFERENCES products(id),
              product_title TEXT NOT NULL,
              order_id INTEGER REFERENCES orders(id),
              customer_name TEXT NOT NULL,
              phone TEXT NOT NULL,
              email TEXT NOT NULL,
              ordered_quantity INTEGER NOT NULL DEFAULT 0,
              available_quantity INTEGER NOT NULL DEFAULT 0,
              additional_quantity INTEGER NOT NULL DEFAULT 0,
              notes TEXT,
              status TEXT NOT NULL DEFAULT 'Pending',
              created_at INTEGER NOT NULL
            );
            """
        )
        ensure_column(conn, "orders", "subtotal", "INTEGER NOT NULL DEFAULT 0")
        ensure_column(conn, "orders", "delivery_fee", "INTEGER NOT NULL DEFAULT 0")
        ensure_column(conn, "orders", "transaction_reference", "TEXT")
        ensure_column(conn, "order_items", "size", "TEXT NOT NULL DEFAULT 'Medium'")
        ensure_column(conn, "order_items", "add_ons", "TEXT NOT NULL DEFAULT 'None'")
        ensure_column(conn, "order_items", "add_ons_total", "INTEGER NOT NULL DEFAULT 0")
        ensure_column(conn, "products", "out_of_stock", "INTEGER NOT NULL DEFAULT 0")
        ensure_column(conn, "stock_requests", "order_id", "INTEGER REFERENCES orders(id)")
        ensure_column(conn, "stock_requests", "ordered_quantity", "INTEGER NOT NULL DEFAULT 0")
        ensure_column(conn, "stock_requests", "available_quantity", "INTEGER NOT NULL DEFAULT 0")
        ensure_column(conn, "stock_requests", "additional_quantity", "INTEGER NOT NULL DEFAULT 0")
        conn.execute("UPDATE orders SET subtotal = total WHERE subtotal = 0")
        conn.execute("UPDATE stock_requests SET status = 'Arranged' WHERE status = 'Contacted'")
        conn.execute("UPDATE stock_requests SET status = 'Completed' WHERE status = 'Closed'")
        if conn.execute("SELECT COUNT(*) FROM products").fetchone()[0] == 0:
            now = int(time.time())

            for item in SEED_PRODUCTS:
                images = item.get("images") or [item.get("image_url")]
                images = [image for image in images if image]
                main_image = images[0] if images else "assets/photos/img_9828.jpg"

                cursor = conn.execute(
                """
                INSERT INTO products (slug,title,summary,description,price,category,stock,image_url,featured,active,created_at,updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,1,?,?)
                """,
                (
                    slugify(item["title"]),
                    item["title"],
                    item["summary"],
                    item["description"],
                    item["price"],
                    item["category"],
                    item["stock"],
                    main_image,
                    item["featured"],
                    now,
                    now,
                ),
        )

                product_id = cursor.lastrowid

                for index, image_url in enumerate(images[:5]):
                    conn.execute(
                        "INSERT INTO product_images (product_id,image_url,sort_order,created_at) VALUES (?,?,?,?)",
                        (product_id, image_url, index, now),
                    )


@app.get("/api/products")
def products(category: str | None = None, featured: bool | None = None):
    query = "SELECT * FROM products WHERE active = 1"
    params: list[object] = []
    if category:
        query += " AND category = ?"
        params.append(category)
    if featured is not None:
        query += " AND featured = ?"
        params.append(1 if featured else 0)
    query += " ORDER BY created_at DESC, id ASC"
    with db() as conn:
        return serialize_products(conn.execute(query, params).fetchall(), conn)


@app.post("/api/orders")
def checkout(payload: CheckoutPayload):
    if payload.payment_method not in PAYMENT_METHODS:
        raise HTTPException(status_code=400, detail="Choose a valid payment method.")
    now = int(time.time())
    with db() as conn:
        quantities_by_id: dict[int, int] = {}
        for item in payload.items:
            if item.size not in SIZE_OPTIONS:
                raise HTTPException(status_code=400, detail="Choose a valid size.")
            normalize_add_ons(item.add_ons)
            quantities_by_id[item.product_id] = quantities_by_id.get(item.product_id, 0) + item.quantity

        subtotal = 0
        order_items = []
        products_by_id = {}
        for product_id, quantity in quantities_by_id.items():
            if quantity > 99:
                raise HTTPException(status_code=400, detail="Quantity cannot be higher than 99 per product.")
            product = product_row(conn, product_id)
            if not product["active"]:
                raise HTTPException(status_code=400, detail=f"{product['title']} is not available.")
            if product["out_of_stock"]:
                raise HTTPException(status_code=400, detail=f"{product['title']} is out of stock.")
            products_by_id[product_id] = product

        for item in payload.items:
            product = products_by_id[item.product_id]
            selected_add_ons = normalize_add_ons(item.add_ons)
            item_add_ons_total = add_ons_total(selected_add_ons)
            item_price = product["price"] + item_add_ons_total
            line_total = item_price * item.quantity
            subtotal += line_total
            order_items.append((product, item.quantity, item.size, item_price, add_ons_label(selected_add_ons), item_add_ons_total, line_total))

        if subtotal <= 0:
            raise HTTPException(status_code=400, detail="Add at least one product to checkout.")

        payment_status = "Awaiting Confirmation" if payload.payment_method in MANUAL_PAYMENT_METHODS else "Pending"
        total = subtotal + DELIVERY_FEE
        transaction_reference = (payload.transaction_reference or "").strip()

        cursor = conn.execute(
            """
            INSERT INTO orders (customer_name,phone,email,address,city,notes,subtotal,delivery_fee,total,payment_method,payment_status,transaction_reference,status,created_at,updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                payload.customer_name.strip(),
                payload.phone.strip(),
                payload.email.lower(),
                payload.address.strip(),
                payload.city.strip(),
                (payload.notes or "").strip(),
                subtotal,
                DELIVERY_FEE,
                total,
                payload.payment_method,
                payment_status,
                transaction_reference,
                "Pending",
                now,
                now,
            ),
        )
        order_id = cursor.lastrowid
        for product, quantity, size, item_price, item_add_ons, item_add_ons_total, line_total in order_items:
            conn.execute(
                "INSERT INTO order_items (order_id,product_id,title,size,price,add_ons,add_ons_total,quantity,line_total) VALUES (?,?,?,?,?,?,?,?,?)",
                (order_id, product["id"], product["title"], size, item_price, item_add_ons, item_add_ons_total, quantity, line_total),
            )

        for product_id, quantity in quantities_by_id.items():
            product = products_by_id[product_id]
            available_quantity = max(0, int(product["stock"] or 0))
            additional_quantity = max(0, quantity - available_quantity)
            conn.execute(
                "UPDATE products SET stock = MAX(stock - ?, 0), updated_at = ? WHERE id = ?",
                (min(quantity, available_quantity), now, product["id"]),
            )
            if additional_quantity > 0:
                conn.execute(
                    """
                    INSERT INTO stock_requests
                    (product_id,product_title,order_id,customer_name,phone,email,ordered_quantity,available_quantity,additional_quantity,notes,status,created_at)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                    """,
                    (
                        product["id"],
                        product["title"],
                        order_id,
                        payload.customer_name.strip(),
                        payload.phone.strip(),
                        payload.email.lower(),
                        quantity,
                        available_quantity,
                        additional_quantity,
                        (payload.notes or "").strip(),
                        "Pending",
                        now,
                    ),
                )
        return {
            "id": order_id,
            "order_number": order_number(order_id),
            "subtotal": subtotal,
            "delivery_fee": DELIVERY_FEE,
            "total": total,
            "status": "Pending",
            "payment_method": payload.payment_method,
            "payment_status": payment_status,
            "transaction_reference": transaction_reference,
        }


@app.post("/api/stock-requests")
def stock_request(payload: StockRequestPayload):
    now = int(time.time())
    with db() as conn:
        product = product_row(conn, payload.product_id)
        if not product["active"]:
            raise HTTPException(status_code=400, detail=f"{product['title']} is not available.")
        cursor = conn.execute(
            """
            INSERT INTO stock_requests (product_id,product_title,customer_name,phone,email,notes,status,created_at)
            VALUES (?,?,?,?,?,?,?,?)
            """,
            (product["id"], product["title"], payload.customer_name.strip(), payload.phone.strip(), payload.email.lower(), (payload.notes or "").strip(), "Pending", now),
        )
        return {"id": cursor.lastrowid, "message": "Request received."}


@app.post("/api/admin/signup")
def first_admin_signup(payload: AdminCreate):
    with db() as conn:
        if conn.execute("SELECT COUNT(*) FROM admins").fetchone()[0] > 0:
            raise HTTPException(status_code=403, detail="Signup is closed. Super Admins must create new users.")
        now = int(time.time())
        conn.execute(
            "INSERT INTO admins (name,email,password_hash,role,created_at) VALUES (?,?,?,?,?)",
            (payload.name.strip(), payload.email.lower(), password_hash(payload.password), "super_admin", now),
        )
    return {"message": "Super Admin created. You can log in now."}


@app.post("/api/admin/login")
def login(payload: LoginPayload):
    with db() as conn:
        admin = conn.execute("SELECT * FROM admins WHERE email = ?", (payload.email.lower(),)).fetchone()
        if not admin or not verify_password(payload.password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        token = secrets.token_urlsafe(32)
        expires = int(time.time()) + SESSION_SECONDS
        conn.execute("DELETE FROM admin_sessions WHERE expires_at <= ?", (int(time.time()),))
        conn.execute("INSERT INTO admin_sessions (token,admin_id,expires_at) VALUES (?,?,?)", (token, admin["id"], expires))
        return {"token": token, "admin": {"id": admin["id"], "name": admin["name"], "email": admin["email"], "role": admin["role"]}, "expires_at": expires}


@app.post("/api/admin/password-reset/request")
def request_password_reset(payload: PasswordResetRequestPayload, request: Request):
    now = int(time.time())
    response = {"message": "If that email is registered, a recovery link will arrive shortly."}
    with db() as conn:
        conn.execute("DELETE FROM admin_password_resets WHERE expires_at <= ? OR used_at IS NOT NULL", (now,))
        admin = conn.execute("SELECT * FROM admins WHERE email = ?", (payload.email.lower(),)).fetchone()
        if admin:
            token = secrets.token_urlsafe(48)
            reset_url = password_reset_url(request, token)
            conn.execute(
                "INSERT INTO admin_password_resets (token_hash,admin_id,expires_at,created_at) VALUES (?,?,?,?)",
                (token_hash(token), admin["id"], now + PASSWORD_RESET_SECONDS, now),
            )
            try:
                if not send_password_reset_email(admin["email"], admin["name"], reset_url):
                    raise HTTPException(status_code=500, detail="Recovery email could not be sent because SMTP is not configured.")
            except HTTPException:
                raise
            except Exception as error:
                logger.exception("Password reset email failed to send.")
                raise HTTPException(status_code=500, detail=f"Recovery email could not be sent: {error}")
    return response


@app.post("/api/admin/password-reset/confirm")
def confirm_password_reset(payload: PasswordResetPayload):
    now = int(time.time())
    hashed_token = token_hash(payload.token)
    with db() as conn:
        reset = conn.execute(
            """
            SELECT * FROM admin_password_resets
            WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
            """,
            (hashed_token, now),
        ).fetchone()
        if not reset:
            raise HTTPException(status_code=400, detail="This recovery link is invalid or has expired.")
        conn.execute("UPDATE admins SET password_hash = ? WHERE id = ?", (password_hash(payload.password), reset["admin_id"]))
        conn.execute("UPDATE admin_password_resets SET used_at = ? WHERE token_hash = ?", (now, hashed_token))
        conn.execute("DELETE FROM admin_sessions WHERE admin_id = ?", (reset["admin_id"],))
    return {"message": "Password updated. You can log in with the new password now."}


@app.get("/api/admin/me")
def me(admin=Depends(require_permission("dashboard:view"))):
    return {"id": admin["id"], "name": admin["name"], "email": admin["email"], "role": admin["role"]}


@app.post("/api/admin/logout")
def logout(authorization: Annotated[str | None, Header()] = None):
    if authorization and authorization.startswith("Bearer "):
        with db() as conn:
            conn.execute("DELETE FROM admin_sessions WHERE token = ?", (authorization.removeprefix("Bearer ").strip(),))
    return {"message": "Logged out."}


@app.get("/api/admin/products")
def admin_products(admin=Depends(require_permission("products:view"))):
    with db() as conn:
        return serialize_products(conn.execute("SELECT * FROM products ORDER BY updated_at DESC, id DESC").fetchall(), conn)


@app.post("/api/admin/products")
def create_product(payload: ProductPayload, admin=Depends(require_permission("products:create"))):
    now = int(time.time())
    image_url = storage_image_url(payload.image_url)
    with db() as conn:
        base = slugify(payload.title)
        slug = base
        index = 2
        while conn.execute("SELECT id FROM products WHERE slug = ?", (slug,)).fetchone():
            slug = f"{base}-{index}"
            index += 1
        cursor = conn.execute(
            """
            INSERT INTO products (slug,title,summary,description,price,category,stock,image_url,featured,active,out_of_stock,created_at,updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (slug, payload.title.strip(), payload.summary.strip(), payload.description.strip(), payload.price, payload.category, payload.stock, image_url, int(payload.featured), int(payload.active), int(payload.out_of_stock), now, now),
        )
        product_id = cursor.lastrowid
        set_product_images(conn, product_id, [image_url])
        return serialize_product(product_row(conn, product_id), conn)


@app.put("/api/admin/products/{product_id}")
def update_product(product_id: int, payload: ProductPayload, admin=Depends(require_permission("products:update"))):
    now = int(time.time())
    with db() as conn:
        existing = product_row(conn, product_id)
        next_image_url = storage_image_url(payload.image_url)
        conn.execute(
            """
            UPDATE products SET title=?,summary=?,description=?,price=?,category=?,stock=?,image_url=?,featured=?,active=?,out_of_stock=?,updated_at=?
            WHERE id=?
            """,
            (payload.title.strip(), payload.summary.strip(), payload.description.strip(), payload.price, payload.category, payload.stock, next_image_url, int(payload.featured), int(payload.active), int(payload.out_of_stock), now, product_id),
        )
        if public_asset_url(existing["image_url"]) != public_asset_url(next_image_url):
            set_product_images(conn, product_id, [next_image_url])
        return serialize_product(product_row(conn, product_id), conn)


@app.patch("/api/admin/products/{product_id}/stock")
def update_stock(product_id: int, payload: StockPayload, admin=Depends(require_permission("inventory:update"))):
    with db() as conn:
        product_row(conn, product_id)
        if payload.out_of_stock is None:
            conn.execute("UPDATE products SET stock=?, updated_at=? WHERE id=?", (payload.stock, int(time.time()), product_id))
        else:
            conn.execute(
                "UPDATE products SET stock=?, out_of_stock=?, updated_at=? WHERE id=?",
                (payload.stock, int(payload.out_of_stock), int(time.time()), product_id),
            )
        return serialize_product(product_row(conn, product_id), conn)


@app.post("/api/admin/products/{product_id}/image")
async def upload_product_image(
    product_id: int,
    images: list[UploadFile] = File(default=[]),
    image_slots: list[int] = Form(default=[]),
    existing_images: list[str] = Form(default=[]),
    admin=Depends(require_permission("products:update")),
):
    if len(images) > 5:
        raise HTTPException(status_code=400, detail="Upload up to 5 images for one product.")
    if image_slots and len(image_slots) != len(images):
        raise HTTPException(status_code=400, detail="Image slot data did not match uploaded images.")

    image_urls = [public_asset_url(str(url or "").strip()) if str(url or "").strip() else "" for url in existing_images[:5]]
    while len(image_urls) < 5:
        image_urls.append("")

    for index, image in enumerate(images):
        if image.content_type not in {"image/jpeg", "image/png", "image/webp", "image/gif"}:
            raise HTTPException(status_code=400, detail="Upload JPG, PNG, WebP, or GIF images.")
        slot = image_slots[index] if image_slots else index
        if slot < 0 or slot > 4:
            raise HTTPException(status_code=400, detail="Image slots must be between 1 and 5.")
        suffix = Path(image.filename or "").suffix.lower() or ".jpg"
        filename = f"product-{product_id}-{secrets.token_hex(8)}{suffix}"
        target = UPLOAD_DIR / filename
        target.write_bytes(await image.read())
        image_urls[slot] = f"/assets/uploads/{filename}"

    image_urls = [url for url in image_urls if str(url or "").strip()]
    if not image_urls:
        raise HTTPException(status_code=400, detail="Upload at least one image.")

    with db() as conn:
        product_row(conn, product_id)
        set_product_images(conn, product_id, image_urls)
    return {"image_url": image_urls[0], "images": image_urls}


@app.delete("/api/admin/products/{product_id}")
def delete_product(product_id: int, admin=Depends(require_permission("products:delete"))):
    with db() as conn:
        product_row(conn, product_id)
        conn.execute("UPDATE products SET active=0, updated_at=? WHERE id=?", (int(time.time()), product_id))
    return {"message": "Product removed from public catalog."}


@app.get("/api/admin/orders")
def admin_orders(admin=Depends(require_permission("orders:view"))):
    with db() as conn:
        orders = rows_dict(conn.execute("SELECT * FROM orders ORDER BY created_at DESC").fetchall())
        for order in orders:
            order["order_number"] = order_number(order["id"])
            order["items"] = rows_dict(conn.execute("SELECT * FROM order_items WHERE order_id = ?", (order["id"],)).fetchall())
        return orders


@app.patch("/api/admin/orders/{order_id}/status")
def update_order_status(order_id: int, payload: OrderStatusPayload, admin=Depends(require_permission("orders:update"))):
    with db() as conn:
        order = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found.")
        conn.execute("UPDATE orders SET status=?, updated_at=? WHERE id=?", (payload.status, int(time.time()), order_id))
        return {"message": "Order status updated.", "status": payload.status}


@app.patch("/api/admin/orders/{order_id}/payment-status")
def update_payment_status(order_id: int, payload: PaymentStatusPayload, admin=Depends(require_permission("orders:update"))):
    with db() as conn:
        order = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found.")
        conn.execute("UPDATE orders SET payment_status=?, updated_at=? WHERE id=?", (payload.payment_status, int(time.time()), order_id))
        return {"message": "Payment status updated.", "payment_status": payload.payment_status}


@app.get("/api/admin/stock-requests")
def admin_stock_requests(admin=Depends(require_permission("orders:view"))):
    with db() as conn:
        requests = rows_dict(conn.execute("SELECT * FROM stock_requests ORDER BY created_at DESC").fetchall())
        for item in requests:
            item["order_number"] = order_number(item["order_id"]) if item.get("order_id") else None
        return requests


@app.patch("/api/admin/stock-requests/{request_id}/status")
def update_stock_request_status(request_id: int, payload: StockRequestStatusPayload, admin=Depends(require_permission("orders:update"))):
    with db() as conn:
        request = conn.execute("SELECT * FROM stock_requests WHERE id = ?", (request_id,)).fetchone()
        if not request:
            raise HTTPException(status_code=404, detail="Request not found.")
        conn.execute("UPDATE stock_requests SET status=? WHERE id=?", (payload.status, request_id))
        return {"message": "Request status updated.", "status": payload.status}


@app.get("/api/admin/sales")
def sales(admin=Depends(require_permission("sales:view"))):
    with db() as conn:
        orders = rows_dict(conn.execute("SELECT * FROM orders ORDER BY created_at DESC").fetchall())
        delivered = [order for order in orders if order["status"] == "Delivered"]
        best = rows_dict(conn.execute(
            """
            SELECT title, SUM(quantity) AS quantity, SUM(line_total) AS revenue
            FROM order_items GROUP BY product_id, title ORDER BY quantity DESC LIMIT 8
            """
        ).fetchall())
        low_stock = rows_dict(conn.execute("SELECT * FROM products WHERE active=1 AND stock <= 5 ORDER BY stock ASC").fetchall())
        revenue = rows_dict(conn.execute(
            """
            SELECT date(created_at, 'unixepoch') AS day, SUM(total) AS total
            FROM orders WHERE status != 'Cancelled' GROUP BY day ORDER BY day DESC LIMIT 30
            """
        ).fetchall())
        return {
            "total_sales": sum(order["total"] for order in orders if order["status"] != "Cancelled"),
            "total_orders": len(orders),
            "pending_orders": sum(1 for order in orders if order["status"] == "Pending"),
            "completed_orders": len(delivered),
            "cancelled_orders": sum(1 for order in orders if order["status"] == "Cancelled"),
            "revenue_by_day": revenue,
            "best_selling": best,
            "low_stock": low_stock,
            "recent_orders": orders[:8],
        }


@app.get("/api/admin/users")
def list_admins(admin=Depends(require_permission("admins:manage"))):
    with db() as conn:
        return rows_dict(conn.execute("SELECT id,name,email,role,created_at FROM admins ORDER BY created_at DESC").fetchall())


@app.post("/api/admin/users")
def create_admin(payload: AdminCreate, admin=Depends(require_permission("admins:manage"))):
    with db() as conn:
        try:
            cursor = conn.execute(
                "INSERT INTO admins (name,email,password_hash,role,created_at) VALUES (?,?,?,?,?)",
                (payload.name.strip(), payload.email.lower(), password_hash(payload.password), payload.role, int(time.time())),
            )
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=400, detail="An admin with this email already exists.")
        return row_dict(conn.execute("SELECT id,name,email,role,created_at FROM admins WHERE id=?", (cursor.lastrowid,)).fetchone())


@app.patch("/api/admin/users/{admin_id}/role")
def update_admin_role(admin_id: int, payload: RolePayload, admin=Depends(require_permission("admins:manage"))):
    with db() as conn:
        if admin_id == admin["id"] and payload.role != "super_admin":
            raise HTTPException(status_code=400, detail="You cannot demote your own Super Admin account.")
        conn.execute("UPDATE admins SET role=? WHERE id=?", (payload.role, admin_id))
        return {"message": "Role updated."}


@app.delete("/api/admin/users/{admin_id}")
def remove_admin(admin_id: int, admin=Depends(require_permission("admins:manage"))):
    if admin_id == admin["id"]:
        raise HTTPException(status_code=400, detail="You cannot remove your own account.")
    with db() as conn:
        conn.execute("DELETE FROM admins WHERE id=?", (admin_id,))
    return {"message": "User removed."}


@app.get("/admin")
def admin_page():
    return FileResponse(ADMIN_DIR / "admin.html")


@app.get("/admin/")
def admin_page_slash():
    return FileResponse(ADMIN_DIR / "admin.html")


@app.get("/admin/panel")
def admin_panel_page():
    return FileResponse(ADMIN_DIR / "panel.html")


@app.get("/admin/panel.html")
def admin_panel_file():
    return FileResponse(ADMIN_DIR / "panel.html")


@app.get("/admin.css")
def legacy_admin_styles():
    return FileResponse(ADMIN_DIR / "admin.css")


@app.get("/admin.js")
def legacy_admin_script():
    return FileResponse(ADMIN_DIR / "admin.js")


@app.get("/admin/admin.css")
def admin_nested_styles():
    return FileResponse(ADMIN_DIR / "admin.css")


@app.get("/admin/admin.js")
def admin_nested_script():
    return FileResponse(ADMIN_DIR / "admin.js")


app.mount("/app-assets", StaticFiles(directory=DIST_DIR / "app-assets", check_dir=False), name="app-assets")
app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")
app.mount("/admin-static", StaticFiles(directory=ADMIN_DIR), name="admin-static")


def storefront_index():
    index = DIST_DIR / "index.html"
    if index.exists():
        return FileResponse(index)
    raise HTTPException(status_code=404, detail="React build not found. Run `npm run build` first.")


@app.get("/")
def home_page():
    return storefront_index()


@app.get("/{filename}")
def public_file(filename: str):
    if filename in SPA_ROUTES:
        return storefront_index()
    raise HTTPException(status_code=404, detail="Not found.")


@app.get("/products/{slug}")
def product_page(slug: str):
    return storefront_index()
