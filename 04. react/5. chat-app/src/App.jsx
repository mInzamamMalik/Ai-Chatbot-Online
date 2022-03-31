import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from "react";
import axios from "axios";


function ChatWindow() {

  const [userText, setUserText] = useState("");
  const [messages, setMessages] = useState([]);

  // setUserText("sdkjfhdkfjs");
  // setUserText((prev)=>{
  //   return prev + " some new value";
  // })

  const sendMessage = (e) => {
    e.preventDefault();

    setMessages((prev) => (
      [{ sender: "user", text: userText }, ...prev]
    ));

    // TODO: send message on dialogflow and get reply

    setUserText("");

    setTimeout(() => {
      setMessages((prev) => (
        [{ sender: "chatbot", text: "hello from chatbot" }, ...prev]
      ));
    }, 1000);

  }


  return <>
    <h1>Chat app</h1>

    <form onSubmit={sendMessage}>
      <input type="text" onChange={(e) => { setUserText(e.target.value) }} />

      <button>Send</button>
    </form>

    <div>
      {messages.map((eachMessage, index) => (
        <>
          <h3>{eachMessage.sender}: </h3>
          <p>{eachMessage.text}</p>
        </>
      ))}
    </div>



  </>
}




function App() {
  return <ChatWindow />;
}
export default App;
