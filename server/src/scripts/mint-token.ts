import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// Script de DÉVELOPPEMENT : génère un JWT de test pour appeler les routes
// protégées (il n'existe pas de route de login). Ce n'est PAS un endpoint.
//
// Usage : npm run mint-token -- --id=dev-user --role=ADMIN --hours=24
function arg(name: string, fallback: string): string {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? (found.split('=')[1] ?? fallback) : fallback;
}

const id = arg('id', 'dev-user');
const role = arg('role', 'ADMIN');
const hours = Number(arg('hours', '24'));

if (role !== 'ADMIN' && role !== 'MEMBRE') {
  console.error('Rôle invalide. Utilisez --role=ADMIN ou --role=MEMBRE.');
  process.exit(1);
}

const token = jwt.sign({ role }, env.JWT_SECRET, {
  subject: id,
  expiresIn: hours * 3600, // en secondes
});

console.log(token);
