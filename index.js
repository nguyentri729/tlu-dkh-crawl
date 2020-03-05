require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const tluRouter = require('./routers/tlu.router')
const mongoose = require('mongoose');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use('/tlu', tluRouter)

app.get('/', (req, res) => {


})
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@tlu-lqgz4.gcp.mongodb.net/tluStudents?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    app.listen(process.env.PORT || 8080)
});



