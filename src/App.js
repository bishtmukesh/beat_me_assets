import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Room from './pages/Room';

import TestPage  from './pages/TestPage';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="content">
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/room/:roomCode" element={<Room />} />
              <Route path="*" element={<h2>404 Not Found</h2>} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
