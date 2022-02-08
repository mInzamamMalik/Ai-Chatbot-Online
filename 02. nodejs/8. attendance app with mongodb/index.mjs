import express, { response } from 'express';
import cors from "cors";
import { Attendance, Student, Post } from "./db.mjs"

const app = express()
app.use(express.json())
app.use(cors());


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



app.post('/student', (req, res) => {

    if (
        !req.body.studentName
        || !req.body.studentClass
        || !req.body.studentRoll
    ) {
        res.status(400).send(`all parameters are required in json body,
         e.g:
         {
            studentName: "john",
            studentClass: "Batch 5 Web and mobile",
            studentRoll: "KHI2231",
        }`);
        return;
    }

    let newStudent = new Student({
        studentName: req.body.studentName,
        studentClass: req.body.studentClass,
        studentRoll: req.body.studentRoll,
    })

    newStudent.save((err, saved) => {
        if (!err) {
            res.send("Student is created 🥳");
        } else {
            res.status(500).send("some thing went wrong, please try later");
        }
    })
})

app.get('/students', (req, res) => {
    Student.find({}, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            res.status(500).send("something went wrong")
        }
    })
})


app.post('/attendance', (req, res) => {

    if (
        !req.body.studentId
        || (req.body.isPresent === undefined)
    ) {
        res.status(400).send(`all parameters are required in json body,
         e.g:
         {
            studentId: "32423jkj234kj23423kj4h24",
            isPresent: true,
        }`);
        return;
    }

    let newAttendance = new Attendance({
        studentId: req.body.studentId,
        studentName: req.body.studentName,
        isPresent: req.body.isPresent,
    })

    newAttendance.save((err, saved) => {
        if (!err) {
            res.send(`${req.body.studentName}'s Attendance is marked in database 🎊`);
        } else {
            res.status(500).send("some thing went wrong, please try later");
        }
    })

})

app.get('/attendance/:date', (req, res) => {

    if (!req.params.date) {
        res.status(400).send(`/attendance/`);
        return;
    }

    console.log("date: ", req.params.date);
    console.log("date: ", typeof req.params.date);

    Attendance.find({
        createdOn: {
            '$gte': `${req.params.date}T00:00:00.000Z`,
            '$lt': `${req.params.date}T23:59:59.999Z`
        }
        
    }, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            res.status(500).send("something went wrong")

        }
    })
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Hello server is listening at http://localhost:${PORT}`)
})


// https://devcenter.heroku.com/articles/getting-started-with-nodejs