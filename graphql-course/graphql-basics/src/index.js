import { GraphQLServer } from "graphql-yoga";

/**
 * --------------------------- Setting Comments Data---------------------------------
 * Part 1: 
 *  1. setup comments type definition where it must have an id(doesnt match any other ids for now) and text as string, both as non-nullable
 *  2. create new sample data for comments according to type definition with 5 elements
 *  3. setup a query handler that returns all comments upon query
 * 
 * Part 2:
 *  1. Setup author field id in comment
 *  2. update all comments array to have an author field (use on the user ids as value)
 *  3. create a resolver for comments fields that return user who wrote the comment
 *  4. run a sample query that gets all comments along with author names
 *  5. set up comments field on user
 *  6. set up resolver that gets all user comments 
 *  7. run a sample query that gets all users and their comments
 */

// Demo comments data
const comments=[
  {
    id:'comments_1',
    text:'nice..!!',
    author:'3'
  },
  {
    id:'comments_2',
    text:"shit..!!",
    author:'2'
  },
  {
    id:'comments_3',
    text:'not so great, not so terrible',
    author:'4'
  },
  {
    id:'comments_4',
    text:'always a loser',
    author:'1'
  }
];
// Demo Posts data
const posts=[
  {
    id: '1',
    title: 'First Post',
    body: 'Content of the post',
    published: false,
    author:'1' 
  },
  {
    id: '1',
    title: 'Some Post',
    body: 'Content...!!!',
    published: true,
    author:'2' 
  },
  {
    id: '4',
    title: 'Demo Post',
    body: 'Content of the post',
    published: false,
    author:'4' 
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
  comments:[Comments]
}
type User{
 id: ID!
 name: String!
 email:String!
 age: Int,
 posts:[Post!]!
 comments:[Comments]
} 
type Post{
  id:ID!
  title:String!
  body:String!
  published:Boolean!
  author:User! #relational data
}
type Comments{
  id:ID!,
  text:String!,
  author:User!
}
`;

//resolvers of api
/**
 * For opertation we intend to perform in graphql we need to that many resolvers. Thus for now we have only one operation we intend to have only one resolver
 * */

const resolvers = {
  Comments:{
    author(parent,args,ctx,info){
      console.log("parent",parent);
      return users.find(e=>e.id==parent.author);
    }
  },
  // Users and posts are having 1-to-M bi-directional-relationship
  Post:{
    //this is our custom object to perform relational search on post to users data
    //this runs before query--not because it is above to query object
    author(parent,args,ctx,info){
      // we use parent here because
      // we need to access field 'author' parent present in post
      // thus parent denotes 'post' object 
      return users.find(e=>e.id==parent.author);
    }
  },
  User:{
    posts(parent,args,ctx,info){
      return posts.filter(e=>e.author==parent.id);
    },
    comments(parent,args,ctx,info){
      return comments.filter(e=>e.author==parent.id);
    }
  },
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
    comments(parent,args,ctx,info){
      if(args.queryUser){
        return comments;
      }else{
        return comments;
      }
    }
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
// for clear understading , you can study below inputs and outputs from bottom to top order
//----------------------------Fetching all users and their comments
//Query Input
/**
 * query{
 *  users{
    name
    comments{
      text
    }
  }
  */
/**
 * Query ouput
 * {
  "data": {
    "users": [
      {
        "name": "Abhishek",
        "comments": [
          {
            "text": "always a loser"
          }
        ]
      },
      {
        "name": "Nagarjuna",
        "comments": [
          {
            "text": "shit..!!"
          }
        ]
      },
      {
        "name": "Jeevana",
        "comments": [
          {
            "text": "nice..!!"
          }
        ]
      },
      {
        "name": "Divya",
        "comments": [
          {
            "text": "not so great, not so terrible"
          }
        ]
      }
    ]
  }
}
 */
//----------------------------Fetching all comments and their user names from comments
/** Query Input
 * query{
  comments{
    text
    author{
      name
    }
  }

/** Query Output
 * {
  "data": {
    "comments": [
      {
        "text": "nice..!!",
        "author": {
          "name": "Jeevana"
        }
      },
      {
        "text": "shit..!!",
        "author": {
          "name": "Nagarjuna"
        }
      },
      {
        "text": "not so great, not so terrible",
        "author": {
          "name": "Divya"
        }
      },
      {
        "text": "always a loser",
        "author": {
          "name": "Abhishek"
        }
      }
    ]
  }
}*/   
//----------------------------Query for relational data from user -> post
// Query Input
/**
 * query{
	users{
    name
    posts{
      title
    }
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
        "posts": [
          {
            "title": "First Post"
          }
        ]
      },
      {
        "name": "Nagarjuna",
        "posts": [
          {
            "title": "Some Post"
          }
        ]
      },
      {
        "name": "Jeevana",
        "posts": []
      },
      {
        "name": "Divya",
        "posts": [
          {
            "title": "Demo Post"
          }
        ]
      }
    ]
  }
}
*/

//----------------------------Query for relational data from post -> user
// Query Input
/**
 * query{
	post{
    title
    author{
      name
    }
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
        "title": "First Post",
        "author": {
          "name": "Abhishek"
        }
      },
      {
        "title": "Some Post",
        "author": {
          "name": "Nagarjuna"
        }
      },
      {
        "title": "Demo Post",
        "author": {
          "name": "Divya"
        }
      }
    ]
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
