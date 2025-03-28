import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Positions from './components/Positions';
import PositionDetails from './components/PositionDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/positions" element={<Positions />} />
          <Route path="/positions/:id" element={<PositionDetails />} />
          <Route path="/" element={<Navigate to="/positions" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
