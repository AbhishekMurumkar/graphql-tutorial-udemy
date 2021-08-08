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
    post(parent, args, { posts }, info) {
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