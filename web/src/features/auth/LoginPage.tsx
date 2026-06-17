import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    login(email);
    navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-scene px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border-2 border-projecteur bg-papier p-8"
      >
        <h1 className="text-2xl font-extrabold text-encre">
          Eloquentia Strasbourg
        </h1>
        <p className="mt-1 text-sm text-encre-3">
          Connexion à l'outil de pilotage
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@eloquentia.fr"
          />
          <Input
            label="Mot de passe"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="Mot de passe"
          />
          <Button type="submit" variant="primary" className="w-full">
            Se connecter
          </Button>
        </div>
      </form>
    </div>
  );
}
