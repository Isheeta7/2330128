import React from 'react';
import Registration from './components/Registration';
import Authentication from './components/Authentication';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Notification App - Frontend</h1>
      <Registration />
      <Authentication />
    </div>
  );
}

export default App;
