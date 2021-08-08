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
    createPost(parent, args, { posts }, info) {
        let userPresent = users.some(u => u.id == args.data.author);
        if (!userPresent) {
            throw new Error("No Valid User Found with given ID");
        }
        let newPost = {
            'id': uuidv4(),
            ...args.data
        };
        posts.push(newPost);
        return newPost;
    },
    deletePost(parent, args, { posts }, info) {
        let postPresent = posts.findIndex(p => p.id == args.postId);
        if (postPresent == -1) { throw new Error("No post was found with given id") }
        // deleting post
        let deletedPost = posts.splice(postPresent, 1, 0);
        // deleting comments related to post Id
        comments = comments.filter(comment => comment.post != args.postId);
        return deletedPost[0];
    },
    createComment(parent, args, { comments }, info) {
        let userPresent = users.some(u => u.id == args.data.author);
        let postPresent = posts.find(p => p.id == args.data.post);
        console.log("Post", postPresent);
        if (!userPresent) { throw new Error("User Doesnt exist"); }
        else if (!postPresent) { throw new Error("Post Doesnt Exist"); }
        else if (!postPresent.published) { throw new Error("Cannot Comment on Un-published posts..!!") }
        else {
            let newComment = {
                'id': uuidv4(),
                ...args
            }
            comments.push(newComment);
            return newComment;
        }
    },
    deleteComment(parent, args, { comments }, info) {
        let commentPresent = comments.findIndex(comment => comment.id == args.commentId);
        if (commentPresent == -1) { throw new Error("Comment with given Id was not found"); }
        let deletedComment = comments.splice(commentPresent, 1, 0);
        return deletedComment[0];
    }
}

export default Mutation;