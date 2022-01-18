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

app.listen(3000, () => {
    console.log(`Hello server is listening at http://localhost:3000`)
})


// https://devcenter.heroku.com/articles/getting-started-with-nodejs