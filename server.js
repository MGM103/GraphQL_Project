const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schemas/schema');

const portnum = 4000;
const app = express();

//Ensure that GraphQL queries sent to express server trigger GraphQL library
//graphiql is a dev tool for GraphQL queries
app.use('/graphql', expressGraphQL({
    schema, //es6 auto expansion
    graphiql: true
}));

app.listen(portnum, () => {
    console.log(`Listening on ${portnum}`)
});