import {v1,v2} from "./myModule";/*--- this is a named export---*/
import v3 from "./myModule"; /*--- this is a default export---*/

import {sub} from "./math";
import add from "./math";

console.log('hello graphql');
console.log(v1,v2,v3);
console.log("addition1:",add(1,2));
console.log("addition2:",add(1,'2'));
console.log("addition3:",add(1,'a'));
console.log("subtraction1:",sub(1,2));
console.log("subtraction2:",sub(1,'2'));

//Task1
/**
 * 1. create a new file math.js
 * 2. define 2 functions add and subtract
 * 3. each functions takes 2 parameters and returns the result
 * 4. setup add as default and sub as named export
 * 5. import both in index.js and run both of them in index.js
 */