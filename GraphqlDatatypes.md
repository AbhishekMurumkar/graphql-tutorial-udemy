# Datatypes present in GraphQL

1. ['Scaler'](#scalar)
2. ['Custom'](#vector)
3. ["Input"](#input)

## [Scalar](#scalar)

1. Built in datatypes present in graphql
2. These are single discrete value
3. List of them are
   1. String
   2. Integers
   3. Float
   4. Boolean
   5. ID : This is unique to graphql, similar to string but only used to assign ID's to objects

## [Custom](#custom)

1. These are combinations of above scaler types
2. List of them are
   1. Arrays
   2. Objects

### Creating Custom Types

Note: while specifying the custom values in type definition, you always need to specify the scalars present in them
Check file [here](./graphql-course/graphql-basics/src/index.js) (Check custom queries)

### Working with arrays

Syntax:

```graphql
type Query{
   testArray: [Int!] #this declares an integer array is needed for testArray
   # Int! - denotes each element of array is non-nullable and should be an Integer
}
```

Now in resolver

```javascript
   testArray(){
      //return data that you want show to user
      return [1,2,3,54];
   }
```

check `grades` definition in [here](graphql-course/graphql-basics/src/index.js) for more.

Lets checkout output from above link <br>
!['arrays'](2021-07-26-06-24-39.png)

### Notice: that for above scalar-type of array we dont need to define any argument while using arrays.

But this is not the case for the custom-type of arrays. At that time we need to specify the fields we need while fetching data
!['custom-typed arrays'](2021-07-26-06-26-58.png)

## [Input Type](#input)

As you learnt about [Querying Data in Graphql](./GettingStarted.md#queries), there we can pass data in 2 ways

1. conventional way = describe each variable name with type and stating is nullable or not
2. Input Type = declaring all the variables we need in a form of JSON and passing the json having all of our needed data type defintions needed to the query, this allows us to create more complex queries

## Working with Inputs

Here to create an input, we need to create new type definition with key `input` followed by var name.

```graphql
# declaring an input data type
input someInput{
   #describe all the properties of data you need here
}
# initializing input type with type definition
type Query{
   sometype(myInputneeded:someInput):SomeType
}
# using input while querying
# conventional querying
query{
   someInput(
      #declares all of your data here
      # here args will have only declared data
   ){
      # show output from resolver
   }
}
# input type querying
query{
   someInput(
      myInputneeded:{
         #declare all of your data here
         # we can have data other than declared as well, so you need access them via args.myInputneeded
      }
   ){
      # show output from resolver
   }
}
```

> Note: see the types used above in query, they are `someInput`, same as we declared with `input` key

> check Input in file [here](graphql-course/graphql-basics/src/index.js) for `CreateUserInput`
