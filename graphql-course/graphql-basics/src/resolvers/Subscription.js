const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;
            setInterval(() => {
                count++;
                pubsub.publish('count', { count });
            }, 1000)
            //on event
            return pubsub.asyncIterator('count');
        }
    },
    comment: {
        subscribe(parent, { postId }, { posts, pubsub }, info) {
            //showing only when post is published
            let postPresent = posts.find(p => p.id == postId && p.published);
            if (!postPresent) { throw new Error("no post found  or  not a published post") }
            return pubsub.asyncIterator('COMMENT:' + postId);
        }
    },
    post: {
      subscribe(parent,args,{pubsub},info){
        return pubsub.asyncIterator("POST Changed");
      }
    }
};

//----------------------------Showing information when a new comment was created using subscription
//Query Input
/**
 * 1. Turning on Subscription resolver, this waits until we create any comment 
 * subscription{
  comment(postId:2){
    id
    text
    author{
      name
      email
    }
    post{
      id
      title
    }
  }
}
* 2. lets create a comment 
// Query Input
mutation{
  createComment(
    data:{
      post  : "2",
      author: "1",
      text  : "Awesome"
    }){
    id
    text
    post{
      id
    }
    author{
      id
    }
  }
}
// Query Output
{
  "data": {
    "createComment": {
      "id"  : "ebca2a34-78ad-4a82-85ee-f68a44f154c4",
      "text": "Awesome",
      "post": {
        "id": "2"
      },
      "author": {
        "id": "1"
      }
    }
  }
}
3. now open the editor that was subscription was waiting, there you can see output as
{
  "data": {
    "comment": {
      "id"    : "ebca2a34-78ad-4a82-85ee-f68a44f154c4",
      "text"  : "Awesome",
      "author": {
        "name" : "Abhishek",
        "email": "abhi@course.com"
      },
      "post": {
        "id"   : "2",
        "title": "Some Post"
      }
    }
  }
}
* Hence we got above data after creating an comment (as event handling)
* This will fired everytime we create a comment
 */
export default Subscription;