export default function Icon({ type }) {
  if (type === "zoom") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M10.5 7.5v6M7.5 10.5h6"/></svg>;
  if (type === "account") return <svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.5-5 3-7 7-7s6.5 2 7 7"/></svg>;
  if (type === "heart") return <svg viewBox="0 0 24 24"><path d="m12 20-1.4-1.3C5.4 14.1 2 11 2 7.3 2 4.3 4.4 2 7.4 2c1.7 0 3.3.8 4.6 2.1C13.3 2.8 14.9 2 16.6 2 19.6 2 22 4.3 22 7.3c0 3.7-3.4 6.8-8.6 11.4L12 20Z"/></svg>;
  if (type === "bag") return <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>;
  if (type === "eye") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z"/><circle cx="12" cy="12" r="3.2"/></svg>;
  if (type === "chevron-left") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>;
  if (type === "chevron-right") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
