const axios = require('axios');
GraphQL = require('graphql');

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema
} = GraphQL;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstname: {type: GraphQLString},
        age: {type: GraphQLInt}
    }
});

//Essentially if RootQueryType is provded a user id it will return a UserType
//Resolve does the work specified above
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentVal, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data); //grab only the data from axios object
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});