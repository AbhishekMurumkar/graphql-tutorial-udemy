# Introduction to Subscription method

* Subscribe to an event and then upon event fired, you can execute a method
* The subscription is similar to query opertation, but only thing difference the way the data is fetched.

## The differences among Queries/Mutations and Subscriptions

  1. Query : 
     1. when a query is sent to server, server executes it and returns all the data got from query at once.
     2. This is good for most of operations, but in real time, while quering to server, if there are any changes to made to application data, then latest changes cannot be seen in pareallely executed query
     3. Hence there is a chance of missing latest changes for some queries in real time applications
     4. Thus above missing changes can be fetched by querying to server again by the client
     5. This ends up in `Server Polling` where we run query operation from our client for each minute in order to store real time changes in the client end.
     6. Thus above step is performance expensive and has resources wastages(when there are no changes in data are present, still we are querying the server to get updated changes)
     7. The Return type should be as same as defiend in schema
  2. Subscriptions :
     1. This is used in order to overcome the disadvantages present in Queries for real time application data
     2. This is just like a open socket connection between client and server, allowing server to send changes in data to client whenever there any changes to application data
     3. The Return is not fixed here, since we return data that is obtained from PubSub function

## Getting Started with Subscriptions & Creating an Counter with it.

> Example for creating an Subscription : creating an subscription that increments an counter for each second

> Create a new file with name as `Subscription.js` in resolvers folder and insert resolver code as shown below

1. **type definition**

    ```graphql
    type MySubscription{
        count:Int!
    }
    ```

2. **resolver**

    ```javascript
    const mySubscriber={
        count:{
            //this is resolver matches with our type definition
            // in this method we can only have one method that is below
            subscribe(parent,args,ctx,info){
                let count=0;
                //this function runs whenever there are events received
                // pubsub is added in context in below index.js step
                setInterval(()=>{
                    count++;
                    //throwing an event/publishing changes in chat room called as 'count' and passing count variable as payload to that room
                    pubsub.publish('count',{count})
                },1000);
                // asyncIterator is same as socket.on('channel',{}) method, where channel is special chat room
                return ctx.pubsub.asyncIterator('count')
            }
        }
    }
    export default mySubscriber;
    ```

3. Now adding support to subscription to `graphql-yoga`, adding following in index.js

    ```javascript
    import {PubSub} from 'graphql-subscriptions';
    ..
    ..
    // used to create new pubsub utility's object
    const pubsub =  new PubSub();
    // now we need to send this instance to all of our resolvers, that has capability to share all the changes on all application data
    // hence we need to use this instance in context of graphql-yoga app, allowing us to same instance across all over resolvers of our application
    const server =new GraphQLServer({
        ...
        ...
        context :{db,pubsub}
    });
    ```

4. Above steps completed the initializing the subscriptions in our app, now lets study subscription function itself (in Subscription.js)
5. For Every Subscription, we need to setup a new property that matches with name of subscription name (ex:count in subscription.js file)
6. in subscribe function, we need to
    1. setup subscription
    2. data that we are going to publish

## Subscriptions with real time application data

