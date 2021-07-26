import { GraphQLServer } from "graphql-yoga";

//typedefinitions
const typeDefs = `
#===== Operational Arguements
# 1. create an 'add' query that returns a float
# 2. set up 'add' to take 2 args(a,b) which are required float
# 3. have a resolver send back the sum of 2 args
type Query{
        add(a:Float!,b:Float!):Float!
    }
#=====
`;

//resolvers of api
/**
 * For opertation we intend to perform in graphql we need to that many resolvers. Thus for now we have only one operation we intend to have only one resolver
 * */

const resolvers = {
    Query: {
        add(parent, args, ctx, info) {
            console.log(args);
            return args.a+args.b;
        }
    },
};

//declaring a server with new graphql server
const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
//lets start a server
// the server runs at port 4000 by default
server.start(() => {
    console.log("Server is started at port 4000");
});
