export function normalizePath(pathname) {
  const clean = pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  return clean === "/index" ? "/" : clean;
}