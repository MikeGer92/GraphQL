const express = require('express')
const schema = require('../schema/schema')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose');


const app = express()
const PORT = 3005

mongoose.connect('mongodb+srv://Mikeman:a15May1975@cluster0.awmtd.mongodb.net/newgraphdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true,  });
const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(PORT, err => {
    err ? console.log(error) : console.log('Server is Started')
})