const User = {
    posts(parent, args, ctx, info) {
        return posts.filter(e => e.author == parent.id);
    },
    comments(parent, args, ctx, info) {
        return comments.filter(e => e.author == parent.id);
    }
}

export default User;