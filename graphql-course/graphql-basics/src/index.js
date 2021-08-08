import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import Query from "./resolvers/Query";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";

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
 * --------------------------- Deleting Posts Data-----------------------------------
 * 1. define a mutation for deleting a post
 * 2. define a resolver for above mutation
 *    - check if above post id exists, if not throw error
 *    - remove and return the post
 *    - remove all comments that belongs to deleted post
 * 3. Test above by deleting a post, verify post & comments are removed
 * --------------------------- Deleting Comments Data-----------------------------------
 * 1. define a mutation for deleting a comment
 * 2. define a resolver for above mutation
 *    - check if above post id exists, if not throw error
 *    - remove and return the post
 * 3. Test above by deleting a post, verify post & comments are removed
 */


//resolvers of api
/**
 * For opertation we intend to perform in graphql we need to that many resolvers. Thus for now we have only one operation we intend to have only one resolver
 * Here, Users and posts are having 1-to-M bi-directional-relationship
 * */
const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Comment
};

//declaring a server with new graphql server
const server = new GraphQLServer({
  typeDefs:"./src/schema.graphql",
  resolvers: resolvers,
  context:{
    users:db.users,
    posts:db.posts,
    comments:db.comments
  }
});
//lets start a server
// the server runs at port 4000 by default
server.start(() => {
  console.log("Server is started at port 4000 hello3");
});