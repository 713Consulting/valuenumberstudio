import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ProtectedConceptsPage from "./components/ProtectedConceptsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/concepts" element={<ProtectedConceptsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;