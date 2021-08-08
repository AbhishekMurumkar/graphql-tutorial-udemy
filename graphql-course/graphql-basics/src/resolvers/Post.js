const Post = {
    //this is our custom object to perform relational search on post to users data
    //this runs before query--not because it is above to query object
    author(parent, args, ctx, info) {
        // we use parent here because
        // we need to access field 'author' parent present in post
        // thus parent denotes 'post' object 
        return users.find(e => e.id == parent.author);
    },
    comments(parent, args, ctx, info) {
        return comments.filter(e => e.post == parent.id);
    }
}

export default Post;