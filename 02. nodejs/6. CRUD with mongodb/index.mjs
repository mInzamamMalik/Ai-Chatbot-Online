import mongoose from "mongoose";
import express, { response } from 'express';
import cors from "cors";


const app = express()
app.use(express.json())
app.use(cors());


//// mongodb connection code /////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = "mongodb+srv://dbuser:dbpassword123@cluster0.9qvbs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////


const postSchema = new mongoose.Schema({
    "text": String,
    "createdOn": { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);


app.get('/post/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            res.status(500).send("something went wrong")
        }
    })
})

app.get('/posts', (req, res) => {
    Post.find({}, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            res.status(500).send("something went wrong")
        }
    })
})

app.post('/post', (req, res) => {

    if (!req.body.text || req.body.text.length > 200) {
        res.status(400).send(`text is required in json body (max 200 chars), e.g: { "text" : "what is in your mind" }`);
        return;
    }

    let newPost = new Post({
        text: req.body.text
    });

    newPost.save((err, saved) => {
        if (!err) {
            res.send("your post is saved 🥳");
        } else {
            res.status(500).send("some thing went wrong, please try later");
        }
    })
})

app.put('/post/:id', (req, res) => {

    Post.findOneAndUpdate(
        { _id: req.params.id },
        { text: req.body.text },
        {},
        (err, data) => {
            if (!err) {
                res.send("updated");
            } else {
                res.status(500).send("something went wrong")
            }
        }
    );
})

app.delete('/post/:id', (req, res) => {
    Post.deleteOne(
        { _id: req.params.id },
        {},
        (err, data) => {
            if (!err) {
                res.send("deleted")
            } else {
                res.status(500).send("something went wrong")
            }
        });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Hello server is listening at http://localhost:${PORT}`)
})


// https://devcenter.heroku.com/articles/getting-started-with-nodejs