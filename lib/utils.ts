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
