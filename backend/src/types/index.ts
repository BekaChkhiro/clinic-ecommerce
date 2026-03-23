/**
 * Shared Types
 *
 * Common type definitions for MedPharma Plus
 */

// Product Type enum (for legal disclaimers)
export enum ProductType {
  SUPPLEMENT = "SUPPLEMENT",       // საკვები დანამატი
  SPECIAL_FOOD = "SPECIAL_FOOD",   // სპეც. სამედიცინო საკვები (PKU, დიაბეტური)
  MEDICATION = "MEDICATION",       // მედიკამენტი
  COSMETIC = "COSMETIC",           // კოსმეტიკა/ჰიგიენა
  DEVICE = "DEVICE",               // სამედიცინო მოწყობილობა
  OTHER = "OTHER",                 // სხვა
}

// Custom Order Status enum
export enum OrderStatus {
  PENDING = "PENDING",                     // მოლოდინში
  CONFIRMED = "CONFIRMED",                 // დადასტურებული
  PACKED = "PACKED",                       // შეფუთული
  COURIER_ASSIGNED = "COURIER_ASSIGNED",   // კურიერი მინიჭებული
  SHIPPED = "SHIPPED",                     // გაგზავნილი
  DELIVERED = "DELIVERED",                 // მიწოდებული
  CANCELLED = "CANCELLED",                 // გაუქმებული
}

// Banner position enum
export enum BannerPosition {
  HOMEPAGE = "homepage",
  CATEGORY = "category",
  PRODUCT = "product",
}

// Working hours type
export interface WorkingHours {
  weekdays: { open: string; close: string } | null
  saturday: { open: string; close: string } | null
  sunday: { open: string; close: string } | null
}

// Coordinates type
export interface Coordinates {
  lat: number
  lng: number
}

// Bilingual text helper type
export interface BilingualText {
  ka: string
  en: string
}
