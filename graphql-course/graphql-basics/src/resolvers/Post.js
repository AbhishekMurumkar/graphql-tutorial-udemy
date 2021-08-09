const Post = {
    //this is our custom object to perform relational search on post to users data
    //this runs before query--not because it is above to query object
    author(parent, args, {users}, info) {
        // we use parent here because
        // we need to access field 'author' parent present in post
        // thus parent denotes 'post' object 
        return users.find(e => e.id == parent.author);
    },
    comments(parent, args, {comments}, info) {
        return comments.filter(e => e.post == parent.id);
    }
}

export default Post;

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