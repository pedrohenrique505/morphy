// App.tsx — Root component. Board manages its own state from Phase 2 onward.

import Board from './components/Board';

function App() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ fontFamily: 'var(--font-family-ui)' }}
      >
        Morphy Chess
      </h1>

      <Board />

      <p className="text-sm" style={{ color: 'var(--color-on-surface)', opacity: 0.5 }}>
        Phase 2 — Drag & Drop
      </p>
    </main>
  );
}

export default App;
