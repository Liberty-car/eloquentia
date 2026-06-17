// Formate une date ISO (AAAA-MM-JJ) en francais, sans decalage de fuseau.
export function formatDateFr(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
