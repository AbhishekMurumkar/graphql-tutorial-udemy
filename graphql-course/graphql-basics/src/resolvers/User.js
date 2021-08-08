const User = {
    posts(parent, args, ctx, info) {
        return posts.filter(e => e.author == parent.id);
    },
    comments(parent, args, ctx, info) {
        return comments.filter(e => e.author == parent.id);
    }
}

export default User;


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