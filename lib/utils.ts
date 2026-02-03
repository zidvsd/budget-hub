import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDesktopScreen() {
  if (window.innerWidth > 1024) return true;
}
export const getRoleFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const roleCookie = cookies.find((cookie) => cookie.startsWith("role="));
  return roleCookie ? roleCookie.split("=")[1] : null;
};

export function getFirstName(name: string) {
  return name.split(" ")[0];
}
export function getFirstChar(name: string) {
  return name.split("")[0];
}
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-PH", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateFull(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-PH", {
    month: "long", // "November"
    day: "numeric", // "26"
    year: "numeric", // "2025"
  }).format(date);
}

export function formatPrice(price: number | string) {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return numericPrice.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
export function truncateId(text: string) {
  return text.slice(0, 8) + "...";
}
export function upperCaseFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  let past = new Date(date);

  if (typeof date === "string" && !date.includes("Z") && !date.includes("+")) {
    past = new Date(`${date.replace(" ", "T")}Z`);
  }

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Time units in seconds
  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const month = 2592000;
  const year = 31536000;

  if (diffInSeconds < 5) return "just now";

  if (diffInSeconds < minute) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < hour) {
    const mins = Math.floor(diffInSeconds / minute);
    return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < day) {
    const hrs = Math.floor(diffInSeconds / hour);
    return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < month) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffInSeconds / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}
