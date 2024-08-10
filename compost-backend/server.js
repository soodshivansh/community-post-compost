require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBSession = require('connect-mongo');

const app = express()
app.use(express.json());

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI


const store = MongoDBSession.create({
    mongoUrl: MONGO_URI,
    collectionName: 'mysession',
});

app.use(session({
    secret: "this is the key",
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.get('/',(req,res) => {
    console.log('Visited Home Page');
    res.send('Welcome to the home Page')
})

const Signup = require('./routes/signup')
app.use('/signup',Signup)

const Login = require('./routes/login')
app.use('/login',Login)


const logout = require('./routes/logout')
app.use('/logout',logout)

const isAuth = require('./middleware/isAuth')

app.use('/u',isAuth);
const dashboard = require('./routes/dashboard')
app.use('/u',dashboard)





// Mongo connect and URL connect

mongoose.connect(MONGO_URI)
.then(() => {
    app.listen(PORT,() => {
        console.log(`Connected to db and Listening on PORT: ${PORT}`)
    })
})
.catch((error) => {
    console.log(error)
})