// Tymczasowo wyłączone - instalowanie Stripe ma problemy na Windows
// import Stripe from 'stripe'

/**
 * Tymczasowa zaślepka dla klienta Stripe.
 * TODO: Zainstalować stripe i przywrócić właściwą implementację
 */
export function getStripeClient(): any {
  throw new Error('Stripe nie jest aktualnie skonfigurowany - zainstaluj pakiet "stripe"')
} 