import { describe, it, expect } from 'vitest';
import { parseContactsCsv } from './import';

describe('parseContactsCsv', () => {
  it('analyse les lignes valides', () => {
    const csv = [
      'prenom,nom,organisation,email',
      'Lucie,Martin,Mairie de Paris,lucie@paris.fr',
      'Karim,Benali,,karim@orange.fr',
    ].join('\n');
    const result = parseContactsCsv(csv);
    expect(result.valides).toHaveLength(2);
    expect(result.valides[0]).toMatchObject({
      prenom: 'Lucie',
      nom: 'Martin',
      organisation: 'Mairie de Paris',
      email: 'lucie@paris.fr',
    });
    // organisation vide -> champ absent
    expect(result.valides[1]!.organisation).toBeUndefined();
    expect(result.ignorees).toBe(0);
  });

  it('ignore les lignes sans prénom ou nom', () => {
    const csv = ['prenom,nom', 'Lucie,', ',Martin', 'Eva,Nguyen'].join('\n');
    const result = parseContactsCsv(csv);
    expect(result.valides).toHaveLength(1);
    expect(result.ignorees).toBe(2);
  });
});
