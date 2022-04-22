import express from "express";
import morgan from "morgan";
import { WebhookClient } from 'dialogflow-fulfillment';
import bodyParser from "body-parser";
import twilio from "twilio"
import cors from "cors";
import dialogflow from '@google-cloud/dialogflow'



const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/webhook", (request, response) => {

    const _agent = new WebhookClient({ request, response });

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }
    function order(agent) {

        const qty = agent.parameters.qty;
        const size = agent.parameters.size;
        const pizzaFlavour = agent.parameters.pizzaFlavour;

        console.log("qty: ", qty);
        console.log("size: ", size);
        console.log("pizzaFlavour: ", pizzaFlavour);

        // TODO: add order to database

        agent.add(`Response from server, here is your order for ${qty} ${size} ${pizzaFlavour} pizza`);
    }
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('placeOrder', order);

    _agent.handleRequest(intentMap);

});

app.post("/twiliowebhook", async (req, res, next) => {

    let response = new twilio.twiml.MessagingResponse()

    console.log("twiliowebhook");
    console.log(req.body);

    // todo: call dialogflow
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath("hello-world-agent-mcdr", "session123");

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: req.body.Body,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);


    responses[0]?.queryResult?.fulfillmentMessages?.map(eachMessage => {
        if (eachMessage.platform === "PLATFORM_UNSPECIFIED") {
            response.message(eachMessage.text.text[0])    
        }
    })

    res.send(response.toString());
})

app.post("/talktochatbot", async (req, res, next) => {
    // body
    // {
    //     query: userText,
    // }
    console.log("body: ", req.body)


    // TODO:  call dialogflow API
    // Create a new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath("hello-world-agent-mcdr", "session123");

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: req.body.query,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);

    let messages = [];

    responses[0]?.queryResult?.fulfillmentMessages?.map(eachMessage => {
        if (eachMessage.platform === "PLATFORM_UNSPECIFIED") {
            
            messages.push({
                sender: "chatbot",
                text: eachMessage.text.text[0]
            })
        }
    })

    res.send(messages);

    // response: 
    // [{ sender: "chatbot", text: "hello from chatbot" }]
})





app.listen(5001, () => {
    console.log("Example app listening on port 5001!");
});

