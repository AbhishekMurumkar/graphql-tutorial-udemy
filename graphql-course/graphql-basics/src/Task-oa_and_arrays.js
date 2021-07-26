import { GraphQLServer } from "graphql-yoga";

//typedefinitions
const typeDefs = `
#===== Operational Arguements
# 1. create an 'add' query that returns a float
# 2. set up 'add' to take 2 args(a,b) which are required float
# 3. have a resolver send back the sum of 2 args
type Query{

    # this query allows us only to add 2 floats only
        add(a:Float!,b:Float!):Float!

    #this query allows us to add any number of floats
        addViaArrays(numbers:[Float!]):Float!
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
            return args.a + args.b;
        },
        addViaArrays(parent, args, ctx, info) {
            console.log(args);
            return args.numbers.reduce((e, sum) => sum + e, 0.0);
        },
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

/**
 * Inputs
 * query{
 add(a:1,b:2)
 addViaArrays(numbers:[2.3,4.0,1.55,3.56])
}
 *
 *ouput
 *{
  "data": {
    "add": 3,
    "addViaArrays": 11.41
  }
}
*/
