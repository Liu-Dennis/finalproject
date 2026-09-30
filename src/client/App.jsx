import { useState } from "react";
// import "./App.css";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./homepage.jsx";

function App() {


  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/pfolio/:username" element={<UserPortfolio/>}> </Route> */}
      </Routes> 
    </div>
    </BrowserRouter>
  );
}

export default App;
