import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DemoDataToggle } from './DemoDataToggle';
import { createCollectionStore } from '../lib/store/createCollectionStore';

interface Widget {
  id: string;
  name: string;
}

const seeder = (): Widget[] => [{ id: 'w1', name: 'Alpha' }];

describe('DemoDataToggle', () => {
  beforeEach(() => localStorage.clear());

  it('active puis désactive les données de démo', async () => {
    const store = createCollectionStore<Widget>('test:demo', seeder);
    render(<DemoDataToggle store={store} />);

    const button = await screen.findByRole('button');
    expect(button).toHaveTextContent('désactivées');

    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('activées'));
    expect(await store.list()).toHaveLength(1);

    fireEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent('désactivées'));
    expect(await store.list()).toHaveLength(0);
  });
});
