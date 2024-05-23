import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { api1, api2 } from './api/test';

function App() {
  
  useEffect( () => {
    (async () => { 
      const response1 = await api1();
      const response2 = await api2('Mukesh');

      console.log("Response one is - ", response1);
      console.log("Response two is - ", response2);
    })();
  });
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
