// Mapowanie produktów między stroną współpracy a panelem użytkownika
export const PRODUCT_MAPPING = {
  // Jednorazowe produkty
  CONSULTATION: {
    id: 2,
    title: "Konsultacja Majątkowa-Edukacyjna",
    slug: "consultation",
    cooperationPageId: 2
  },
  STUDENT_PACKAGE: {
    id: 5,
    title: "Pakiet Biedny Student",
    slug: "student-package",
    cooperationPageId: 5
  },
  STARTER_PACKAGE: {
    id: 3,
    title: "Pakiet Startowy",
    slug: "starter-package",
    cooperationPageId: 3
  },
  MODELS_ACCESS: {
    id: 4,
    title: "Dostęp do modeli",
    slug: "models-access",
    cooperationPageId: 4
  },
  
  // Subskrypcje
  INVESTMENT_SUPPORT: {
    id: 1,
    title: "Wsparcie Inwestycyjne",
    slug: "investment-support",
    cooperationPageId: 1
  }
} as const

export type ProductId = keyof typeof PRODUCT_MAPPING

/**
 * Pobiera informacje o produkcie na podstawie ID ze strony współpracy
 */
export function getProductByCooperationId(cooperationId: number) {
  return Object.values(PRODUCT_MAPPING).find(
    product => product.cooperationPageId === cooperationId
  )
}

/**
 * Pobiera informacje o produkcie na podstawie slug
 */
export function getProductBySlug(slug: string) {
  return Object.values(PRODUCT_MAPPING).find(
    product => product.slug === slug
  )
}

/**
 * Sprawdza czy produkt istnieje na podstawie ID ze strony współpracy
 */
export function isValidCooperationProductId(cooperationId: number): boolean {
  return Object.values(PRODUCT_MAPPING).some(
    product => product.cooperationPageId === cooperationId
  )
}

/**
 * Pobiera wszystkie dostępne produkty jednorazowe
 */
export function getOneTimeProducts() {
  return [
    PRODUCT_MAPPING.CONSULTATION,
    PRODUCT_MAPPING.STUDENT_PACKAGE,
    PRODUCT_MAPPING.STARTER_PACKAGE,
    PRODUCT_MAPPING.MODELS_ACCESS
  ]
}

/**
 * Pobiera wszystkie dostępne subskrypcje
 */
export function getSubscriptionProducts() {
  return [
    PRODUCT_MAPPING.INVESTMENT_SUPPORT
  ]
} 