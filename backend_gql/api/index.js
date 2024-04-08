//const express = require('express')
//const {graphqlHTTP} = require('express-graphql')
//const {buildSchema} = require('graphql')
//const mongoose = require('mongoose')
//const User = require('./models/users')
//const Employee = require('./models/employees')
//const { ApolloServer, gql, ApolloServerPluginDrainHttpServer } = require('apollo-server')
//const http = require('http')
//const cors = require('cors')

import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import express from "express";
import cors from "cors";
import mongoose from 'mongoose'
import User from '../models/users.js'
import Employee from '../models/employees.js'



// DB
const DB_URL = "mongodb+srv://rootadmin:qwer1234@cluster0.mn0pq2e.mongodb.net/comp3133_assignment1?retryWrites=true&w=majority"
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



const app = express();
app.use(cors({
    origin: 'http://localhost:4200'
}))
app.use(express.json());
const httpServer = http.createServer(app);


// GraphQL schema, this is the definition
//var schema = buildSchema(
const typeDefs = gql
    `type Query {
        hello: String
        login(username: String!, password: String!): User
        getAllEmployees: [Employee]
        getEmployeeById(_id: ID!): Employee    
        getUserByUsername(username: String!): Boolean!
    }

    type Mutation{
        signup(username: String!, email: String!, password: String!): User
        addNewEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, salary: Float!): Employee
        updateEmployeeById(_id: ID!, first_name: String!, last_name: String!, email: String!, gender: String!, salary: Float!): Employee
        deleteEmployeeById(_id: ID!): Employee
    }
    
    type User{
        _id: ID!
        username: String!
        email: String!
        password: String!
    }

    type Employee{
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        salary: Float!
    }
    `
//)

// Root resolver
const resolvers = {
    Query: {
        hello: () => "world",
        // #2
        login: async(_, args) => {
            const user = await User.findOne({username: args.username}).exec()
            if (user === null || user.password != args.password) {
                return null
            }
            return user
        },
        // #3
        getAllEmployees: async()=>{
            try {
                const employees = await Employee.find({}).exec()
                if (employees !== null) {return employees}
                return null
            }catch(e){
                return e.message
            }
            
        },
        // #5
        getEmployeeById: async(_, args) => {
            try {
                const employee = await Employee.findOne({_id: args._id})
                if (employee !== null) {return employee}
                return null
            }catch(e) {
                return e.message
            }
        },
        getUserByUsername: async(_, args) => {
            try{
                const user = await User.findOne({username: args.username})
                if (user !== null) {return true}
                return false
            }catch(e) {
                return e.message
            }
        }
    },
    Mutation: {
        // #1
        signup: async(_, args) => {
            try{
                let user = await User.create(args)
                console.log("User created successfully: ", user)
                if (user !== null) {return user}
                return null
            } catch(e){
                console.error("Error creating user:", e);
                return e.message
            }
           
        },
        // #4
        addNewEmployee: async(_, args)=> {
            try {
                let newEmployee = await Employee.create(args)
                console.log("Employee created successfully: ", newEmployee)
                return newEmployee
            } catch(e) {
                console.error("Error creating Employee:", e);
                return e.message
            }
        },
    
        // #6
        updateEmployeeById: async(_, args) => {
            try {
                const employee = await Employee.findOneAndUpdate({_id: args._id}, args, {new: true})
                if(employee != null) {
                    return employee
                }
                return null
            }catch(e) {
                return e.message
            }
            
        },
        // #7
        deleteEmployeeById: async(_, args) => {
            try {
                const employee = await Employee.findOneAndDelete({_id: args._id}, args, {new: true})
                if (employee === null) {return JSON.stringify("Employee not existed")}
                return employee
            }catch(e) {
                return e.message
            }
        }
    }
}

const startApolloServer = async(app, httpServer) => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cache: "bounded",
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer(app, httpServer);

export default httpServer;

/*
app.listen({port: process.env.PORT || 4000}, () => {
    console.log(`Server running on port`);
});


const server = new ApolloServer({ typeDefs, resolvers })

// Start server to listen
server.listen({port: 4000}, ()=>console.log('Server Now Running at http://localhost:4000'))

module.exports = server*/