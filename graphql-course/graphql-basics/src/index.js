import { GraphQLServer } from "graphql-yoga";

//typedefinitions
const typeDefs = `
#===== Operational Arguements
type Query{
        greeting(name: String):String!
        me:User!
    }
    type User{
       id: ID!
       name: String!
       age: Int
    } 
#=====
#===== Custom Query
#type Query{
#    me:User! #this denotes custom type
#}
#type User{
#   id: ID!
#   name: String!
#   age: Int
#} 
#=====
#===== Introduction
 # this is where graphql code goes
 # we write our needed query in these backticks
 # for now we only trying to query hello from online playground of graphql : https://graphql-demo.mead.io
 # for query we use following
 #type Query {
 #    # ! is used to denote that it should always return string type
 #    hello: String! #this is type definition
 #    name: String! #this is a type definition
 #    location: String! #this is a type definition
 #    bio: String! #this is a type definition
 #}
`;

//resolvers of api
/**
 * For opertation we intend to perform in graphql we need to that many resolvers. Thus for now we have only one operation we intend to have only one resolver
 * */

const resolvers = {
  Query: {
    greeting(parent,args,ctx,info){
        console.log(args);
        return 'Hello '+((args.name)?(args.name):(''))+', Welcome to GraphQL'
    },
    me() {
      return {
        id: "12308",
        name: "Abhishek",
        age: 25,
      };
    },
    /**
        *hello() {
        //This is executed when we query for 'hello' in our graphql query
            return 'This is my first query..!!'
        },
        name() {
            //This is executed when we query for 'name' in our graphql query
            return 'This is returned from "name" resolver'
        },
        location() {
            //This is executed when we query for 'location' in our graphql query
            return 'This is from "location" resolver'
        },
        bio() {
            //This is executed when we query for 'bio' in our graphql query
            return 'This is from "bio" resolver'
        }
         */
  },
};

//declaring a server with new graphql server
const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
//lets start a server
// the server runs at port 4000 by default
server.start(() => {
  console.log("Server is started at port 4000");
});
