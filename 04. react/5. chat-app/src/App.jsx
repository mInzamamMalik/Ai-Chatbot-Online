import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Stack, Container, Row, Col } from 'react-bootstrap';



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
    <h1 className='heading'>CHAT APP</h1>

    <form onSubmit={sendMessage} className="form">

      <Stack direction="horizontal" gap={3}>
        <Form.Control className="me-auto inputField" type="text" placeholder="Enter your text here" onChange={(e) => { setUserText(e.target.value) }} />
        <Button variant="secondary" className='submitButton'>Submit</Button>
      </Stack>

    </form>

    <div>


      <Container>
        {messages.map((eachMessage, index) => (
          (eachMessage.sender === "user") ?
            (<Row >
              <Col xs={3}></Col>
              <Col className='message user-message'>{eachMessage.text}</Col>
            </Row>)
            :
            (<Row >
              <Col className='message chatbot-message'>{eachMessage.text}</Col>
              <Col xs={3}></Col>
            </Row>)

        ))}
      </Container>





    </div>



  </>
}




function App() {
  return <ChatWindow />;
}
export default App;
