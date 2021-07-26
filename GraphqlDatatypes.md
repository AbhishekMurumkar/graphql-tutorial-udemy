# Datatypes present in GraphQL

1. ['Scaler'](#scalar)
2. ['Custom'](#vector)

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