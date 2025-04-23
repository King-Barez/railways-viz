import React from 'react';
import './App.css';

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold my-6">Railways Viz</h1>

      {/* Prima immagine con didascalia */}
      <div className="my-4 text-center">
        <figure>
          <img
            src="https://placehold.co/1000x128"
            alt="Immagine 1"
            className="w-full max-w-lg rounded-lg shadow-lg"
          />
          <figcaption className="mt-2 text-xl font-medium text-gray-700">Immagine 1: Una descrizione</figcaption>
        </figure>
      </div>

      {/* Seconda immagine con didascalia */}
      <div className="my-4 text-center">
        <figure>
          <img
            src="https://placehold.co/1000x128"
            alt="Immagine 2"
            className="w-full max-w-lg rounded-lg shadow-lg"
          />
          <figcaption className="mt-2 text-xl font-medium text-gray-700">Immagine 2: Un'altra descrizione</figcaption>
        </figure>
      </div>
    </div>
  );
}

export default App;
