// configuration of express, mongoose and cors
const express = require('express')
const app = express()
app.use(express.json())
// app.use(express.urlencoded())

const cors = require('cors')
app.use(cors())

const mongoose = require('mongoose')


// Creation of Database 
mongoose.connect('mongodb://localhost:27017/SFSformData', {
    useNewUrlParser: true
}, () => {
    console.log("Database connected succesfully")
});


// creation of Schema for database
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String
})


// creation of model and linking to Schema
const User = new mongoose.model("User", userSchema)


// Routes
// validating user email with database email

app.post("/", (request, response) => {
    const { email, password } = request.body

    // validating user email with database email
    User.findOne({ email: email }, (error, user) => {
        if (user) {
            if (password === user.password) {
                response.send({ message: "login successful", user: user })
            } else {
                response.send({ message: "Please enter the Valid Password" })
            }
        } else {
            response.send({ message: "user not registered, Sign Up!" })
        }
    })
})

app.post("/signup", (request, response) => {
    const { firstname, lastname, email, password } = request.body
    
    User.findOne({ email: email }, (error, user) => {
        if (user) {
            response.send({ message: "Entered Email already Registered" })
        } else {
            // creating new user and adding user data 
            const user = new User({
                firstname,
                lastname,
                email,
                password
            })

            user.save(error => {
                if (error) {
                    response.send({message: "Enter the Valid Input"})
                } else {
                    response.send({ message: "Sign Up Successfull, Please Signin now.", user })
                }
            })
        }
    })
})

app.listen(5000, () => {
    console.log("Backend started at Port: 5000")
})
