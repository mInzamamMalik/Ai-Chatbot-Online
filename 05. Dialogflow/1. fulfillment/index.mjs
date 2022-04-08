import express from "express";
import morgan from "morgan";
import { WebhookClient } from 'dialogflow-fulfillment';

const app = express();
app.use(express.json());
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

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});

