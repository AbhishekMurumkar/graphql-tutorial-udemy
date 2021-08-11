import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, { users }, info) {
        let emailPresent = users.some(u => u.email == args.data.email);
        if (emailPresent) {
            throw new Error('Email Already Taken')
        }
        let newUser = {
            'id': uuidv4(),
            ...args.data
        };
        users.push(newUser);
        return newUser;
    },
    deleteUser(parent, args, { users }, info) {
        let userIndex = users.findIndex(u => u.id == args.userId);
        if (userIndex == -1) { throw new Error("No User Found with given id"); }
        // removed user
        let deletedUser = users.splice(userIndex, 1);
        console.log("deleted user", deletedUser)
        // removing comments related to deleted user
        comments = comments.filter(c => c.author != args.userId)
        // removing posts related to deleted user
        posts = posts.filter(post => {
            let match = post.author == args.userId;
            //when you found a post that is to be deleted, remove the comments present in the post that is to be deleted
            (match) ? (comments = comments.filter(comment => comment.post !== post.id)): (null)
            return !match;
        });
        return deletedUser[0];
    },
    updateUser(parent,{userId,dataToUpdate},{users},info){
        console.log(userId,dataToUpdate,users);
        let userPresent = users.find(u=>u.id==userId);
        if(!userPresent){throw new Error("User Doesnt exist for given ID")}
        if(typeof(dataToUpdate.email)=="string"){
            const isEmailTaken = users.some(u=>u.email==dataToUpdate.email);
            if(isEmailTaken){throw new Error("Email Already Taken")}else{userPresent.email=dataToUpdate.name}
        }
        if(typeof(dataToUpdate.name)=="string"){userPresent.name=dataToUpdate.name}
        if(typeof(dataToUpdate.age)!='undefined'){userPresent.age=dataToUpdate.age}
        return userPresent; 
    },
    createPost(parent, args, { posts,users,pubsub }, info) {
        let userPresent = users.some(u => u.id == args.data.author);
        if (!userPresent) {
            throw new Error("No Valid User Found with given ID");
        }
        let newPost = {
            'id': uuidv4(),
            ...args.data
        };
        posts.push(newPost);
        if(newPost.published){
          pubsub.publish("POST Changed",{
            "post":{
              "mutation":"CREATED",
              "data":newPost
            }
          });
        }
        return newPost;
    },
    deletePost(parent, args, { posts,comments,pubsub }, info) {
        let postPresent = posts.findIndex(p => p.id == args.postId);
        if (postPresent == -1) { throw new Error("No post was found with given id") }
        // deleting post
        let [deletedPost] = posts.splice(postPresent, 1);
        // deleting comments related to post Id
        comments = comments.filter(comment => comment.post != args.postId);
        if(deletedPost.published){
          pubsub.publish("POST Changed",{
            "post":{
              "mutation":"DELETED",
              "data":deletedPost
            }
          })
        }
        return deletedPost;
    },
    updatePost(parent,{postId,dataToUpdate},{posts,pubsub},info){
      let postExists = posts.find(p=>p.id==postId);
      if(postExists==-1){throw new Error("No post found with given id")}
      let originalPost = {...postExists}

      if(typeof(dataToUpdate.title)=="string"){postExists.title=dataToUpdate.title}
      if(typeof(dataToUpdate.body)=="string"){postExists.body=dataToUpdate.body}

      if(typeof(dataToUpdate.published)=="boolean"){
        postExists.published=dataToUpdate.published
        //check if previously post was changed and later turn to unpublished
        if(originalPost.published && !postExists.published){
          //deleted post
          pubsub.publish("POST Changed",{
            post:{
              mutation:"DELETED",
              data:postExists
            }
          })
        }/** originally not pblished  but now changed to published state */
        else if(!originalPost.published && postExists.publish){
          //created post
          pubsub.publish("POST Changed",{
            post:{
              mutation:"CREATED",
              data:postExists
            }
          })
        }
      }else if(postExists.published){
        //simply updating post except published field
        pubsub.publish("POST Changed",{
          post:{
            mutation:"UPDATED",
            data:postExists
          }
        })
      }
      return postExists;
    },
    createComment(parent, args, { users,posts,comments,pubsub }, info) {
        let userPresent = users.some(u => u.id == args.data.author);
        let postPresent = posts.find(p => p.id == args.data.post);
        console.log("Post", postPresent);
        if (!userPresent) { throw new Error("User Doesnt exist"); }
        else if (!postPresent) { throw new Error("Post Doesnt Exist"); }
        else if (!postPresent.published) { throw new Error("Cannot Comment on Un-published posts..!!") }
        else {
            let newComment = {
                'id': uuidv4(),
                ...args.data
            }
            comments.push(newComment);
            //adding subscription on comment creation on a post
            pubsub.publish("COMMENT:"+args.data.post,{
              comment:{
                mutation:"CREATED",
                data:newComment
              }});
            return newComment;
        }
    },
    deleteComment(parent, args, { comments,pubsub }, info) {
        let commentPresent = comments.findIndex(comment => comment.id == args.commentId);
        if (commentPresent == -1) { throw new Error("Comment with given Id was not found"); }
        let [deletedComment] = comments.splice(commentPresent, 1);
        pubsub.publish("COMMENT:"+deletedComment.post,{
          comment:{
            mutation:"DELETED",
            data:deletedComment
          }
        });
        return deletedComment;
    },
    updateComment(parent,{commentId,dataToUpdate},{comments,pubsub},info){
      let commentExists = comments.find(c=>c.id==commentId);
      if(commentId==-1){throw new Error("No Comment found with given id")}
      if(typeof(dataToUpdate.text)=="string"){commentExists.text=dataToUpdate.text;}
      pubsub.publish("COMMENT:"+commentExists.post,{
        comment:{
          mutation:"UPDATED",
          data:commentExists
        }
      })
      return commentExists;
    }
}

export default Mutation;

// Queries and their outputs
//----------------------------Updating below post data with some data.
// Query Input
/*mutation{
	updatePost(postId:1,dataToUpdate:{title:'Changed Title',published:true}){
    id
    title
    body
    published
  }
}*/
// Query Output
/*{
  "data": {
    "updatePost": {
      "id": "1",
      "title": "Changed Title",
      "body": "Content of the post",
      "published": true
    }
  }
}*/
//----------------------------Updating a post data with null data.
// Query Input
/*mutation{
	updatePost(postId:1,dataToUpdate:{}){
    id
    title
    body
    published
  }
}*/
// Query Output
/*{
  "data": {
    "updatePost": {
      "id": "1",
      "title": "First Post",
      "body": "Content of the post",
      "published": false
    }
  }
}*/
//----------------------------Updating below user data with some data.
// Query Input
/*mutation{
  updateUser(userId:3,dataToUpdate:{age:26,name:"Jeevana Madishetty"}){
    id
    name
    age
    email
  }
}*/
// Query Output
/*{
  "data": {
    "updateUser": {
      "id": "3",
      "name": "Jeevana Madishetty",
      "age": 26,
      "email": "jeevana@course.com"
    }
  }
}*/
//----------------------------Updating user data with no data.
// Query Input
/*
mutation{
  updateUser(userId:3,dataToUpdate:{}){
    id
    name
    age
    email
  }
}*/
// Query Output
/*{
  "data": {
    "updateUser": {
      "id": "3",
      "name": "Jeevana",
      "age": null,
      "email": "jeevana@course.com"
    }
  }
}*/

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