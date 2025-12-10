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
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}
