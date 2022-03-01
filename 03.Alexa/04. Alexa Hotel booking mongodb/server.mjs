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



const app = express();
app.use(morgan("dev"))
const PORT = process.env.PORT || 3000;


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const speakOutput = 'Hello and Welcome, I am virtual version of Mr.Inzamam Malik. what would you like to ask? I can tell you his name and work experiance.';

    let savedDoc = await countingModel.create({
      intentName: "LaunchRequest"
    })
    console.log("savedDoc: ", savedDoc);

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
const workExpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'workExperiance';
  },
  handle(handlerInput) {
    const speakOutput = `I started working on web technologies in 2012,
      later on moved to Ai Chatbots and voice apps in late 2015. 
      these days I am one of the experts in voice apps.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      // .reprompt('I am waiting for your response my friend, you can ask me my name')
      .getResponse();
  }
};
const weatherIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'weatherIntent';
  },
  async handle(handlerInput) {

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    console.log("slots: ", slots);

    const cityName = slots.cityName;
    console.log("cityName: ", cityName);

    try {

      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=5f50d76cd06943d099f160402221902&q=${cityName.value}&aqi=no`)
      console.log("data1", response.data);
      console.log("data2", response.data.current.condition.text);
      console.log("data3", response.data.current.temp_c);

      const speakOutput = `In ${cityName.value} it is ${response.data.current.temp_c} degree centigrade and ${response.data.current.condition.text}`;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        // .reprompt('to know my work experiance say. what is your work experiance')
        .getResponse();
    }
    catch (error) {
      console.log(error);
      return handlerInput.responseBuilder
        .speak("something went wrong in function")
        // .reprompt('to know my work experiance say. what is your work experiance')
        .getResponse();
    }



  }
};
const bookRoomIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'bookRoom';
  },
  async handle(handlerInput) {

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    console.log("slots: ", slots);

    const numberOfPeople = slots.numberOfPeople;
    console.log("numberOfPeople: ", numberOfPeople);

    const roomType = slots.roomType;
    console.log("roomType: ", roomType);

    const arrivalDate = slots.arrivalDate;
    console.log("arrivalDate: ", arrivalDate);

    const duration = slots.Duration;
    console.log("duration: ", duration);

    try {
      let savedDoc = await bookingModel.create({
        numberOfPeople: numberOfPeople.value,
        roomType: roomType.value,
        arrivalDate: arrivalDate.value,
        duration: duration.value,
      })
      console.log("document is saved in mongodb");

    } catch (e) {
      console.log("something went wrong while saving booking: ", e);
    }

    const speakOutput = `ok, your room for ${numberOfPeople.value} people is reserved for ${duration.value} night`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      // .reprompt('I am waiting for your response my friend, you can ask me my name')
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
    HelloWorldIntentHandler,
    workExpIntentHandler,
    weatherIntentHandler,
    bookRoomIntentHandler
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





