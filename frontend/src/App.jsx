import React from 'react';

function App() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <h1 className="text-4xl font-extrabold text-blue-600 underline mb-4">
        Hola
      </h1>
      <p className="text-slate-600 font-medium">
         funciona perfectamente.
      </p>
    </div>
  );
}

export default App; // <-- ¡Este es el export que faltaba!