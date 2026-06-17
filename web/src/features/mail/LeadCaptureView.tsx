import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { LeadFormValues } from './types';

const VIDE: LeadFormValues = {
  prenom: '',
  nom: '',
  organisation: '',
  email: '',
  message: '',
};

export function LeadCaptureView({
  onSubmit,
}: {
  onSubmit: (values: LeadFormValues) => void;
}) {
  const [values, setValues] = useState<LeadFormValues>(VIDE);

  function set<K extends keyof LeadFormValues>(
    key: K,
    value: LeadFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const peutEnvoyer = values.prenom.trim() !== '' && values.nom.trim() !== '';

  function envoyer() {
    if (!peutEnvoyer) return;
    onSubmit({
      prenom: values.prenom.trim(),
      nom: values.nom.trim(),
      organisation: values.organisation.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
    setValues(VIDE);
  }

  return (
    <div className="max-w-xl">
      <div className="rounded-xl border-2 border-projecteur bg-papier p-5">
        <h2 className="text-lg font-bold text-encre">Formulaire de contact</h2>
        <p className="mt-1 mb-4 text-sm text-encre-3">
          Simule un formulaire public : chaque envoi crée un contact « lead »
          dans le CRM (étape « À contacter »).
        </p>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              value={values.prenom}
              onChange={(e) => set('prenom', e.target.value)}
            />
            <Input
              label="Nom"
              value={values.nom}
              onChange={(e) => set('nom', e.target.value)}
            />
          </div>
          <Input
            label="Organisation"
            value={values.organisation}
            onChange={(e) => set('organisation', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lead-message"
              className="text-xs font-medium text-encre-3"
            >
              Message
            </label>
            <textarea
              id="lead-message"
              rows={4}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              className="rounded-[10px] border border-trait bg-scene px-3 py-2 text-sm text-encre placeholder:text-encre-4 focus:border-focus focus:outline-none focus:ring-2 focus:ring-focus/30"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" onClick={envoyer} disabled={!peutEnvoyer}>
              Envoyer la demande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
