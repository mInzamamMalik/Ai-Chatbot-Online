import express from "express";
import morgan from "morgan";
import cors from "cors";
import {
    dialogflow, Image, Suggestions, LinkOutSuggestion,
    Carousel, SimpleResponse
} from "actions-on-google"

const app = express();
app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});


const dfapp = dialogflow({
    clientId: "754307992398-qqtqa1uuch8hgvljcelv0e6425ovov37.apps.googleusercontent.com"
}); // dialogflow webhook instance

dfapp.intent('Default Welcome Intent', conv => {

    console.log("conv.user: ", conv.user.raw);
    console.log("conv.user.email: ", conv.user.email)
    console.log("conv.user.name: ", conv.user.name)
    console.log("conv.user.profile: ", conv.user.profile.payload.name)

    conv.ask(new SimpleResponse({
        text: `Hi ${conv.user.profile.payload.name}, I am your hotel booking assistant. How can I help you? `,
        speech: `<speak>
                    <s> this is speech.</s>
                    Hi ${conv.user.profile.payload.name}, 
                    I am your hotel booking assistant. How can I help you?
                </speak>`,
    }))


    // conv.ask(`Here's your profile picture`)
    // conv.ask(new Image({
    //     url: conv.user.profile.payload.picture,
    //     alt: 'A Car',
    // }))
})
dfapp.intent('bookRoom', (conv, params) => {

    const roomType = params.roomType
    console.log("roomType: ", roomType)

    conv.ask("please tell me what type of room would you like to book, we have VIP, regular and economy rooms available");

    // conv.ask(new Suggestions("VIP Room"));
    // conv.ask(new Suggestions("Regular Room"));
    // conv.ask(new Suggestions("Economy Room"));
    // conv.ask(new LinkOutSuggestion({
    //     name: 'More about Hotel',
    //     url: 'https://hotel.sysborg.com/'
    // }));

    conv.ask(new Carousel({
        title: 'Available Room Types',
        items: {
            // Add the first item to the carousel
            'VIP': {
                synonyms: [
                    'Luxury',
                    'Deluxe',
                ],
                title: 'VIP Room',
                description: 'Our VIP room are similar to presedential suites, but with a more luxurious look.',
                image: new Image({
                    url: 'https://sc01.alicdn.com/kf/H28a4d0c44c1e46bbb061c8199fb8915fg/231196071/H28a4d0c44c1e46bbb061c8199fb8915fg.jpg',
                    alt: 'Image showing a VIP room in hotel',
                }),
            },
            // Add the second item to the carousel
            'regular': {
                synonyms: [
                    'regular',
                    'normal',
                ],
                title: 'Regular Room',
                description: 'Our regular rooms are clean peaceful and classy.',
                image: new Image({
                    url: 'https://media-cdn.tripadvisor.com/media/photo-s/12/4e/56/57/standard-hotel-room-layout.jpg',
                    alt: 'Image showing a regular room in hotel',
                }),
            },
            // Add the third item to the carousel
            'economy': {
                synonyms: [
                    'economy',
                    'low cost',
                    'cheap',
                ],
                title: 'Economy Room',
                description: 'Economy Rooms are specialy designed for students and young adults.',
                image: new Image({
                    url: 'https://thumbs.dreamstime.com/z/hotel-room-economy-class-desk-126885086.jpg',
                    alt: 'Image showing an economy room in hotel',
                }),
            },
        },
    }));



})

dfapp.intent("booking carousel - options", (conv, params, option) => {

    console.log("option: ", option);
    console.log("114 params: ", params);
    console.log("115 session params: ", conv.session.params);

    const numOfGuests = params?.numOfGuests
    const checkinDate = params?.checkinDate
    const numberOfNights = params?.numberOfNights

    console.log("numOfGuests: ", numOfGuests)
    console.log("checkinDate: ", checkinDate)
    console.log("numberOfNights: ", numberOfNights)

    const SELECTED_ITEM_RESPONSES = {
        'VIP': 'You selected vip room',
        'regular': 'You selected regular room',
        'economy': 'You selected economy room',
    };

    // conv.ask("you clicked on a Carousel item");
    // conv.ask(SELECTED_ITEM_RESPONSES[option]);

    // conv.session.params.roomType = "option";
    // console.log(conv.session?.params?.roomType);

    if (!numOfGuests) {
        conv.ask("please tell me how many guests are staying");

    } else if (!checkinDate) {
        conv.ask("please tell me when you want to checkin");

    } else if (!numberOfNights) {
        conv.ask("please tell me how many nights you want to stay");

    } else {

        // TODO:  write booking data in database

        conv.close(`Dear ${conv.user.profile.payload.name} your booking is completed, thank you for doing business with us`);
    }
})

dfapp.intent('Default Fallback Intent', conv => {
    conv.ask(`express.js I didn't understand. Can you tell me something else?`)
})


app.post("/webhook", (request, response) => {

    console.log("request.body", request.body);

    dfapp(request, response);
});


app.listen(5001, () => {
    console.log("Example app listening on port 5001!");
});

