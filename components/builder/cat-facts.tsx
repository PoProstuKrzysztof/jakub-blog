import { FC } from 'react'

/**
 * CatFacts - React Server Component do wyświetlania kilku ciekawostek o kotach.
 * Komponent jest zarejestrowany w Builder.io (patrz lib/builder-register.ts),
 * atrybut `isRSC` jest wymagany, aby Builder poprawnie wyrenderował RSC
 * po stronie serwera.
 */
async function CatFacts() {
  const facts: Array<{ _id: string; text: string }> = await fetch(
    'https://cat-fact.herokuapp.com/facts',
    { next: { revalidate: 3600 } } // revalidate co godzinę
  ).then((r) => r.json())

  return (
    <div className="space-y-2">
      <p className="font-semibold">Kilka ciekawostek o kotach:</p>
      <ul className="list-disc list-inside">
        {facts.slice(0, 5).map((fact) => (
          <li key={fact._id}>{fact.text}</li>
        ))}
      </ul>
    </div>
  )
}

export const CatFactsInfo = {
  name: 'CatFacts',
  component: CatFacts as FC,
  isRSC: true,
} 