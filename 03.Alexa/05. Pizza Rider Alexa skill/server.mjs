import express from "express";
import Alexa, { SkillBuilders } from 'ask-sdk-core';
import morgan from "morgan";
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import axios from "axios";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://user123:user123@testcluster123.nr4e4.mongodb.net/alexaclassdb?retryWrites=true&w=majority")

mongoose.connection.on("connected", () => {
  console.log("mongodb is connected");
})
mongoose.connection.on("error", () => {
  console.log("mongodb error");
})

const countingSchema = new mongoose.Schema({
  intentName: String,
  date: { type: Date, default: Date.now },
});
const countingModel = mongoose.model('Counting', countingSchema);

const bookingSchema = new mongoose.Schema({
  numberOfPeople: String,
  roomType: String,
  arrivalDate: String,
  duration: String,
  createdOn: { type: Date, default: Date.now },
});
const bookingModel = mongoose.model('Booking', bookingSchema);


function pluck(arr) {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}




const app = express();
app.use(morgan("dev"))
const PORT = process.env.PORT || 3000;


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const speakOutput = `
        <speak>
          <voice name="Justin">
            <amazon:emotion name="excited" intensity="medium">
              <p>
                <s> Hello! </s>
                <s>I'm your Pizza Rider</s>
              </p>
              <p>
                I am here to automate your pizza delivery.
                What would you like to order today?
              </p>
            </amazon:emotion>
          </voice>
        </speak>
    `;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};
const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'nameIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'My name is Muhammad Inzamam Malik, my friends call me Malik, would you like to know about my work experiance?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt('to know my work experiance say. what is your work experiance')
      .getResponse();
  }
};


const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = 'Sorry, This is error handler intent. Please try again.';
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};


const skillBuilder = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler
  )
  .addErrorHandlers(
    ErrorHandler
  )
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);




// https://blue-bird.herokuapp.com/api/v1/webhook-alexa
app.post('/api/v1/webhook-alexa', adapter.getRequestHandlers());

app.use(express.json())
app.get('/profile', (req, res, next) => {
  res.send("this is a profile");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});







// {
//   "interactionModel": {
//       "languageModel": {
//           "invocationName": "pizza rider",
//           "intents": [
//               {
//                   "name": "AMAZON.CancelIntent",
//                   "samples": []
//               },
//               {
//                   "name": "AMAZON.HelpIntent",
//                   "samples": []
//               },
//               {
//                   "name": "AMAZON.StopIntent",
//                   "samples": []
//               },
//               {
//                   "name": "placeOrder",
//                   "slots": [
//                       {
//                           "name": "topping",
//                           "type": "Toppings",
//                           "samples": [
//                               "{topping} pizza",
//                               "I would like to have {topping} pizza"
//                           ]
//                       },
//                       {
//                           "name": "size",
//                           "type": "Sizes",
//                           "samples": [
//                               "{size}",
//                               "lets go with {size} pizza",
//                               "give me a {size} pizza"
//                           ]
//                       }
//                   ],
//                   "samples": [
//                       "I want {size} {topping} pizza",
//                       "I want {topping} pizza",
//                       "give me a {size} pizza",
//                       "what pizzas do you have",
//                       "order pizza",
//                       "give me pizza",
//                       "give me something to eat",
//                       "I am hungry",
//                       "I want pizza"
//                   ]
//               },
//               {
//                   "name": "AMAZON.NavigateHomeIntent",
//                   "samples": []
//               },
//               {
//                   "name": "AMAZON.FallbackIntent",
//                   "samples": []
//               }
//           ],
//           "types": [
//               {
//                   "name": "Toppings",
//                   "values": [
//                       {
//                           "name": {
//                               "value": "ranch"
//                           }
//                       },
//                       {
//                           "name": {
//                               "value": "fajita"
//                           }
//                       },
//                       {
//                           "name": {
//                               "value": "pepperoni"
//                           }
//                       }
//                   ]
//               },
//               {
//                   "name": "Sizes",
//                   "values": [
//                       {
//                           "name": {
//                               "value": "large",
//                               "synonyms": [
//                                   "serves 4",
//                                   "4 serving",
//                                   "4 person",
//                                   "large"
//                               ]
//                           }
//                       },
//                       {
//                           "name": {
//                               "value": "medium",
//                               "synonyms": [
//                                   "regular",
//                                   "standard",
//                                   "serves 2",
//                                   "2 person",
//                                   "medium"
//                               ]
//                           }
//                       },
//                       {
//                           "name": {
//                               "value": "small",
//                               "synonyms": [
//                                   "single",
//                                   "small"
//                               ]
//                           }
//                       }
//                   ]
//               }
//           ]
//       },
//       "dialog": {
//           "intents": [
//               {
//                   "name": "placeOrder",
//                   "confirmationRequired": false,
//                   "prompts": {},
//                   "slots": [
//                       {
//                           "name": "topping",
//                           "type": "Toppings",
//                           "confirmationRequired": false,
//                           "elicitationRequired": true,
//                           "prompts": {
//                               "elicitation": "Elicit.Slot.1359803472947.562975436908"
//                           }
//                       },
//                       {
//                           "name": "size",
//                           "type": "Sizes",
//                           "confirmationRequired": false,
//                           "elicitationRequired": true,
//                           "prompts": {
//                               "elicitation": "Elicit.Slot.1359803472947.377248272673"
//                           }
//                       }
//                   ]
//               }
//           ],
//           "delegationStrategy": "ALWAYS"
//       },
//       "prompts": [
//           {
//               "id": "Elicit.Slot.1359803472947.562975436908",
//               "variations": [
//                   {
//                       "type": "PlainText",
//                       "value": "Which flavour of pizza would you like to have, we have got fajita, pepperoni, and ranch."
//                   },
//                   {
//                       "type": "PlainText",
//                       "value": "what kind of pizza would you like to have, we have got fajita, pepperoni, and ranch."
//                   }
//               ]
//           },
//           {
//               "id": "Elicit.Slot.1359803472947.377248272673",
//               "variations": [
//                   {
//                       "type": "PlainText",
//                       "value": "what size of {topping} pizza, we have large, medium and small"
//                   },
//                   {
//                       "type": "PlainText",
//                       "value": "ok {topping} pizza, what size would you like it in, we have large, medium and small"
//                   }
//               ]
//           }
//       ]
//   }
// }


