import { GraphQLServer } from "graphql-yoga";

//typedefinitions
const typeDefs = `
# 1. create a "post" type
# 2. add title, body and published to the post type( all non-nullable )
# 3. define a "post" query that returns single post
# 4. set up resolver method to return some post data
# 5. Test query
type Query{
    me:User!
    post:Post!
}
type User{
   id: ID!
   name: String!
   age: Int
} 
type Post{
    id:ID!
    title:String!
    body:String!
    published:Boolean!
}
`;

//resolvers of api
/**
 * For opertation we intend to perform in graphql we need to that many resolvers. Thus for now we have only one operation we intend to have only one resolver
 * */

const resolvers = {
  Query: {
    me() {
        return {
            id:'12308',
            name:'Abhishek',
            age:25
        }
    },
    post() {
        return {
            id:'082',
            title:'First Post',
            body:'Content of the post',
            published:false
        }
    },

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

/**
 * Output will be
 * 
 * {
  "data": {
    "me": {
      "id": "12308",
      "age": 25
    },
    "post": {
      "id": "082",
      "title": "First Post",
      "published": false
    }
  }
}
 */