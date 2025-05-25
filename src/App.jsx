import React from 'react'
import Weather from './components/Weather'
import './index.css' // make sure your CSS variables are in this file

function App() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark-theme');
  };

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme}>
        🌙 Dark
      </button>

      <Weather />
    </>
  );
}

export default App;
