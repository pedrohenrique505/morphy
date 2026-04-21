import './App.css';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-4">Minimalist Chess</h1>
      
      {/* Placeholder for Phase 2 */}
      <div className="board">
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isLight = (row + col) % 2 === 0;
          return (
            <div key={i} className={`square ${isLight ? 'light' : 'dark'}`}>
              {/* Piece placeholder */}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-gray-600">Waiting for Phase 2...</p>
    </div>
  );
}

export default App;
