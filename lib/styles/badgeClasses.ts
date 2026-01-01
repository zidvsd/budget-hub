// badgeClasses.ts

export const availabilityClasses = {
  available: "text-green-500 font-medium",
  unavailable: "text-red-500 font-medium",
};

export const stockStatusClasses = {
  outOfStock:
    "px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium",
  lowStock:
    "px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium",
  inStock:
    "px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium",
};

export const orderStatusClasses: Record<string, string> = {
  pending:
    "px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium",
  processing:
    "px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium",
  completed:
    "px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium",
  cancelled:
    "px-2 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium",
};
