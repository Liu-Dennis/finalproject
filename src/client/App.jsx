import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./homepage.jsx";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes> 
    </div>
    </BrowserRouter>
  );
}

export default App;
