import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPrice(amount: number) {
  return `Rp ${amount.toLocaleString("en-US")}`; // Rp 500,000
}

export function formatPriceShort(amount: number) {
  return `Rp ${Math.round(amount / 1000)}k`; // Rp 750k
}