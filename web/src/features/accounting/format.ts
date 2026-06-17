// Formatage monétaire fr-FR.
export function formatEuros(montant: number): string {
  return montant.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
