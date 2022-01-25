import express from 'express';

const app = express()

app.get('/', (req, res) => {
    res.send('I am Express.js server')
})
app.get('/water', (req, res) => {
    res.send('here is your water 🐳')
})
app.get('/food', (req, res) => {
    res.send('here is your food 🍔')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Hello server is listening at http://localhost:${PORT}`)
})


// https://devcenter.heroku.com/articles/getting-started-with-nodejs