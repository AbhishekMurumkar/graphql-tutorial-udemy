const Query = {
    users(parent, args, { users }, info) {
        if (args.queryName) {
            return users.filter(e => e.name.toLowerCase().includes(args.queryName.toLowerCase()));
        } else {
            return users;
        }
    },
    me() { //custom query resolver
        return users.find(e => e.name == 'Abhishek');
    },
    posts(parent, args, { posts }, info) {
      console.log(posts);
        if (args.queryTitleOrBody) {
            return posts.filter(e => e.title.toLowerCase().includes(args.queryTitleOrBody.toLowerCase()) || e.body.toLowerCase().includes(args.queryTitleOrBody.toLowerCase()))
        } else {
            return posts;
        }
    },
    comments(parent, args, { comments }, info) {
        return comments;
    }
}

export default Query;

//Queries and their outputs
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
