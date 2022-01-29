import express, { response } from 'express';
import cors from "cors";

const app = express()
app.use(express.json())


// // cors code
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.use(cors(corsOptions))
// // cors code end

app.use(cors()); //  allow all origins, not recommended in production


var posts = [
    { text: "some post 0" },
    { text: "some post 1" },
    { text: "some post2" }
];


app.get('/post/:id', (req, res) => {
    const id = Number(req.params.id);
    res.send(posts[id]);
})

app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/post', (req, res) => {
    posts.push(req.body);
    res.send(`your post is saved 🥳 now we have ${posts.length} posts`)
})

app.put('/post/:id', (req, res) => {
    const id = Number(req.params.id);
    posts[id] = req.body;
    res.send(posts[id])
})

app.delete('/post/:id', (req, res) => {
    const id = Number(req.params.id);
    delete posts[id];
    res.send("deleted")
})

app.delete('/posts', (req, res) => {
    posts = [];
    res.send("deleted everything")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Hello server is listening at http://localhost:${PORT}`)
})


// https://devcenter.heroku.com/articles/getting-started-with-nodejs