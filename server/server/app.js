const express = require('express')
const schema = require('../schema/schema')
const { graphqlHTTP } = require('express-graphql')


const app = express()
const PORT = 3005

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(PORT, err => {
    err ? console.log(error) : console.log('Server is Started')
})