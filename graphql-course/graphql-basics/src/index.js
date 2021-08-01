import { GraphQLServer } from "graphql-yoga";
import uuidv4 from 'uuid/v4';

/**
 * --------------------------- Setting Comments Data---------------------------------
 * Part 1: Build comments
 *  1. setup comments type definition where it must have an id(doesnt match any other ids for now) and text as string, both as non-nullable
 *  2. create new sample data for comments according to type definition with 5 elements
 *  3. setup a query handler that returns all comments upon query
 * 
 * Part 2: Build relation ship among Comments and User
 *  1. Setup author field id in comment
 *  2. update all comments array to have an author field (use on the user ids as value)
 *  3. create a resolver for comments fields that return user who wrote the comment
 *  4. run a sample query that gets all comments along with author names
 *  5. set up comments field on user
 *  6. set up resolver that gets all user comments 
 *  7. run a sample query that gets all users and their comments
 * 
 * Part 3: build relationship among Posts and Comments
 *  1. setup a post field in comments
 *  2. update all comments in the array to have a new post field(use one of the post ids as value)
 *  3. create a resolver for comments that returns post that comment belongs to
 *  4. run a sample query that gets all comments and post names
 *  5. set up a comment field on post
 *  6. set up resolver for post fields that returns all comments belonging to the post
 *  7. run a sample query that gets all posts and all their comments
 * --------------------------- Mutating Comments Data---------------------------------
 * 1. Define a new createComment mutation
 *    - should take text,author id and post id as non nullable
 *    - upon successful completion should return a comment object
 * 2. Define a resolver method for createComment
 *    - confirm that User exists, else throw error
 *    - confirm that Post exists and it is published, else throw error
 * 3. Run Mutation and add a comment
 * 4. use comments query to verify new comment present in comments array
 */

// Demo comments data
const comments=[
  {
    id:'comments_1',
    text:'nice..!!',
    author:'3',
    post:'1',
  },
  {
    id:'comments_2',
    text:"shit..!!",
    author:'2',
    post:'4'
  },
  {
    id:'comments_3',
    text:'not so great, not so terrible',
    author:'4',
    post:'2'
  },
  {
    id:'comments_4',
    text:'always a loser',
    author:'1',
    post:'1'
  }
];
// Demo Posts data
const posts=[
  {
    id: '1',
    title: 'First Post',
    body: 'Content of the post',
    published: false,
    author:'1',
    comments:['1','4']
  },
  {
    id: '2',
    title: 'Some Post',
    body: 'Content...!!!',
    published: true,
    author:'2',
    comments:['3']
  },
  {
    id: '4',
    title: 'Demo Post',
    body: 'Content of the post',
    published: false,
    author:'4',
    comments:['2']
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
  comments:[Comment]
}
type User{
 id: ID!
 name: String!
 email:String!
 age: Int,
 posts:[Post!]
 comments:[Comment]
} 
type Post{
  id:ID!
  title:String!
  body:String!
  published:Boolean!
  author:User! #relational data
  comments:[Comment]
}
type Comment{
  id:ID!,
  text:String!,
  author:User!
  post:Post!
}

type Mutation{
  createUser(name:String!,email:String!,age:Int): User!
  createPost(title:String!,body:String!,published:Boolean!,author:ID!):Post!
  createComment(text:String!,post:ID!,author:ID!):Comment!
}
`;

//resolvers of api
/**
 * For opertation we intend to perform in graphql we need to that many resolvers. Thus for now we have only one operation we intend to have only one resolver
 * */

const resolvers = {
  Mutation:{
    createUser(parent,args,ctx,info){
      let emailPresent = users.some(u=> u.email == args.email);
      if(emailPresent){
        throw new Error('Email Already Taken')
      }
      let newUser = {
        'id':uuidv4(),
        'name':args.name,
        'email':args.email,
        'age':args.age,
      };
      users.push(newUser);
      return newUser; 
    },
    createPost(parent,args,ctx,info){
      let userPresent = users.some(u=>u.id==args.author);
      if(!userPresent){
        throw new Error("No Valid User Found with given ID");
      }
      let newPost = {
        'id':uuidv4(),
        ...args
      };
      posts.push(newPost);
      return newPost;
    },
    createComment(parent,args,ctx,info){
      let userPresent = users.some(u=>u.id==args.author);
      let postPresent = posts.find(p=>p.id==args.post);
      console.log("Post",postPresent);
      if(!userPresent){ throw new Error("User Doesnt exist"); }
      else if(!postPresent){ throw new Error("Post Doesnt Exist");} 
      else if(!postPresent.published){ throw new Error("Cannot Comment on Un-published posts..!!")}
      else{
        let newComment = {
          'id':uuidv4(),
          ...args
        }
        comments.push(newComment);
        return newComment;
      }
    }
  },
  Comment:{
    author(parent,args,ctx,info){
      console.log("parent",parent);
      return users.find(e=>e.id==parent.author);
    },
    post(parent,args,ctx,info){
      return posts.find(e=>e.id==parent.post);
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
    },
    comments(parent,args,ctx,info){
      return comments.filter(e=>e.post==parent.id);
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
        return comments;
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
  console.log("Server is started at port 4000 hello3");
});
// for clear understading , you can study below inputs and outputs from bottom to top order
//----------------------------Inserting an comment with createComment resolver and displaying out details from resolver.
// Query Input
/**
 * mutation{
  createComment(
    post:"9ed40429-bc7f-4c46-89c8-2495b03167ba",
    author:"f507c2f8-a16e-4949-be14-9ccc5027ff5a",
    text:"Hip hip Hurraayyyy...!!!!"
  ){
    text
    author{
      name
    }
    post{
      title
      body
    }
  }
}
 */
// Query Output
/**
 * {
  "data": {
    "createComment": {
      "text": "Hip hip Hurraayyyy...!!!!",
      "author": {
        "name": "Abhi"
      },
      "post": {
        "title": "My new post",
        "body": "Getting Started"
      }
    }
  }
}
 */
//---- confirming above comment in comments array
// query input
/**
 * query{
  comments{
    text
  }
}
 */
// query output
/**
 * {
  "data": {
    "comments": [
      {
        "text": "nice..!!"
      },
      {
        "text": "shit..!!"
      },
      {
        "text": "not so great, not so terrible"
      },
      {
        "text": "always a loser"
      },
      {
        "text": "Hip hip Hurraayyyy...!!!!"
      }
    ]
  }
}
 */
//----------------------------Inserting an post with createPost resolver and displaying out details from resolver.
//Query Input
/**
 * mutation{
  createPost(
    title:"My new post",
    body:"Getting Started",
    published:false,
    author:"f507c2f8-a16e-4949-be14-9ccc5027ff5a"
  ){
    id
    title
    body
    author{
      name
      email
    }
    comments{
      text
    }
  }
} */
// Query Output
/**
 * {
  "data": {
    "createPost": {
      "id": "9ed40429-bc7f-4c46-89c8-2495b03167ba",
      "title": "My new post",
      "body": "Getting Started",
      "author": {
        "name": "Abhi",
        "email": "a1@gmail.com"
      },
      "comments": []
    }
  }
}
 */
//----------------------------Inserting an user with createUser resolver and displaying out details from resolver.
//Query Input
/**
 * mutation{
  createUser(name:"Abhi",email:"a1@gmail.com"){
    id
    name
    email
    age
  }
}
 */
//Query Output
/**
 * {
  "data": {
    "createUser": {
      "id": "f507c2f8-a16e-4949-be14-9ccc5027ff5a",
      "name": "Abhi",
      "email": "a1@gmail.com",
      "age": null
    }
  }
}
 */
//----------------------------Fetching all posts and comments present in it.
//QueryInput
/**
 * query{
  post{
    title
    body
    comments{
      text
    }
  }
}
 */
//Query Output
/**
 * {
  "data": {
    "post": [
      {
        "title": "First Post",
        "body": "Content of the post",
        "comments": [
          {
            "text": "nice..!!"
          },
          {
            "text": "always a loser"
          }
        ]
      },
      {
        "title": "Some Post",
        "body": "Content...!!!",
        "comments": [
          {
            "text": "not so great, not so terrible"
          }
        ]
      },
      {
        "title": "Demo Post",
        "body": "Content of the post",
        "comments": [
          {
            "text": "shit..!!"
          }
        ]
      }
    ]
  }
}
 */
//----------------------------Fetching all comments and posts via comments
//Query Input
/**
 * query{
  comments{
    text
    author{
      name
    }
    post{
      title
      body
    }
  }
}
 */
//Query Output
/**{
  "data": {
    "comments": [
      {
        "text": "nice..!!",
        "author": {
          "name": "Jeevana"
        },
        "post": {
          "title": "First Post",
          "body": "Content of the post"
        }
      },
      {
        "text": "shit..!!",
        "author": {
          "name": "Nagarjuna"
        },
        "post": {
          "title": "Demo Post",
          "body": "Content of the post"
        }
      },
      {
        "text": "not so great, not so terrible",
        "author": {
          "name": "Divya"
        },
        "post": {
          "title": "Some Post",
          "body": "Content...!!!"
        }
      },
      {
        "text": "always a loser",
        "author": {
          "name": "Abhishek"
        },
        "post": {
          "title": "First Post",
          "body": "Content of the post"
        }
      }
    ]
  }
} */
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
