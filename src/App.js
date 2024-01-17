// App.js
import React from 'react';
import Weather from './weather/weather';
import './App.css';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
      </header>
      <main className="main-content">
        <Weather />
      </main>
    </div>
  );
}

export default App;
