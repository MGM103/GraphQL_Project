const axios = require('axios');
const { response } = require('express');
GraphQL = require('graphql');
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = GraphQL;

//fields need to be wrapped in a closure to ensure the rest of the file is run
// and the fields object has access to other defined data types
const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentVal, args) {
                return axios.get(`http://localhost:3000/companies/${parentVal.id}/users`)
                    .then(response => response.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        firstname: {type: GraphQLString},
        age: {type: GraphQLInt},
        //field not called companyId, therefore need a resolve
        //Because companyId is taken from company data type
        company: {
            type: CompanyType,
            resolve(parentVal, args){
                return axios.get(`http://localhost:3000/companies/${parentVal.companyId}`)
                    .then(response => response.data);
            }
        } //To create an association you define the type in the field, like FK on DB UML
    })
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
        },
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentVal, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(response => response.data)
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstname: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentVal, {firstname, age}) {
                return axios.post('http://localhost:3000/users', {firstname, age})
                    .then(response => response.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentVal, args) {
                return axios.delete(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data);
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstname: {type: GraphQLString},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLString}
            },
            resolve(parentVal, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(response => response.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});