import logo from './logo.svg';
import './App.css';
import { useState } from "react";


function Room() {

  const [isLit, setLit] = useState(true);
  
  const toggle = () => {
    setLit(!isLit);
    console.log("I am running");
  }

  return (
    <div>
      {(isLit) ? "room is Lit" : "room is Dark"}

      <br />
      <button onClick={toggle}>Change</button>
    </div>
  );
}



function App() {
  return (
    <div className="App">
      <Room />
    </div>
  );
}

export default App;
