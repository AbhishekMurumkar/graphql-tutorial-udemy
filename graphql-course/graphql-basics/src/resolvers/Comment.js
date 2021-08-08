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