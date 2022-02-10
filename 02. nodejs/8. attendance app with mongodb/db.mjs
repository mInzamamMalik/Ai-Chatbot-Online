import mongoose from "mongoose";

//// mongodb connection code /////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = "YOUR DB URL";
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
export const Post = mongoose.model('Post', postSchema);

const studentSchema = new mongoose.Schema({
    "studentName": String,
    "studentClass": String,
    "studentRoll": String,
    "createdOn": { type: Date, default: Date.now }
});
export const Student = mongoose.model('Student', studentSchema);

const attendanceSchema = new mongoose.Schema({
    "studentId": String,
    "studentName": String,
    "isPresent": Boolean,
    "createdOn": { type: Date, default: Date.now }
});
export const Attendance = mongoose.model('Attendance', attendanceSchema);

