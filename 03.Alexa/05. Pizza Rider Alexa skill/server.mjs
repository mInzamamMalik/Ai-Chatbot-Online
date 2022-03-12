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

const orderSchema = new mongoose.Schema({
  topping: String,
  size: String,
  qty: Number,
  name: String,
  address: String,
  createdOn: { type: Date, default: Date.now },
});
const orderModel = mongoose.model('Orders', orderSchema);


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
const placeOrderIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'placeOrder';
  },
  async handle(handlerInput) {
    console.log("request came: ", JSON.stringify(handlerInput.requestEnvelope));

    const topping = Alexa.getSlot(handlerInput.requestEnvelope, "topping");
    const size = Alexa.getSlot(handlerInput.requestEnvelope, "size");
    const qty = Alexa.getSlot(handlerInput.requestEnvelope, "qty");

    console.log("topping: ", topping);
    console.log("size: ", size);
    console.log("qty: ", qty);

    if (!topping.value) {
      const speakOutput = `
          <speak>
            <voice name="Justin">
              <amazon:emotion name="excited" intensity="medium">
                <p>
                  <s> What topping would you like to have </s>
                  <s> We have pepperoni, ranch and Fajita </s>
                </p>
              </amazon:emotion>
            </voice>
          </speak>
      `;
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();

    } else if (!size.value) {
      const speakOutput = `
            <speak>
              <voice name="Justin">
                <amazon:emotion name="excited" intensity="medium">
                  <p>
                    <s> ok </s>
                    <s>  ${topping.value} pizza, what size would you like to order</s>
                    <s> We have Large that serves 4, medium that serves 2, and small that serves 1 </s>
                  </p>
                </amazon:emotion>
              </voice>
            </speak> 
      `;
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();

    } else {


      const apiAccessToken = Alexa.getApiAccessToken(handlerInput.requestEnvelope);

      const fullName = await axios.get("https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.name", {
        headers: { Authorization: `Bearer ${apiAccessToken}` }
      })
      const email = await axios.get("https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.email", {
        headers: { Authorization: `Bearer ${apiAccessToken}` }
      })

      console.log("fullName: ", fullName.data);
      console.log("email: ", email.data);



      let savedDoc = await orderModel.create({
        topping: topping.value,
        size: size.value,
        qty: qty.value,
        name: fullName.data,
        address: email.data
      })
      console.log("savedDoc: ", savedDoc);

      const speakOutput = `
          <speak>
            <voice name="Justin">
              <amazon:emotion name="excited" intensity="medium">
                <p>
                  <s> Thank you! </s>
                  <s> Your order is placed </s>
                </p>
              </amazon:emotion>
            </voice>
          </speak>
      `;
      return handlerInput.responseBuilder
        .speak(speakOutput)
        // .reprompt('to know my work experiance say. what is your work experiance')
        .getResponse();

    }
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
    placeOrderIntentHandler
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


