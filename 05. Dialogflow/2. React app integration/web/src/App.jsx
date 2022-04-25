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

  const sendMessage = async (e) => {
    e.preventDefault();

    if (userText.trim() === "") return;

    console.log("sendMessage");

    setMessages((prev) => (
      [{ sender: "user", text: userText }, ...prev]
    ));

    // TODO: send message on dialogflow and get reply
    const response = await axios.post("http://localhost:5001/talktochatbot", {
      query: userText,
    })
    console.log("response.data: ", response.data);

    let audioBufer = response.data.pop().audio;
    console.log("audioBufer: ", audioBufer);



    
    let dataUrl = btoa(String.fromCharCode(...new Uint8Array(audioBufer.data)));

    let audioFile = new Audio(dataUrl);
    audioFile.play();



    document.querySelector("#myaudio").src = "data:audio/mp3;base64," + dataUrl;
    document.querySelector("#myaudio").play()





    setMessages((prev) => (
      [...response.data, ...prev]
    ));

    setUserText("");
    e.target.reset();

  }


  return <>
    <audio controls id="myaudio"></audio>

    <h1 className='heading'>CHAT APP</h1>

    <form onSubmit={sendMessage} className="form">

      <Stack direction="horizontal" gap={3}>

        <Form.Control className="me-auto inputField" type="text"
          placeholder="Enter your text here"
          onChange={(e) => { setUserText(e.target.value) }} />

        <Button type="submit" variant="secondary" className='submitButton'>Submit</Button>
      </Stack>

    </form>

    <div>


      <Container>
        {messages.map((eachMessage, index) => (
          (eachMessage.sender === "user") ?
            (<Row key={index}>
              <Col xs={3}></Col>
              <Col className='message user-message'>{eachMessage.text}</Col>
            </Row>)
            :
            (<Row key={index}>
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
