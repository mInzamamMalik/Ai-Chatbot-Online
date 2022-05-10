import express from "express";
import morgan from "morgan";
import cors from "cors";
import { dialogflow, Image } from "actions-on-google"

const app = express();
app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});


const dfapp = dialogflow({ clientId: "754307992398-qqtqa1uuch8hgvljcelv0e6425ovov37.apps.googleusercontent.com" }); // dialogflow webhook instance

dfapp.intent('Default Welcome Intent', conv => {

    console.log("conv.user: ", conv.user.raw);
    console.log("conv.user.email: ", conv.user.email)
    console.log("conv.user.name: ", conv.user.name)
    console.log("conv.user.profile: ", conv.user.profile.payload.name)

    conv.ask(`Hi ${conv.user.profile.payload.name} , I am your hotel booking assistant. How can I help you?`);
    conv.ask(`Here's your profile picture`)
    conv.ask(new Image({
        url: conv.user.profile.payload.picture,
        alt: 'A Car',
    }))
})
dfapp.intent('placeOrder', conv => {
    conv.close('See you later!')
})
dfapp.intent('Default Fallback Intent', conv => {
    conv.ask(`express.js I didn't understand. Can you tell me something else?`)
})


app.post("/webhook", (request, response) => {

    // console.log("request.body", request.body);

    dfapp(request, response);
});


app.listen(5001, () => {
    console.log("Example app listening on port 5001!");
});

