import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export function formatDate(date) {
  return dayjs(date).format("D MMM YYYY");
}

export function formatDateTime(date) {
  return dayjs(date).format("D MMM YYYY, h:mm A");
}

export function timeAgo(date) {
  return dayjs(date).fromNow();
}

export function formatCurrency(amount, currency = "INR", locale = "en-IN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toLabel(str) {
  return str.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export function formatNumber(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatDistance(value, unit = "km") {
  if (value == null) return "—";
  return `${formatNumber(value)} ${unit}`;
}
