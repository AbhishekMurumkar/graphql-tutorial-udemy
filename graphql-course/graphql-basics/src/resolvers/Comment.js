const Comment = {
    author(parent, args, ctx, info) {
        console.log("parent", parent);
        return users.find(e => e.id == parent.author);
    },
    post(parent, args, ctx, info) {
        return posts.find(e => e.id == parent.post);
    }
}

export default Comment;

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