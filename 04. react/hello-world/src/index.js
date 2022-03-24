import React from 'react';
import ReactDOM from 'react-dom';
import "./style.css"

function popup() {
  alert("I am a popup!!");
}


// function Hi({ firstName, lastName }) {
//   return <div> Hello {firstName} {lastName} 👋 </div>
// }

// //es5 anonymous function
// const Hi = function ({ firstName, lastName }) {
//   return <div> Hello {firstName} {lastName} 👋 </div>
// }

// es6
const Hi = ({ firstName, lastName }) => {
  return <div> Hello {firstName} {lastName} 👋 </div>
}


// // es6 // optional
// const Hi = ({ firstName, lastName }) => (
//   <div> Hello {firstName} {lastName} 👋 </div>
// )



ReactDOM.render(

  <Hi
    firstName="M.Inzamam"
    lastName="Malik"
  />,

  document.querySelector('#root'));