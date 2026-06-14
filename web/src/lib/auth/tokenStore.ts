// Stockage du jeton d'authentification EN MÉMOIRE uniquement.
// Jamais localStorage ni sessionStorage : le jeton est volontairement perdu
// au rechargement de la page (choix de sécurité).
let token: string | null = null;

export const tokenStore = {
  get(): string | null {
    return token;
  },
  set(value: string): void {
    token = value;
  },
  clear(): void {
    token = null;
  },
};
