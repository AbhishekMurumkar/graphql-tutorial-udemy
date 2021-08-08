# Better Structure for project and Spliting down index.js

1. take type definitions and break them into individual files
2. create a file `schema.graphql` in `src` folder, This contains all of the graphql code such as type definitions. hence copy all of the content present in variable `typeDefs` into this file.
3. Now to get all type-defintions from that file to curring node script, we need to do following configuation in `server` variable of index.js

    ```javascript
    const server = new GraphQLSever({
        typeDefs:"./src/schema.graphql", // keep path of .graphql file, this path relative to root of your application
        resolvers
    })
    ```

4. Since graphql config is separeted from nodejs code, when we make some changes in .graphql the nodemon will not be restarted
5. for this purpose, we need to add .graphql file into watchlist of nodemon. This is done by adding `-e` or `--ext` arguement.Thus add `--ext js,graphql` to npm start command in  package.json file. After adding, restart the server manually and check whether nodemon reloads on content changes in graphql file as well.
6. Lets take all of our data present in each individual files(users,posts & comments). For now lets create `db.js` in src folder and move all of that data into that file. Add a export statement for all variables, and import of all these in index.js

7. ## Using Context

    * Now above data is used every where, typedefinitions and resolvers and functions as well
    * If you directly import content in index.js, there will be an issue when transfer resolver to other files(data is not avaialble to new resolvers file, at that we need to reimport data file as well)
    * Thus a better solution is to import `db.js` as context, which will be availble through out of our application.
    * This is done by adding `context` property to graphQLServer

        ```javascript
        const server = new GraphQLServer({
            typeDefs :"./src/schema.graphql",
            resolvers: resolvers,
            context  : {
                // place all of your data here
                comments // this is resolved by babel to "comments":comments
                posts
                users
            }
        });

8. 