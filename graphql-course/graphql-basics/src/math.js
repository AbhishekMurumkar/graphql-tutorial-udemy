
// const add = (n1,n2)=>{
//     if(isNaN(n1) || isNaN(n2)){
//         return "Invalid inputs given";
//     }else{
//         n1=parseInt(n1);
//         n2=parseInt(n2);
//         return n1+n2;
//     }
// }
// const sub = (n1,n2)=>{
//     if(isNaN(n1) || isNaN(n2)){
//         return "invalid inputs given";
//     }else{
//         n1=parseInt(n1);
//         n2=parseInt(n2);
//         return n1-n2;
//     }
// }

const add = (n1,n2)=>n1+n2;
const sub = (n1,n2)=>n1-n2;

export {
    add as default,
    sub
}