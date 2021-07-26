import { GraphQLServer } from "graphql-yoga";
// Demo Posts data

const posts=[
  {
    id: '1',
    title: 'First Post',
    body: 'Content of the post',
    published: false,
    authorId:'1' 
  },
  {
    id: '1',
    title: 'Some Post',
    body: 'Content...!!!',
    published: true,
    authorId:'2' 
  },
  {
    id: '4',
    title: 'Demo Post',
    body: 'Content of the post',
    published: false,
    authorId:'1' 
  }
]
//Demo Users data
const users=[
  {
    'id':"1",
    name:"Abhishek",
    email:"abhi@course.com",
    age:25
  },
  {
    'id':"2",
    name:"Nagarjuna",
    email:"nagarjuna@course.com",
    age:25
  },
  {
    'id':"3",
    name:"Jeevana",
    email:"jeevana@course.com",
  },
  {
    'id':"4",
    name:"Divya",
    email:"divya@course.com",
  },
]

//typedefinitions
const typeDefs = `
type Query{
  me:User!
  users(queryName:String):[User!]! #fetch all authors of our application, note: This is a CUSTOM TYPED Array
  post(queryTitleOrBody:String):[Post!]!
}
type User{
 id: ID!
 name: String!
 email:String!
 age: Int
} 
type Post{
  id:ID!
  title:String!
  body:String!
  published:Boolean!
  authorId:ID!
}
`;

//resolvers of api
/**
 * For opertation we intend to perform in graphql we need to that many resolvers. Thus for now we have only one operation we intend to have only one resolver
 * */

const resolvers = {
  Query: {
    users(parent,args,ctx,info){
      if(args.queryName){
        return users.filter(e=>e.name.toLowerCase().includes(args.queryName.toLowerCase()));
      }else{
        return users;
      }
    },
    me() { //custom query resolver
      return users.find(e=>e.name=='Abhishek');
    },
    post(parent,args,ctx,info) {
      if(args.queryTitleOrBody){
        return posts.filter(e=>e.title.toLowerCase().includes(args.queryTitleOrBody.toLowerCase())||e.body.toLowerCase().includes(args.queryTitleOrBody.toLowerCase()))
      }else{
        return posts;
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

//----------------------------Simple input and output
// Query Input
/**
 * query{
	users{
    name
    age
  }
  me{
    id
    email
  }
}
 */
//------------------------------
//Query Output
/**
 * {
  "data": {
    "users": [
      {
        "name": "Abhishek",
        "age": 25
      },
      {
        "name": "Nagarjuna",
        "age": 25
      },
      {
        "name": "Jeevana",
        "age": null
      },
      {
        "name": "Divya",
        "age": null
      }
    ],
    "me": {
      "id": "1",
      "email": "abhi@course.com"
    }
  }
}
 *  */
//----------------------------Query Users with operational arguements on custom typed array
// Query Input
/**
 * query{
	users(query:"na"){
    name
    age
  }
}
 */
//------------------------------
//Query Output
/**
 * {
  "data": {
    "users": [
      {
        "name": "Nagarjuna",
        "age": 25
      },
      {
        "name": "Jeevana",
        "age": null
      }
    ],
  }
}
*/
//----------------------------Query for post with operational arguements
// Query Input
/**
 * query{
	post(queryTitleOrBody:"demo"){
    title
    authorId
  }
}
 */
//------------------------------
//Query Output
/**
 * {
  "data": {
    "post": [
      {
        "title": "Demo Post",
        "authorId": "1"
      }
    ]
  }
}
*/
